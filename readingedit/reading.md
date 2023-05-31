---
layout: default
title: Reading Log (Edit Mode)
---

<head>
  <link rel="stylesheet" href="/css/books.css">
</head>


<div id=books>
</div>

Thanks to the [Open Library](https://openlibrary.org/) for providing the data powering this page 

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
                    (author, index) => `<a href="${bookData.authorLinks[index]}">${author}</a>`
                )

            fetchImage(bookData.coverLink)
            var html = `
                <div class="book">
                    <div style="display:inline-block;vertical-align:top;">
                        <a href="https://books.api.dacubeking.com/bestedition?workId=${bookData.workId}&render=true&bypassCache=true">
                            <img src="${bookData.coverLink}" alt="Edit Book Info for, ${bookData.name}">
                        </a>
                    </div>
                    <div style="display:inline-block;vertical-align:bottom;">
                        <div class="book-title">
                            <a href="https://books.api.dacubeking.com/bestedition?workId=${bookData.workId}&render=true">${bookData.name}</a>
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
