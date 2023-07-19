import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { InputBookingBody } from '@/protocols';
import bookingServices from '@/services/booking-service';

export async function getBookingByUserId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingServices.listBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (e) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body as InputBookingBody;
  const { userId } = req;
  try {
    const newBooking = await bookingServices.createBooking(roomId, userId);
    return res.status(httpStatus.OK).send(newBooking);
  } catch (e) {
    if (e.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body as InputBookingBody;
  const { userId } = req;
  const { bookingId } = req.params;
  try {
    const updateBookingResponse = await bookingServices.updateBookingRoom(roomId, userId, Number(bookingId));
    return res.status(httpStatus.OK).send(updateBookingResponse);
  } catch (e) {
    if (e.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
