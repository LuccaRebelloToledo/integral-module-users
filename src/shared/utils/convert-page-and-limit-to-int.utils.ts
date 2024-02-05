export const convertPageAndLimitToInt = (
  page: string,
  limit: string,
): { pageParsed: number; limitParsed: number } => {
  const pageParsed = parseInt(page);

  const limitParsed = parseInt(limit);

  return { pageParsed, limitParsed };
};
