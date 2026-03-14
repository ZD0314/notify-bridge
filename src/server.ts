import { buildApp } from './app'
import { config } from './config'

async function main() {
  const app = await buildApp()
  try {
    await app.listen({ port: config.server.port, host: config.server.host })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
