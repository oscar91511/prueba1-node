const express = require('express');

const routeUsers = require('./routes/users.routes');
const routeNRepairs = require('./routes/repairs.routes');
const cors = require('cors');

const helmet = require('helmet');
const hpp = require('hpp');
const sanitizer = require('perfect-express-sanitizer');
const rateLimited = require('express-rate-limit');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controllers');

const app = express();
const limiter = rateLimited({
  max: 5000, // limiti peticions
  windows: 60 * 60 * 1000, // 1 hour
  message: 'To many request from this IP ⚙️, Please try again in 1 hour🙏!',
});
app.use(helmet());
app.use(express.json());
app.use(hpp());
app.use(cors());

app.use(
  sanitizer.clean({
    xss: true,
    nosql: true,
    sql: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', limiter);

app.use((req, res, next) => {
  const time = new Date().toISOString(); // * request date

  req.requestTime = time;
  next();
});

app.use('/api/v1/users', routeUsers);
app.use('/api/v1/repairs', routeNRepairs);

app.all('*', (req, res, next) => {
  return next(
    new AppError(
      `Sorry bad request!, not found ${req.originalUrl} on this server😲🫢😣!`,
      404
    )
  );
});

app.use(globalErrorHandler);
module.exports = app;
