export const arrayToString = (array: any[], selector?: string) => {
  if (selector) {
    return array.map((el) => el[selector]).join(', ');
  } else {
    return array.map((el) => el).join(', ');
  }
};
