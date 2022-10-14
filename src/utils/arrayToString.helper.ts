export const arrayToString = (array: any[], selector: string) => {
  return array.map((el) => el[selector]).join(', ');
};
