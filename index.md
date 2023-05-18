---
layout: home
---

<font size = "8"><b>I'm DaCubeKing.</b></font>
<div style="line-height:5%;">
    <br>
</div>
<font size = "5">That's my pen name. IRL people call me Varun. </font>

<div style="line-height:100%;">
    <br>
</div>
Hey 👋, you probably don't know me, but if you do, it's probably from [my youtube videos](yt)
or in relation to [my FRC team](https://github.com/FRC3476/AutoBuilder).

I'm an 18-year-old High School student from California. I love coding and everything about computers. 
I'm currently the programming lead for my [FRC team, Team 3476 - Code Orange](http://teamcodeorange.com/).

<div id="currentlyReading">
Apart from that, my hobbies include reading and playing video games (mainly Minecraft). 
</div>

<script>
	fetch(
		'https://books.api.dacubeking.com/currentlyreading',
	)
    .then(function(response) {
        // When the page is loaded convert it to text
        return response.text()
    })
    .then(function(html) {
        document.getElementById("currentlyReading").innerHTML +=  html
    })
</script>

<p></p>

If you're looking for my maven repository that's [here](https://maven.dacubeking.com).

---
<div style="line-height:120%;">
    <br>
</div>
