"use strict"

// Notes are surrounded by %$ ... $% and should be displayed as an arrow with hand-written text
let noteElementIds = [];
// Find all the notes and replace them with a div containing the note text
document.addEventListener("DOMContentLoaded", function(event) {

    let canvas = getCanvas(1, 1, 1, 1);
    if (!canvas) return;
    document.body.removeChild(canvas);

    console.log("DOM fully loaded and parsed");
    const pageContent = document.getElementsByClassName("page-content")[0];

    // Select the node that will be observed for mutations

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                console.log("A child node has been added or removed.");
                noteElementIds.forEach(function(noteElementId) {
                    const noteElement = document.getElementById(noteElementId)
                    let boundingRect /* @type {DOMRect} */ = noteElement.getBoundingClientRect()
                    console.log(boundingRect.x, boundingRect.y, boundingRect.width, boundingRect.height);

                    // Find a parent paragraph element
                    let parent = noteElement.closest("p");
                    let parentBoundRect = parent.getBoundingClientRect();
                    let spaceOnLeft = parentBoundRect.x;
                    let spaceOnRight = document(parentBoundRect.x + parentBoundRect.width);
                })
            } else if (mutation.type === "attributes") {
                console.log(`The ${mutation.attributeName} attribute was modified.`);
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

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
    canvasCount++;
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = "absolute";
    canvas.style.top = "" + x;
    canvas.style.left = "" + y;
    canvas.style.zIndex = "-1";
    document.body.appendChild(canvas);

    if (!canvas.getContext) {
        console.error("Canvas not supported");
        return;
    }

    return canvas;
}

function getCanvasCtx(x, y, width, height) {
    const canvas = getCanvas(x, y, width, height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    return ctx;
}
