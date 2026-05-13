export function sendSuccess(res, data, message = '', status = 200) {
  res.status(status).json({
    success: true,
    message,
    data,
  })
}

export function sendCreated(res, data, message = 'Created') {
  sendSuccess(res, data, message, 201)
}
