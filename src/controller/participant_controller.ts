import { Hono } from "hono";
import { prisma } from "../../lib/prisma";
import { zValidator } from '@hono/zod-validator'
import { schemaCreateParticipant, schemaUpdateParticipant } from "../schema/validator";

const participantApp = new Hono();

participantApp.get('/', async (c) => {
  const search = c.req.query('search') || '';
  let searchCondition = {};
  if (search) {
    searchCondition = {
      name: {
        contains: search,
      },
    };
  }
  const data = await prisma.participants.findMany({ where: searchCondition });
  return c.json({ data });
});

participantApp.post('/', zValidator('json', schemaCreateParticipant), async (c) => {
  const participant = await prisma.participants.create({
    data: {
      name: c.req.valid('json').name,
    },
  });
  return c.json({ data: participant }, 201);
});

participantApp.get('/:id', async (c) => {
  const id = c.req.param('id');
  const participant = await prisma.participants.findUnique({
    where: { id: Number(id) },
  });
  return c.json({ data: participant });
});

participantApp.patch('/:id', zValidator('json', schemaUpdateParticipant), async (c) => {
  const id = c.req.param('id');
  const updatedName = await prisma.participants.update({
    where: { id: Number(id) },
    data: { name: c.req.valid('json').name },
  });
  return c.json({ data: updatedName });
});

participantApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const deleted = await prisma.participants.delete({
    where: { id: Number(id) },
  });
  return c.json({ data: deleted });
});

export default participantApp;