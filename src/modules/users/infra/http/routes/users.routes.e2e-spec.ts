import request from 'supertest';

import app from '@shared/infra/http/app';

import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';
import FeaturesRepository from '@modules/features/infra/typeorm/repositories/features.repository';

import {
  CREATED,
  NO_CONTENT,
  OK,
} from '@shared/infra/http/constants/http-status-code.constants';

import type User from '../../typeorm/entities/user.entity';

describe('e2e - Users', () => {
  let featuresRepository: FeaturesRepository;
  let featureGroupsRepository: FeatureGroupsRepository;

  let accessToken: string;
  let user: User;

  const USER_PATH = '/users';

  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featuresRepository = new FeaturesRepository();
    featureGroupsRepository = new FeatureGroupsRepository();

    const feature = await featuresRepository.create({
      key: 'full:users',
      name: 'Full access to users',
    });

    await featureGroupsRepository.create({
      key: 'ADMIN',
      name: 'ADMIN',
      features: [feature],
    });

    const sessionsPath = '/sessions';

    await request(app).post(`${sessionsPath}/sign-up`).send({
      name: 'User Test',
      email: 'lucca@test.com',
      password: 'Lucca@123',
    });

    const response = await request(app).post(`${sessionsPath}/sign-in`).send({
      email: 'lucca@test.com',
      password: 'Lucca@123',
    });

    const { accessToken: token } = response.body;

    accessToken = token;
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', async () => {
    expect(app).toBeDefined();
    expect(featuresRepository).toBeDefined();
    expect(featureGroupsRepository).toBeDefined();
    expect(accessToken).toBeDefined();
  });

  test('should be create a user', async () => {
    const response = await request(app)
      .post(`${USER_PATH}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'User Test 2',
        email: 'lucca2@test.com',
        password: 'Lucca@321',
      });

    expect(response.status).toBe(CREATED);
    expect(response.body).toBeDefined();

    user = response.body;
  });

  test('should be list a users', async () => {
    const response = await request(app)
      .get(`${USER_PATH}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        email: user.email,
      });

    expect(response.status).toBe(OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        meta: expect.any(Object),
        data: expect.any(Object),
      }),
    );

    const { meta, data } = response.body;

    expect(meta.totalItems).toBe(1);
    expect(data.length).toBe(1);
    expect(data[0]).toEqual(expect.objectContaining({ email: user.email }));
  });

  test('should be show a user', async () => {
    const response = await request(app)
      .get(`${USER_PATH}/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(OK);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
  });

  test('should be update a user', async () => {
    const response = await request(app)
      .put(`${USER_PATH}/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Lucca Toledo',
      });

    expect(response.status).toBe(OK);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');

    expect(response.body.id).toBe(user.id);
    expect(response.body.name).toBe('Lucca Toledo');
    expect(response.body.email).toBe(user.email);
  });

  test('should be delete a user', async () => {
    const response = await request(app)
      .delete(`${USER_PATH}/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(NO_CONTENT);
    expect(response.body).toEqual({});
  });
});
