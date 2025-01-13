export const decomposeFlag = (flag: number) => {
  return flag
    .toString(2)
    .split("")
    .reverse()
    .map((x, i) => (x === "1" ? Math.pow(2, i) : 0))
    .filter(Boolean);
};
