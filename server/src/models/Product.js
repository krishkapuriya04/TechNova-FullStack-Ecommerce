import mongoose from 'mongoose'
import { slugify } from '../utils/slugify.js'
import { sanitizeProductImages } from '../utils/productImages.js'

const specSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    value: { type: String, required: true, trim: true, maxlength: 240 },
  },
  { _id: false },
)

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [160, 'Title is too long'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 180,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 8000,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      default: null,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 64,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 64,
    },
    images: {
      type: [String],
      validate: [(v) => Array.isArray(v) && v.length > 0, 'At least one image is required'],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    specifications: {
      type: [specSchema],
      default: [],
    },
    effectivePrice: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
  },
  { timestamps: true },
)

productSchema.index({ category: 1 })
productSchema.index({ featured: 1 })
productSchema.index({ trending: 1 })
productSchema.index({ createdAt: -1 })

function computeEffectivePrice(doc) {
  const base = doc.price
  const discount = doc.discountPrice
  if (discount != null && discount > 0 && discount < base) {
    return discount
  }
  return base
}

productSchema.pre('validate', function assignSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title)
  }
  this.effectivePrice = computeEffectivePrice(this)
  next()
})

productSchema.pre('save', function recomputePrice(next) {
  if (this.isModified('price') || this.isModified('discountPrice')) {
    this.effectivePrice = computeEffectivePrice(this)
  }
  next()
})

productSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    title: this.title,
    slug: this.slug,
    description: this.description,
    price: this.price,
    discountPrice: this.discountPrice,
    effectivePrice: this.effectivePrice,
    category: this.category,
    brand: this.brand,
    images: sanitizeProductImages(this.images, this.slug ?? this._id?.toString()),
    stock: this.stock,
    ratings: this.ratings,
    featured: this.featured,
    trending: Boolean(this.trending),
    specifications: this.specifications,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema)
