const mongoose = require("mongoose");
const Booking = require("./models/Booking");
const Reservation = require("./models/Reservation");

async function handleBooking(user, reservationDetails, paymentMethod) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = new Booking({
      user,
      payment_status: "pending",
      payment_method: paymentMethod,
    });
    await booking.save({ session });
    const reservation = new Reservation({
      ...reservationDetails,
      booking: booking._id,
    });
    await reservation.save({ session });
    const paymentSuccessful = await processPayment(user, paymentMethod);
    if (paymentSuccessful) {
      booking.payment_status = "completed";
      reservation.reservedStatus = true;

      await booking.save({ session });
      await reservation.save({ session });
    } else {
      throw new Error("Payment failed");
    }
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
