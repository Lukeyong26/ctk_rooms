export interface Bookings {
    id: string;
    date: string;
    roomId: string;
    bookedBy: string;
    startTime: string;
    endTime: string;
    ministry: string; 
    phoneNumber: string;
    email: string;
    description: string;
}

export interface BookingFormData {
    date: string;
    roomId: string;
    bookedBy: string;
    startTime: string;
    endTime: string;
    ministry: string;
    phoneNumber: string;
    email: string;
    description: string;
}

export interface Ministry {
    id: string;
    name: string;
    color: string;
}

export interface Room {
    id: string;
    name: string;
    desc: string;
}