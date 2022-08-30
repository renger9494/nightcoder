/**
 * Функция возвращает произвольную строку длиной 9 символов
 * */
const getId = function () {
  return Math.random().toString(36).substr(2, 9);
};

export { getId };
