import { nanoid } from 'nanoid';

export const generateNanoId = () => {
  const generatedId = nanoid(21);

  return generatedId;
};
