let myChart = null;

document.addEventListener('DOMContentLoaded', function() {
    fetch('flights_delay_stats.json')
        .then(response => response.json())
        .then(data => {
            populateFilters(data);
            createChart(data);
        })
        .catch(error => console.error('Error loading the data:', error));

    function displayData(data) {
        const container = document.getElementById('data-container');
        container.innerHTML = ''; // Clear existing data
        data.forEach(flight => {
            const flightElement = document.createElement('div');
            flightElement.classList.add('flight-data');
            flightElement.textContent = `Origin: ${flight.ori}, Destination: ${flight.dest}, Airline: ${flight.air}, Mean Delay: ${flight.mean}, Median Delay: ${flight.median}, Mode Delay: ${flight.mode}, Top 10% Delay: ${flight.q90}, Count: ${flight.n}`;
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

    function createChart(data) {
        const ctx = document.getElementById('delayChart').getContext('2d');
        const labels = data.map(flight => `${flight.ori} to ${flight.dest}`);
        const meanDelays = data.map(flight => flight.mean);

        // If a chart instance exists, destroy it before creating a new one
        if (myChart !== null) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'bar', // Change this to 'line', 'pie', etc., based on preference
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Delay (minutes)',
                    data: meanDelays,
                    backgroundColor: [
                        'rgba(217, 3, 104, 0.6)',
                        'rgba(46, 41, 78, 0.6)',
                    ],
                    borderColor: [
                        'rgba(217, 3, 104, 1)',
                        'rgba(46, 41, 78, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
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
                createChart(filteredData); // Update this line to display the chart
            })
            .catch(error => console.error('Error re-loading the data:', error));
    }

    document.getElementById('airlineFilter').addEventListener('change', filterData);
    document.getElementById('originFilter').addEventListener('change', filterData);
    document.getElementById('destinationFilter').addEventListener('change', filterData);
});
