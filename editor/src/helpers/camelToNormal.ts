export default (str: string) => {
  return str
    .replace(/[\w]([A-Z])/g, function (m) {
      return `${m[0]}-${m[1]}`;
    })
    .toLowerCase();
};
