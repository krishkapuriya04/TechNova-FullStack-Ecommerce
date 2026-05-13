import { HttpStatus } from '../constants/httpStatus.js'
import mongoose from 'mongoose'

/**
 * Liveness — no DB check. Use for load balancers / platform health pings.
 */
export function getLive(req, res) {
  res.status(HttpStatus.OK).json({
    ok: true,
    service: 'technova-api',
    timestamp: new Date().toISOString(),
  })
}

/**
 * Readiness — includes MongoDB connection state.
 */
export function getHealth(req, res) {
  const dbState = mongoose.connection.readyState
  const dbOk = dbState === 1

  res.status(dbOk ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE).json({
    success: dbOk,
    message: 'TechNova API',
    uptime: process.uptime(),
    database: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
}
