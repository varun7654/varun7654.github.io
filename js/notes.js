"use strict"

const extraCanvasHeight = 50;
const noteTextClassName = "note-text-rendered"


let fontsLoaded = false;
// Notes are surrounded by %$ ... $% and should be displayed as an arrow with hand-written text
let noteElementIds = [];
let canvasElementIds = [];
let placedNotePos = new Map();
let noteTextElementIds = []
// Find all the notes and replace them with a div containing the note text
document.addEventListener("DOMContentLoaded", function(event) {

    let canvas = getCanvas(1, 1, 1, 1);
    if (!canvas) return;
    document.body.removeChild(canvas);
    canvasElementIds = [];

    console.log("DOM fully loaded and parsed");
    const pageContent = document.getElementsByClassName("page-content")[0];

    // Select the node that will be observed for mutations

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };


    const updateNoteElements = () => {
        canvasElementIds.forEach(id => {
            let element = document.getElementById(id);
            element.remove();
        });
        canvasElementIds = [];

        noteTextElementIds.forEach(id => {
            let element = document.getElementById(id);
            element.remove()
        })
        noteTextElementIds = []

        noteElementIds.forEach(function(noteElementId, index) {
            const noteElement = document.getElementById(noteElementId)
            let boundingRect /* @type {DOMRect} */ = noteElement.getBoundingClientRect()
            // Find a parent paragraph element
            let parent = noteElement.closest("p");
            let parentBoundRect = parent.getBoundingClientRect();
            let spaceOnLeft = parentBoundRect.x;
            let spaceOnRight = window.innerWidth - (parentBoundRect.x + parentBoundRect.width);

            let textElement = document.createElement("div");
            textElement.id = noteElementId + "-note-text";
            textElement.style.position = "absolute";
            textElement.className = noteTextClassName;
            textElement.textContent = noteElement.getAttribute("data-note-text");
            noteTextElementIds.push(textElement.id);
            document.body.appendChild(textElement);

            let textElementBoundingBox = textElement.getBoundingClientRect();
            let noteWidth = textElementBoundingBox.width;


            let maxRotation = Math.min(degToRad(10), Math.atan2(17, textElementBoundingBox.height));
            console.log(radToDeg(maxRotation));




            if (spaceOnLeft > noteWidth + 40 && spaceOnRight > noteWidth + 40) {
                let yOffset = parentBoundRect.y - extraCanvasHeight / 2;
                let ctx = getCanvasCtx(0, parentBoundRect.y - extraCanvasHeight / 2, parentBoundRect.height + extraCanvasHeight);
                // modify the bounding rects to be in the canvas space
                boundingRect = new DOMRect(boundingRect.x,
                    boundingRect.y - yOffset,
                    boundingRect.width, boundingRect.height);

                parentBoundRect = new DOMRect(parentBoundRect.x, extraCanvasHeight / 2, parentBoundRect.width, parentBoundRect.height);

                let randomRoatation = random(index) * maxRotation * 2 - maxRotation;
                textElement.style.transform = "rotate(" + randomRoatation + "rad)"

                let leftSide = true; //random(index + 3 ) > 0.5;
                textElement.style.top = (yOffset + 20) + "px"

                if (leftSide) {
                    textElement.style.left = "20px"
                } else {
                    textElement.style.left = (parentBoundRect.right +  20) + "px"
                }

                textElementBoundingBox = textElement.getBoundingClientRect();
                let height = textElementBoundingBox.height * Math.cos(randomRoatation)
                let width = textElementBoundingBox.width * Math.sin(randomRoatation);
                console.log(textElementBoundingBox.x, textElementBoundingBox.y, textElementBoundingBox.width, textElementBoundingBox.height);
                let endY = random(index + 10) * Math.min(height - 20, parentBoundRect.height + 10);
                console.log("endy", endY)
                let endXOffset = Math.tan(randomRoatation) * endY;
                let endX;
                if (leftSide) {
                    console.log("offset", Math.sin(randomRoatation) * width);
                    endY += Math.sin(randomRoatation) * textElementBoundingBox.width / 2;
                    endX = textElementBoundingBox.right + endXOffset + 5;

                } else {
                    endX = textElementBoundingBox.x - endXOffset - 5;
                }

                console.log(endX, endY);

                drawArrow(ctx, boundingRect.x, boundingRect.y + boundingRect.height / 2, endX, endY + 20, index);



            } else {
                console.log("Screen too small")
            }
        })
    };

    // Callback function to execute when mutations are observed
    const callback = (mutationList /* @type {MutationRecord[]} */, observer) => {
        if (!fontsLoaded) return;
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                let hasNonTextNode = Array.from(mutation.addedNodes).some(node => node.className !== noteTextClassName)
                if (hasNonTextNode) {
                    console.log("A child node has been added or removed.", mutation.target);
                    updateNoteElements();
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    window.addEventListener('resize', updateNoteElements);
    document.fonts.ready.then(() => {
        fontsLoaded = true;
        updateNoteElements();
    });

    // Start observing the target node for configured mutations
    observer.observe(pageContent, config);


    let wrapper = pageContent.getElementsByClassName("wrapper")[0];


    const notes = wrapper.innerHTML.match(/%\$[\s\S]*?\$%/g);
    if (notes) {
        notes.forEach(function(note) {
            const noteText = note.slice(2, -2);
            const noteElement = document.createElement("span");
            const noteId = "note-" + noteElementIds.length;
            noteElement.id = noteId;
            noteElement.className = "note";
            // hide the note text in the data of the element
            noteElement.dataset.noteText = noteText;
            wrapper.innerHTML = wrapper.innerHTML.replace(note, noteElement.outerHTML);

            noteElementIds.push(noteId);
        });
    }
});


let canvasCount = 0;
function getCanvas(x, y, width, height) {
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
    canvas.style.zIndex = "-1";
    document.body.appendChild(canvas);



    if (!canvas.getContext) {
        console.error("Canvas not supported");
        return;
    }

    return canvas;
}

function getPixelRatio(context) {
    let dpr = window.devicePixelRatio || 1,
        bsr = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

    return dpr / bsr;
}

function getCanvasCtx(x, y, height) {
    let width = window.innerWidth;
    const canvas = getCanvas(x, y, width, height);
    const ctx = canvas.getContext("2d");
    let pixelRatio = getPixelRatio(ctx);
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.strokeStyle = "blue";
    return ctx;
}

const degToRad = deg => (deg * Math.PI) / 180.0;
const radToDeg = rad => (rad * 180.0) / Math.PI;


let randoms = []

function random(index) {
    if (randoms.length > index) {
        return randoms[index];
    } else {
        for (let i = randoms.length; i <= index; i++) {
            randoms.push(Math.random());
        }
        return randoms[index]
    }
}

function drawArrow(ctx, startX, startY, endX, endY, index) {
    let middleX = (endX + startX) / 2
    let middleY = (endY + startY) / 2
    ctx.beginPath();
    ctx.moveTo(startX, startY);


    ctx.quadraticCurveTo(middleX, middleY + random(index) * 300 - 150, endX, endY );
    ctx.stroke();
}