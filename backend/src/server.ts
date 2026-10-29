import express from "express";
import cors from "cors";
import helmet from "helmet";
import loggerMiddleware from "./middleware/logger.middleware.js";
import routes from "./routes/routes.js";
import rateLimiter from "./middleware/rateLimiter.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "100kb" }));

app.use(loggerMiddleware);

app.use(rateLimiter);

app.use(routes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
