// index.test.ts
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
import { describe, it, expect } from 'vitest' // Or your preferred test runner
import app from '../src/index'

describe('Events Endpoint', () => {
  const client: any = testClient(app)

  it('should create an event', async () => {
    const res = await client.events.$post({
      json: {
        name: 'New Event',
      },
    })

    expect(res.status).toBe(201)
    expect((await res.json()).data).toHaveProperty('name', 'New Event')
  })

  it('should list events', async () => {
    const res = await client.events.$get({
      query: { search: 'Event' },
    })

    expect(res.status).toBe(200)
    const data = (await res.json()).data
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  it('should get event details', async () => {
    const resInit = await client.events.$post({
      json: {
        name: 'New Event',
      },
    })
    const dataInit = (await resInit.json()).data

    const id = dataInit.id
    const res = await client.events[':id'].$get({ param: { id } })

    expect(res.status).toBe(200)
    const data = (await res.json()).data
    expect(data).toHaveProperty('id', id)
  })

  it('should update an event', async () => {
      const resInit = await client.events.$post({
        json: {
          name: 'New Event',
        },
      })
      const dataInit = (await resInit.json()).data

    const id = dataInit.id
    const res = await client.events[':id'].$patch({
      param: { id },
      json: {
        name: 'Updated Event',
      },
    })

    expect(res.status).toBe(200)
    const newData = (await res.json()).data
    expect(newData).toHaveProperty('name', 'Updated Event') 
  })

  it('should delete an event', async () => {
    const resInit = await client.events.$post({
      json: {
        name: 'New Event',
      },
    })
    const dataInit = (await resInit.json()).data

    const id = dataInit.id
    const res = await client.events[':id'].$delete({ param: { id } })

    expect(res.status).toBe(200)
  })
})