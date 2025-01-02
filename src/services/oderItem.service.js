const httpStatus = require("http-status");
const prisma = require("../../prisma/index");
const ApiError = require("../utils/ApiError");

const productService = require("./product.service");
const orderService = require("./order.service");

/**
 * Create a orderItem
 * @returns {Promise<OrderItem>}
 */
const createOrderItem = async (orderId, productId, quantity) => {
  const product = await productService.getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product fot found");
  }

  if (product.quantityInStock < quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient stock");
  }

  const unitPrice = product.price;
  const order = await orderService.getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Memulai transaksi untuk memastikan konsistensi data
  const result = await prisma.$transaction([
    // Membuat OrderItem
    prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        unitPrice,
      },
    }),

    // Memperbarui stok produk
    prisma.product.update({
      where: { id: productId },
      data: { quantityInStock: product.quantityInStock - quantity },
    }),

    // Memperbarui total harga order
    prisma.customerOrder.update({
      where: { id: orderId },
      data: { totalPrice: order.totalPrice + unitPrice * quantity },
    }),
  ]);

  return result[0]; // Mengembalikan OrderItem yang baru dibuat
};

/**
 * Query for orders
 * @returns {Promise<QueryResult>}
 */
const queryOrderItems = async (filter, options) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const orderItems = await prisma.orderItem.findMany({
    skip,
    take: limit,
    where: filter,
  });

  const totalItems = await prisma.orderItem.count({ where: filter });
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = page;

  const pagination = {
    totalItems,
    totalPages,
    currentPage,
  };

  return { orderItems, pagination };
};

/**
 * Get orderItem by id
 * @param {ObjectId} id
 * @returns {Promise<OrderItem>}
 */
const getOrderItemById = async (id) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: {
      id: id,
    },
  });
  return orderItem;
};

/**
 * Update orderItem by id
 * @param {ObjectId} orderItemId
 * @param {Object} updateBody
 * @returns {Promise<OrderItem>}
 */
const updateOrderItemById = async (orderItemId, updateBody) => {
  const { orderId, productId, quantity } = updateBody;

  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order item not found");
  }

  const product = await productService.getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  const order = await orderService.getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const unitPrice = product.price;
  const previousTotal = orderItem.unitPrice * orderItem.quantity;

  // Menggunakan transaksi untuk memastikan atomik (semua sukses atau semua gagal)
  const result = await prisma.$transaction([
    // 1. Update harga order lama
    prisma.customerOrder.update({
      where: { id: orderId },
      data: { totalPrice: order.totalPrice - previousTotal },
    }),

    // 2. Update stok produk lama (dikembalikan)
    prisma.product.update({
      where: { id: orderItem.productId },
      data: { quantityInStock: product.quantityInStock + orderItem.quantity },
    }),

    // 3. Update stok produk baru
    prisma.product.update({
      where: { id: productId },
      data: { quantityInStock: product.quantityInStock - quantity },
    }),

    // 4. Update harga total order dengan harga baru
    prisma.customerOrder.update({
      where: { id: orderId },
      data: { totalPrice: order.totalPrice + unitPrice * quantity },
    }),

    // 5. Update orderItem
    prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        orderId,
        productId,
        quantity,
        unitPrice,
      },
    }),
  ]);

  return result[4]; // M
};

/**
 * Delete category by id
 * @param {ObjectId} orderItemId
 * @returns {Promise<OrderItem>}
 */
const deleteOrderItemById = async (orderItemId) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order item not foudn");
  }

  const deleteOrderItem = await prisma.orderItem.delete({
    where: {
      id: orderItemId,
    },
  });

  return deleteOrderItem;
};

module.exports = {
  createOrderItem,
  queryOrderItems,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemById,
};
