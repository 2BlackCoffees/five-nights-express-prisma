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

router.post("/test", asyncMiddleware(async (req, res) => {
  const timeMinutes = req.query.time_minutes;

  const untilTime = Math.floor(new Date().getTime() / 1000 / 60) + timeMinutes;
  console.error("untilTime:", untilTime)

  try {
    // deleteUsers = await prisma.GameAccessTimeDBG.deleteMany({})
    const result_dbg = await prisma.GameAccessTimeDBG.create({
      data: {
        until_time: 123,
        text: " In post: " + req.toString() + ", " + req.params.toString() + ", " +req.body.toString() + ", " + req.params.time_minutes
      }
    });
    const result = await prisma.GameAccessTimeDBG.create({
      data: {
        until_time: 456,
        text: " In post: " + req.toString() + ", " + req.params.toString() + ", " +req.body.toString() + ", " + req.params.time_minutes
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
    console.error("result:")
    console.error(result);
    console.error("res:")
    console.error(res);
  } catch (e/*: unknown*/) { // <-- note `e` has explicit `unknown` type
    console.error("In post:");
    console.error(e);
    res.json("");

  }
}));

router.get('/', asyncMiddleware(async (req, res) => {
  try {
    const now = Math.floor(new Date().getTime() / 1000 / 60);
    const result = await prisma.GameAccessTimeDBG.create({
      data: {
        until_time: untilTime,
        text: " In get: " + req.toString() + ", " + req.params.toString() + ", " +req.body.toString() + ", " + req.params.time_minutes
      }
    });
    const findTime = await prisma.GameAccessTimeDBG.findMany(/*{
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
    console.error("findTime:")
    console.error(findTime);
    console.error("res:")
    console.error(res);
    console.error("Done")

    
  } catch (e/*: unknown*/) { // <-- note `e` has explicit `unknown` type
    console.error("In Get:");
    console.error(e);
    res.json("");

  }
}));

/*router.patch('/:id', asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const updated = await prisma.GameAccessTimeDBG.update({
    where: { id },
    data: req.body,
  });
  res.json(updated);
}));*/


module.exports = router;
