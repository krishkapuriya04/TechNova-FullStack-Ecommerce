import mongoose from 'mongoose'

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    line1: { type: String, required: true, trim: true, maxlength: 200 },
    line2: { type: String, default: '', trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    postalCode: { type: String, required: true, trim: true, maxlength: 24 },
    country: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
  },
  { _id: false },
)

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: {
      type: [orderItemSchema],
      validate: [(v) => Array.isArray(v) && v.length > 0, 'Order must include items'],
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card'],
      required: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    couponCode: { type: String, default: '', trim: true, maxlength: 32 },
    shippingFee: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
)

orderSchema.index({ user: 1, createdAt: -1 })

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
