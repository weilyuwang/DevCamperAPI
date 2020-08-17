const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require('../models/User')


// @desc      Register User
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  // Create User
  const user = await User.create({
    name, email, password, role
  })

  // Create JWT 
  const token = user.getSignedJwtToken()

  res.status(200).json({ success: true, token: token })
})



// @desc      Login User
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400))
  }

  // Check for User
  // we set `select: false` to the password field of the User model so 
  // by default the password will not be returned
  // We need to explicitly use `.select('+password')` to get password 
  const user = await User.findOne({ email: email }).select('+password')

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  // Create JWT 
  const token = user.getSignedJwtToken()

  res.status(200).json({ success: true, token: token })
})

