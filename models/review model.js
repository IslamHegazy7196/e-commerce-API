const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverage = async function (productId) {
 console.log(productId)
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(result)
  try {
    result[0]?await this.model("Product").findOneAndUpdate({
      _id: productId,
      averageRating: result[0].averageRating ,
      numOfReviews: result[0].numOfReviews ,
    })  :
    await this.model("Product").findOneAndUpdate({
      _id: productId,
      averageRating: 0 ,
      numOfReviews: 0 ,
    });
  } catch (error) {
    console.log(error);
  }
};
ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverage(this.product);
});
ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverage(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
