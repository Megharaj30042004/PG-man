// rooms.js
document.addEventListener('DOMContentLoaded', () => {
    const roomList = document.getElementById('rooms');

    // Function to load rooms from localStorage
    const loadRooms = () => {
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];

        if (rooms.length === 0) {
            roomList.innerHTML = '<li>No rooms available.</li>';
            return;
        }

        roomList.innerHTML = ''; // Clear previous rooms

        rooms.forEach(room => {
            const li = document.createElement('li');
            li.classList.add('room-item');
            li.innerHTML = `
                <div>
                    <strong>Room No:</strong> ${room.roomNumber} <br>
                    <strong>Type:</strong> ${room.roomType} <br>
                    <strong>Rent:</strong> ₹${room.roomRent} <br>
                    <strong>Location:</strong> ${room.roomLocation} <br>
                </div>
            `;
            roomList.appendChild(li);
        });
    };

    loadRooms(); // Call the function to display rooms
});