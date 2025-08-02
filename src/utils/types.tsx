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
    pending: boolean;
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
    pending: boolean;
}

export interface Ministry {
    id: string;
    name: string;
    email: string;
}

export interface Room {
    id: string;
    name: string;
    desc: string;
    img: string;
}