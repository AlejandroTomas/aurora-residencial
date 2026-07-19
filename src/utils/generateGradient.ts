export default function generateGradient() {
  const colors = [
    ["#ff9a9e", "#fad0c4"],
    ["#a18cd1", "#fbc2eb"],
    ["#ffecd2", "#fcb69f"],
    ["#8fd3f4", "#84fab0"],
    ["#c3cfe2", "#f5f7fa"],
  ];
  const randomPair = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(135deg, ${randomPair[0]}, ${randomPair[1]})`;
}
