const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Review");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Get reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {

  if (req.params.bootcampId) {      // GET /api/v1/bootcamps/:bootcampId/reviews
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } else {          // GET /api/v1/reviews
    res.status(200).json(res.advancedResults)
  }
});