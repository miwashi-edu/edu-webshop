const express = require('express');
const path = require('path');
const serveIndex = require('serve-index');


const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

const imagesPath = path.join(__dirname, '..', 'images');
app.use('/images', express.static(imagesPath), serveIndex(imagesPath, { icons: true }));

module.exports = app;
