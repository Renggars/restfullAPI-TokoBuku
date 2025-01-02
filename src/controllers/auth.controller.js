const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const authService = require("../services/auth.service");
const userService = require("../services/user.service");
const tokenService = require("../services/token.service");
const ApiError = require("../utils/ApiError");
const prisma = require("../../prisma");
const { responseApiSuccess } = require("../utils/responseApi");

const register = catchAsync(async (req, res) => {
  const existingUser = await userService.getUserByEmail(req.body.email);

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const userCreated = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(userCreated);
  res.status(httpStatus.CREATED).send({ data: { userCreated, tokens } });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.headers.authorization);
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ data: { user, tokens } });
});

const logout = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Authorization token is missing"
    );
  }

  await authService.logoutUser(token);
  responseApiSuccess(res, "Logout success");
});

module.exports = {
  register,
  login,
  logout,
};
