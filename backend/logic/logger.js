/**
 * logger.js
 * Centralized logging system using Winston.
 * Handles both console output for development and daily rotated files for production.
 */
const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// Custom format: Timestamp [Module Name] Level: Message
const customFormat = winston.format.printf(({ timestamp, module, level, message }) => {
    return `${timestamp} [${module || 'general'}] ${level}: ${message}`;
});

const logDirectory = path.join(__dirname, '../logs');

const logger = winston.createLogger({
    level: 'debug',
    transports: [
        // 1. Console Transport: High visibility for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                customFormat
            ),
        }),
        // 2. File Transport: Persists logs with daily rotation (kept for 14 days)
        new winston.transports.DailyRotateFile({
            dirname: logDirectory,
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                customFormat
            ),
        }),
    ],
});

module.exports = { logger };