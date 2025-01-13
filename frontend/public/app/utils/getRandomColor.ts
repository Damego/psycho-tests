const colors: string[] = ["#638EFF", "#303044", "#D0EEFF"];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

export function getRandomColor() {
  return colors[getRandomInt(colors.length - 1)]
}