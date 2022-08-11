export const checkStrArrIncludeKeyword = (keyword: string, arrStr: (string | undefined)[]) =>
  arrStr.some((val) => val?.toLowerCase().includes(keyword));
