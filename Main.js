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
            address: d.street
        };
    });

    //view the whole data array in the web pages console
    console.log(locations);


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

    //add markers to the map at mcdonalds locations showing status
    locations.forEach(loc => {
        const marker = L.circleMarker([loc.lng, loc.lat], {
            radius: 2,
            color: getColor(loc.status),
            fillOpacity: 0.8
        }).addTo(map);

        //on mouse click open the popup containing the status and address
        //has catch for address as I struggled to get that loaded perfectly
        marker.bindPopup(
            `<strong>Status:</strong> ${loc.status}<br><strong>Address:</strong> ${loc.address || 'No address available'}`)
    });
    //make my legened for the color key
    const legend = L.control({ position: 'bottomright' });
    //using html to create an info box
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
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
