import { nanoid } from 'nanoid';

export default function generateNanoId() {
  const generatedId = nanoid(21);

  return generatedId;
}
