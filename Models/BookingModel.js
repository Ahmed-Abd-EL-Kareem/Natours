const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Booking must belong to a tour!"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  price: {
    type: Number,
    require: [true, "Booking Must Have A Price"]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate("user").populate({
    path: "tour",
    select: "name"
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
