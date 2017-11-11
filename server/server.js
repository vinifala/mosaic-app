require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((...a) => {
    console.log(a);
    next('Oops, looks like something went wrong :(');
  });
};
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
  });
  next();
});

app.post(
  '/upload-image',
  asyncMiddleware(async (req, res) => {
    console.log(2, process.env.IMGUR_CLIENT_ID);
    axios({
      url: 'https://api.imgur.com/3/image',
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      },
      data: {
        image: req.body.image.split(',').pop(),
      },
    })
      .catch(console.log)
      .then(({ data }) => res.json(data));
  }),
);

app.get(
  '/gallery/:subreddit/:page',
  asyncMiddleware(async (req, res) => {
    const { subreddit, page } = req.params;
    console.log(3, process.env.IMGUR_CLIENT_ID);
    axios
      .get(`https://api.imgur.com/3/gallery/r/${subreddit}/time/${Math.floor(page / 10)}`, {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch(console.log)
      .then(galleryData => res.json(galleryData.data));
  }),
);

app.use(
  '/',
  express.static(path.join(__dirname, '/../build'), {
    setHeaders(res) {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cache-Control', 'no-cache');
    },
  }),
);

app.listen(3001, () => console.log('Magic happenst on port 3001!'));
