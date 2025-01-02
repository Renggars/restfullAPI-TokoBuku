const Joi = require("joi");
const { objectId } = require("./custom.validation");

// ✅ Validasi untuk membuat produk baru
const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantityInStock: Joi.number().integer().min(0).required(),
    categoryId: Joi.string().custom(objectId).required(),
    author: Joi.string().required(), // Baru
    publisher: Joi.string().required(), // Baru
    isbn: Joi.string().required(), // Baru
  }),
};

// ✅ Validasi untuk mendapatkan produk berdasarkan ID
const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

// ✅ Validasi untuk memperbarui produk
const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().positive(),
      quantityInStock: Joi.number().integer().min(0),
      categoryId: Joi.string().custom(objectId),
      author: Joi.string(), // Baru
      publisher: Joi.string(), // Baru
      isbn: Joi.string(), // Baru
    })
    .min(1),
};

// ✅ Validasi untuk menghapus produk
const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
