require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

const slices = size => arr => {
  const a = [];
  for (let i = 0; i < arr.length; i += size) {
    a.push(arr.slice(i, i + size));
  }
  return a;
};

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((...a) => {
    console.log(a);
    next('Oops, looks like something went wrong :(');
  });
};
const app = express();

app.use(bodyParser.json({ limit: '10mb' }));

app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
  });
  next();
});

app.post(
  '/image',
  asyncMiddleware(async (req, res) => {
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
      .catch(() => res.sendStatus(500))
      .then(({ data }) => res.json(data));
  }),
);

let imgListCache = [];

app.get(
  '/gallery/:subreddit/:reqPage',
  asyncMiddleware(async (req, res) => {
    const { subreddit, reqPage } = req.params;
    const page = reqPage - 1;

    if (imgListCache[page]) {
      res.json(imgListCache[page]);
    } else {
      axios
        .get(
          `https://api.imgur.com/3/gallery/r/${subreddit}/time/${Math.floor(
            page / 10,
          )}`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .catch(console.log)
        .then(galleryData => {
          const { data } = galleryData.data;
          imgListCache = imgListCache.concat(slices(10)(data));
          return res.json(imgListCache[page]);
        });
    }
  }),
);

app.use(
  '/',
  express.static(path.join(__dirname, '/../dist'), {
    setHeaders(res) {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cache-Control', 'no-cache');
    },
  }),
);

app.listen(3001, () => console.log('Magic happenst at http://localhost:3001/'));
