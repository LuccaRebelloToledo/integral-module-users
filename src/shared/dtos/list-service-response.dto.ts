interface PaginationInfoDto {
  previous: number | string;
  current: number;
  next: number | string;
  total: number | string;
}

export default interface ListServiceResponseDto<T> {
  pagination: PaginationInfoDto;
  totalItems: number;
  items: T[];
}
