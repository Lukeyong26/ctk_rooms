export interface Bookings {
    date: string;
    roomId: string;
    bookedBy: string;
    startTime: string;
    endTime: string;
}

export interface Room {
    id: string;
    name: string;
    desc: string;
}