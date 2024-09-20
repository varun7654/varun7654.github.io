"use strict"

const extraCanvasHeight = 100;
const noteTextClassName = "note-text-rendered"


let fontsLoaded = false;
let noteFontLoaded = false;

let noteElementIds: string[] = [];
let canvasElementIds: string[] = [];
let placedNotePos = new Map();
let noteTextElementIds: string[] = [];

function toGlobalBounds(boundingClientRect: DOMRect) {
    return new DOMRect(boundingClientRect.x + window.scrollX, boundingClientRect.y + window.scrollY, boundingClientRect.width, boundingClientRect.height);
}

// Find all the notes and replace them with a div containing the note text
document.addEventListener("DOMContentLoaded", function (event) {

    let canvas = getCanvas(1, 1, 1, 1);
    if (!canvas) return;
    document.body.removeChild(canvas);
    canvasElementIds = [];

    const pageContent = document.getElementsByClassName("page-content")[0];

    // Select the node that will be observed for mutations

    // Options for the observer (which mutations to observe)
    const config = {attributes: true, childList: true, subtree: true};


    const updateNoteElements = () => {
        canvasElementIds.forEach(id => {
            let element = document.getElementById(id);
            if (!element) return;
            element.remove();
        });
        canvasElementIds = [];

        noteTextElementIds.forEach(id => {
            let element = document.getElementById(id);
            if (!element) return;
            element.remove()
        })
        noteTextElementIds = []

        noteElementIds.forEach(function (noteElementId, index) {
            const noteElement = document.getElementById(noteElementId)
            if (!noteElement) {
                console.error("Couldn't find element: " + noteElementId);
                return;
            }
            let boundingRect /* @type {DOMRect} */ = toGlobalBounds(noteElement.getBoundingClientRect());
            // Find a parent paragraph element
            let parent = noteElement.closest("p");
            if (!parent) {
                console.error("Couldn't find p parent for: " + noteElementId);
                return;
            }

            let parentBoundRect = toGlobalBounds(parent.getBoundingClientRect());
            let spaceOnLeft = parentBoundRect.x;
            let spaceOnRight = window.innerWidth - (parentBoundRect.x + parentBoundRect.width);

            let textElementParent = document.createElement("div");
            textElementParent.id = noteElementId + "-note-text";
            textElementParent.style.position = "absolute";
            textElementParent.className = noteTextClassName;
            noteTextElementIds.push(textElementParent.id);
            document.body.appendChild(textElementParent);

            let textElement = document.createElement("span");
            textElement.innerHTML = noteElement.getAttribute("data-note-text") as string;

            textElementParent.appendChild(textElement);

            let textElementBoundingBox = toGlobalBounds(textElement.getBoundingClientRect());
            let noteWidth = textElementBoundingBox.width;
            let noteHeight = textElementBoundingBox.height;

            let canPlaceOnSide = spaceOnLeft > noteWidth + 40 && spaceOnRight > noteWidth + 40


            let maxRotation;
            if (canPlaceOnSide) {
                maxRotation = Math.min(degToRad(10), Math.atan2(17, textElementBoundingBox.height));
            } else {
                maxRotation = Math.min(degToRad(5), Math.atan2(17, textElementBoundingBox.height));
            }

            let randomRotation = random(index, 0) * maxRotation * 2 - maxRotation;
            textElementParent.style.transform = "rotate(" + randomRotation + "rad)"
            let yOffset;
            let ctx;
            let leftSide;
            if (canPlaceOnSide) {
                yOffset = parentBoundRect.y - extraCanvasHeight / 2;
                ctx = getCanvasCtx(0, parentBoundRect.y - extraCanvasHeight / 2, parentBoundRect.height + extraCanvasHeight);

                leftSide = random(index, 5) > 0.5;
                textElementParent.style.top = (yOffset + 60) + "px"

                if (leftSide) {
                    textElementParent.style.left = (spaceOnLeft - noteWidth - 20) + "px"
                } else {
                    textElementParent.style.left = (parentBoundRect.right + 20) + "px"
                }
            } else {
                document.body.removeChild(textElementParent);
                parent.insertAdjacentElement("afterend", textElementParent);
                textElementParent.style.position = "relative"

                let textElemParentBoundingBox = toGlobalBounds(textElementParent.getBoundingClientRect());
                let space = toGlobalBounds(parent.parentElement!.getBoundingClientRect()).width - textElemParentBoundingBox.width - 2;

                textElementParent.style.paddingLeft = (random(index, 5) * space) + "px";


                let textAlignRandom = random(index, 10);
                let textAlign;
                if (textAlignRandom < 0.33) {
                    textAlign = "left";
                } else if (textAlignRandom < 0.66) {
                    textAlign = "center";
                } else {
                    textAlign = "right";
                }
                textElementParent.style.textAlign = textAlign;
                ctx = getCanvasCtx(0, parentBoundRect.y - extraCanvasHeight / 2, parentBoundRect.height + textElemParentBoundingBox.width + extraCanvasHeight);
                yOffset = parentBoundRect.y - extraCanvasHeight / 2;
            }

            // modify the bounding box to be in the canvas space
            boundingRect = new DOMRect(boundingRect.x,
                boundingRect.y - yOffset,
                boundingRect.width, boundingRect.height);

            textElementBoundingBox = toGlobalBounds(textElement.getBoundingClientRect());
            let teBB = new DOMRect(textElementBoundingBox.x, textElementBoundingBox.y - yOffset, textElementBoundingBox.width, textElementBoundingBox.height);

            //ctx.strokeRect(textElementBoundingBox.x, textElementBoundingBox.y - yOffset, textElementBoundingBox.width, textElementBoundingBox.height);

            let topLeft;
            let topRight;
            let bottomLeft;
            let bottomRight;

            if (randomRotation > 0) {
                topLeft = new Point(teBB.left + Math.sin(randomRotation) * noteHeight, teBB.top);
            } else {
                topLeft = new Point(teBB.left, teBB.top - Math.sin(randomRotation) * noteWidth);
            }
            topRight = topLeft.addAngle(noteWidth, 0, randomRotation);
            bottomLeft = topLeft.addAngle(0, noteHeight, randomRotation);
            bottomRight = topLeft.addAngle(noteWidth, noteHeight, randomRotation);


            // ctx.beginPath();
            // ctx.moveTo(topLeft.x,topLeft.y);
            // ctx.lineTo(bottomLeft.x,bottomLeft.y);
            // ctx.lineTo(bottomRight.x,bottomRight.y);
            // ctx.lineTo(topRight.x, topRight.y);
            // ctx.closePath();
            // ctx.stroke()

            let alpha = random(index, 6) * 0.5 + 0.15;
            let endX;
            let endY;
            let rotationBias;
            if (canPlaceOnSide) {
                if (leftSide) {
                    endX = lerp(topRight.x, bottomRight.x, alpha);
                    endY = lerp(topRight.y, bottomRight.y, alpha);
                } else {
                    endX = lerp(topLeft.x, bottomLeft.x, alpha);
                    endY = lerp(topLeft.y, bottomLeft.y, alpha);
                }
                rotationBias = randomRotation;
            } else {
                endX = lerp(topLeft.x, topRight.x, alpha);
                endY = lerp(topLeft.y, topRight.y, alpha);
                rotationBias = randomRotation + Math.PI;
            }

            drawArrow(ctx, boundingRect.x, boundingRect.y + boundingRect.height / 2, endX, endY, index, rotationBias, canPlaceOnSide);

        })
    };

    // Callback function to execute when mutations are observed
    const callback = (mutationList: MutationRecord[], observer: MutationObserver) => {
        if (!fontsLoaded || !noteFontLoaded) return;
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                // @ts-ignore
                let hasNonTextNode = Array.from(mutation.addedNodes).some(node => node.className !== noteTextClassName)
                if (hasNonTextNode) {
                    updateNoteElements();
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    window.addEventListener('resize', updateNoteElements);

    document.fonts.load("2em Zeyada").then(() => {
        noteFontLoaded = true;
        if (fontsLoaded) {
            updateNoteElements();
        }
    });
    document.fonts.ready.then(() => {
        fontsLoaded = true;
        if (noteFontLoaded) {
            updateNoteElements();
        }
    });

    // Start observing the target node for configured mutations
    observer.observe(pageContent, config);


    let notes = pageContent.getElementsByClassName("note");
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        noteElementIds.push(note.id);
    }
});


let canvasWidthShrink = 50;

let canvasCount = 0;

function getCanvas(x: number, y: number, width: number, height: number) {
    // Add a canvas behind the page content to draw the notes on
    const canvas = document.createElement("canvas");
    canvas.id = "notes-canvas-" + canvasCount;
    canvasElementIds.push(canvas.id);
    canvasCount++;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.style.position = "absolute";
    canvas.style.top = y + "px";
    canvas.style.left = x + "px";
    canvas.style.right = "0px"
    canvas.style.zIndex = "-1"
    canvas.style.zIndex = "-1";
    document.body.appendChild(canvas);


    if (!canvas.getContext) {
        console.error("Canvas not supported");
        return;
    }

    return canvas;
}

function getPixelRatio(context: CanvasRenderingContext2D) {
    let dpr = window.devicePixelRatio || 1,
        // @ts-ignore
        bsr = context.webkitBackingStorePixelRatio ||
            // @ts-ignore
            context.mozBackingStorePixelRatio ||
            // @ts-ignore
            context.msBackingStorePixelRatio ||
            // @ts-ignore
            context.oBackingStorePixelRatio ||
            // @ts-ignore
            context.backingStorePixelRatio || 1;

    return dpr / bsr;
}

function getCanvasCtx(x: number, y: number, height: number) {
    let width = window.innerWidth;
    const canvas = getCanvas(x, y, width - canvasWidthShrink, height)!;
    const ctx = canvas.getContext("2d")!;
    let pixelRatio = getPixelRatio(ctx);
    canvas.width = (width - canvasWidthShrink) * pixelRatio;
    canvas.height = height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
    ctx.strokeStyle = "e7e1d3";

    ctx.lineWidth = 0.7;
    return ctx;
}

const degToRad = (deg: number) => (deg * Math.PI) / 180.0;
const radToDeg = (rad: number) => (rad * 180.0) / Math.PI;


let randoms: number[][] = []

function random(index: number, index2: number) {
    let arr1;
    if (randoms.length > index) {
        arr1 = randoms[index];
    } else {
        for (let i = randoms.length; i <= index; i++) {
            randoms.push([]);
        }
        arr1 = randoms[index];
    }
    if (arr1.length > index2) {
        return arr1[index2];
    } else {
        for (let i = arr1.length; i <= index2; i++) {
            arr1.push(Math.random());
        }
        return arr1[index2];
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} startX
 * @param {number} startY
 * @param {number} endX
 * @param {number} endY
 * @param {number} index
 * @param {number} endAngleBias
 * @param {boolean} connectedToSide
 */
function drawArrow(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, index: number, endAngleBias: number, connectedToSide: boolean) {
    let middleX = (endX + startX) / 2
    let middleY = (endY + startY) / 2

    let distance = Math.sqrt((startX - endX) * (startX - endX) + (startY - endY) * (startY - endY));
    let isUp;
    if (Math.abs(startY - endY) < 5) {
        isUp = random(index, 2) < 0.5;
    } else {
        isUp = endY > startY;
    }

    let isLeft = endX < startX;

    // generate an angle between 30 - 60 degrees in rad
    let angle = random(index, 3) * (Math.PI / 6) + (Math.PI / 6);
    let angleCos = Math.cos(angle);
    let angleSin = Math.sin(angle);
    if (isLeft) {
        angleCos = -angleCos;
    }
    if (!isUp) {
        angleSin = -angleSin;
    }

    let enterMag = .12 * distance;
    let cp1x = angleCos * enterMag + startX;
    let cp1y = angleSin * enterMag + startY;

    let angle2 = (isLeft && connectedToSide) ? endAngleBias : endAngleBias + Math.PI;
    if (connectedToSide) {
        angle2 += random(index, 4) * 0.2
    } else {
        angle2 += Math.atan2(isUp ? -1 : 1, random(index, 4) * 0.4 - 0.2);
    }

    let backOffAmount = -20;
    endX = endX - backOffAmount * Math.cos(angle2);
    endY = endY - backOffAmount * Math.sin(angle2);

    let arrowOrigin = new Point(endX, endY).addAngle(-4 + (-6) * random(index, 5), 0, angle2);
    let arrowPoint = arrowOrigin.addAngle(-10, 0, angle2);
    let arrowLeft = arrowOrigin.addAngle(3, 5 + (3) * random(index, 9), angle2);
    let arrowLeftControl = arrowOrigin.addAngle(-3, 2 + (3) * random(index, 6), angle2);
    let arrowRight = arrowOrigin.addAngle(3, -5 + (-3) * random(index, 10), angle2);
    let arrowRightControl = arrowOrigin.addAngle(-3, -2 + (-3) * random(index, 7), angle2);


    let reextendAmount = random(index, 8) * 15;
    endX = endX - reextendAmount * Math.cos(angle2);
    endY = endY - reextendAmount * Math.sin(angle2);


    let exitMag = 0.4 * (connectedToSide ? distance : 200);
    let cp2x = Math.cos(angle2) * exitMag + endX;
    let cp2y = Math.sin(angle2) * exitMag + endY;

    ctx.beginPath();

    ctx.moveTo(arrowLeft.x, arrowLeft.y);
    ctx.quadraticCurveTo(arrowLeftControl.x, arrowLeftControl.y, arrowPoint.x, arrowPoint.y);
    ctx.quadraticCurveTo(arrowRightControl.x, arrowRightControl.y, arrowRight.x, arrowRight.y);

    ctx.moveTo(startX, startY);

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    ctx.stroke();
}

function lerp(a: number, b: number, alpha: number) {
    return a + (b - a) * alpha;
}


class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(x: number, y: number) {
        return new Point(this.x + x, this.y + y);
    }

    addAngle(x: number, y: number, theta: number) {
        let sin = Math.sin(theta);
        let cos = Math.cos(theta);
        return new Point(this.x + cos * x - sin * y, this.y + sin * x + cos * y);
    }
}

