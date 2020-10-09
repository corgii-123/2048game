export const leftNinety = array => {
  let w = 4
  let h = 4
  let result = new Array(16).fill(null)
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      result[(w - 1 - j) * w + i] = array[i * w + j]
    }
  }
  return result
}

export const rightNinety = array => {
  let w = 4
  let h = 4
  let result = new Array(16).fill(null)
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      result[i * w + j] = array[(w - 1- j) * w + i]
    }
  }
  return result
}

export const rotateHalf = array => {
  let w = 4
  let h = 4
  let result = new Array(16).fill(null)
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      result[i * w + j] = array[(w - 1- i) * w + (h - 1 - j)]
    }
  }
  return result 
}
