document.addEventListener('DOMContentLoaded', function() {
    fetch('flights_delay_stats.json')
        .then(response => response.json())
        .then(data => {
            populateFilters(data);
            displayData(data); // Function to display data on the page
        })
        .catch(error => console.error('Error loading the data:', error));

    function displayData(data) {
        const container = document.getElementById('data-container');
        container.innerHTML = ''; // Clear existing data
        data.forEach(flight => {
            const flightElement = document.createElement('div');
            flightElement.classList.add('flight-data');
            flightElement.textContent = `Origin: ${flight.ori}, Destination: ${flight.dest}, Airline: ${flight.air}, Mean Delay: ${flight.mean}`;
            container.appendChild(flightElement);
        });
    }

    function populateFilters(data) {
        const airlineFilter = document.getElementById('airlineFilter');
        const originFilter = document.getElementById('originFilter');
        const destinationFilter = document.getElementById('destinationFilter');
        
        const airlines = [...new Set(data.map(flight => flight.air))];
        const origins = [...new Set(data.map(flight => flight.ori))];
        const destinations = [...new Set(data.map(flight => flight.dest))];

        populateFilter(airlineFilter, airlines);
        populateFilter(originFilter, origins);
        populateFilter(destinationFilter, destinations);
    }

    function populateFilter(filterElement, items) {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            filterElement.appendChild(option);
        });
    }

    function filterData() {
        fetch('flights_delay_stats.json')
            .then(response => response.json())
            .then(data => {
                const selectedAirline = document.getElementById('airlineFilter').value;
                const selectedOrigin = document.getElementById('originFilter').value;
                const selectedDestination = document.getElementById('destinationFilter').value;
                
                const filteredData = data.filter(flight => 
                    (flight.air === selectedAirline || selectedAirline === 'All') &&
                    (flight.ori === selectedOrigin || selectedOrigin === 'All') &&
                    (flight.dest === selectedDestination || selectedDestination === 'All')
                );
                displayData(filteredData); // Clear the container and display filtered data
            })
            .catch(error => console.error('Error re-loading the data:', error));
    }

    document.getElementById('airlineFilter').addEventListener('change', filterData);
    document.getElementById('originFilter').addEventListener('change', filterData);
    document.getElementById('destinationFilter').addEventListener('change', filterData);
});