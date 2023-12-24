export const arrayToString = <T>(array: T[], selector?: keyof T) => {
  if (selector) {
    return array.map((el) => el[selector]).join(', ');
  }

  return array.map((el) => el).join(', ');
};
