let myChart = null;

document.addEventListener('DOMContentLoaded', function() {
    fetch('flights_delay_stats.json')
        .then(response => response.json())
        .then(data => {
            populateFilters(data);
            createChart(data);
        })
        .catch(error => console.error('Error loading the data:', error));

    function populateFilters(data) {
        const airlineFilter = document.getElementById('airlineFilter');
        const originFilter = document.getElementById('originFilter');
        const destinationFilter = document.getElementById('destinationFilter');
        
        const airlines = [...new Set(data.map(flight => flight.air))].sort();
        const origins = [...new Set(data.map(flight => flight.ori))].sort();
        const destinations = [...new Set(data.map(flight => flight.dest))].sort();

        populateFilter(airlineFilter, airlines);
        populateFilter(originFilter, origins);
        populateFilter(destinationFilter, destinations);

        // Set default values
        originFilter.value = 'Tehran';
        destinationFilter.value = 'Mashhad';
        metricSelect.value = 'median';
        filterData();
    }

    function populateFilter(filterElement, items) {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            filterElement.appendChild(option);
        });
    }

    function createChart(data, metric = 'mean') {
        const ctx = document.getElementById('delayChart').getContext('2d');
        const labels = data.map(flight => `${flight.air}`);
        const metricValues = data.map(flight => flight[metric]);
        const flightCounts = data.map(flight => flight.n); // Gather the flight count data

        // If a chart instance exists, destroy it before creating a new one
        if (myChart !== null) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '',
                    data: metricValues,
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
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: `${metric.charAt(0).toUpperCase() + metric.slice(1)} Delay (minutes)`
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide the legend
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const index = context.dataIndex;
                                const metricValue = context.dataset.data[index];
                                const flightCount = flightCounts[index];
                                return [
                                    `${metric.charAt(0).toUpperCase() + metric.slice(1)} Delay: ${metricValue.toFixed(1)} mins`,
                                    `Number of Recorded Flights: ${flightCount}`
                                ];
                            }
                        }
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
                const selectedMetric = document.getElementById('metricSelect').value;
                
                const filteredData = data.filter(flight => 
                    (flight.air === selectedAirline || selectedAirline === 'All') &&
                    (flight.ori === selectedOrigin || selectedOrigin === 'All') &&
                    (flight.dest === selectedDestination || selectedDestination === 'All')
                );
                createChart(filteredData, selectedMetric);
            })
            .catch(error => console.error('Error re-loading the data:', error));
    }

    document.getElementById('airlineFilter').addEventListener('change', filterData);
    document.getElementById('originFilter').addEventListener('change', filterData);
    document.getElementById('destinationFilter').addEventListener('change', filterData);
    document.getElementById('metricSelect').addEventListener('change', filterData);
});
