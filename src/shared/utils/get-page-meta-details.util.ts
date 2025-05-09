import type MetaDetailsDto from '@shared/dtos/meta-details.dto';
import type PageMetaDto from '@shared/dtos/page-meta.dto';

const getPageMetaDetails = ({
  page,
  limit,
  totalItems,
}: MetaDetailsDto): PageMetaDto => {
  const totalPages = Math.ceil(totalItems / limit);

  const hasPreviousPage = page > 1;

  const hasNextPage = page < totalPages;

  return { page, totalItems, totalPages, hasPreviousPage, hasNextPage };
};

export default getPageMetaDetails;
