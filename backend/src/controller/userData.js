import { prisma } from "../lib/neon.js";
import redis from "../lib/redis.js";
import { GeneralLimiter } from "../lib/rate_Limiter.js";

export async function GetUserData(req, res) {
  const userId = req.user.user;

      
          const requestLimit=await GeneralLimiter.limit(
            `Request:email:${userId}`
          )
      
         
          if(!requestLimit.success){
            return res.status(429).json({message:"Too many request"})
          }

  const requestedPage = Number(req.query.page ?? 1);
  const requestedLimit = Number(req.query.limit ?? 10);



  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const limit =
    Number.isSafeInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 10;

  const skip = (page - 1) * limit;

  if (!Number.isSafeInteger(skip)) {
    return res.status(400).json({
      message: "Page number is too large",
    });
  }

  const cacheKey =
    `user:${userId}:links:page:${page}:limit:${limit}`;

  try {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("Collecting from Redis");

      return res.json({
        ...cachedData,
        source: "cache",
      });
    }

    console.log("Collecting from database");

    const [links, totalItems] = await Promise.all([
  prisma.shortedLink.findMany({
    where: { createdById: userId },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  }),

  prisma.shortedLink.count({
    where: { createdById: userId },
  }),
]);

    const responseData = {
      data: links,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: page * limit < totalItems,
        hasPreviousPage: page > 1,
      },
    };

    // Cache the complete response for five minutes.
    await redis.set(cacheKey, responseData, {
      ex: 300,
    });

    return res.json({
      ...responseData,
      source: "database",
    });
  } catch (error) {
    console.error("Failed to fetch previous links:", error);

    return res.status(500).json({
      message: "Could not load previous links",
    });
  }
}