import { Hono } from "hono";
import { handle } from "hono/vercel";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import accounts from "./accounts";
import { HTTPException } from "hono/http-exception";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// app.get("/hello", clerkMiddleware(), (c) => {
//   const auth = getAuth(c);
//   if (!auth?.userId) {
//     return c.json({ message: "Not authenticated" });
//   }
//   return c.json({
//     message: "Hello Next.js!",
//     userId: auth.userId,
//   });
// });

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ message: "Internal Error" }, 500);
});

const routes = app.route("/accounts", accounts);
export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
