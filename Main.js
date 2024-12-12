//read in data set containing lat and long for each 16,000 mcdonalds location and the status of the icecream machine
d3.csv('mcdonalds_dataset.csv').then((data) => {
    //grab the lat and long from data set as ints
    const locations = data.map(d => {
        const lat = +d.lat;
        const lng = +d.lon;

        //this was a checker as the lat and long did not load correctly at the start
        console.log(`Lat: ${lat}, Lng: ${lng}`);

       //creating a new variable called status
        //automatically set status to unknown
        let status = "Unknown";

        //uses the dot column to figure out what the labeled status is of the machine
        //three unique id's in the data set (working, broken, and inactive)
        if (d.dot === "working") {
            status = "working";  // Machine is working
        } else if (d.dot === "broken" || d.is_broken === "true") {
            status = "broken";  // Machine is broken
        } else if (d.dot === "inactive") {
                status = "inactive";  // Machine is broken
        }

        //can grab any variables here but assign the status as a finished variable after the code sorts the correct label
        //grab the street and status to show in info box
        return {
            lat: lat,
            lng: lng,
            status: status,
            address: d.street,
            state: d.state,
            country: d.country
        };
    });

    //view the whole data array in the web pages console
    console.log(locations);

    //function to get radius based on zoom level
    //used this to attempt to help with data overlap from so many points and
    function getMarkerRadius(zoomLevel) {
        //base radius and scaling factor
        const baseRadius = 1;
        //factor the radius grows by based on zoom
        const scaleFactor = 1.5;
        //calculated new radius value
        return baseRadius * Math.pow(scaleFactor, zoomLevel - 3);
    }
    //picked a northern hemisphere biased view as the data we have is concentrated to USA germany and UK
    //get a focused global view
    const map = L.map('map').setView([50, -90], 3);
    //import leaflet
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //function to get color based on status
    function getColor(status) {
        if (status === "working") {
            return "green";
        } else if (status === "broken") {
            return "yellow";
        } else if (status === "inactive") {
            return "red";
        }
        return "gray"; //backup color just in case nothing matched would be the 'unknown' case
    }
    //my bar chart method that creates a visual for how many machines by state of country are down
    function updateBarChart(data, title) {
        //update the title
        d3.select("#chart-title").text(title);
        //looked online for the .groups method
        //similar to a python groupby it groups the specific data on status
        const statusCounts = d3.groups(data, d => d.status)
            //create a dictionary with the status and counts of each status label
            .map(([key, values]) => ({
                //key is the status label
                key: key,
                //count of total values per status in the array
                value: values.length
            }));
        //dimensions
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        //had no clue how to erase visual looked up this line to reset
        //stack overflow helped
        d3.select("#bar-chart").html('');

        const svg = d3.select("#bar-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleBand()
            .domain(statusCounts.map(d => d.key))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(statusCounts, d => d.value)])
            .nice()
            .range([height, 0]);
        //making the background white so the graph pops
        d3.select("#bar-chart").style("background-color", "black")
            .style("padding", "10px")
            .style("border-radius", "8px");

        svg.selectAll(".bar")
            .data(statusCounts)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", d => getColor(d.key));

        svg.append("g")
            .selectAll(".x-axis")
            .data([statusCounts])
            .enter().append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));
    }
    updateBarChart(locations, 'Total Global Machines Operational');

    //creating the marker for each mcdonals store
    //this method watches for two separte inputs from user a hover over to display the stores details
    //or a mouse click to look at the bar chart break down in detail of the state
    locations.forEach(loc => {
        const marker = L.circleMarker([loc.lng, loc.lat], {
            radius: getMarkerRadius(map.getZoom()),
            //uses color function to reflect machine status
            color: getColor(loc.status),
            fillOpacity: 0.8
        }).addTo(map);

        map.on('zoom', function() {
            marker.setRadius(getMarkerRadius(map.getZoom()));
        });

        //update bar chart on mouse click
        marker.on('click', function() {
            //create a new variable for filtered data
            //allows us to only look at specifics not the whole thing
            let filteredData;
            let title;
            //since there are nans in the state for everything outside of the us sort based on country first
            if (loc.country === 'USA') {
                //filter by state if the location is within the USA
                //have enough data for it to make sense
                filteredData = locations.filter(d => d.state === loc.state);
                //accesses the locations state and replaces the blank with the state name
                //uses the ` instead of ' to allow insert
                title = `Ice Cream Machine Status for ${loc.state}, USA`;
            } else {
                //filter by country if the location is outside the USA
                //less data
                filteredData = locations.filter(d => d.country === loc.country);
                //does the same for country to pass in the updated title
                title = `Ice Cream Machine Status for ${loc.country}`;
            }
            //calls method to update the chart with the specific data from user mouse click input
            updateBarChart(filteredData, title);
        });

        // Bind popup to marker on mouseover
        marker.on('mouseover', function() {
            marker.bindPopup(
                `<strong>Status:</strong> ${loc.status}<br><strong>Address:</strong> ${loc.address || 'No address available'}`
            ).openPopup();
        });

        // Optionally, you can also keep the popup open on mouseout or mouseleave if you want to control visibility
        marker.on('mouseout', function() {
            marker.closePopup();  // Close the popup when mouse leaves
        });
    });
    //make my legened for the color key
    const legend = L.control({ position: 'bottomright' });
    //using html to create an info box
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = "black";  // Add black background
        div.style.color = "white";  // Change text color to white
        div.style.padding = "10px";  // Add some padding
        div.innerHTML = `
            <h4>Ice Cream Machine Status</h4>
            <i style="background: green; width: 18px; height: 18px; display: inline-block;"></i> Working<br>
            <i style="background: yellow; width: 18px; height: 18px; display: inline-block;"></i> Broken<br>
            <i style="background: red; width: 18px; height: 18px; display: inline-block;"></i> Inactive<br>
            <i style="background: grey; width: 18px; height: 18px; display: inline-block;"></i> Unknown
        `;
        return div;
    };

    legend.addTo(map);
    //if my data failed to load i had a catch fot it
}).catch(error => console.error('Error loading the dataset:', error));
