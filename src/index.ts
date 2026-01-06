import { Hono } from 'hono'
import eventApp from './controller/event_controller'

const app = new Hono()

app.route('/events', eventApp)

export default app
