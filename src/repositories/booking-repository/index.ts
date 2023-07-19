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

async function createBookingByRoomId(roomId: number, userId: number) {
    return prisma.booking.create({
        data: {
            userId,
            roomId,
            updatedAt: new Date(),
        },
    });
}

async function findRoomId(roomId: number) {
    return prisma.room.findFirst({
        where: {
            id: roomId,
        },
    })
}


const bookingRepository = {
    getBookingByUserId,
    createBookingByRoomId,
    findRoomId
};

export default bookingRepository;