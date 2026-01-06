import { Hono } from 'hono'
import eventApp from './controller/event_controller'
import participantApp from './controller/participant_controller'

const app = new Hono()

app.route('/events', eventApp)
app.route('/participants', participantApp)

export default app
