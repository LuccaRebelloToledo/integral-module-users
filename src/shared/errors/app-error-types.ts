const AppErrorTypes = {
  sessions: {
    invalidCredentials: 'Your credentials are invalid!',
    tokenNotFound: 'Token was not found!',
    invalidToken: 'Token is invalid!',
    insufficientPrivilege:
      'You do not have enough privilege to access this resource!',
  },
  users: {
    emailAlreadyInUse: 'The email provided is already in use!',
    notFound: 'User was not found!',
  },
  features: {
    notFound: 'Feature was not found!',
  },
};

export default AppErrorTypes;
