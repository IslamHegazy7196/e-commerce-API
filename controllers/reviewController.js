const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product model");
const Review = require("../models/review model");
const { checkPermissions } = require("../utils");
const customError = require("../errors");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new customError.NotFoundError(`No product with id :${productId}`);
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new customError.BadRequestError(
      "Already submitted review for this product"
    );
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name"
    })
    .populate({ path: "user", select: "name" });
  res.status(StatusCodes.OK).json({ reviews, counts: reviews.length });
};
const getSingleReview = async (req, res) => {
  const { id: productId } = req.params;
  const review = await Review.findOne({ _id: productId });
  if (!review) {
    throw new customError.BadRequestError(
      `no review found with id:${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id: productId } = req.params;
  const review = await Review.findOne({ _id: productId });
  if (!review) {
    throw new customError.BadRequestError(
      `no review found with id:${productId}`
    );
  }
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { id: productId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: productId });
  if (!review) {
    throw new customError.BadRequestError(
      `no review found with id:${productId}`
    );
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  deleteReview,
  updateReview,
};
