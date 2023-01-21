export const isUrlActive = (asPath: string, to: string) => {
  return asPath.split('/')[1] === to.split('/')[1];
};
