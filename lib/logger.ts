import winston from "winston";

const transports: winston.transport[] = [
  new winston.transports.Console(),
];

// Gunakan block ini agar File transport TIDAK DIMUAT saat di produksi
if (process.env.NODE_ENV !== "production") {
  // Hanya melakukan require jika tidak di production
  const { File } = require("winston/lib/winston/transports");
  
  transports.push(
    new File({
      filename: "logs/error.log",
      level: "error",
    }),
    new File({
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