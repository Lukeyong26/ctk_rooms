export interface Bookings {
    id: string;
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