import { IPaginationData } from '@/interface/interfaceCommon';
import { t } from 'i18next';

export const sleep = (millis: number) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

export const renderPaginationInfo = (paginationData?: IPaginationData): string => {
  if (!paginationData) {
    return '';
  }
  const { currentPage, size, totalPages, totalRecords } = paginationData;

  if (!size) {
    return '';
  }

  const startIndex = (currentPage || 0) * size - size + 1;
  const endIndex = totalPages === currentPage ? totalRecords : startIndex + size - 1;

  return t('common.pagination.info', { startIndex, endIndex, totalRecords });
};

export const milisecondsToMinutesRound = (miliseconds: number): number => {
  return Math.round((miliseconds / 1000 / 60) * 100) / 100;
};
