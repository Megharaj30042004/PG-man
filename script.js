document.addEventListener('DOMContentLoaded', () => {
    const roomForm = document.getElementById('roomForm');
    const roomList = document.getElementById('rooms');
    const citySelect = document.getElementById('citySelect');
    const rentFilter = document.getElementById('rentFilter');

    let rooms = JSON.parse(localStorage.getItem('rooms')) || [];

    // Function to populate the city dropdown with sorted cities
    const loadCities = () => {
        // Ensure rooms are loaded first before extracting cities
        if (rooms.length === 0) {
            citySelect.innerHTML = '<option value="">Select City</option>'; // No cities available
            return;
        }

        const cities = [...new Set(rooms.map(room => room.roomLocation))]; // Get unique city names
        cities.sort(); // Sort cities alphabetically

        // Clear the city select options before re-adding
        citySelect.innerHTML = '<option value="">Select City</option>'; // Reset the dropdown

        // Add each city to the dropdown
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    };

    const loadRooms = () => {
        roomList.innerHTML = '';

        const selectedCity = citySelect.value.trim();
        const selectedRent = rentFilter.value.trim();

        console.log('Selected City:', selectedCity);
        console.log('Selected Rent Range:', selectedRent);

        const filteredRooms = rooms.filter(room => {
            let cityMatch = true;
            let rentMatch = true;

            if (selectedCity && selectedCity !== "") {
                cityMatch = room.roomLocation.toLowerCase() === selectedCity.toLowerCase();
            }

            if (selectedRent && selectedRent !== "") {
                if (selectedRent === 'low') {
                    rentMatch = room.roomRent < 5000;
                } else if (selectedRent === 'mid') {
                    rentMatch = room.roomRent >= 5000 && room.roomRent <= 10000;
                } else if (selectedRent === 'high') {
                    rentMatch = room.roomRent > 10000;
                }
            }

            return cityMatch && rentMatch;
        });

        if (filteredRooms.length === 0) {
            roomList.innerHTML = '<li>No rooms found for the selected filters.</li>';
        } else {
            filteredRooms.forEach(room => {
                const li = document.createElement('li');
                li.classList.add('room-item');
                li.innerHTML = `
                    <div>
                        <strong>Room No:</strong> ${room.roomNumber} <br>
                        <strong>Type:</strong> ${room.roomType} <br>
                        <strong>Rent:</strong> ₹${room.roomRent} <br>
                        <strong>Location:</strong> ${room.roomLocation} <br>
                        <strong>Status:</strong> ${room.booked ? 'Booked' : 'Available'}
                    </div>
                    <button class="bookButton" ${room.booked ? 'disabled' : ''} onclick="bookRoom('${room.roomNumber}')">
                        ${room.booked ? 'Booked' : 'Book'}
                    </button>
                    <button class="deleteButton" onclick="deleteRoom('${room.roomNumber}')">Delete</button>
                `;
                roomList.appendChild(li);
            });
        }

        console.log(`Rooms displayed: ${filteredRooms.length}`);
    };

    roomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const roomNumber = document.getElementById('roomNumber').value;
        const roomType = document.getElementById('roomType').value;
        const roomRent = document.getElementById('roomRent').value;
        const roomLocation = document.getElementById('roomLocation').value;

        const newRoom = {
            roomNumber,
            roomType,
            roomRent: parseInt(roomRent),
            roomLocation,
            booked: false
        };

        rooms.push(newRoom);
        localStorage.setItem('rooms', JSON.stringify(rooms));
        loadCities();  // Re-load cities to ensure new cities are available
        loadRooms();   // Re-load rooms
        roomForm.reset();
    });

    window.bookRoom = (roomNumber) => {
        rooms = rooms.map(room => {
            if (room.roomNumber === roomNumber) {
                room.booked = true;
            }
            return room;
        });

        localStorage.setItem('rooms', JSON.stringify(rooms));
        loadRooms();
    };

    window.deleteRoom = (roomNumber) => {
        rooms = rooms.filter(room => room.roomNumber !== roomNumber);

        localStorage.setItem('rooms', JSON.stringify(rooms));
        loadCities();  // Re-load cities to update the dropdown
        loadRooms();
    };

    citySelect.addEventListener('change', loadRooms);
    rentFilter.addEventListener('change', loadRooms);

    loadCities();  // Initial population of city dropdown
    loadRooms();
});
