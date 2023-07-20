import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import bookingServices from "@/services/booking-service";
import { TicketStatus } from "@prisma/client";

describe('POST /booking unit test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('test if services calls are correct and working as expected', async () => {
        let mockTicket;
        const mockUser = {
            id: 1,
            email: 'john.doe@example.com',
            password: 'hashedpassword123',
            createdAt: new Date('2023-07-20T12:34:56Z'),
            updatedAt: new Date('2023-07-20T12:34:56Z'),
        };
        const mockAddress = {
            id: 1,
            cep: '12345-678',
            street: '123 Main St',
            city: 'City',
            state: 'State',
            number: '123',
            neighborhood: 'Neighborhood',
            addressDetail: 'Apartment 456',
            enrollmentId: 1,
            createdAt: new Date('2023-07-20T12:34:56Z'),
            updatedAt: new Date('2023-07-20T12:34:56Z'),
        };
        const mockTicketType = {
            id: 1,
            name: 'Presential Ticket',
            price: 5000,
            isRemote: false,
            includesHotel: true,
            createdAt: new Date('2023-07-20T12:34:56Z'),
            updatedAt: new Date('2023-07-20T12:34:56Z'),
            Ticket: [mockTicket],
        };

        mockTicket = {
            id: 1,
            ticketTypeId: 1,
            enrollmentId: 1,
            status: TicketStatus.PAID,
            createdAt: new Date('2023-07-20T12:34:56Z'),
            updatedAt: new Date('2023-07-20T12:34:56Z'),
            TicketType: mockTicketType
        };

        const mockEnrollment = {
            id: 1,
            name: 'John Doe',
            cpf: '123.456.789-00',
            birthday: new Date('1990-01-01T00:00:00Z'),
            phone: '(123) 456-7890',
            userId: 1,
            User: mockUser,
            Address: [mockAddress],
            createdAt: new Date('2023-07-20T12:34:56Z'),
            updatedAt: new Date('2023-07-20T12:34:56Z'),
            Ticket: [mockTicket],
        };
        const mockRoom = {
            id: 1,
            name: 'Standard Room',
            capacity: 2,
            hotelId: 123,
            createdAt: new Date('2023-07-20T12:34:56Z'),
            updatedAt: new Date('2023-07-20T12:34:56Z'),
        };
        const mockBooking = {
            id: 1,
            userId: 456,
            roomId: 1,
            createdAt: new Date('2023-07-20T12:34:56Z'),
            updatedAt: new Date('2023-07-20T12:34:56Z'),
        };



        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
        jest.spyOn(bookingRepository, 'findRoomId').mockResolvedValueOnce(mockRoom);
        jest.spyOn(bookingRepository, 'findBookingByRoomId').mockResolvedValueOnce(null);
        jest.spyOn(bookingRepository, 'createBookingByRoomId').mockResolvedValueOnce(mockBooking);

        const booking = await bookingServices.createBooking(mockUser.id, mockRoom.id);

        // Verifique a resposta da função createBooking
        expect(booking).toBeDefined(); // Ou use toBeTruthy()

        // Verifique se as funções do repositório foram chamadas corretamente
        expect(enrollmentRepository.findWithAddressByUserId).toHaveBeenCalledWith(mockUser.id);
        expect(ticketsRepository.findTicketByEnrollmentId).toHaveBeenCalledWith(mockEnrollment.id);
        expect(bookingRepository.findRoomId).toHaveBeenCalledWith(mockRoom.id);
        expect(bookingRepository.findBookingByRoomId).toHaveBeenCalledWith(mockRoom.id);
        expect(bookingRepository.createBookingByRoomId).toHaveBeenCalledWith(mockRoom.id, mockUser.id);

    });

   /*  it('should', async () => {
        
    }) */
});