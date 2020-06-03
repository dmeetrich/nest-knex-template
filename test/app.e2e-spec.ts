import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { HealthCheckModule } from '../src/modules/health-check/health-check.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [HealthCheckModule],
    }).compile();

    app = await moduleFixture.createNestApplication().init();
  });

  it('/GET root', () =>
    request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.NOT_FOUND));

  it('/GET check', () =>
    request(app.getHttpServer())
      .get('/check')
      .expect(HttpStatus.OK));
});
