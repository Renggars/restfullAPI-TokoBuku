const httpStatus = require("http-status");
const prisma = require("../../prisma/index");
const ApiError = require("../utils/ApiError");

/**
 * Create a staff
 * @param {Object} staffBody
 * @returns {Promise<Staff>}
 */
const createStaff = async (staffBody) => {
  return prisma.staff.create({
    data: staffBody,
  });
};

/**
 * Get staff by id
 * @param {ObjectId} id
 * @returns {Promise<Staff>}
 */
const getStaffById = async (id) => {
  return prisma.staff.findUnique({
    where: {
      id: id,
    },
  });
};

/**
 * Query staff
 * @param {Object} filter
 * @param {Object} options
 * @param {number} options.page - Current page (default = 1)
 * @param {number} options.limit - Maximum number of results per page (default = 10)
 * @returns {Promise<QueryResult>}
 */
const queryStaffs = async (filter, options) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const staffs = await prisma.staff.findMany({
    skip,
    take: limit,
    where: filter,
  });

  const totalItems = await prisma.staff.count({ where: filter });
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = page;

  const pagination = {
    totalItems,
    totalPages,
    currentPage,
  };

  return { staffs, pagination };
};

/**
 * Update staff by id
 * @param {ObjectId} staffId
 * @param {Object} updateBody
 * @returns {Promise<Staff>}
 */
const updateStaffById = async (staffId, updateBody) => {
  const staff = await getStaffById(staffId);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, "Staff not found");
  }

  const updatedStaff = await prisma.staff.update({
    where: {
      id: staffId,
    },
    data: updateBody,
  });

  return updatedStaff;
};

/**
 * Delete staff by id
 * @param {ObjectId} staffId
 * @returns {Promise<Staff>}
 */
const deleteStaffById = async (staffId) => {
  const staff = await getStaffById(staffId);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, "Staff not found");
  }

  const deletedStaff = await prisma.staff.delete({
    where: {
      id: staffId,
    },
  });

  return deletedStaff;
};

module.exports = {
  createStaff,
  getStaffById,
  queryStaffs,
  updateStaffById,
  deleteStaffById,
};
