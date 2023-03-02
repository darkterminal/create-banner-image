const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const middlewares = require('./middlewares');
const { generateMainImage } = require('./generator');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Crete Banner Image with Github Action & REST API - use /generator endpoint to generate your image get base64 from image png result',
  });
});

app.post('/generator', async (req, res) => {
    const { canonicalName, gradientColors, articleName, articleCategory, emoji } = req.body
    const generated = await generateMainImage(canonicalName, gradientColors, articleName, articleCategory, emoji)
    res.status(200).json({
        message: "Image generated!",
        image: `data:image/png;base64,${generated}`
    })
})

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;