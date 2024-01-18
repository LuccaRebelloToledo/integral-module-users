const AppErrorTypes = {
  sessions: {
    invalidCredentials: 'Your credentials are invalid!',
    tokenNotFound: 'Token was not found!',
    invalidToken: 'Token is invalid!',
    insufficientPrivilege:
      'You do not have enough privilege to access this resource!',
    missingUserFeatureGroup: 'User does not have a feature group!',
  },
  users: {
    emailAlreadyInUse: 'The email provided is already in use!',
    notFound: 'User was not found!',
  },
  features: {
    notFound: 'Feature was not found!',
    repeatedFeatures: 'There are repeated features!',
  },
  featureGroups: {
    notFound: 'Feature group was not found!',
    keyAlreadyRegistered: 'Feature group key is already registered!',
    nameAlreadyRegistered: 'Feature group name is already registered!',
  },
};

export default AppErrorTypes;
