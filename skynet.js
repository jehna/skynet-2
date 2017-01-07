/**
 * Data loaded from: http://yann.lecun.com/exdb/mnist/
 */

loadData('train-images-idx3-ubyte').then(({ allImages, numRows, numCols }) => {
  render(allImages[0], numRows, numCols);
});
