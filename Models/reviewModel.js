const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty"],
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a Tour"]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a User"]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); // Prevents duplicate reviews from the same user for the same tour
// eslint-disable-next-line prettier/prettier
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo"
  });
  next();
});
// eslint-disable-next-line prettier/prettier
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5 // Default value if no reviews exist
    });
  }
};
// eslint-disable-next-line prettier/prettier
reviewSchema.post("save", function () {
  // this points to current
  this.constructor.calcAverageRatings(this.tour);
});
// eslint-disable-next-line prettier/prettier
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
// eslint-disable-next-line prettier/prettier
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

// TODO: F13 , V1 LAST TAKE V0
