const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createStaff = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    position: Joi.string().required(),
    salary: Joi.number().positive().required(),
    phoneNumber: Joi.string().optional(),
    email: Joi.string().email().optional(),
  }),
};

const getStaff = {
  params: Joi.object().keys({
    staffId: Joi.string().custom(objectId).required(),
  }),
};

const updateStaff = {
  params: Joi.object().keys({
    staffId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      position: Joi.string(),
      salary: Joi.number().positive(),
      phoneNumber: Joi.string(),
      email: Joi.string().email(),
    })
    .min(1),
};

const deleteStaff = {
  params: Joi.object().keys({
    staffId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff,
};
