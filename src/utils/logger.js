const { createLogger, format, transports } = require('winston');

module.sports = createLogger({
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(
      (info) => `[${info.timestamp} ${info.message} ${info.file}:${info.line}]`
    )
  ),
  transport: [
    new transports.file({
      maxsize: 5120000,
      maxfiles: 5,
      filename: `${__dirname}/../logs/log-api.log`,
    }),
    new transports.Console({
      level: 'debug',
    }),
  ],
});
