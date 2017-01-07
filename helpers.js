const canvas = document.createElement('canvas');
canvas.style.width = '200px';
canvas.style.imageRendering = 'pixelated';
const context = canvas.getContext('2d');

document.addEventListener("DOMContentLoaded", () => document.body.appendChild(canvas));

function padLeft(nr, n, str) {
  return Array(n - String(nr).length + 1).join(str||'0') + nr;
}

function loadData(filename) {
  return fetch(filename)
  .then(response => response.arrayBuffer())
  .then(buffer => {
    const headerLength = 16;
    const header  = new DataView(buffer.slice(0,headerLength));
    const [magicNumber, numItems, numRows, numCols] = [0,1,2,3].map(n => header.getUint32(n*4));
    const numLength = numRows * numCols;

    canvas.width = numCols;
    canvas.height = numRows;

    const allImages = new Array(numItems);
    for (let i = 0; i < numItems; i++) {
      allImages[i] = new Uint8Array(buffer.slice(headerLength+i*numLength, headerLength+(i+1)*numLength));
    }
    return {
      numItems,
      numRows,
      numCols,
      allImages
    };
  });
}



function render(data, numRows, numCols) {
  renderCanvas(data, numRows, numCols);
  //renderConsole(data, numRows, numCols);
}

function renderCanvas(data, numRows, numCols) {
  const formattedData = new Uint8ClampedArray(data.length * 4);
  for (let i = 0; i < data.length; i++) {
    formattedData[i*4+3] = data[i];
  }

  context.putImageData(new ImageData(formattedData, numCols, numRows), 0, 0);
}

function renderConsole(data, numRows, numCols) {
  let output = "";
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      output += padLeft(data[y*numCols+x], 3, 0) + " ";
    }
    output += "\n";
  }
  console.log(output);
}
