const httpStatus = require("http-status");
const prisma = require("../../prisma/index");
const ApiError = require("../utils/ApiError");

/**
 * Create a detail transaksi
 * @param {Object} detailTransaksiBody
 * @returns {Promise<DetailTransaksi>}
 */
const createDetailTransaksi = async (detailTransaksiBody) => {
  const { orderId, ...data } = detailTransaksiBody; // Ambil orderId dari detailTransaksiBody

  const prismaTransaction = await prisma.$transaction(async (prisma) => {
    const order = await prisma.customerOrder.findUnique({
      where: { id: orderId }, // Gunakan orderId yang ada dalam body
    });

    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    return prisma.detailTransaksi.create({
      data: {
        orderId, // Pastikan orderId dimasukkan dalam data yang akan disimpan
        ...data, // Gabungkan data lainnya dari body
      },
    });
  });

  return prismaTransaction;
};

const queryDetailTransaksi = async (filter = {}, options = {}) => {
  const page = options.page || 1; // Default page is 1
  const limit = options.limit || 10; // Default limit is 10
  const skip = (page - 1) * limit;

  // Fetch the detail transaksi with pagination and filtering
  const detailTransaksi = await prisma.detailTransaksi.findMany({
    skip,
    take: limit,
    where: filter,
  });

  // Get the total number of detail transaksi that match the filter
  const totalItems = await prisma.detailTransaksi.count({ where: filter });
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = page;

  // Pagination information
  const pagination = {
    totalItems,
    totalPages,
    currentPage,
  };

  return { detailTransaksi, pagination };
};

/**
 * Get detail transaksi by orderId
 * @param {ObjectId} orderId
 * @returns {Promise<DetailTransaksi>}
 */
const getDetailTransaksiById = async (detailTransaksiId) => {
  const detailTransaksi = await prisma.detailTransaksi.findUnique({
    where: { id: detailTransaksiId }, // Mencari berdasarkan id detail transaksi
  });

  if (!detailTransaksi) {
    throw new ApiError(httpStatus.NOT_FOUND, "Detail Transaksi not found");
  }

  return detailTransaksi;
};

/**
 * Update detail transaksi by orderId
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<DetailTransaksi>}
 */
const updateDetailTransaksiById = async (detailTransaksiId, updateBody) => {
  const detailTransaksi = await getDetailTransaksiById(detailTransaksiId); // Panggil fungsi getDetailTransaksiById
  if (!detailTransaksi) {
    throw new ApiError(httpStatus.NOT_FOUND, "Detail Transaksi not found");
  }

  const updateDetailTransaksi = await prisma.detailTransaksi.update({
    where: {
      id: detailTransaksiId, // Menggunakan id untuk update
    },
    data: updateBody,
  });

  return updateDetailTransaksi;
};

/**
 * Delete detail transaksi by orderId
 * @param {ObjectId} orderId
 * @returns {Promise<DetailTransaksi>}
 */
const deleteDetailTransaksiById = async (detailTransaksiId) => {
  const detailTransaksi = await getDetailTransaksiById(detailTransaksiId); // Panggil fungsi getDetailTransaksiById
  if (!detailTransaksi) {
    throw new ApiError(httpStatus.NOT_FOUND, "Detail Transaksi not found");
  }

  try {
    const deleteDetailTransaksi = await prisma.detailTransaksi.delete({
      where: {
        id: detailTransaksiId, // Menggunakan id untuk menghapus
      },
    });
    return deleteDetailTransaksi;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete Detail Transaksi"
    );
  }
};

module.exports = {
  createDetailTransaksi,
  queryDetailTransaksi,
  getDetailTransaksiById,
  updateDetailTransaksiById,
  deleteDetailTransaksiById,
};
