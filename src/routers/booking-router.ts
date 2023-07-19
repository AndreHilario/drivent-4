import { createBooking, getBookingByUserId, updateBooking } from "@/controllers/booking-controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBookingByUserId).post('/', createBooking).put('/:bookingId', updateBooking);

export { bookingRouter };