const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const prisma = require("../../prisma");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  return user;
};

const logoutUser = async (token) => {
  console.log("token awal", token);
  const dataToken = await prisma.token.findFirst({
    where: {
      token: token,
    },
  });
  console.log("dataToken", dataToken);

  if (!dataToken) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
  }

  const result = await prisma.token.update({
    where: {
      id: dataToken.id,
    },
    data: {
      blacklisted: true,
    },
  });
  return result;
};

module.exports = {
  loginUserWithEmailAndPassword,
  logoutUser,
};
