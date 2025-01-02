const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createDetailTransaksi = {
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(), // Validasi untuk orderId
    paymentMethod: Joi.string().valid("cash", "debit").required(), // Hanya "cash" atau "debit"
    shippingAddress: Joi.string().optional(), // Optional untuk shippingAddress
    notes: Joi.string().optional(), // Optional untuk notes
  }),
};

const getDetailTransaksi = {
  params: Joi.object().keys({
    detailTransaksiId: Joi.string().custom(objectId).required(), // Mengambil DetailTransaksi berdasarkan orderId
  }),
};

const updateDetailTransaksi = {
  params: Joi.object().keys({
    detailTransaksiId: Joi.string().custom(objectId).required(), // Mengupdate DetailTransaksi berdasarkan orderId
  }),
  body: Joi.object()
    .keys({
      paymentMethod: Joi.string().valid("cash", "debit"), // Hanya "cash" atau "debit"
      shippingAddress: Joi.string().optional(), // Optional untuk shippingAddress
      notes: Joi.string().optional(), // Optional untuk notes
    })
    .min(1), // Memastikan setidaknya satu field diubah
};

const deleteDetailTransaksi = {
  params: Joi.object().keys({
    detailTransaksiId: Joi.string().custom(objectId).required(), // Menghapus DetailTransaksi berdasarkan orderId
  }),
};

module.exports = {
  createDetailTransaksi,
  getDetailTransaksi,
  updateDetailTransaksi,
  deleteDetailTransaksi,
};
