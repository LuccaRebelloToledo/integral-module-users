interface itemsPagination {
  previous: number | string;
  current: number;
  next: number | string;
  total: number | string;
}

export default interface PaginationServiceResponseDTO<T> {
  pagination: itemsPagination;
  totalItems: number;
  items: T[];
}
