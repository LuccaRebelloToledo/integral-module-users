const AppErrorTypes = {
  sessions: {
    invalidCredentials:
      'The provided credentials are invalid. Please check your email and password.',
    tokenNotFound:
      'The authentication token was not found. Please log in again.',
    invalidToken:
      'The authentication token is invalid or has expired. Please log in again.',
    insufficientPrivilege:
      'You do not have sufficient privileges to access this resource. Please contact the administrator if you believe this is an error.',
    missingUserFeatureGroup:
      'The user does not have an assigned feature group. Please contact the administrator to resolve this issue.',
  },
  users: {
    emailAlreadyInUse:
      'The provided email is already in use. Please use a different email.',
    notFound:
      'The user was not found. Please check the provided user ID or username.',
  },
  features: {
    notFound:
      'The feature was not found. Please check the provided feature ID or name.',
    repeatedFeatures:
      'There are repeated features in the feature group. Each feature in a group should be unique.',
  },
  featureGroups: {
    notFound:
      'The feature group was not found. Please check the provided feature group ID or name.',
    keyAlreadyRegistered:
      'The feature group key is already registered. Please use a unique key.',
    nameAlreadyRegistered:
      'The feature group name is already registered. Please use a unique name.',
  },
};

export default AppErrorTypes;
