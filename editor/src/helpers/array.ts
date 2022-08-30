/**
 * Переносит элемент в массиве c позиции fromIndex в toIndex
 *
 * @return новый массив
 *
 * @param array исходный массив
 * @param fromIndex индекс с которого нужно перестить
 * @param toIndex индекс в который нужно переместить
 * */
const move = function (array: any[], fromIndex: number, toIndex: number) {
  return (array = array.slice()), array.splice(toIndex, 0, ...array.splice(fromIndex, 1)), array;
};

export { move };
