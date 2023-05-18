---
layout: page
title: Reading Log
---

<head>
  <link rel="stylesheet" href="/css/books.css">
</head>


<div id=books>
</div>

Thanks to the [OpenLibrary](openlibrary.org) for providing the data powering this page 

<script>
    fetch(
		'https://books.api.dacubeking.com/read',
	)
    .then(function(response) {
        // When the page is loaded convert it to text
        return response.json()
    })
    .then(function(json) {
        json.forEach(function(bookData) {

            var authorHtml = 
                bookData.authors.map(
                    (author, index) => `<a href="${bookData.authorLinks[index]}">${author}</a>`
                )
            var html = `
                <div class="book">
                    <div style="display:inline-block;vertical-align:top;">
                        <a href="${bookData.link}">
                            <img src="${bookData.coverLink}" alt="Book Cover for, ${bookData.name}">
                        </a>
                    </div>
                    <div style="display:inline-block;vertical-align:bottom;">
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
