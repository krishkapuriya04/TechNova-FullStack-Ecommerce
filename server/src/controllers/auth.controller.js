import { HttpStatus } from '../constants/httpStatus.js'
import { User } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { sendCreated, sendSuccess } from '../utils/apiResponse.js'
import { signAccessToken } from '../utils/jwt.util.js'

export async function registerUser(req, res) {
  const { name, email, password, avatar } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    throw new AppError('An account with this email already exists', HttpStatus.CONFLICT)
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      avatar: avatar ?? '',
    })

    const accessToken = signAccessToken({
      sub: user._id.toString(),
      role: user.role,
    })

    sendCreated(
      res,
      {
        user: user.toSafeObject(),
        accessToken,
      },
      'Account created successfully',
    )
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('An account with this email already exists', HttpStatus.CONFLICT)
    }
    throw err
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED)
  }

  const match = await user.comparePassword(password)
  if (!match) {
    throw new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED)
  }

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
  })

  sendSuccess(
    res,
    {
      user: user.toSafeObject(),
      accessToken,
    },
    'Signed in successfully',
  )
}

export async function getCurrentUser(req, res) {
  const user = await User.findById(req.user.sub)
  if (!user) {
    throw new AppError('User not found', HttpStatus.NOT_FOUND)
  }

  sendSuccess(res, { user: user.toSafeObject() })
}
