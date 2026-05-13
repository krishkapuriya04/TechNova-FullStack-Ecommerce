import { createApp } from './app.js'
import { env } from './config/env.js'
import { connectDatabase } from './config/database.js'

async function bootstrap() {
  try {
    await connectDatabase()
    console.log('[db] MongoDB connected')

    const app = createApp()
    app.listen(env.port, () => {
      console.log(`[server] TechNova API http://localhost:${env.port}`)
    })
  } catch (err) {
    console.error('[bootstrap]', err.message)
    process.exit(1)
  }
}

bootstrap()
