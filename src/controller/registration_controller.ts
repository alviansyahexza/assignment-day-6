import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { schemaRegistration } from "../schema/validator";
import { prisma } from "../../lib/prisma";

const registrationApp = new Hono();

registrationApp.post('/', zValidator('json', schemaRegistration) ,async (c) => {
  const { eventId, participantId } = c.req.valid('json');
  const registration = await prisma.eventParticipants.create({
    data: {
      eventId,
      participantId,
    },
  });
  return c.json({ data: registration }, 201);
});

registrationApp.delete('/', zValidator('json', schemaRegistration), async (c) => {
  const { eventId, participantId } = c.req.valid('json');
  const deleted = await prisma.eventParticipants.delete({
    where: { 
      eventId_participantId: {
        eventId,
        participantId,
      }
     },
  });
  return c.json({ data: deleted });
});

export default registrationApp;