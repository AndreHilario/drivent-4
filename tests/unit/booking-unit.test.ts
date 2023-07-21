import { Booking, Enrollment, Hotel, Room, Ticket, TicketStatus, TicketType, User } from '@prisma/client';
import faker from '@faker-js/faker';
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createUser,
  createTicket,
  createTicketTypeWithHotel,
  createPayment,
} from '../factories';
import { cleanDb } from '../helpers';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingServices from '@/services/booking-service';
import { init } from '@/app';
import { TicketWithTicketType } from '@/protocols';
import bookingRepository from '@/repositories/booking-repository';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('All unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when ticketType is remote', async () => {
    const mockUser: User = await createUser();
    const mockEnrollment: Enrollment = await createEnrollmentWithAddress(mockUser);
    const mockTicketType: TicketType = await createTicketTypeWithHotel();
    const mockTicket: Ticket = await createTicket(mockEnrollment.id, mockTicketType.id, TicketStatus.PAID);
    await createPayment(mockTicket.id, mockTicketType.price);
    const mockHotel: Hotel = await createHotel();
    const mockRoom: Room = await createRoomWithHotelId(mockHotel.id);
    const mockBooking: Booking = await createBooking(mockUser.id, mockRoom.id);
    const ticket: TicketWithTicketType = {
      id: mockBooking.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      TicketType: {
        id: mockTicketType.id,
        name: faker.name.findName(),
        price: faker.datatype.number(),
        isRemote: true,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(ticket);

    try {
      await bookingServices.createBooking(mockBooking.roomId, mockUser.id);
      fail('Expected createBooking to throw forbiddenError');
    } catch (error) {
      expect(error.name).toEqual('ForbiddenError');
      expect(error.message).toEqual('Forbidden! You do not have permission to access this resource.');
    }
  });

  it('should throw an error when ticketType is not PAID', async () => {
    const mockUser: User = await createUser();
    const mockEnrollment: Enrollment = await createEnrollmentWithAddress(mockUser);
    const mockTicketType: TicketType = await createTicketTypeWithHotel();
    const mockTicket: Ticket = await createTicket(mockEnrollment.id, mockTicketType.id, TicketStatus.PAID);
    await createPayment(mockTicket.id, mockTicketType.price);
    const mockHotel: Hotel = await createHotel();
    const mockRoom: Room = await createRoomWithHotelId(mockHotel.id);
    const mockBooking: Booking = await createBooking(mockUser.id, mockRoom.id);
    const ticket: TicketWithTicketType = {
      id: mockBooking.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.RESERVED,
      TicketType: {
        id: mockTicketType.id,
        name: faker.name.findName(),
        price: faker.datatype.number(),
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(ticket);

    try {
      await bookingServices.createBooking(mockBooking.roomId, mockUser.id);
      fail('Expected createBooking to throw forbiddenError');
    } catch (error) {
      expect(error.name).toEqual('ForbiddenError');
      expect(error.message).toEqual('Forbidden! You do not have permission to access this resource.');
    }
  });

  it('should throw an error when ticketType doesnt includes hotel', async () => {
    const mockUser: User = await createUser();
    const mockEnrollment: Enrollment = await createEnrollmentWithAddress(mockUser);
    const mockTicketType: TicketType = await createTicketTypeWithHotel();
    const mockTicket: Ticket = await createTicket(mockEnrollment.id, mockTicketType.id, TicketStatus.PAID);
    await createPayment(mockTicket.id, mockTicketType.price);
    const mockHotel: Hotel = await createHotel();
    const mockRoom: Room = await createRoomWithHotelId(mockHotel.id);
    const mockBooking: Booking = await createBooking(mockUser.id, mockRoom.id);
    const ticket: TicketWithTicketType = {
      id: mockBooking.id,
      ticketTypeId: mockTicketType.id,
      enrollmentId: mockEnrollment.id,
      status: TicketStatus.PAID,
      TicketType: {
        id: mockTicketType.id,
        name: faker.name.findName(),
        price: faker.datatype.number(),
        isRemote: false,
        includesHotel: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(ticket);

    try {
      await bookingServices.createBooking(mockBooking.roomId, mockUser.id);
      fail('Expected createBooking to throw forbiddenError');
    } catch (error) {
      expect(error.name).toEqual('ForbiddenError');
      expect(error.message).toEqual('Forbidden! You do not have permission to access this resource.');
    }
  });

  it('should throw an error when room choose to update doesnt belong to the user', async () => {
    const mockUser: User = await createUser();
    const mockHotel: Hotel = await createHotel();
    const mockRoom: Room = await createRoomWithHotelId(mockHotel.id);
    const mockBooking: Booking = await createBooking(mockUser.id, mockRoom.id);

    jest.spyOn(bookingRepository, 'getBookingByUserId').mockResolvedValue(null);

    const response = bookingServices.updateBookingRoom(mockRoom.id, mockUser.id, mockBooking.id);
    expect(response).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Forbidden! You do not have permission to access this resource.',
    });
  });
});
