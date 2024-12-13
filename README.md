# Can Brooke and Jangael Get a McFlurry Today? 
## Created by Brooke & Jangael for the COM349 Final

This website is inspiration from the original [McBroken.com](https://mcbroken.com/) website, that visualizes all of the active and inactive ice cream machines at McDonalds locations at the United States and in Europe.

# Data Highlights:
* About 16,000 McDonald's locations analyzed
* No duplicate rows in the dataset --> all unique McDonald's locations
* Missing 'state' and 'city' fields for non-US locations
* Did not drop or impute just replaced city/state tag with country
* Ice Cream Machine Status categories: working, broken, inactive, unknown
* 'Unknown' status was created in to visually mark the unexpected machine status'
* This was not really used more of a just in case
* No imputation for missing values--> handled differently

# Code Insights:
* Used D3.js to process and visualize data
* Can visualize the odds by area of machines down
* Interactive map and bar chart for detailed breakdown
* Map shows all McDonald Locations and their Machine status. The viewbox is set to show both the United States and Europe.
* Bar Chart shows the global counts of machine availability
* Colors of Red and Yellow are used to reflect with McDonalds branding, but choose green to showcase activeness of ice cream machines. These colors easily contrast each other in color theory.
* Legand Box that identifies Ice Cream Machine Status categories and colors associated. 

## Availabile Interactions:
* Standard Zoom in 
* Hover Over Machines on Map to get store details, such as status, location, and state.
* Click on a Map Point to get the localized details. When you click on a location, the bar chart showcases Mcdonald ice cream machines' statuses in the area. 
* Shows the state if in the US or Countries Machine availability -- ex. when you click on a location in California, the graph changes to showcase data of all California McDonalds locations and their statuses.
* When you double click on a location, you get to zoom closer. 
