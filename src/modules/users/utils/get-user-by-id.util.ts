import { container } from 'tsyringe';

import ShowUsersService from '../services/show-users.service';

const getUserById = async (id: string) => {
  const showUsersService = container.resolve(ShowUsersService);

  const user = await showUsersService.execute(id);

  return user;
};

export default getUserById;
