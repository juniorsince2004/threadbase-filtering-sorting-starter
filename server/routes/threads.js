import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// ─────────────────────────────────────────────────────────────
// GET /api/threads?search=<term>&sort=<newest|oldest>
//
// Filtering and sorting are performed by the database via Prisma.
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : "";
    const sort = typeof req.query.sort === "string" ? req.query.sort : "newest";

    const threads = await prisma.thread.findMany({
      where: search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},

      orderBy: {
        createdAt: sort === "oldest" ? "asc" : "desc",
      },
      include: {
        author: { select: { name: true, avatarUrl: true } },
        _count: { select: { comments: true } },
      },
    });

    res.json({ threads });
  } catch (error) {
    next(error);
  }
});

export default router;
