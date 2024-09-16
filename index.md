---
layout: home
---
<head>
  <link rel="stylesheet" href="/css/index.css">
  <link rel="preload" href="https://dacubeking.com/cf-fonts/v/dancing-script/5.0.16/latin/wght/normal.woff2" as="font" type="font/woff2" crossorigin="anonymous">
  <link rel="preload" href="https://books.api.dacubeking.com/currentlyreading" as="fetch" crossorigin="anonymous">
</head>


<div style = "line-height: 0.9">
<p style="font-family: 'Dancing Script', serif; font-size: 5em; font-weight: 700;">I'm DaCubeKing.</p>
That's my pen name, irl people know me as Varun.
</div>
<p></p>

Hey 👋, you probably don't know me, but if you do, it's likely from [my youtube videos](yt)
or in relation to the [FRC team](https://github.com/FRC3476/AutoBuilder) that I was on.

I'm a 20-year-old college sophomore from California that loves coding and everything about computers. 
In High School, I was the programming lead for the FRC team, [3476 - Code Orange](http://teamcodeorange.com/), and I'm majoring in Computer Science with a Math minor @ Penn Sate.

Check out some of the stuff that I've worked on [here](/2022/12/01/My-Programming-Projects.html).

<p>
    <span>
    When I'm not working or writing some code you may find me reading. %$Take a look at what I've read <a href="/reading.html">here</a>.$%
    </span>
    <span id="currentlyReading"> </span>
</p>
<p></p>

If I'm not reading you'll likely find me playing video games. I'm currently playing though [Alan Wake 2](https://www.alanwake.com/), 
but I also continue to come back to [Minecraft](https://dynmap.dacubeking.com/) & [Valorant](https://playvalorant.com/en-us/).

<script>
	fetch(
		'https://books.api.dacubeking.com/currentlyreading',
	)
    .then(function(response) {
        // When the page is loaded convert it to text
        return response.text() + "."
    })
    .then(function(html) {
        if (html.length > 0) {
            document.getElementById("currentlyReading").innerHTML +=  html
        }
    })
</script>

<p></p>
---
<div style="line-height:120%;">
    <br>
</div>
