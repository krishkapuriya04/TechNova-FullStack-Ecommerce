import mongoose from 'mongoose'
import { Cart } from '../models/Cart.js'
import { Product } from '../models/Product.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { AppError } from '../utils/AppError.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { buildCartResponse } from '../utils/cartCalculations.js'

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'title slug images stock price discountPrice effectivePrice',
  })
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] })
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'title slug images stock price discountPrice effectivePrice',
    })
  }
  return cart
}

function effectivePriceFromProduct(product) {
  if (!product) return 0
  return product.effectivePrice
}

export async function getCart(req, res) {
  const cart = await getOrCreateCart(req.user.sub)
  sendSuccess(res, { cart: buildCartResponse(cart) })
}

export async function addToCart(req, res) {
  const { productId, quantity } = req.body
  const qty = Number(quantity)
  const product = await Product.findById(productId)
  if (!product) {
    throw new AppError('Product not found', HttpStatus.NOT_FOUND)
  }
  if (product.stock < qty) {
    throw new AppError('Not enough stock available', HttpStatus.BAD_REQUEST)
  }

  const cart = await getOrCreateCart(req.user.sub)
  const unitPrice = effectivePriceFromProduct(product)

  const existing = cart.items.find(
    (row) => row.product.toString() === product._id.toString(),
  )

  if (existing) {
    const nextQty = existing.quantity + qty
    if (product.stock < nextQty) {
      throw new AppError('Not enough stock for this quantity', HttpStatus.BAD_REQUEST)
    }
    existing.quantity = nextQty
    existing.unitPrice = unitPrice
  } else {
    cart.items.push({
      product: product._id,
      quantity: qty,
      unitPrice,
    })
  }

  await cart.save()
  const fresh = await getOrCreateCart(req.user.sub)
  sendSuccess(res, { cart: buildCartResponse(fresh) }, 'Cart updated')
}

export async function updateCartItem(req, res) {
  const { itemId } = req.params
  const { quantity } = req.body
  const qty = Number(quantity)

  if (!mongoose.isValidObjectId(itemId)) {
    throw new AppError('Invalid cart item', HttpStatus.BAD_REQUEST)
  }

  const cart = await getOrCreateCart(req.user.sub)
  const item = cart.items.id(itemId)
  if (!item) {
    throw new AppError('Cart item not found', HttpStatus.NOT_FOUND)
  }

  const product = await Product.findById(item.product)
  if (!product) {
    cart.items.pull(itemId)
    await cart.save()
    throw new AppError('Product no longer available — removed from cart', HttpStatus.BAD_REQUEST)
  }

  if (product.stock < qty) {
    throw new AppError('Not enough stock available', HttpStatus.BAD_REQUEST)
  }

  item.quantity = qty
  item.unitPrice = effectivePriceFromProduct(product)
  await cart.save()

  const fresh = await getOrCreateCart(req.user.sub)
  sendSuccess(res, { cart: buildCartResponse(fresh) }, 'Cart updated')
}

export async function removeCartItem(req, res) {
  const { itemId } = req.params
  if (!mongoose.isValidObjectId(itemId)) {
    throw new AppError('Invalid cart item', HttpStatus.BAD_REQUEST)
  }

  const cart = await getOrCreateCart(req.user.sub)
  const item = cart.items.id(itemId)
  if (!item) {
    throw new AppError('Cart item not found', HttpStatus.NOT_FOUND)
  }

  cart.items.pull(itemId)
  await cart.save()

  const fresh = await getOrCreateCart(req.user.sub)
  sendSuccess(res, { cart: buildCartResponse(fresh) }, 'Item removed')
}

export async function clearCart(req, res) {
  const cart = await getOrCreateCart(req.user.sub)
  cart.items = []
  await cart.save()
  const fresh = await getOrCreateCart(req.user.sub)
  sendSuccess(res, { cart: buildCartResponse(fresh) }, 'Cart cleared')
}
