import { createApp } from './app.js'
import { env, assertBootstrapConfig, logStartupEnv } from './config/env.js'
import { connectDatabase } from './config/database.js'

async function bootstrap() {
  logStartupEnv()
  assertBootstrapConfig()

  try {
    await connectDatabase()
    console.log('[db] MongoDB connected')

    const app = createApp()
    app.listen(env.port, () => {
      console.log(`[server] TechNova API http://localhost:${env.port}`)
      console.log(`[server] CORS allowed origins: ${env.clientOrigins.join(', ')}`)
    })
  } catch (err) {
    console.error('[bootstrap]', err instanceof Error ? err.message : err)
    process.exit(1)
  }
}

bootstrap()
