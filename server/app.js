const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
console.log(DB);
mongoose.connect(DB, {}).then(() => {
  // console.log(con.connections);
  console.log('DB connection successfull');
});


app.use(
    cors(),
);

if (process.env.NODEENV === 'development') {
    app.use(morgan('dev'));
  }



module.exports = app;
