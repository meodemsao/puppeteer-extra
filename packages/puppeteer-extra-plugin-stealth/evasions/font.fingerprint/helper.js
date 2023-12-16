/**
 * random method
 * @param min
 * @param max
 * @param pon random positive or negative
 */
export function _rd(min, max, pon = false) {
  const c = max - min + 1
  return Math.floor(Math.random() * c + min) * (pon ? _pon() : 1)
}

/**
 *
 * @param {*} arr
 * @returns
 */
export function _arrRd(arr) {
  if (!arr || !arr.length) {
    throw new TypeError('arr must not be empty')
  }
  return arr[_rd(0, arr.length - 1)]
}

/**
 * positive or negative
 */
export function _pon() {
  return _rd(0, 10) >= 5 ? 1 : -1
}

/**
 *
 * @param {*} arr
 * @returns
 */
export function arrShuffle(arr) {
  const result = arr.sort(() => 0.5 - Math.random())
  return result
}
