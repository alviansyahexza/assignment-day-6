import * as z from 'zod'

export const schemaCreateEvent = z.object({
  name: z.string().min(1, 'Event name is required'),
})

export const schemaUpdateEvent = z.object({
  name: z.string().min(1, 'Event name is required'),
})

const schemaCreateParticipant = z.object({
  name: z.string().min(1, 'Participant name is required'),
})

const schemaCreateSchedule = z.object({
  eventId: z.number().int().positive('Event ID must be a positive integer'),
  participantId: z.number().int().positive('Participant ID must be a positive integer'),
})