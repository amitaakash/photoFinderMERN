const mongoose = require('mongoose');
// dotenv declaration is mendetory before app import
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./server/app');

//const http = require('http');

//console.log(http.STATUS_CODES);
process.on('uncaughtException', error => {
  console.log(error.name, error.message);
  process.exit(1);
});

const db = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 10000
  })
  .then(() => console.log('db connected successfully'));

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(
    `app is running on ${PORT}`,
    `in [${process.env.NODE_ENV}] environment`
  );
});

process.on('unhandledRejection', error => {
  server.close(() => {
    console.log('UNHANDLED REJECTION 💥 System sutting down...');
    console.log(error.name, error.message);
    process.exit(1);
  });
});
