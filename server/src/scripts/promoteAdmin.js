/**
 * Promote a user to admin by email (run from server root).
 * Usage: node src/scripts/promoteAdmin.js you@example.com
 */
import mongoose from 'mongoose'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

const email = process.argv[2]?.toLowerCase().trim()
if (!email) {
  console.error('Usage: node src/scripts/promoteAdmin.js <email>')
  process.exit(1)
}

async function main() {
  await mongoose.connect(env.mongodbUri)
  const user = await User.findOne({ email })
  if (!user) {
    console.error('User not found:', email)
    process.exit(1)
  }
  user.role = 'admin'
  await user.save()
  console.log('Promoted to admin:', email)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
