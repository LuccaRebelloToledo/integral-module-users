import request from 'supertest';

import app from '@shared/infra/http/app';

import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';
import FeaturesRepository from '@modules/features/infra/typeorm/repositories/features.repository';

import {
  NO_CONTENT,
  OK,
} from '@shared/infra/http/constants/http-status-code.constants';

describe('Integration - Sessions', () => {
  let featuresRepository: FeaturesRepository;
  let featureGroupsRepository: FeatureGroupsRepository;

  const SESSIONS_PATH = '/sessions';

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
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', async () => {
    expect(app).toBeDefined();
    expect(featuresRepository).toBeDefined();
    expect(featureGroupsRepository).toBeDefined();
  });

  test('should be sign up', async () => {
    const response = await request(app).post(`${SESSIONS_PATH}/sign-up`).send({
      name: 'User Test',
      email: 'lucca@test.com',
      password: 'Lucca@123',
    });

    expect(response.status).toBe(NO_CONTENT);
    expect(response.body).toEqual({});
  });

  test('should be sign in', async () => {
    const response = await request(app).post(`${SESSIONS_PATH}/sign-in`).send({
      email: 'lucca@test.com',
      password: 'Lucca@123',
    });

    expect(response.status).toBe(OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  test('should be refresh the token', async () => {
    const response = await request(app).post(`${SESSIONS_PATH}/sign-in`).send({
      email: 'lucca@test.com',
      password: 'Lucca@123',
    });

    const {
      body: { accessToken, refreshToken },
    } = response;

    expect(response.status).toBe(OK);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();

    const responseRefreshToken = await request(app)
      .post(`${SESSIONS_PATH}/refresh-token`)
      .send({
        refreshToken,
      });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      responseRefreshToken.body;

    expect(responseRefreshToken.status).toBe(OK);
    expect(newAccessToken).toBeDefined();
    expect(newRefreshToken).toBeDefined();
  });
});
