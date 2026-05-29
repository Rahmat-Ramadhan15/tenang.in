import winston from "winston";

// Tambahkan type Transport untuk mengatasi error TypeScript
const transports: winston.transport[] = [
  new winston.transports.Console(),
];

// Hanya tambahkan File transport jika BUKAN di Vercel (Production)
if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    })
  );
}

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: transports,
});