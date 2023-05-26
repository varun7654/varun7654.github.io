---
layout: default
title: Finalize Book
---

Title:
<input type="text" id="Title" name="Title">

<input type="submit" name="submit" onclick="updateBookOverride()" >

<script>
    const url = new URL(window.location.href);
    const jsonData = url.searchParams.get('overrideData');
    console.log(jsonData);
    const bookData = JSON.parse(jsonData);
    document.getElementById("Title").value = bookData.name;

    updateBookOverride = function() {
        var workId = url.searchParams.get('workId');
        var title = document.getElementById("Title").value;

        bookData.name = title;
        var data = JSON.stringify(bookData);
        var cover = url.searchParams.get('cover');

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://books.api.dacubeking.com/updateBookOverride?workId=" + workId + "&overrideData=" + encodeURIComponent(data) + "&cover=" + cover, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Book Override Updated");
                window.location.href = "/readingedit/reading";
            }
        };
    }
</script>
