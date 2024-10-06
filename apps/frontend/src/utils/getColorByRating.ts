const ratingRanges = [
  {
    color: "red",
    min: 0,
    max: 3
  },
  {
    color: "orange",
    min: 3,
    max: 6
  },
  {
    color: "green",
    min: 6,
    max: 10
  },
];

export const getColorByRating = (value: number) => {
  for (const range of ratingRanges) {
    if (range.min <= value && value <= range.max) {
      return range.color;
    }
  }
  return ""
}
