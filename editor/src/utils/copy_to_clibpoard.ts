export default (value: string) => {
  const hiddenField = document.createElement('input');

  hiddenField.value = value;
  document.body.appendChild(hiddenField);
  hiddenField.select();
  document.execCommand('copy');
  document.body.removeChild(hiddenField);
};
