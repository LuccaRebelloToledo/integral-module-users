const AppErrorTypes = {
  sessions: {
    invalidCredentials: 'Your credentials are invalid!',
    tokenNotFound: 'Token was not found!',
    invalidToken: 'Token is invalid!',
  },
  users: {
    emailAlreadyInUse: 'The email provided is already in use!',
    notFound: 'User was not found!',
  },
};

export default AppErrorTypes;
