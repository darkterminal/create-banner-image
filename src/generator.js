const { createCanvas, GlobalFonts } = require('@napi-rs/canvas') // For canvas.
const fs = process.env.NODE_ENV === 'development' ? require('fs') : require('@cyclic.sh/s3fs')

// Load in the fonts we need
GlobalFonts.registerFromPath('./fonts/Inter-ExtraBold.ttf', 'InterBold');
GlobalFonts.registerFromPath('./fonts/Inter-Medium.ttf','InterMedium');
GlobalFonts.registerFromPath('./fonts/Apple-Emoji.ttf', 'AppleEmoji');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    const _buffer = new Buffer.from(bitmap, 'base64')
    return _buffer.toString('base64');
}

/**
 *
 * @param {Object} ctx the context for the canvas
 * @param {String} text the text we wish to wrap
 * @param {Number} x the starting x position of the text
 * @param {Number} y the starting y position of the text
 * @param {Number} maxWidth the maximum width, i.e the width of the container
 * @param {Number} lineHeight the height of one line (as defined by us)
 * @returns Array
 */
const wrapText = function(ctx, text, x, y, maxWidth, lineHeight) {
    // First, split the words by spaces
    let words = text.split(' ');
    // Then we'll make a few variables to store info about our line
    let line = '';
    let testLine = '';
    // wordArray is what we'l' return, which will hold info on
    // the line text, along with its x and y starting position
    let wordArray = [];
    // totalLineHeight will hold info on the line height
    let totalLineHeight = 0;

    // Next we iterate over each word
    for(var n = 0; n < words.length; n++) {
        // And test out its length
        testLine += `${words[n]} `;
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        // If it's too long, then we start a new line
        if (testWidth > maxWidth && n > 0) {
            wordArray.push([line, x, y]);
            y += lineHeight;
            totalLineHeight += lineHeight;
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        }
        else {
            // Otherwise we only have one line!
            line += `${words[n]} `;
        }
        // Whenever all the words are done, we push whatever is left
        if(n === words.length - 1) {
            wordArray.push([line, x, y]);
        }
    }

    // And return the words in array, along with the total line height
    // which will be (totalLines - 1) * lineHeight
    return [ wordArray, totalLineHeight ];
}

/**
 * REST API Generator
 * @param {String} canonicalName this is the name we'll use to save our image (slugify first: Recomended!)
 * @param {Array} gradientColors an array of two colors, i.e. [ '#ffffff', '#000000' ], used for our gradient
 * @param {String} articleName the title of the article or site you want to appear in the image
 * @param {String} articleCategory the category which that article sits in - or the subtext of the article
 * @param {String} emoji the emoji you want to appear in the image.
 * @returns
 */
const generateMainImage = async function(canonicalName, gradientColors, articleName, articleCategory, emoji) {

    articleCategory = articleCategory.toUpperCase();
    // gradientColors is an array [ c1, c2 ]
    if(typeof gradientColors === "undefined") {
        gradientColors = [ "#8005fc", "#073bae"]; // Backup values
    }

    // Create canvas
    const canvas = createCanvas(1342, 853);
    const ctx = canvas.getContext('2d')

    // Add gradient - we use createLinearGradient to do this
    let grd = ctx.createLinearGradient(0, 853, 1352, 0);
    grd.addColorStop(0, gradientColors[0]);
    grd.addColorStop(1, gradientColors[1]);
    ctx.fillStyle = grd;
    // Fill our gradient
    ctx.fillRect(0, 0, 1342, 853);

    // Write our Emoji onto the canvas
    ctx.fillStyle = 'white';
    ctx.font = '95px AppleEmoji';
    ctx.fillText(emoji, 85, 700);

    // Add our title text
    ctx.font = '95px InterBold';
    ctx.fillStyle = 'white';
    let wrappedText = wrapText(ctx, articleName, 85, 753, 1200, 100);
    wrappedText[0].forEach(function(item) {
        // We will fill our text which is item[0] of our array, at coordinates [x, y]
        // x will be item[1] of our array
        // y will be item[2] of our array, minus the line height (wrappedText[1]), minus the height of the emoji (200px)
        ctx.fillText(item[0], item[1], item[2] - wrappedText[1] - 200); // 200 is height of an emoji
    })

    // Add our category text to the canvas
    ctx.font = '35px InterMedium';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(articleCategory, 85, 553 - wrappedText[1] - 100); // 853 - 200 for emoji, -100 for line height of 1

    if(fs.existsSync(`./images/${canonicalName}.png`)) {
        return 'Images Exist! We did not create any'
    } else {
        // Set canvas as to png
        try {
            const canvasData = await canvas.encode('png');
            // Save file
            fs.writeFileSync(`./images/${canonicalName}.png`, canvasData);
            const base64Image = base64_encode(`./images/${canonicalName}.png`)
            fs.unlinkSync(`./images/${canonicalName}.png`)
            return base64Image
        } catch(e) {
            console.log(e);
            return 'Could not create png image this time.'
        }
    }
}

/**
 * Github Action Image Generator
 * @param {String} canonicalName this is the name we'll use to save our image (slugify first: Recomended!)
 * @param {Array} gradientColors an array of two colors, i.e. [ '#ffffff', '#000000' ], used for our gradient
 * @param {String} articleName the title of the article or site you want to appear in the image
 * @param {String} articleCategory the category which that article sits in - or the subtext of the article
 * @param {String} emoji the emoji you want to appear in the image.
 * @returns
 */
const actionGenerateImage = async function(canonicalName, gradientColors, articleName, articleCategory, emoji) {

    articleCategory = articleCategory.toUpperCase();
    // gradientColors is an array [ c1, c2 ]
    if(typeof gradientColors === "undefined") {
        gradientColors = [ "#8005fc", "#073bae"]; // Backup values
    }

    // Create canvas
    const canvas = createCanvas(1342, 853);
    const ctx = canvas.getContext('2d')

    // Add gradient - we use createLinearGradient to do this
    let grd = ctx.createLinearGradient(0, 853, 1352, 0);
    grd.addColorStop(0, gradientColors[0]);
    grd.addColorStop(1, gradientColors[1]);
    ctx.fillStyle = grd;
    // Fill our gradient
    ctx.fillRect(0, 0, 1342, 853);

    // Write our Emoji onto the canvas
    ctx.fillStyle = 'white';
    ctx.font = '95px AppleEmoji';
    ctx.fillText(emoji, 85, 700);

    // Add our title text
    ctx.font = '95px InterBold';
    ctx.fillStyle = 'white';
    let wrappedText = wrapText(ctx, articleName, 85, 753, 1200, 100);
    wrappedText[0].forEach(function(item) {
        // We will fill our text which is item[0] of our array, at coordinates [x, y]
        // x will be item[1] of our array
        // y will be item[2] of our array, minus the line height (wrappedText[1]), minus the height of the emoji (200px)
        ctx.fillText(item[0], item[1], item[2] - wrappedText[1] - 200); // 200 is height of an emoji
    })

    // Add our category text to the canvas
    ctx.font = '35px InterMedium';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(articleCategory, 85, 553 - wrappedText[1] - 100); // 853 - 200 for emoji, -100 for line height of 1

    try {
        const canvasData = await canvas.encode('png');
        const _buffer = new Buffer.from(canvasData, 'base64')
        return _buffer.toString('base64');
    } catch(e) {
        console.log(e);
        return 'Could not create png image this time.'
    }
}

module.exports = { generateMainImage, actionGenerateImage }
