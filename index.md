---
layout: home
---
<head>
  <link rel="stylesheet" href="/css/index.css">
</head>



<font size = "8"><b>I'm DaCubeKing.</b></font>
<div style="line-height:5%;">
    <br>
</div>
<font size = "5">That's my pen name. IRL people call me Varun. </font>

<div style="line-height:100%;">
    <br>
</div>
Hey 👋, you probably don't know me, but if you do, it's probably from [my youtube videos](yt)
or in relation to the [FRC team](https://github.com/FRC3476/AutoBuilder) that I was on.

I'm a 19-year-old college sophomore from California that loves coding and everything about computers. 
In High School, I was the programming lead for the FRC team, [3476 - Code Orange](http://teamcodeorange.com/).
I'm majoring in Computer Science with a Math minor @ Penn Sate.

Check out some of the stuff that I've worked on [here](/2022/12/01/My-Programming-Projects.html).

<div>
    <span>
    When I'm not working or writing some code you may find me reading. Take a look at what I've read [here](/reading.md).
    </span>
    <span id="currentlyReading"> </span>. 
</div>

If I'm not reading you'll likely find me playing video games. I'm currently playing though [Alan Wake 2](https://www.alanwake.com/), 
but I also continue to come back to [Minecraft](https://dynmap.dacubeking.com/) & [Valorant](https://playvalorant.com/en-us/).

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
---
<div style="line-height:120%;">
    <br>
</div>
