// index.test.ts
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
import { describe, it, expect } from 'vitest' // Or your preferred test runner
import app from '../src/index'

describe('Participant Endpoint', () => {
  const client: any = testClient(app)

  it('should create a participant', async () => {
    const res = await client.participants.$post({
      json: {
        name: 'New Participant',
      },
    })

    expect(res.status).toBe(201)
    expect((await res.json()).data).toHaveProperty('name', 'New Participant')
  })

  it('should list participants', async () => {
    const res = await client.participants.$get({
      query: { search: 'Participant' },
    })

    expect(res.status).toBe(200)
    const data = (await res.json()).data
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  it('should get participant details', async () => {
    const resInit = await client.participants.$post({
      json: {
        name: 'New Participant',
      },
    })
    const dataInit = (await resInit.json()).data

    const id = dataInit.id
    const res = await client.participants[':id'].$get({ param: { id } })

    expect(res.status).toBe(200)
    const data = (await res.json()).data
    expect(data).toHaveProperty('id', id)
  })

  it('should update a participant', async () => {
      const resInit = await client.participants.$post({
        json: {
          name: 'New Participant',
        },
      })
      const dataInit = (await resInit.json()).data

    const id = dataInit.id
    const res = await client.participants[':id'].$patch({
      param: { id },
      json: {
        name: 'Updated Participant',
      },
    })

    expect(res.status).toBe(200)
    const newData = (await res.json()).data
    expect(newData).toHaveProperty('name', 'Updated Participant') 
  })

  it('should delete a participant', async () => {
    const resInit = await client.participants.$post({
      json: {
        name: 'New Participant',
      },
    })
    const dataInit = (await resInit.json()).data

    const id = dataInit.id
    const res = await client.participants[':id'].$delete({ param: { id } })

    expect(res.status).toBe(200)
  })
})