import request from 'supertest';

import app from '@shared/infra/http/app';

import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import FeaturesRepository from '@modules/features/infra/typeorm/repositories/features.repository';
import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';

import {
  CREATED,
  NO_CONTENT,
  OK,
} from '@shared/infra/http/constants/http-status-code.constants';

import User from '../../typeorm/entities/user.entity';

describe('e2e - Users', () => {
  let featuresRepository: FeaturesRepository;
  let featureGroupsRepository: FeatureGroupsRepository;

  let token: string;
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

    const { token: userToken } = response.body;

    token = userToken;
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', async () => {
    expect(app).toBeDefined();
    expect(featuresRepository).toBeDefined();
    expect(featureGroupsRepository).toBeDefined();
    expect(token).toBeDefined();
  });

  test('should be create a user', async () => {
    const response = await request(app)
      .post(`${USER_PATH}`)
      .set('Authorization', token)
      .send({
        name: 'User Test 2',
        email: 'lucca2@test.com',
        password: 'Lucca@321',
      });

    expect(response.status).toBe(CREATED);
    expect(response.body).toBeDefined();

    console.log(response.body);

    user = response.body;
  });

  test('should be list a users', async () => {
    const response = await request(app)
      .get(`${USER_PATH}`)
      .set('Authorization', token)
      .query({
        email: user.email,
      });

    expect(response.status).toBe(OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        pagination: expect.any(Object),
        totalItems: expect.any(Number),
        items: expect.any(Object),
      }),
    );

    const { totalItems, items } = response.body;

    expect(totalItems).toBe(1);
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(expect.objectContaining({ email: user.email }));
  });

  test('should be show a user', async () => {
    const response = await request(app)
      .get(`${USER_PATH}/${user.id}`)
      .set('Authorization', token);

    expect(response.status).toBe(OK);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
  });

  test('should be update a user', async () => {
    const response = await request(app)
      .put(`${USER_PATH}/${user.id}`)
      .set('Authorization', token)
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
      .set('Authorization', token);

    expect(response.status).toBe(NO_CONTENT);
    expect(response.body).toEqual({});
  });
});
