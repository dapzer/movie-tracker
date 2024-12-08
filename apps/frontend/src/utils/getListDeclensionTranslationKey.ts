export const getListDeclensionTranslationKey = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'mediaList.multipleLists';
  }

  switch (lastDigit) {
    case 1:
      return 'mediaList.singleLists';
    case 2:
    case 3:
    case 4:
      return 'mediaList.manyLists';
    default:
      return 'mediaList.multipleLists';
  }
}
