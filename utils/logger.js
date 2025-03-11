import { createLogger, format, transports } from 'winston';
import path from 'path';
import winston from 'winston';

// Function to get the correct caller's file and line number
const getCallerInfo = () => {
  const err = new Error();
  const stackLines = err.stack.split('\n');

  for (let i = 2; i < stackLines.length; i++) { // Start at 2 to skip Error and wrapLogger
    const line = stackLines[i];
    const match = line.match(/at\s+(?:.*?\s+)?\(?([^:]+):(\d+):(\d+)\)?$/) ||
                  line.match(/at\s+([^:]+):(\d+):(\d+)$/);
    
    if (match) {
      const filePath = match[1].trim();
      const lineNumber = match[2];

      // Skip logger file and node internals
      if (filePath.includes('logger.js') || filePath.startsWith('node:')) {
        continue;
      }

      // Skip Winston internals and node_modules
      if (filePath.includes('winston') || filePath.includes('node_modules')) {
        continue;
      }

      const fileName = path.basename(filePath);
      return `${fileName}:${lineNumber}`;
    }
  }
  return 'unknown:0';
};

// Create base logger instance
const baseLogger = createLogger({
  level: 'data',
  levels: {
    error: 0,
    crit: 1,
    warn: 2,
    info: 3,
    data: 4
  },
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'DD-MM-YYYY hh:mm:ss A' }),
    format.printf(({ level, message, timestamp, callerInfo }) => {
      return `${timestamp} - [${callerInfo}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ 
      filename: 'bot.log', 
      format: format.uncolorize() 
    })
  ]
});

// Define log level colors
const colors = {
  error: 'red',
  crit: 'magenta',
  warn: 'yellow',
  info: 'blue',
  data: 'green'
};
winston.addColors(colors);

// Wrapper to capture caller info before Winston processes it
const wrapLogger = {
  error: (message) => baseLogger.error(message, { callerInfo: getCallerInfo() }),
  crit: (message) => baseLogger.crit(message, { callerInfo: getCallerInfo() }),
  warn: (message) => baseLogger.warn(message, { callerInfo: getCallerInfo() }),
  info: (message) => baseLogger.info(message, { callerInfo: getCallerInfo() }),
  data: (message) => baseLogger.data(message, { callerInfo: getCallerInfo() })
};

export default wrapLogger;