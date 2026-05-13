import { HttpStatus } from '../constants/httpStatus.js'
import mongoose from 'mongoose'

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
