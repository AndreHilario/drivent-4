import { prisma } from "@/config";

async function getBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: {
            userId,
        },
        include: {
            Room: true,
        },
    });
}


const bookingRepository = {
    getBookingByUserId,
};

export default bookingRepository;