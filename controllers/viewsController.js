// const Tour = require("../Models/tourModel");
// const catchAsync = require("../utils/catchAsync");

// exports.getOverview = catchAsync(async (req, res, next) => {
//   //? 1) Get all tours from the database
//   const tours = await Tour.find();
//   //? 2) Build template

//   //? 3) Render that template using tour data from 1)
//   res.status(200).render("overview", {
//     title: "All Tours",
//     tours
//   });
// });
// exports.getTour = catchAsync(async (req, res, next) => {
//   //? 1) Get the data for the requested tour (including reviews and user)
//   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
//     path: "reviews",
//     fields: "review rating user"
//   });
//   //? 2) Build template
//   //? 3) Render template using data from 1)
//   res.status(200).render("tour", {
//     title: `${tour.name} Tour`,
//     tour
//   });
// });

// exports.getLoginForm = (req, res) => {
//   res.status(200).render("login", {
//     title: "Log into your account"
//   });
// };

// exports.getSignupForm = (req, res) => {
//   res.status(200).render("signup", {
//     title: "Create your account"
//   });
// };
const Tour = require("../Models/tourModel");
const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Booking = require("../Models/BookingModel");

exports.getOverview = async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All Tours",
    tours
  });
};

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user"
  });
  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account"
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("signup", {
    title: "Create your account"
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account"
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res.status(200).render("overview", {
    title: "My Tours",
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const UpdatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  // console.log(req.body);
  res.status(200).render("account", {
    title: "Your account",
    user: UpdatedUser
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === "booking") {
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";
  }
  next();
};
