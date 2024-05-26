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

  try {
    const deleteUsers = await prisma.GameAccessTime.deleteMany({})
    const result = await prisma.GameAccessTime.create({
      data: {
        until_time: untilTime
      }
    });
    /*const result = await prisma.user.upsert({
      where: {
      },
      update: {
      },
      create: {
        until_time: untilTime,

      },
    })*/
    res.json(result);
    console.log("result:")
    console.log(result);
    console.log("res:")
    console.log(res);
  } catch (e/*: unknown*/) { // <-- note `e` has explicit `unknown` type
    console.error("In post:");
    console.error(e);
    res.json("");

  }
}));

router.get('/', asyncMiddleware(async (req, res) => {
  try {
    const now = Math.floor(new Date().getTime() / 1000 / 60);
    const findTime = await prisma.GameAccessTime.findMany(/*{
      where: {
        until_time: {
              gt: now,
        }
      },
      orderBy: {
        until_time: 'desc',
      },
    }*/);
    res.json(findTime);
    console.log("findTime:")
    console.log(findTime);
    console.log("res:")
    console.log(res);
    console.log("Done")

    
  } catch (e/*: unknown*/) { // <-- note `e` has explicit `unknown` type
    console.error("In Get:");
    console.error(e);
    res.json("");

  }
}));

/*router.patch('/:id', asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const updated = await prisma.GameAccessTime.update({
    where: { id },
    data: req.body,
  });
  res.json(updated);
}));*/


module.exports = router;
