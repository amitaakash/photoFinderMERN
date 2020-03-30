const express = require('express');
const userRoutes = require('./Routes/userRoutes');
const ApiErrors = require('./utils/apiErrors');
const globalErrorHandler = require('./controller/errorController');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(express.static(`${__dirname}/public`));

/* app.get('/api/v1/users', (req, res, next) => {
  res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true });
  res.status(200).json('server up and running');
}); */
app.use('/api/v1/users', userRoutes);
app.use('*', (req, res, next) => {
  next(new ApiErrors(`cant find requested URL: ${req.originalUrl}`, 400));
});

app.use(globalErrorHandler);
module.exports = app;
