declare namespace Express {
  type SessionFeature = {
    key: string;
    name: string;
  };

  type SessionFeatureGroup = {
    key: string;
    name: string;
    features: SessionFeature[];
  };

  type SessionUser = {
    id: string;
    featureGroup: SessionFeatureGroup;
    standaloneFeatures: SessionFeature[];
  };
  export interface Request {
    user: SessionUser;
  }
}
