import winston from "winston";

// Kita hanya pakai Console transport agar aman di Vercel
// Tidak ada lagi File transport yang memicu error 'mkdir'
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: transports,
});