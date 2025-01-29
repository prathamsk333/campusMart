const express = require('express');
const morgan = require('morgan');
const path = require('path');

const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config({ path: './config.env' });


app.use(
    cors(),
);

if (process.env.NODEENV === 'development') {
    app.use(morgan('dev'));
  }



module.exports = app;
