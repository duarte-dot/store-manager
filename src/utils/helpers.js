function formatDate() {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const camelize = (data) => {
  const camelData = data.map((item) => Object.keys(item).reduce((acc, key) => {
    acc[key.replace(/_([a-z])/g, (m, c) => c.toUpperCase())] = item[key];
    return acc;
  }, {}));
  return camelData;
};

module.exports = {
  formatDate,
  camelize,
};