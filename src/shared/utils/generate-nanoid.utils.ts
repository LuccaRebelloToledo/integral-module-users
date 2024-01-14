import { nanoid } from 'nanoid';

export default function generateNanoId() {
  const generatedId = nanoid();

  return generatedId;
}
