import { AuthenticatedRequest } from "@/middlewares";
import bookingServices from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBookingByUserId(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try {
        const booking = await bookingServices.listBooking(userId);
        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
    try {

    } catch (error) {

    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    try {

    } catch (error) {

    }
}