const colors = [
  "#3D5E71",
  "#3D716A",
  "#3D7150",
  "#44713D",
  "#716A3D",
  "#71503D",
  "#713D5D",
  "#6B3D71",
];

const greys = [
  "#f8f9fa",
  "#e9ecef",
  "#dee2e6",
  "#ced4da",
  "#adb5bd",
  "#6c757d",
  "#495057",
  "#343a40",
  "#2b3035",
  "#212529",
  "#15171a",
  "#845EC2",
];

const randomColor = () => {
  return colors[Math.round(Math.random() * colors.length - 1)];
};

export { colors, randomColor, greys };
