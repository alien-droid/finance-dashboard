import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { subDays, parse, differenceInDays } from "date-fns";
import { db } from "@/db/drizzle";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { accounts, categories, transactions } from "@/db/schema";
import { z } from "zod";
import { calculatePercentage, fillDays } from "@/lib/utils";

// Create a new Hono app and define a GET route
const app = new Hono().get(
  "/",
  clerkMiddleware(), // Middleware to handle authentication using Clerk
  zValidator(
    "query",
    z.object({
      from: z.string().optional(), // Optional query parameter for start date
      to: z.string().optional(), // Optional query parameter for end date
      accountId: z.string().optional(), // Optional query parameter for account ID
    })
  ),
  async (c) => {
    const auth = getAuth(c); // Get authentication details
    const { from, to, accountId } = c.req.valid("query"); // Extract validated query parameters

    // If the user is not authenticated, return a 401 error
    if (!auth?.userId) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    // Default date range: last 30 days
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    // Parse the provided dates or use defaults
    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    // Calculate the length of the current period and the previous period
    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);
    console.log(startDate, endDate, lastPeriodStart, lastPeriodEnd);

    // Function to fetch financial data (income, expenses, balance) for a given date range
    async function fetchFinancialData(
      userId: string,
      startDate: Date,
      endDate: Date
    ) {
      return db
        .select({
          income:
            sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ), // Sum of positive amounts (income)
          expenses:
            sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ), // Sum of negative amounts (expenses)
          balance: sum(transactions.amount).mapWith(Number), // Net balance
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(accounts.id, accountId) : undefined, // Filter by account ID if provided
            eq(accounts.userId, userId), // Ensure the account belongs to the authenticated user
            gte(transactions.date, startDate), // Transactions on or after the start date
            lte(transactions.date, endDate) // Transactions on or before the end date
          )
        );
    }

    // Fetch financial data for the current and previous periods
    const [currentPeriod] = await fetchFinancialData(
      auth.userId,
      startDate,
      endDate
    );
    const [lastPeriod] = await fetchFinancialData(
      auth.userId,
      lastPeriodStart,
      lastPeriodEnd
    );

    // Calculate percentage changes for income, expenses, and balance
    const incomeChange = calculatePercentage(
      currentPeriod.income,
      lastPeriod.income
    );
    const expensesChange = calculatePercentage(
      currentPeriod.expenses,
      lastPeriod.expenses
    );
    const balanceChange = calculatePercentage(
      currentPeriod.balance,
      lastPeriod.balance
    );

    // Fetch category-wise expense data for the current period
    const category = await db
      .select({
        name: categories.name, // Category name
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number), // Total expense for the category
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(accounts.id, accountId) : undefined, // Filter by account ID if provided
          eq(accounts.userId, auth.userId), // Ensure the account belongs to the authenticated user
          lt(transactions.amount, 0), // Only consider expenses (negative amounts)
          gte(transactions.date, startDate), // Transactions on or after the start date
          lte(transactions.date, endDate) // Transactions on or before the end date
        )
      )
      .groupBy(categories.name) // Group by category name
      .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`)); // Order by total expense (descending)

    // Separate top 3 categories and group the rest into "Other"
    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);
    const otherCategoriesTotal = otherCategories.reduce(
      (acc, curr) => acc + curr.value,
      0
    );

    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({
        name: "Other",
        value: otherCategoriesTotal,
      });
    }

    // Fetch daily income and expense data for the current period
    const activeDays = await db
      .select({
        date: transactions.date, // Transaction date
        income:
          sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ), // Daily income
        expense:
          sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          ), // Daily expense
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(accounts.id, accountId) : undefined, // Filter by account ID if provided
          eq(accounts.userId, auth.userId), // Ensure the account belongs to the authenticated user
          gte(transactions.date, startDate), // Transactions on or after the start date
          lte(transactions.date, endDate) // Transactions on or before the end date
        )
      )
      .groupBy(transactions.date) // Group by transaction date
      .orderBy(transactions.date); // Order by date (ascending)

    // Fill in missing days with zero values for income and expenses
    const days = fillDays(activeDays, startDate, endDate);

    // Return the summary data as a JSON response
    return c.json({
      data: {
        remainingAmount: currentPeriod.balance, // Remaining balance for the current period
        balanceChange, // Percentage change in balance
        incomeAmount: currentPeriod.income, // Total income for the current period
        expensesAmount: currentPeriod.expenses, // Total expenses for the current period
        incomeChange, // Percentage change in income
        expensesChange, // Percentage change in expenses
        categories: finalCategories, // Top categories with "Other" grouped
        days, // Daily income and expense data
      },
    });
  }
);

export default app;