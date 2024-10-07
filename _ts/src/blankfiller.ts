type FillableElement = {
    before: string;
    fillKey: string;
};

function extractFillableElements(input: string): FillableElement[] {
    const regex = /(?<!\\)\[([^\]]+)\]/g;
    let result: FillableElement[] = [] as FillableElement[];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(input)) !== null) {
        // `match.index` is the position of the match in the string
        let before = input.slice(lastIndex, match.index); // Everything before the fillable element
        const fillKey = match[1]; // The captured group for the element name inside []

        before = before.replace(/\\\[/g, "["); //unescape the \[

        result.push({ before, fillKey });

        lastIndex = regex.lastIndex; // Update last index to the end of this match
    }

    // If there is anything after the last match, include it in the final object with an empty element
    if (lastIndex < input.length) {
        result.push({ before: input.slice(lastIndex).replace(/\\\[/g, "["), fillKey: '' });
    }

    return result;
}


let templateParsed = [] as FillableElement[]
let fillKeys = new Set<string>();


function templateChanged(element: HTMLTextAreaElement) {
    localStorage.setItem("blankfiller.templateText", element.value);
    templateParsed = extractFillableElements(element.value);

    let fillArea = document.getElementById("fillArea");
    if (!fillArea) {
        console.error("no fill area");
        return;
    }

    fillKeys.clear();
    templateParsed.forEach(template => {
        if (template.fillKey.length > 0) {
            fillKeys.add(template.fillKey.toLowerCase());
        }
    })

    fillKeys.forEach(
        fillKey => {
            if (fillKey.length > 0) {
                let lowerFillKey = fillKey.toLowerCase();
                let elem = document.getElementById("template-fill-div-" + lowerFillKey);
                if (!elem) {
                    let div = document.createElement("div");
                    div.id = "template-fill-div-" + lowerFillKey;
                    div.className = "fill-div";

                    let label = document.createElement("label");
                    label.htmlFor = "lowerFillKey"
                    label.innerText = lowerFillKey + ":";
                    label.className = "fill-label"

                    let textInput = document.createElement("input");
                    textInput.id = "template-fill-input-" + lowerFillKey;
                    textInput.type = "text";
                    textInput.name = lowerFillKey;
                    textInput.className = "fill-textinput"
                    textInput.addEventListener('input', () => {
                        onFillChange();
                    })

                    div.appendChild(label);
                    div.appendChild(textInput);
                    fillArea.appendChild(div);
                }
            }
        }
    )

    for (let child of fillArea.children) {
        if (!fillKeys.has(child.id.substring("template-fill-div-".length))){
            child.remove();
        }
    }
}

function onFillChange() {

    let fillArea = document.getElementById("fillArea");
    if (!fillArea) {
        console.error("no fill area");
        return;
    }

    let fillData = new Map<string, string>;
    fillKeys.forEach((key) => {
        let input = document.getElementById("template-fill-input-" + key) as HTMLInputElement;
        fillData.set(key, input.value);
    });


    let outStr = "";
    templateParsed.forEach(template => {
        outStr += template.before;
        if (template.fillKey.length > 0) {
            let fillText = fillData.get(template.fillKey.toLowerCase()) as string;
            if (template.fillKey.charAt(0).toLowerCase() != template.fillKey.charAt(0)) {
                // upercase fillKey
                fillText = fillText.charAt(0).toUpperCase() + fillText.substring(1);
            }
            outStr += fillText
        }
    });

    let outArea = document.getElementById("outputText") as HTMLTextAreaElement;
    outArea.value = outStr;
}

document.addEventListener("DOMContentLoaded", function (event) {
    let template = document.getElementById('templateText') as HTMLTextAreaElement;
    if (!template) {
        console.error("No template found");
        return;
    }
    template.addEventListener('input', () => {
        templateChanged(template);
        onFillChange();
    });


    let restoreText = localStorage.getItem("blankfiller.templateText")
    if (!restoreText) {
        console.log("No template found")
    } else {
        template.value = restoreText;
        templateChanged(template);
        onFillChange();
    }
});
