import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";

async function listBooking(userId: number) {
    const response = await bookingRepository.getBookingByUserId(userId);

    if (!response) throw notFoundError();

    const correctInfoBooking = {
        id: response.id,
        Room: response.Room,
    }

    return correctInfoBooking;
}

const bookingServices = {
    listBooking,
}

export default bookingServices;