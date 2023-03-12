const fileInput = document.getElementById("fileInput");
let pixelArrayInput, pixelArrayInvertion;

function fileInputOnChange() {
    const file = fileInput.files[0];
    const img = new Image();
    const canvasInput = document.createElement("canvas");
    const ctxInput = canvasInput.getContext("2d");

    img.src = URL.createObjectURL(file);

    // draw as img
    /*
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.appendChild(img);
    */

    img.onload = () => {
        canvasInput.width = img.width;
        canvasInput.height = img.height;
        ctxInput.drawImage(img, 0, 0);

        const canvasInputContainer = document.getElementById("canvasInputContainer");
        const canvasBinarizationContainer = document.getElementById("canvasBinarizationContainer");
        const canvasInvertionContainer = document.getElementById("canvasInvertionContainer");

        // invert
        pixelArrayInput = canvas2pixelArray(canvasInput);
        pixelArrayInvertion = invertColor(pixelArrayInput);
        const canvasInvertion = pixelArray2canvas(pixelArrayInvertion);
        // const canvasBinarization = copyCanvas(canvasInput);

        // draw as canvas
        canvasInvertionContainer.appendChild(canvasInvertion);
        canvasInputContainer.appendChild(canvasInput);
        /*
        canvasBinarizationContainer.appendChild(canvasBinarization);
        */

    }
}

function canvas2pixelArray(canvas) {
    const pixelData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    const pixelArray = [];
    for (let y = 0; y < canvas.height; y++) {
        const row = [];
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const r = pixelData[index];
            const g = pixelData[index + 1];
            const b = pixelData[index + 2];
            row.push([r, g, b]);
        }
        pixelArray.push(row);
    }
    return pixelArray;
}

function copyCanvas(sourceCanvas) {
    const targetCanvas = document.createElement("canvas");
    const targetCtx = targetCanvas.getContext("2d");
    targetCanvas.width = sourceCanvas.width;
    targetCanvas.height = sourceCanvas.height;
    targetCtx.drawImage(sourceCanvas, 0, 0);
    return targetCanvas;
}

function pixelGrid2divs() {
    // draw as divs
    /*
    const pixelGrid = document.getElementById("pixelGrid");
    for (let y = 0; y < pixelArray.length; y++) {
        const row = document.createElement("div");
        pixelGrid.appendChild(row);
        for (let x = 0; x < pixelArray[y].length; x++) {
            const [r, g, b] = pixelArray[y][x];
            const pixel = document.createElement("div");
            pixel.style.width = "10px";
            pixel.style.height = "10px";
            pixel.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            //pixel.textContent = `${r},${g},${b}`;
            row.appendChild(pixel);
        }
    }
    */
}

function invertColor(pixelArray) {
    const newPixelArray = [];
    for (let y = 0; y < pixelArray.length; y++) {
        const newRow = [];
        for (let x = 0; x < pixelArray[y].length; x++) {
            const [r, g, b] = pixelArray[y][x];
            newRow.push([255 - r, 255 - g, 255 - b]);
        }
        newPixelArray.push(newRow);
    }
    return newPixelArray;
}

function pixelArray2canvas(pixelArray) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelArray[0].length;
    canvas.height = pixelArray.length;
    const ctx = canvas.getContext("2d");
    for (let y = 0; y < pixelArray.length; y++) {
        for (let x = 0; x < pixelArray[y].length; x++) {
            const [r, g, b] = pixelArray[y][x];
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    return canvas;
}

function sliderOnInput() {
    const slider = document.getElementById("myRange");
    const output = document.getElementById("demo");
    const value = slider.value;

    output.innerHTML = value;
    const pixelArray = pixelArrayInput;
    const pixelArrayBinarization = processPixelArray(pixelArray, value);
    const canvasBinarization = pixelArray2canvas(pixelArrayBinarization);
    const canvasBinarizationContainer = document.getElementById("canvasBinarizationContainer");
    canvasBinarizationContainer.innerHTML = "";
    canvasBinarizationContainer.appendChild(canvasBinarization);
}

function processPixelArray(pixelArray, value) {
    let outputArray = [];
    for (let i = 0; i < pixelArray.length; i++) {
        let row = [];
        for (let j = 0; j < pixelArray[i].length; j++) {
            let avg = (pixelArray[i][j][0] + pixelArray[i][j][1] + pixelArray[i][j][2]) / 3;
            if (avg > value) {
                row.push([255, 255, 255]);
            } else {
                row.push([0, 0, 0]);
            }
        }
        outputArray.push(row);
    }
    return outputArray;
}