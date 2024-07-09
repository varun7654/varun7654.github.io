---
layout: page
title: Reading Log
---

<head>
  <link rel="stylesheet" href="/css/books.css">
</head>


<div id=books>
</div>

Thanks to the [Open Library](https://openlibrary.org/) and [Google Books](https://books.google.com/) for providing the data powering this page. The backend is run on Cloudflare Workers with the source [here](https://github.com/varun7654/Workers-Books-Api)

<script>
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

            fetchImage(bookData.coverLink + "&fife=w800")

            var currentlyReadingHtml = ""
            if (bookData.list === "Currently Reading") {
                currentlyReadingHtml = `<div class="currently-reading">Currently Reading - ${Math.round(bookData.percentComplete * 100)}%</div>`
            }

            var html = `
                <div class="book">
                    <div style="display:inline-block;vertical-align:top;min-h">
                        <a href="${bookData.link}">
                            <img src="${bookData.coverLink}" loading="lazy" alt="Book Cover for, ${bookData.name}">
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
