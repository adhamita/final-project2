export interface response<T> {
  token(arg0: string, token: any): unknown
  results: number
  metadata: Metadata
  data: T[]
}

export interface Metadata {
  currentPage: number
  numberOfPages: number
  limit: number
  nextPage: number
}

export interface product {
  sold: number
  images: string[]
  subcategory: Subcategory[]
  ratingsQuantity: number
  _id: string
  title: string
  slug: string
  description: string
  quantity: number
  price: number
  imageCover: string
  category: Category
  brand: Brand
  ratingsAverage: number
  createdAt: string
  updatedAt: string
  id: string
  priceAfterDiscount?: number
  availableColors?: any[]
}

export interface Subcategory {
  _id: string
  name: string
  slug: string
  category: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  image: string
}

export interface Brand {
  _id: string
  name: string
  slug: string
  image: string
}
export interface cartResponse {
  status: string
  numOfCartItems: number
  cartId: string
  data: Data
}

export interface Data {
  _id: string
  userId: string
  products: ProductCart[]
  createdAt: string
  updatedAt: string
  __v: number
  totalCartPrice: number
}

export interface ProductCart {
  count: number
  _id: string
  product: product
  price: number
}
export interface Brands {
  _id: string
  name: string
  slug: string
  image: string
  createdAt: string
  updatedAt: string
}

export interface subBrand {
  _id: string
  name: string
  slug: string
  image: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface wishlist {
length: any
  status: string
  message: string
  wishlistId: string[]
}
export interface wishlistId{
  productId: string
}

// Orders interfaces
export type OrdersResponse = Order[]

export interface Order {
  shippingAddress?: ShippingAddress
  taxPrice: number
  shippingPrice: number
  totalOrderPrice: number
  paymentMethodType: string
  isPaid: boolean
  isDelivered: boolean
  _id: string
  user: OrderUser
  cartItems: OrderCartItem[]
  createdAt: string
  updatedAt: string
  id: number
  __v: number
  paidAt?: string
}

export interface ShippingAddress {
  details: string
  city: string
  phone?: string
  postalCode?: string
}

export interface OrderUser {
  _id: string
  name: string
  email: string
  phone: string
}

export interface OrderCartItem {
  count: number
  product: OrderProduct
  price: number
  _id: string
}

export interface OrderProduct {
  subcategory: Subcategory[]
  ratingsQuantity: number
  _id: string
  title: string
  imageCover: string
  category: Category
  brand: Brand
  ratingsAverage: number
  id: string
}
