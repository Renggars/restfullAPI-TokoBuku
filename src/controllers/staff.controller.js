const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const staffService = require("../services/staff.service");
const {
  responseApiCreateSuccess,
  responseApiSuccess,
} = require("../utils/responseApi");
const { paginationValidation } = require("../validations");

const createStaff = catchAsync(async (req, res) => {
  const staff = await staffService.createStaff(req.body);
  responseApiCreateSuccess(res, "Create Staff Success", staff);
});

const getStaffs = catchAsync(async (req, res) => {
  const { error, value } = paginationValidation.querySchema.validate(req.query);
  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Query invalid");
  }

  const { page, limit, ...filter } = value;
  const result = await staffService.queryStaffs(filter, {
    page,
    limit,
  });

  responseApiSuccess(res, "Get Staffs Success", result);
});

const getStaff = catchAsync(async (req, res) => {
  const staff = await staffService.getStaffById(req.params.staffId);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, "Staff not found");
  }
  responseApiSuccess(res, "Get Staff Success", staff);
});

const updateStaff = catchAsync(async (req, res) => {
  const staff = await staffService.updateStaffById(
    req.params.staffId,
    req.body
  );
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, "Staff not found");
  }
  responseApiSuccess(res, "Update Staff Success", staff);
});

const deleteStaff = catchAsync(async (req, res) => {
  const staff = await staffService.deleteStaffById(req.params.staffId);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, "Staff not found");
  }
  responseApiSuccess(res, "Delete Staff Success", null);
});

module.exports = {
  createStaff,
  getStaffs,
  getStaff,
  updateStaff,
  deleteStaff,
};
