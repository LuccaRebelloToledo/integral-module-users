interface calculateSkipDto {
  page: number;
  limit: number;
}

const calculateSkip = ({ page, limit }: calculateSkipDto): number => {
  return (page - 1) * limit;
};

export default calculateSkip;
