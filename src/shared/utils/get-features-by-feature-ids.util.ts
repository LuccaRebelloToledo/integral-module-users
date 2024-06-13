import { container } from 'tsyringe';

import ShowFeaturesService from '@modules/features/services/show-features.service';

import Feature from '@modules/features/infra/typeorm/entities/feature.entity';

const getFeaturesByFeatureIds = async (
  featureIds: string[],
): Promise<Feature[]> => {
  const showFeaturesService = container.resolve(ShowFeaturesService);

  const features = await Promise.all(
    featureIds.map((featureId) => showFeaturesService.execute(featureId)),
  );

  return features;
};

export default getFeaturesByFeatureIds;
