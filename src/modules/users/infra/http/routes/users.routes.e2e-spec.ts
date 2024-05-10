// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';

import app from '@shared/infra/http/app';

import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import FeaturesRepository from '@modules/features/infra/typeorm/repositories/features.repository';
import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';

import {
  CREATED,
  NO_CONTENT,
  OK,
} from '@shared/infra/http/constants/http-status-code.constants';

let featuresRepository: FeaturesRepository;
let featureGroupsRepository: FeatureGroupsRepository;

let token: string;
let idUser: string;
const basePath = '/users';

const payloadNewUser = {
  name: 'User Test 2',
  email: 'lucca2@test.com',
  password: 'Lucca@321',
  featureGroupId: '1o9xrUxw2KVRpNmNTiZPx',
};

describe('UsersE2E', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featuresRepository = new FeaturesRepository();
    featureGroupsRepository = new FeatureGroupsRepository();

    const feature = await featuresRepository.create({
      id: '1',
      key: 'full:users',
      name: 'Full access to users',
    });

    await featureGroupsRepository.create({
      id: '1o9xrUxw2KVRpNmNTiZPx',
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
      .post(`${basePath}/`)
      .set('Authorization', token)
      .send(payloadNewUser);

    expect(response.status).toBe(CREATED);
    expect(response.body).toEqual('');
  });

  test('should be list a users', async () => {
    const response = await request(app)
      .get(`${basePath}/`)
      .set('Authorization', token)
      .query({
        email: payloadNewUser.email,
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
    expect(items[0]).toEqual(
      expect.objectContaining({ email: payloadNewUser.email }),
    );

    idUser = items[0].id;
  });

  test('should be show a user', async () => {
    const response = await request(app)
      .get(`${basePath}/${idUser}`)
      .set('Authorization', token);

    expect(response.status).toBe(OK);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
  });

  test('should be update a user', async () => {
    const response = await request(app)
      .put(`${basePath}/${idUser}`)
      .set('Authorization', token)
      .send({
        name: 'Lucca Toledo',
      });

    expect(response.status).toBe(OK);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');

    expect(response.body.id).toBe(idUser);
    expect(response.body.name).toBe('Lucca Toledo');
    expect(response.body.email).toBe(payloadNewUser.email);
  });

  test('should be delete a user', async () => {
    const response = await request(app)
      .delete(`${basePath}/${idUser}`)
      .set('Authorization', token);

    expect(response.status).toBe(NO_CONTENT);
    expect(response.body).toEqual({});
  });
});
