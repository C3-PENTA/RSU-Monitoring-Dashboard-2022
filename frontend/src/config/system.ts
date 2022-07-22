import { ILanguageConfig, IPagination, TSupportedLangCode } from '@/interface/interfaceCommon';
import { safeAnyToNumber } from '@/util/primitiveHandle';

import KOFlag from '@/assets/images/flag-south-korea.png';
import USAFlag from '@/assets/images/flag-usa.png';

/**
 * Get & process environment variables (.env)
 */
export const afkTimeout = safeAnyToNumber(import.meta.env.VITE_IDLE_TIMEOUT, 1800000); // 30 mins
export const filterDebounceTime = safeAnyToNumber(import.meta.env.VITE_FILTER_DEBOUNCE_TIME, 400); // 0.4s
export const blinkAnimatedTimeout = safeAnyToNumber(import.meta.env.VITE_UI_BLINKING_TIMEOUT, 5000); // 5s
export const connectionChangeTimeout = safeAnyToNumber(
  import.meta.env.VITE_UI_CONNECTION_TIMEOUT,
  1000,
); // 1s
export const exportRecordsLimit = safeAnyToNumber(import.meta.env.VITE_EXPORT_RECORDS_LIMIT, 10000);

export const CPUThreshold = safeAnyToNumber(import.meta.env.VITE_CPU_THRESHOLD);
export const RAMThreshold = safeAnyToNumber(import.meta.env.VITE_RAM_THRESHOLD);
export const NICThreshold = safeAnyToNumber(import.meta.env.VITE_NIC_THRESHOLD);

/**
 * Language config
 */
export const defaultLanguage: TSupportedLangCode = 'en';

export const languageConfig: ILanguageConfig[] = [
  { lang: 'en', img: KOFlag, alt: 'Korea flag', tooltip: '한국어' },
  { lang: 'ko', img: USAFlag, alt: 'USA flag', tooltip: 'English' },
];

/**
 * Common components config
 */
export const paginationConfig: IPagination = {
  pageSizePool: [10, 15, 20], // the default pageSize is value of the first element.
};
