const calculatePaginationDetails = (
  totalItems: number,
  page: number,
  limit: number,
) => {
  const calculatedLastPage = Math.ceil(totalItems / limit);
  const totalPages =
    calculatedLastPage === page
      ? 'You are already on the last page!'
      : calculatedLastPage;

  const calculatedPreviousPage = page - 1;
  const previous =
    calculatedPreviousPage < 1
      ? 'There is no previous page!'
      : calculatedPreviousPage;

  const calculatedNextPage = page + 1;
  const next =
    calculatedNextPage > calculatedLastPage
      ? 'There is no next page!'
      : calculatedNextPage;

  return { previous, next, totalPages };
};

export default calculatePaginationDetails;
