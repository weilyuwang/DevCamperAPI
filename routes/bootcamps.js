const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  updateBootcamp,
  createBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResults')

// Include other resource routers
const courseRouter = require("./courses");
const reviewsRouter = require("./reviews")

const router = express.Router();

const { protect, authorize } = require('../middleware/auth')

// Re-route into other resource routers
// Re-route /api/v1/bootcamps/:bootcampId/courses to /api/v1/courses with params merged
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewsRouter)

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(advancedResults(Bootcamp, "courses"), getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route("/:id/photo").put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
