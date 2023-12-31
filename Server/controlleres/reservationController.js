const Reservation = require("../models/reservationModel");
const House = require("../models/houseModel");
const { AppError } = require("../utils/appError");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51Nvcg1Guqo6CM9lqtfEESuSSTnVQIfGIgvZutCwww5kA80K51mTyR8xURpmJZ8bUFnaZGGSiCmQPHeWuQK99QPUI009wLJkllV"
);

exports.payment = async (req, res, next) => {
  const { id, checkIn, checkOut } = req.body;
  const house = await House.findById(id);

  const price = parseInt(
    (house.price * (new Date(checkOut) - new Date(checkIn))) /
      (1000 * 60 * 60 * 24)
  );
  const isValideDate =
    new Date(checkIn) < new Date(checkOut) &&
    new Date(checkIn).getDate() + 1 >= new Date().getDate();
  if (!isValideDate) {
    return next(
      new AppError(
        `The checkin date must be before the checkout date and after today`,
        400
      )
    );
  }

  const checkAvailability = await Reservation.find({
    houseId: id,
    $or: [
      {
        checkIn: {
          $gte: checkIn,
          $lte: checkOut,
        },
      },
      {
        checkOut: {
          $gte: checkIn,
          $lte: checkOut,
        },
      },
    ],
  });

  if (checkAvailability.length > 0) {
    return next(
      new AppError(
        `The house is not available between ${req.body.checkIn} and ${req.body.checkOut}`,
        400
      )
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: house.name,

              images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaWQZyUWL5KqcqjDkmy8KLuUZGk_cvLGy8Hg&usqp=CAU",
              ],
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get(
        "host"
      )}/reservations/success?id=${id}&checkIn=${checkIn}&checkOut=${checkOut}&price=${price}&userId=${
        req.user._id
      } `,
      cancel_url: "http://localhost:5173/failed",
      customer_email: req.user.email,
    });

    res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find();

    res.status(200).json({
      status: "success",
      reservationCount: reservations.length,
      data: {
        reservations,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.createReservation = async (req, res, next) => {
  const { id, checkIn, checkOut, price, userId } = req.query;
  try {
    await Reservation.create({
      houseId: id,
      checkIn,
      checkOut,
      userId,
      price,
    });
    res
      .status(302)
      .setHeader("Location", "http://localhost:5173/success")
      .end();

    res.end();
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return next(
        new AppError(
          `There is no reservation with the id ${req.params.id}`,
          404
        )
      );
    }

    if (
      req.user.role !== "admin" &&
      req.user._id != reservation.userId._id.toString()
    ) {
      console.log(reservation.userId);
      console.log(req.user._id);
      return next(
        new AppError("You are not allowed to delete this reservation", 403)
      );
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        reservation,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.getReservationsByUserId = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ userId: req.params.userId });

    res.status(200).json({
      status: "success",
      data: {
        reservations,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.getReservationsByHouseId = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      houseId: req.params.id,
    });

    res.status(200).json({
      status: "success",
      data: {
        reservations,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// exports.getReservation = async (req, res, next) => {
//   try {
//     const reservation = await Reservation.findById(req.params.id);

//     if (!reservation) {
//       return next(
//         new AppError(
//           `There is no reservation with the id ${req.params.id}`,
//           404
//         )
//       );
//     }

//     res.status(200).json({
//       status: "Success",
//       data: {
//         reservation,
//       },
//     });
//   } catch (error) {
//     return next(new AppError(error.message, 500));
//   }
// };

exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id });

    res.status(200).json({
      status: "success",
      data: {
        reservations,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.stats = async (req, res) => {
  try {
    const pipeline = [
      // Match all reservations
      {
        $match: {},
      },
      // Calculate total price
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" },
          reservations: { $push: "$$ROOT" },
        },
      },
      // Find the most reserved place
      {
        $project: {
          _id: 0,
          totalPrice: 1,
          reservations: 1,
          mostReservedPlace: {
            $arrayElemAt: [
              {
                $map: {
                  input: "$reservations",
                  as: "reservation",
                  in: {
                    houseId: "$$reservation.houseId",
                    totalReservations: {
                      $size: {
                        $filter: {
                          input: "$reservations",
                          as: "r",
                          cond: {
                            $eq: ["$$r.houseId", "$$reservation.houseId"],
                          },
                        },
                      },
                    },
                  },
                },
              },
              0,
            ],
          },
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await Reservation.aggregate(pipeline);

    // Send the result as a response
    res.status(200).json({
      success: true,
      message:
        "Total reservations price and most reserved place calculated successfully",
      data: result[0],
    });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "Error calculating total reservations price and most reserved place",
      error: error.message,
    });
  }
};
