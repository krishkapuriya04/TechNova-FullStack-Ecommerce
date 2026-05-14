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

export async function updateCurrentUser(req, res) {
  const user = await User.findById(req.user.sub)
  if (!user) {
    throw new AppError('User not found', HttpStatus.NOT_FOUND)
  }

  if (req.body.name != null) {
    user.name = String(req.body.name).trim()
  }
  if (req.body.avatar != null) {
    user.avatar = String(req.body.avatar).trim()
  }
  if (req.body.savedAddresses != null) {
    const list = req.body.savedAddresses
    if (!Array.isArray(list)) {
      throw new AppError('savedAddresses must be an array', HttpStatus.BAD_REQUEST)
    }
    if (list.length > 10) {
      throw new AppError('At most 10 saved addresses', HttpStatus.BAD_REQUEST)
    }
    for (let i = 0; i < list.length; i += 1) {
      const a = list[i]
      if (!a || typeof a !== 'object') {
        throw new AppError(`Invalid address at index ${i}`, HttpStatus.BAD_REQUEST)
      }
      const required = ['fullName', 'line1', 'city', 'postalCode', 'country', 'phone']
      for (const key of required) {
        if (!String(a[key] ?? '').trim()) {
          throw new AppError(`Address ${i + 1}: ${key} is required`, HttpStatus.BAD_REQUEST)
        }
      }
    }
    user.savedAddresses = list.map((a) => ({
      label: String(a.label ?? 'Home').trim() || 'Home',
      fullName: String(a.fullName).trim(),
      line1: String(a.line1).trim(),
      line2: String(a.line2 ?? '').trim(),
      city: String(a.city).trim(),
      postalCode: String(a.postalCode).trim(),
      country: String(a.country).trim(),
      phone: String(a.phone).trim(),
    }))
  }

  await user.save()
  sendSuccess(res, { user: user.toSafeObject() }, 'Profile updated')
}
