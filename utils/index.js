export const navigation = [
  {
    to: "/",
    label: "Tokens",
  },
  {
    to: "/badges",
    label: "Badges",
  },
  {
    to: "/criteria",
    label: "Criteria",
  },
  {
    to: "/statistics",
    label: "Statistics",
  },
];

export const arraysEqual = (a, b) => {
  if (a === b) return true;
  // eslint-disable-next-line eqeqeq
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (const [index, element] of a.entries())
    if (element !== b[index]) return false;

  return true;
};
