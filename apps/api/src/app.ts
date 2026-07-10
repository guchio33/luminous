import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { healthRoute } from "./routes/health";

const app = new Hono();

// ミドルウェア
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);

// ルート
app.route("/health", healthRoute);

// ルートエンドポイント
app.get("/", (c) => {
  return c.json({
    name: "Luminous API",
    version: "0.1.0",
  });
});

export { app };
