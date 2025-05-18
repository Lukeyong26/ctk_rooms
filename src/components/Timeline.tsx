import React, { useState } from "react";

interface Booking {
    id: number;
    startTime: string;
    endTime: string;
    title: string;
}

const Timeline: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([
        { id: 1, startTime: "10:00", endTime: "11:00", title: "Meeting A" },
        { id: 2, startTime: "13:00", endTime: "14:00", title: "Meeting B" },
    ]);

    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    const handleSlotClick = (time: string) => {
        const title = prompt("Enter booking title:");
        if (title) {
            setBookings([
                ...bookings,
                {
                    id: bookings.length + 1,
                    startTime: time,
                    endTime: `${parseInt(time) + 1}:00`,
                    title,
                },
            ]);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Booking Timeline</h1>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-2">
                    {hours.map((hour) => (
                        <div key={hour} className="h-12 flex items-center justify-center border-b">
                            {hour}
                        </div>
                    ))}
                </div>
                <div className="col-span-10">
                    {hours.map((hour) => (
                        <div
                            key={hour}
                            className="h-12 border-b relative cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSlotClick(hour)}
                        >
                            {bookings
                                .filter((booking) => booking.startTime === hour)
                                .map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="absolute inset-0 bg-blue-500 text-white text-sm p-2 rounded"
                                    >
                                        {booking.title}
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timeline;