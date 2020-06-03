import {
  applySpec,
  curry,
  drop,
  equals,
  evolve,
  groupBy,
  ifElse,
  isNil,
  join,
  map,
  nth,
  omit,
  path,
  pipe,
  prop,
  propSatisfies,
  sortBy,
  split,
  test,
  type,
  until,
  values,
} from 'ramda';

const toSnakeCase = value => value.replace(/([A-Z])/g, $1 => `_${$1.toLowerCase()}`);

const createOperator = curry((name, generatorCallback, filters, knex) =>
  knex.modify(queryBuilder =>
    filters[`${name}`]
      ? map(({ fieldName, value }) => generatorCallback(knex, queryBuilder, fieldName, value))(
          filters[`${name}`],
        )
      : undefined,
  ),
);

const isOrOperator = test(/^\$or\.\d+\./);
const groupByOperator = groupBy(({ operator, fieldName }) => {
  if (isOrOperator(fieldName)) {
    return '$or';
  }

  return operator;
});

const isHaveTableName = propSatisfies(pipe(type, equals('String')), 'table');
const resolveFieldName = ifElse(
  propSatisfies(test(/\./), 'incomeFieldName'),
  prop('incomeFieldName'),
  pipe(
    applySpec({
      fieldName: prop('incomeFieldName'),
      tableName: pipe(
        path(['query', '_single']),
        until(isHaveTableName, path(['table', '_single'])),
        ifElse(propSatisfies(isNil, 'as'), prop('table'), prop('as')),
      ),
    }),
    ({ fieldName, tableName }) => `${tableName}.${fieldName}`,
  ),
);

const OPERATORS = {
  $lt: createOperator('$lt', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.where(fieldName, '<', value);
  }),
  $gt: createOperator('$gt', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.where(fieldName, '>', value);
  }),
  $lte: createOperator('$lte', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.where(fieldName, '<=', value);
  }),
  $gte: createOperator('$gte', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.where(fieldName, '>=', value);
  }),
  $ne: createOperator('$ne', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.whereNot(fieldName, value);
  }),
  $eq: createOperator('$eq', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.where(fieldName, value);
  }),
  $in: createOperator('$in', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.whereIn(fieldName, value);
  }),
  $nin: createOperator('$nin', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.whereNotIn(fieldName, value);
  }),
  $ilike: createOperator('$ilike', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.where(fieldName, 'ilike', `%${String(value).replace(/[_%]/g, '\\$&')}%`);
  }),
  $notNull: createOperator('$notNull', (knex, queryBuilder, fieldName) => {
    queryBuilder.whereNotNull(fieldName);
  }),
  $isNull: createOperator('$isNull', (knex, queryBuilder, fieldName) => {
    queryBuilder.whereNull(fieldName);
  }),
  $between: createOperator('$between', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.whereBetween(fieldName, value);
  }),
  $inArr: createOperator('$inArr', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.where(fieldName, '@>', `{${value.join(', ')}}`);
  }),
  $tsQuery: createOperator('$tsQuery', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.whereRaw(`${toSnakeCase(fieldName)} @@ to_tsquery('english', '${value}:*a')`);
  }),
  $gisSearch: createOperator('$gisSearch', (knex, queryBuilder, fieldName, value) => {
    queryBuilder.whereRaw(
      `ST_DWithin (coordinates.coordinates::geography,
        ST_MakePoint(?, ?)::geography, (? * 1.6))`,
      value,
    );
  }),
};

const dropPrefix = pipe(split('.'), drop(2), join('.'));

const groupOr = pipe(
  groupBy(pipe(prop('fieldName'), split('.'), nth(1))),
  values,
  map(
    map(
      evolve({
        fieldName: dropPrefix,
      }),
    ),
  ),
  value => [{ value, operator: '$or' }],
);

const setFilterOptions = (filters, knex) => {
  const changedFilters = filters.map(data => {
    const objectWithoutFieldName = omit(['fieldName'])(data);

    return {
      ...objectWithoutFieldName,
      fieldName: resolveFieldName({
        query: knex,
        incomeFieldName: data.fieldName,
      }),
    };
  });

  const groupedFiltersByOperators = pipe(
    groupByOperator,
    evolve({
      $or: groupOr,
    }),
  )(changedFilters);

  Object.values(OPERATORS).forEach(operatorHandler => {
    operatorHandler(groupedFiltersByOperators, knex);
  });

  return knex;
};

const setSortOptions = (sort, knex) => {
  const sortByOrder = sortBy(prop('order'), sort);

  return knex.modify(queryBuilder =>
    sortByOrder.map(({ fieldName, method }) => {
      if (method === 'desc nulls last') {
        return queryBuilder.orderByRaw(`${toSnakeCase(fieldName)} DESC NULLS LAST`);
      }

      if (test(/^id=[0-9]*$/, fieldName)) {
        const [, id] = fieldName.split('=');

        const resolvedField = toSnakeCase(
          resolveFieldName({
            query: knex,
            incomeFieldName: 'id',
          }),
        );

        return queryBuilder.orderByRaw(`${resolvedField}=${id} ${method}`);
      }

      return queryBuilder.orderBy(fieldName, method);
    }),
  );
};

const setPaginationOptions = ({ limit, offset }, knex) =>
  limit > 0 ? knex.limit(limit).offset(offset) : knex;

const getCountAll = (query, trx) => trx.count('* as total').from(query);

export const setFindAllQueryOptions = ({ filters, sorting, pagination }, knex) => {
  const queryWithFilters = curry(setFilterOptions)(filters)(knex);
  const queryWithSortings = curry(setSortOptions)(sorting)(queryWithFilters);
  const queryWithAllOptions = curry(setPaginationOptions)(pagination)(queryWithSortings);

  return queryWithAllOptions;
};

export const setCountQueryOptions = ({ filters }, query, trx) => {
  setFilterOptions(filters, query);

  return getCountAll(query, trx);
};
