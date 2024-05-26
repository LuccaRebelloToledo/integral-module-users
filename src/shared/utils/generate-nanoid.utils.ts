import { nanoid } from 'nanoid';

const generateNanoId = () => {
  const generatedId = nanoid(21);

  return generatedId;
};

export default generateNanoId;
