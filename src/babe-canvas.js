const babeDrawShapes = function(trialInfo) {
    const canvasHeight = (trialInfo.canvasSettings === undefined || trialInfo.canvasSettings.height === undefined) ? 300 : trialInfo.canvasSettings.height;
    const canvasWidth = (trialInfo.canvasSettings === undefined || trialInfo.canvasSettings.width === undefined) ? 500 : trialInfo.canvasSettings.width;
    const canvasBg = (trialInfo.canvasSettings === undefined || trialInfo.canvasSettings.background === undefined) ? 'white' : trialInfo.canvasSettings.background;

    const createCanvas = function(height, width, bg) {
        const canvas = {};
        const canvasElem = document.createElement('canvas');
        const context = canvasElem.getContext("2d");
        canvasElem.classList.add('babe-view-canvas');
        canvasElem.height = height;
        canvasElem.width = width;
        canvasElem.style.backgroundColor = bg;
        $('.babe-view').prepend(canvasElem);

        canvas.draw = function(shape, size, x, y, color) {
            context.beginPath();
            if (shape === 'circle') {
                context.arc(x, y, size / 2, 0, 2*Math.PI);
            } else if (shape === 'square') {
                context.rect(x - (size / 2), y - (size / 2), size, size);
            } else if (shape === 'triangle') {
                var delta = size / (Math.sqrt(3)*2);
                context.moveTo(x - (size / 2), y + delta);
                context.lineTo(x + (size / 2), y + delta);
                context.lineTo(x, y - 2*delta);
            }
            if (color === 'blue') {
                context.fillStyle = '#2c89df';
            } else if (color === 'green') {
                context.fillStyle = '#22ce59';
            } else if (color === 'red') {
                context.fillStyle = '#ff6347';
            } else if (color === 'yellow') {
                context.fillStyle = '#ecd70b';
            } else {
                context.fillStyle = color;
            }
            context.closePath();
            context.fill();
        };

        canvas.getTwoSidedCoords = function(rows, gap, number, size, direction = 'row') {
            // a list of coords
            var coords = [];
            var tempCoords = [];
            // the space between the elems
            var margin = size / 2;
            var columns, xStart, yStart;

            // reset the rows if not passed or more than the total elems
            rows = (rows === 0 || rows === undefined) ? 1 : rows;
            rows = (rows > number) ? number : rows;
            // sets a gap if not specified
            gap = (gap <= size + margin || gap === undefined) ? (margin + size) : gap;
            // calculates the total number of columns per side
            columns = Math.ceil(number / rows);
            // gets the first coordinate so that the elems are centered on the canvas
            xStart = (canvasElem.width - (columns * size + (columns - 2) * margin)) / 2 + margin / 2 - gap / 2;
            yStart = (canvasElem.height - (rows * size + (rows - 2) * margin)) / 2 + margin;

            // expands the canvas if needed
            if (xStart < margin) {
                canvasElem.width += -2*xStart;
                xStart = margin;
            }

            // expands the canvas if needed
            if (yStart < margin) {
                canvasElem.height += -2*yStart;
                yStart = margin;
            }

            // generates the coords
            // for each row
            for (var i=0; i<rows; i++) {
                // for each elem
                for (var j=0; j<number; j++) {
                    // x position, y position
                    var xPos, yPos;
                     // position on the right
                    if ((Math.floor(j/columns) === i) && (j%columns >= Math.ceil(columns / 2))) {
                        xPos = xStart + (j%columns)*size + (j%columns)*margin + gap;
                        yPos = yStart + i*size + i*margin;
                        tempCoords.push({x: xPos, y: yPos});
                    // position on the left
                    } else if (Math.floor(j/columns) === i) {
                        xPos = xStart + (j%columns)*size + (j%columns)*margin;
                        yPos = yStart + i*size + i*margin
                        tempCoords.push({x: xPos, y: yPos});
                    }
                }
            }

            // coords' position on the canvas
            /*
                ----------------
                |              |
                |   000  00x   |
                |   xxx  xxx   |
                |   xxx  xxx   |
                |              |
                ----------------
            */ 
            if (direction === 'row') {
                coords = tempCoords;
            /*
                ----------------
                |              |
                |   000  xxx   |
                |   00x  xxx   |
                |   xxx  xxx   |
                |              |
                ----------------
            */ 
            } else if (direction === 'side_row') {
                var leftPart = [];
                var rightPart = [];
                for (var i=0; i<tempCoords.length; i++) {
                    if (i%columns < columns/2) {
                        leftPart.push(tempCoords[i]);
                    } else {
                        rightPart.push(tempCoords[i]);
                    }
                }

                coords = leftPart.concat(rightPart);
            /*
                ----------------
                |              |
                |   00x  xxx   |
                |   00x  xxx   |
                |   0xx  xxx   |
                |              |
                ----------------
            */ 
             } else if (direction === 'column') {
                var idx;

                for (var i=0; i<tempCoords.length; i++) {
                    idx = ((i%rows) * columns) + Math.floor(i/rows);
                    coords.push(tempCoords[idx]);
                }
            }

            return coords;
        };

        canvas.getRandomCoords = function(number, size) {
            let coords = [];
            const margin = size / 2;

            // increases the canvas if to small to fit all the elems
            (function() {
                let times;
                const area = canvasElem.height * canvasElem.width;
                const minArea = size * size * number * 3;

                if (area < minArea) {
                    times = Math.ceil(minArea / area)
                    canvasElem.height = canvasElem.height * times;
                    canvasElem.width = canvasElem.width * times;
                    console.info(info.canvasTooSmall);
                } else {
                    canvasElem.height = canvasElem.height;
                    canvasElem.width = canvasElem.width;
                }
            })();

            // generates random x and y coordinates in the canvas
            const generateCoords = function() {
                const maxWidth = canvasElem.width - size;
                const maxHeight = canvasElem.height - size;
                const xPos = Math.floor(Math.random() * (maxWidth - size)) + size;
                const yPos = Math.floor(Math.random() * (maxHeight - size)) + size;
                
                return {x: xPos, y: yPos};
            };

            const adjustCanvas = function() {
                const area = canvasElem.height * canvasElem.width;
                console.log('area ' + area);
                const minArea = size * size * number * 2.5;
                console.log('min area ' + minArea);

                if (area < minArea) {
                    canvasElem.height = (canvasElem.height * minArea) / canvasElem.width;
                    canvasElem.width = (canvasElem.width * minArea) / canvasElem.height;
                } else {
                    canvasElem.height = canvasElem.height;
                    canvasElem.width = canvasElem.width;
                }
            };

            // ensures no elements overlap
            const checkCoords = function(xPos, yPos) {
                for (var i=0; i<coords.length; i++) {
                    if (((xPos + size + margin) > coords[i]["x"])
                        && ((xPos - size - margin) < coords[i]["x"])
                        && ((yPos + size + margin) > coords[i]["y"])
                        && ((yPos - size - margin) < coords[i]["y"])) {
                        return false;
                    }
                }
                return true;
            };

            // generates x and y positions on the canvas for one element
            // checks whether the coord is valid
            const findValidCoords = function() {
                let tempCoords = generateCoords();
                if (checkCoords(tempCoords.x, tempCoords.y)) {
                    coords.push(tempCoords);
                } else {
                    findValidCoords();
                }
            };

            // finds valid coordinates for each element
            for (i=0; i<number; i++) {
                findValidCoords();             
            }

            return coords;
        };

        canvas.getGridCoords = function(rows, number, size) {
            var coords = [];
            var margin = size / 2;
            var columns, xStart, yStart;

            if (rows === 0 || rows === undefined) {
                rows = 1;
            } else if (rows > number) {
                rows = number;
            }
            
            columns = Math.ceil(number / rows);
            xStart = (canvasElem.width - (columns * size + (columns - 2) * margin)) / 2 + margin / 2;
            yStart = (canvasElem.height - (rows * size + (rows - 2) * margin)) / 2 + margin;

            // handles small canvases
            if (xStart < margin) {
                canvasElem.width += -2*xStart;
                xStart = margin;
            }

            if (yStart < margin) {
                console.log('true');
                canvasElem.height += -2*yStart;
                yStart = margin;
            }

            for (var i=0; i<rows; i++) {
                for (var j=0; j<number; j++) {
                    if (Math.floor(j/columns) === i) {
                        coords.push({x: xStart + (j%columns)*size + (j%columns)*margin, y: yStart + i*size + i*margin})
                    } else {
                        continue;
                    }
                }
            }

            return coords;
        };

        return canvas;
    };

    const canvas = createCanvas(canvasHeight, canvasWidth, canvasBg);
    const coords =
        trialInfo.sort == 'grid' ? canvas.getGridCoords(trialInfo.rows, trialInfo.total, trialInfo.elemSize) :
        trialInfo.sort == 'split_grid' ? canvas.getTwoSidedCoords(trialInfo.rows, trialInfo.gap, trialInfo.total, trialInfo.elemSize, trialInfo.direction) :
        canvas.getRandomCoords(trialInfo.total, trialInfo.elemSize);

    if (trialInfo.start_with === 'other') {
        for (let i=0; i<trialInfo.total; i++) {
            if (i < trialInfo.total - trialInfo.focalNumber) {
                canvas.draw(trialInfo.otherShape, trialInfo.elemSize, coords[i].x, coords[i].y, trialInfo.otherColor);
            } else {
                canvas.draw(trialInfo.focalShape, trialInfo.elemSize, coords[i].x, coords[i].y, trialInfo.focalColor);
            }
        }
    } else {
        for (let i=0; i<trialInfo.total; i++) {
            if (i < trialInfo.focalNumber) {
                canvas.draw(trialInfo.focalShape, trialInfo.elemSize, coords[i].x, coords[i].y, trialInfo.focalColor);
            } else {
                canvas.draw(trialInfo.otherShape, trialInfo.elemSize, coords[i].x, coords[i].y, trialInfo.otherColor);
            }
        }
    }
};