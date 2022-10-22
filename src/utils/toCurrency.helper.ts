export const toCurrency = (value: number, currencyType: string, locale: string) => {
  return value.toLocaleString(locale, {
    style: 'currency',
    currency: currencyType,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
