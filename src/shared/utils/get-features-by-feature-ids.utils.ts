import { container } from 'tsyringe';

import ShowFeaturesService from '@modules/features/services/show-features.service';

import Feature from '@modules/features/infra/typeorm/entities/feature.entity';

export const getFeaturesByFeatureIds = async (
  featureIds: string[],
): Promise<Feature[]> => {
  const showFeaturesService = container.resolve(ShowFeaturesService);

  const features: Feature[] = [];

  for (const featureId of featureIds) {
    const feature = await showFeaturesService.execute(featureId);

    features.push(feature);
  }

  return features;
};
