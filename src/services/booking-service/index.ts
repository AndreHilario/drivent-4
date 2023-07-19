import { TicketStatus } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function listBooking(userId: number) {
  const response = await bookingRepository.getBookingByUserId(userId);

  if (!response) throw notFoundError();

  const correctInfoBooking = {
    id: response.id,
    Room: response.Room,
  };

  return correctInfoBooking;
}

async function createBooking(roomId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (
    ticket.TicketType.isRemote === true ||
    ticket.TicketType.includesHotel === false ||
    ticket.status === TicketStatus.RESERVED
  )
    throw forbiddenError();

  const findRoomId = await bookingRepository.findRoomId(roomId);
  if (!findRoomId) throw notFoundError();

  const fullRoom = await bookingRepository.findBookingByRoomId(roomId);
  if (fullRoom) throw forbiddenError();

  const response = await bookingRepository.createBookingByRoomId(roomId, userId);

  return { bookingId: response.id };
}

async function updateBookingRoom(roomId: number, userId: number, bookingId: number) {
  const existingBooking = bookingRepository.getBookingByUserId(userId);
  if (!existingBooking) throw forbiddenError();

  const findRoomId = await bookingRepository.findRoomId(roomId);
  if (!findRoomId) throw notFoundError();

  const fullRoom = await bookingRepository.findBookingByRoomId(roomId);
  if (fullRoom) throw forbiddenError();

  const response = await bookingRepository.updateBookingByBookingId(userId, roomId, bookingId);

  return { bookingId: response.id };
}

const bookingServices = {
  listBooking,
  createBooking,
  updateBookingRoom,
};

export default bookingServices;
