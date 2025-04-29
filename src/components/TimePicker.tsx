import React, { useState } from 'react';

const TimePicker: React.FC = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(e.target.value);
        validateTimes();
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(e.target.value);
        validateTimes();
    };

    const validateTimes = () => {
        if (startTime && endTime && startTime >= endTime) {
            setError('End time must be greater than start time.');
        } else {
            setError('');
            alert('Times are valid!');
        }
    };

    return (
        <div>
            <div>
                <label>
                    Start Time:
                    <input
                        type="time"
                        value={startTime}
                        onChange={handleStartTimeChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    End Time:
                    <input
                        type="time"
                        value={endTime}
                        onChange={handleEndTimeChange}
                    />
                </label>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default TimePicker;