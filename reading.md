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
    fetch('https://books.api.dacubeking.com/read')
    .then(function(response) {
        // When the page is loaded convert it to JSON
        return response.json();
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

        function getContainerWidth(container) {
            return container.offsetWidth;
        }

        json.forEach(function(bookData) {
            var authorHtml = bookData.authors.map((author, index) => `${author}`).join(", ");

            var currentlyReadingHtml = "";
            if (bookData.list === "Currently Reading") {
                currentlyReadingHtml = `<div class="currently-reading">Currently Reading - ${Math.round(bookData.percentComplete * 100)}%</div>`;
            }

            var bookContainer = document.createElement('div');
            bookContainer.className = "book";
            
            var bookContent = `
                <div style="display:inline-block;vertical-align:top;min-h" class="book-image-container">
                    <a href="${bookData.link}">
                        <img src="" loading="lazy" alt="Book Cover for ${bookData.name}" class="book-cover">
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
            `;
            bookContainer.innerHTML = bookContent;
            document.getElementById("books").appendChild(bookContainer);

            // Get the book image container
            var bookImageContainer = bookContainer.querySelector('.book-image-container');
            var imageWidth = getContainerWidth(bookImageContainer);
            var imageLink = `${bookData.coverLink}&fife=w${imageWidth}`;

            // Set the image source dynamically
            var bookCoverImg = bookContainer.querySelector('.book-cover');
            bookCoverImg.src = imageLink;
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            document.querySelectorAll('.book').forEach(function(bookContainer) {
                var bookImageContainer = bookContainer.querySelector('.book-image-container');
                var bookCoverImg = bookContainer.querySelector('.book-cover');
                var imageWidth = getContainerWidth(bookImageContainer);
                var newImageLink = `${bookCoverImg.src.split('&fife=')[0]}&fife=w${imageWidth}`;
                bookCoverImg.src = newImageLink;
            });
        });
    });
</script>

[Edit This](/readingedit/reading)
