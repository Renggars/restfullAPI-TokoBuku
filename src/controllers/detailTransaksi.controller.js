const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const detailTransaksiService = require("../services/detailTransaksi.service");
const {
  responseApiCreateSuccess,
  responseApiSuccess,
} = require("../utils/responseApi");
const { paginationValidation } = require("../validations");

const createDetailTransaksi = catchAsync(async (req, res) => {
  const detailTransaksi = await detailTransaksiService.createDetailTransaksi(
    req.body
  );
  responseApiCreateSuccess(
    res,
    "Create Detail Transaksi Success",
    detailTransaksi
  );
});

const getDetailTransaksis = catchAsync(async (req, res) => {
  // Validasi query params untuk paginasi dan filter
  const { error, value } = paginationValidation.querySchema.validate(req.query);
  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Query invalid");
  }

  // Destructuring value dari validasi
  const { page, limit, ...filter } = value;

  // Mengambil data detail transaksi dengan filter dan paginasi
  const result = await detailTransaksiService.queryDetailTransaksi(filter, {
    page,
    limit,
  });

  // Mengirim response API yang sukses dengan data hasil query
  responseApiSuccess(res, "Get Detail Transaksis Success", result);
});

const getDetailTransaksi = catchAsync(async (req, res) => {
  const detailTransaksi = await detailTransaksiService.getDetailTransaksiById(
    req.params.detailTransaksiId
  );
  if (!detailTransaksi) {
    throw new ApiError(httpStatus.NOT_FOUND, "Detail Transaksi not found");
  }
  responseApiSuccess(res, "Get Detail Transaksi Success", detailTransaksi);
});

const updateDetailTransaksi = catchAsync(async (req, res) => {
  const detailTransaksi =
    await detailTransaksiService.updateDetailTransaksiById(
      req.params.detailTransaksiId,
      req.body
    );
  if (!detailTransaksi) {
    throw new ApiError(httpStatus.NOT_FOUND, "Detail Transaksi not found");
  }
  responseApiSuccess(res, "Update Detail Transaksi Success", detailTransaksi);
});

const deleteDetailTransaksi = catchAsync(async (req, res) => {
  const detailTransaksi =
    await detailTransaksiService.deleteDetailTransaksiById(
      req.params.detailTransaksiId
    );
  if (!detailTransaksi) {
    throw new ApiError(httpStatus.NOT_FOUND, "Detail Transaksi not found");
  }
  responseApiSuccess(res, "Delete Detail Transaksi Success", null);
});

module.exports = {
  createDetailTransaksi,
  getDetailTransaksis,
  getDetailTransaksi,
  updateDetailTransaksi,
  deleteDetailTransaksi,
};
