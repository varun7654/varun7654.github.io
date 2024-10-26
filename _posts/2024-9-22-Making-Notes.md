---
layout: post
title: Making Little Handwritten Notes on My Website!
---

<head>
  <script type="text/javascript" src="/js/highlightjs/languages/javascript.js"></script>
</head>
I wanted to add some handwritten notes to my website %$That look like this!$%. Creating a few of these probably wouldn't be that hard.
A little bit of html and css with some svg images I created beforehand would do.

But since I like programming and don't really want to write a bunch of css and html I created a system that turns the following
markdown ish syntax into a note on my website.

`%​$This is how I write a note!$​%$My code doesn't know about code blocks so I have to use a Zero-Width-Space here so it doesn't turn this into an note!$%%`

I started this project with the following goals:

1. Make creating new notes really easy 
2. Have them also work on mobile and small displays 
3. They should work automatically. I don't want to have to run extra commands to generate everything. 
4. Arrows should look hand-drawn (ish). I don't want every arrow to look the same. %$Getting notes to place properly in lists took a bunch of effort$%

Source [here](https://github.com/varun7654/varun7654.github.io/blob/main/_ts/src/notes.ts)

# Starting in JS Land

Initially, to meet goal #3, I wrote everything in JS. We searched for the `%​$` & `$​%` in JS on the browser
and edited the DOM to remove the raw text of the notes. This caused some issues that I'll talk about later, but for the most part
the approach worked and was really easy to implement.

After finding a note we created an empty span that had the text of the note inside on of its data fields. 
We use a span to get the position of where we want the arrow to originate from and to inform the y-level of the note we later create.

I started by just placing notes in the margins of my website. I wasn't worried about inline note support (for mobile) yet. 

Notes are just just a div (that's styled) that has a span %$I'll explain why we need this in a bit$% inside which has the text inside.

## Problems with bounding boxes

There's a fun method on Elements [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
that "returns a DOMRect object providing information about the size of an element and its position **relative to the viewport**."

I'd somehow managed miss the _relative to the viewport_ part and spent far to long debugging why sometimes everything would be misaligned.
Since everything is initially processed on page load %$I do recalculate everything when the viewport changes, so I can't believe that it took me as long as it did to figure out what was happening$%
it worked ... until it didn't. Figuring this out took awhile, but the fix was relatively simple.

## Using the bounding boxes

If you'd like to see the bounding boxes press me -> 
<button type="button" onclick="toggleShowBoundingBoxes()">Toggle Bounding Boxes!</button>

The first issue I ran into was bounding boxes being incorrect because of fonts loading late. This was also a simple fix
(just delay rendering the notes until we have the fonts we need), but, once again, it took me a bit to figure out this was happening.

We're using the bounding boxes to place the arrows, so they need to actually be accurate bounds. Initially I didn't have a span
inside a div and only had the div. The bounding box of the div is the blue rectangle and you can see 
%$I'm just gonna drop a convenient example over here (hopefully!)$% that it is sometimes very off! 

I believe this happens because the bounding box is influenced by the styling. 
Putting a span (with no styling) inside the div gives me accurate bounding boxes (orange).

I then do some math, utilizing the known rotation and orange bounding box to derive the green bounding box that I can finally use.

## Randomness

As far as I can tell javascript doesn't have a way to seed a random. 
I, however, need consistent random values to prevent the page from experiencing seizures when its resized, so I present to you this piece of terrible code:

```javascript
let randoms: number[][] = []

function random(index: number, index2: number) {
    let arr1;
    if (randoms.length > index) {
        arr1 = randoms[index];
    } else {
        for (let i = randoms.length; i <= index; i++) {
            randoms.push([]);
        }
        arr1 = randoms[index];
    }
    if (arr1.length > index2) {
        return arr1[index2];
    } else {
        for (let i = arr1.length; i <= index2; i++) {
            arr1.push(Math.random());
        }
        return arr1[index2];
    }
}
```

It lazily generates random values for each unique `(index, index2)` and guarantees calls to the same position will return the same random.

I have it so that first index is the index of note in our list of notes. 
The second index is a number that I increment on each random call I make.
This keeps the specific code path a note took from effecting the random of other notes.
(As the available space changes, notes can place themselves in different ways.)














