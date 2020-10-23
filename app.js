const express = require('express');

const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const crushRouter = require('./routes/crushRoutes');
const userRouter = require('./routes/userRoutes');

// 1- Global Middleware

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //100 requests from same IP per hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter); //limit only API calls

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection - remove mongo operators from body
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      //allows the following fields from being duplicate in the query
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

//request time middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2-Routes

app.use('/api/v1/crushes', crushRouter);
app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);

// 3-Serving static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/buid'));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

// Error Handling

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
