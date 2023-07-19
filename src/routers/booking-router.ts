import { Router } from 'express';
import { createBooking, getBookingByUserId, updateBooking } from '@/controllers/booking-controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas/booking-shemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBookingByUserId)
  .post('/', validateBody(bookingSchema), createBooking)
  .put('/:bookingId', updateBooking);

export { bookingRouter };
