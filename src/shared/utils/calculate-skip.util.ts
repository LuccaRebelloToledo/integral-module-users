import type CalculateSkipDto from '@shared/dtos/calculate-skip.dto';

const calculateSkip = ({ page, limit }: CalculateSkipDto): number => {
  return (page - 1) * limit;
};

export default calculateSkip;
