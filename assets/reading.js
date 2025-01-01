const sizes = [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600]

fetch(
    'https://books.api.dacubeking.com/read',
)
.then(response => {
    return response.json();
})
.then(json => {
        json.forEach(function(bookData) {
            let imageLink = bookData.coverLink;
            let imageSources = "";
            for (size of sizes) {
                if (imageLink.includes("books.google.com")) {
                    imageSources += imageLink + "&fife=w" + size + " " + size + "w, "
                }
            }

            let div = document.createElement("div");
            div.className = "book";

            let imageDiv = document.createElement("div");
            imageDiv.style = "display:inline-block;vertical-align:top;min-h";

            let imgLink = document.createElement("a");
            imgLink.href = bookData.link;

            let img = document.createElement("img");
            img.src = imageLink;
            img.srcset = imageSources;
            img.sizes = "(max-width: 16em) 100vw, 16em";
            img.loading = "lazy";
            img.alt = `Book Cover for: ${bookData.name}`;
            img.addEventListener("load", () => {
                img.style = "aspect-ratio: unset";
            })

            imgLink.appendChild(img);
            imageDiv.appendChild(imgLink);

            div.appendChild(imageDiv);

            let infoDiv = document.createElement("div");
            infoDiv.style = "display:inline-block;vertical-align:bottom; width:20em; margin-top:0.3em";

            if (bookData.list === "Currently Reading") {
                let currReadingDiv = document.createElement("div");
                currReadingDiv.className = "currently-reading";
                currReadingDiv.textContent = `Currently Reading - ${Math.round(bookData.percentComplete * 100)}%`
                infoDiv.appendChild(currReadingDiv);
            }

            let titleDiv = document.createElement("div");
            titleDiv.className = "book-title";
            titleDiv.href = bookData.link;
            titleDiv.textContent = bookData.name;
            infoDiv.appendChild(titleDiv);

            let authorDiv = document.createElement("div");
            authorDiv.className = "author";
            authorDiv.textContent = bookData.authors.join(", ");
            infoDiv.appendChild(authorDiv);

            let publishedDiv = document.createElement("div");
            publishedDiv.className = "published";
            publishedDiv.textContent = bookData.published;
            infoDiv.appendChild(publishedDiv);
            div.appendChild(infoDiv);

            document.getElementById("books").appendChild(div);
        });
    }
)