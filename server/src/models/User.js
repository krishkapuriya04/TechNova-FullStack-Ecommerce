import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const savedAddressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: [40, 'Label too long'], default: 'Home' },
    fullName: { type: String, trim: true, maxlength: [120, 'Name too long'], required: true },
    line1: { type: String, trim: true, maxlength: [200, 'Address too long'], required: true },
    line2: { type: String, trim: true, maxlength: [200, 'Address too long'], default: '' },
    city: { type: String, trim: true, maxlength: [80, 'City too long'], required: true },
    postalCode: { type: String, trim: true, maxlength: [24, 'Postal code too long'], required: true },
    country: { type: String, trim: true, maxlength: [80, 'Country too long'], required: true },
    phone: { type: String, trim: true, maxlength: [32, 'Phone too long'], required: true },
  },
  { _id: true },
)

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
      maxlength: [2048, 'Avatar URL is too long'],
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },
    savedAddresses: {
      type: [savedAddressSchema],
      default: [],
      validate: [(arr) => arr.length <= 10, 'You can save at most 10 addresses'],
    },
  },
  { timestamps: true },
)

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    role: this.role,
    savedAddresses: (this.savedAddresses ?? []).map((a) => ({
      id: a._id.toString(),
      label: a.label,
      fullName: a.fullName,
      line1: a.line1,
      line2: a.line2 ?? '',
      city: a.city,
      postalCode: a.postalCode,
      country: a.country,
      phone: a.phone,
    })),
    createdAt: this.createdAt,
  }
}

export const User = mongoose.models.User || mongoose.model('User', userSchema)
