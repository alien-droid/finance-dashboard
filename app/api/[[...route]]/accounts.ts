import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { createId } from "@paralleldrive/cuid2";

import { accounts, accountsInsertSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { eq, and, inArray } from "drizzle-orm";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ error: "Not authenticated" }, 401);
      // throw new HTTPException(401, {
      //   res: c.json({ message: "Not authenticated" }, 401),
      // });
    }

    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));
    return c.json({ data });
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Not authenticated" }, 401);
      }
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Invalid id" }, 400);
      }
      const [data] = await db
        .select({ id: accounts.id, name: accounts.name })
        .from(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", accountsInsertSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
      if (!auth?.userId) {
        return c.json({ error: "Not authenticated" }, 401);
      }

      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();
      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
      if (!auth?.userId) {
        return c.json({ error: "Not authenticated" }, 401);
      }
      const { ids } = values;
      const data = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), inArray(accounts.id, ids)))
        .returning({ id: accounts.id });
      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", accountsInsertSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Not authenticated" }, 401);
      }

      const [data] = await db
        .update(accounts)
        .set(values)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning();
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Not authenticated" }, 401);
      }

      const [data] = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning({
          id: accounts.id,
        });
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
      return c.json({ data });
    }
  );
export default app;
