const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export default calculateSkip;
