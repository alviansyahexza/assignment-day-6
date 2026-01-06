// index.test.ts
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
import { describe, it, expect } from 'vitest' // Or your preferred test runner
import app from '../src/index'
import { json } from 'zod'

describe('Registrations Endpoint', () => {
  const client: any = testClient(app)

  it('should create an event', async () => {
    const initEventResponse = await client.events.$post({
      json: {
        name: 'New Event',
      },
    })
    const eventData = (await initEventResponse.json()).data
    const eventId = eventData.id

    const initParticipantResponse = await client.participants.$post({
      json: {
        name: 'New Participant',
      },
    })
    const participantData = (await initParticipantResponse.json()).data
    const participantId = participantData.id

    const res = await client.registrations.$post({
      json: {
        eventId,
        participantId,
      },
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.data).toHaveProperty('eventId', eventId)
    expect(data.data).toHaveProperty('participantId', participantId)
  })

  it('should delete an event', async () => {
    const initEventResponse = await client.events.$post({
      json: {
        name: 'New Event',
      },
    })
    const eventData = (await initEventResponse.json()).data
    const eventId = eventData.id

    const initParticipantResponse = await client.participants.$post({
      json: {
        name: 'New Participant',
      },
    })
    const participantData = (await initParticipantResponse.json()).data
    const participantId = participantData.id

    const initRegistration = await client.registrations.$post({
      json: {
        eventId,
        participantId,
      },
    })
    const registrationData = (await initRegistration.json()).data
    const registrationEventId = registrationData.eventId
    const registrationParticipantId = registrationData.participantId

    const res = await client.registrations.$delete({
      json: {
        eventId: registrationEventId,
        participantId: registrationParticipantId,
      },
    })

    expect(res.status).toBe(200)
  })
})