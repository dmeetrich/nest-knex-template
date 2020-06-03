import { Logger, LoggerType } from '@common/logger';
import { getSelectFields, renameKeys } from '@common/tools';
import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from '@nestjsplus/knex';
import * as Knex from 'knex';
import { head, omit, prop } from 'ramda';

import { userFields } from './user-fields';
import { CreateUser, GetUser, OnlyUser, Role, User, UserRole } from './user.interfaces';

@Injectable()
export class UserService {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
    @Logger('UserService')
    private readonly logger: LoggerType,
  ) {}

  public async createUser(userData: CreateUser): Promise<User> {
    return this.knex.transaction(async trx => {
      const userRoleId = await this.knex('roles')
        .where({
          defaultRole: true,
        })
        .limit(1)
        .then<Role>(head)
        .then(prop('id'));

      const user = await this.create(
        {
          ...userData,
          role: userRoleId,
        },
        trx,
      ).catch(error => {
        this.logger.error({
          err: error,
        });
        throw new Error('User creation failed');
      });

      return omit(['password'], user);
    });
  }

  public async create(userData: OnlyUser, trx?: Knex.Transaction): Promise<User> {
    const qb = trx ? trx<User>('users') : this.knex<User>('users');

    return qb
      .insert(userData)
      .returning('*')
      .then<User>(head);
  }

  public async isUserExists(email: string): Promise<boolean> {
    return Boolean(
      await this.knex<boolean>('users')
        .where('email', email)
        .limit(1)
        .then<User>(head),
    );
  }

  public async getUserWithRole(fields: GetUser): Promise<UserRole> {
    const userWhereFields = renameKeys({
      id: 'users.id',
    })(fields);

    return this.knex<UserRole>('users')
      .select(...getSelectFields('users', userFields), 'roles.name AS role')
      .where(userWhereFields)
      .leftJoin('roles', {
        'users.role': 'roles.id',
      })
      .limit(1)
      .then<UserRole>(head);
  }

  public async getUserList(options: {
    limit: number;
    offset: number;
    role: string;
  }): Promise<User[]> {
    const qb = this.knex('users')
      .select(
        'users.id',
        'users.email',
        'users.first_name',
        'users.second_name',
        'users.is_deleted',
        'users.added_at as sign_up_date',
      )
      .leftJoin('roles as r', 'users.role', 'r.id')
      .where('r.name', '<>', 'admin')
      .groupBy(['users.id']);

    if (options.limit && options.offset) {
      qb.limit(options.limit).offset(options.offset);
    }

    if (options.limit && !options.offset) {
      qb.limit(options.limit).offset(0);
    }

    if (options.role) {
      qb.where('r.name', options.role);
    }

    return qb;
  }
}
