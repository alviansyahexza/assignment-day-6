import { Hono } from "hono";
import { prisma } from "../../lib/prisma";
import { zValidator } from '@hono/zod-validator'
import { schemaCreateEvent, schemaUpdateEvent } from "../schema/validator";
import z from "zod";

const eventApp = new Hono();

eventApp.get('/', async (c) => {
  const search = c.req.query('search') || '';
  let searchCondition = {};
  if (search) {
    searchCondition = {
      name: {
        contains: search,
      },
    };
  }
  const data = await prisma.events.findMany({ where: searchCondition });
  return c.json({ data });
});

eventApp.post('/', zValidator('json', schemaCreateEvent), async (c) => {
  const event = await prisma.events.create({
    data: {
      name: c.req.valid('json').name,
    },
  });
  return c.json({ data: event }, 201);
});

eventApp.get('/:id', async (c) => {
  const id = c.req.param('id');
  const event = await prisma.events.findUnique({
    where: { id: Number(id) },
  });
  return c.json({ data: event });
});

eventApp.patch('/:id', zValidator('json', schemaUpdateEvent), async (c) => {
  const id = c.req.param('id');
  const updatedName = await prisma.events.update({
    where: { id: Number(id) },
    data: { name: c.req.valid('json').name },
  });
  return c.json({ data: updatedName });
});

eventApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const deleted = await prisma.events.delete({
    where: { id: Number(id) },
  });
  return c.json({ data: deleted });
});

export default eventApp;