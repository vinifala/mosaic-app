export default size => arr => {
  const a = [];
  for (let i = 0; i < arr.length; i += size) {
    a.push(arr.slice(i, i + size));
  }
  return a;
};
