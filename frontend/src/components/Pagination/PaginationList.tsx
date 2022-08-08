import { paginationConfig } from '@/config/system';
import { IPaginationData } from '@/interface/interfaceCommon';
import { renderPaginationInfo } from '@/util/common';
import { safeAnyToNumber } from '@/util/primitiveHandle';
import { Loader, Pagination, Select } from '@mantine/core';
import { UseForm } from '@mantine/hooks/lib/use-form/use-form';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import './PaginationList.scss';

export const PaginationList = <T extends IPaginationData>({
  fetchingState,
  paginationData,
  filterForm,
}: {
  fetchingState: {
    isFetching: boolean;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
  };
  paginationData?: IPaginationData;
  filterForm: UseForm<T>;
}) => {
  const { t } = useTranslation();

  return (
    <div className="pagination d-flex align-center gap-3">
      <div className="pagination__info">
        {fetchingState.isFetching ? (
          <Loader variant="dots" />
        ) : (
          renderPaginationInfo(paginationData)
        )}
      </div>
      <Pagination
        page={filterForm.values.currentPage}
        total={paginationData?.totalPages || 1}
        siblings={2}
        onChange={(p) => {
          fetchingState.setIsFetching(true);
          filterForm.setFieldValue('currentPage', p);
        }}
        withEdges
        style={fetchingState.isFetching ? { cursor: 'wait' } : undefined}
        styles={{
          item: fetchingState.isFetching ? { pointerEvents: 'none', opacity: 0.5 } : undefined,
        }}
      />

      <Select
        className="pagination__size"
        data={paginationConfig.pageSizePool.map((v) => ({
          label: t('common.pagination.page_size', { size: v }),
          value: v.toString(),
        }))}
        value={(filterForm.values.size || paginationConfig.pageSizePool[0]).toString()}
        rightSection={<></>}
        rightSectionWidth={0}
        styles={{ rightSection: { pointerEvents: 'none' } }}
        onChange={(pageSize) =>
          filterForm.setValues((v) => ({
            ...v,
            size: safeAnyToNumber(pageSize) || paginationConfig.pageSizePool[0],
            currentPage: 1,
          }))
        }
      />
    </div>
  );
};
