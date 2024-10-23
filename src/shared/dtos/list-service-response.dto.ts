import type PageMetaDto from './page-meta.dto';

export default interface ListServiceResponseDto<T> {
  meta: PageMetaDto;
  data: T[];
}
