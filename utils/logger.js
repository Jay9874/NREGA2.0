import { createLogger, format, transports } from 'winston';
import winston from 'winston';
import path from 'path';

// Define log level colors
const colors = {
  error: 'red',
  crit: 'magenta',
  warn: 'yellow',
  info: 'blue',
  debug: 'green'
};
winston.addColors(colors); // Apply colors to Winston

// Function to extract last directory + file name and line number
const getCallerInfo = () => {
  const stack = new Error().stack.split('\n').slice(2); // Remove first 2 lines (Error + logger call)

  for (let line of stack) {
    const match = line.match(/\((.*):(\d+):\d+\)/); // Extract (file:line)
    if (match) {
      let fullPath = match[1];
      if (!fullPath.includes('node_modules') && !fullPath.includes('internal/')) {
        const parts = fullPath.split(path.sep); // Split path into parts
        const shortPath = parts.slice(-2).join('/'); // Get last directory + file
        return shortPath + ':' + match[2]; // Format as 'dir/file.js:line'
      }
    }
  }

  return 'unknown';
};

// Create logger instance
const logger = createLogger({
  level: 'debug',
  levels: {
    error: 0,
    crit: 1,
    warn: 2,
    info: 3,
    debug: 4
  },
  format: format.combine(
    format.colorize({ all: true }), // Apply color to all logs
    format.timestamp({ format: 'DD-MM-YYYY hh:mm:ss A' }),
    format.printf(({ level, message, timestamp }) => {
      const callerInfo = getCallerInfo();
      return `${timestamp} - [${callerInfo}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'bot.log', format: format.uncolorize() }) // Remove colors for file logs
  ]
});

// Export logger (ESM)
export default logger;
