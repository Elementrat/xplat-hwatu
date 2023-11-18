const colors = [
  "#3D5E71",
  "#3D716A",
  "#3D7150",
  "#44713D",
  "#5E713D",
  "#716A3D",
  "#71503D",
  "#713D43",
  "#713D5D",
  "#6B3D71"
];

const randomColor = () => {
  return colors[Math.round(Math.random() * colors.length - 1)];
};

export { colors, randomColor };
