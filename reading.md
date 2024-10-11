---
layout: page
title: Reading Log
---

<head>
  <link rel="preload" href="/css/books.css" as="style">
  <link rel="stylesheet" href="/css/books.css">
  <link rel="preload" href="https://books.api.dacubeking.com/read" as="fetch" crossorigin="anonymous">
</head>


<div id=books>
</div>

Thanks to the [Open Library](https://openlibrary.org/) and [Google Books](https://books.google.com/) for providing the data powering this page. The backend is run on Cloudflare Workers with the source [here](https://github.com/varun7654/Workers-Books-Api)

<script>
    const sizes = [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600]

    fetch(
		'https://books.api.dacubeking.com/read',
	)
    .then(function(response) {
        // When the page is loaded convert it to text
        return response.json()
    })
    .then(function(json) {
        async function fetchImage(url) {
            const img = new Image();
            return new Promise((res, rej) => {
                img.onload = () => res(img);
                img.onerror = e => rej(e);
                img.src = url;
            });
        }

        
        json.forEach(function(bookData) {
            var authorHtml = 
                bookData.authors.map(
                    (author, index) => `${author}`
                )

            authorHtml = authorHtml.join(", ");

            let imageLink = bookData.coverLink;
            let imageSources = "";
            for (size of sizes) {
                if (imageLink.includes("books.google.com")) {
                    imageSources += imageLink + "&fife=w" + size + " " + size + "w, "
                }
            }
            
            //fetchImage(imageLink)

            var currentlyReadingHtml = ""
            if (bookData.list === "Currently Reading") {
                currentlyReadingHtml = `<div class="currently-reading">Currently Reading - ${Math.round(bookData.percentComplete * 100)}%</div>`
            }

            var html = `
                <div class="book">
                    <div style="display:inline-block;vertical-align:top;min-h">
                        <a href="${bookData.link}">
                            <img src="${imageLink}" srcset="${imageSources}" loading="lazy" alt="Book Cover for, ${bookData.name}">
                        </a>
                    </div>
                    <div style="display:inline-block;vertical-align:bottom;">
                        ${currentlyReadingHtml}
                        <div class="book-title">
                            <a href="${bookData.link}">${bookData.name}</a>
                        </div>
                        <div class="author">
                            ${authorHtml}
                        </div>
                        <div class="published">
                            ${bookData.published}
                        </div>
                    </div>
                </div>
            `

            document.getElementById("books").innerHTML +=  html
        });
    })
</script>

[Edit This](/readingedit/reading)
