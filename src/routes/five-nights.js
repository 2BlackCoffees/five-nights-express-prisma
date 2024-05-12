/**
 * REST endpoint for /todos
 */

const { PrismaClient, PrismaClientKnownRequestError } = require('@prisma/client');
const express = require('express');
const router = express.Router();

const prisma = new PrismaClient();

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

router.post("/", asyncMiddleware(async (req, res) => {
  const { time_minutes: timeMinutes } = req.params;

  const untilTime = Math.floor(new Date().getTime() / 1000 / 60) + timeMinutes;

  const result = await prisma.AccessTime.create({
    data: {
      until_time: untilTime
    }
  });
  res.json(result);
}));

router.get('/', asyncMiddleware(async (req, res) => {
  try {
    const now = Math.floor(new Date().getTime() / 1000 / 60);
    const findTime = await prisma.AccessTime.findFirstOrThrow({
      where: {
        until_time: {
              gt: now,
        }
      },
      orderBy: {
        until_time: 'desc',
      },
    })
    res.json(findTime);
  } catch (e/*: unknown*/) { // <-- note `e` has explicit `unknown` type
    res.json("");

  }
}));

/*router.patch('/:id', asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const updated = await prisma.AccessTime.update({
    where: { id },
    data: req.body,
  });
  res.json(updated);
}));*/


module.exports = router;
