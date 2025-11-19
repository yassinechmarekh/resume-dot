import express from "express";
import { Environment, HttpStatusCode } from "./utils/constants";
import { errorHandler } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { xssSanitizer } from "./middlewares/xss.middleware";
import cors from "cors";
import corsOptions from "./config/cors";
import routes from "./routes/index.route";
import passport from "./config/passport";
import morgan from "morgan";

const app = express();

// Cors Config
app.use(cors(corsOptions));

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Morgan Middleware
app.use(
  morgan(process.env.NODE_ENV === Environment.DEVELOPMENT ? "dev" : "combined")
);

// Security Middlewares
app.use(helmet());
app.use(xssSanitizer);
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// Passport Middleware
app.use(passport.initialize());

// Home Route
app.get("/", (_req, res) => {
  res.send("Welcome to Ai Resume Builder API.");
});

// App Routes
app.use("/api", routes);

// Not Found Routes
app.get(/(.*)/, (req, res) => {
  res
    .status(HttpStatusCode.NOT_FOUND)
    .json({ message: `Can't find ${req.originalUrl} on this server.` });
});

// Error Handler Middleware
app.use(errorHandler);

export default app;
