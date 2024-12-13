# Can Brooke and Jangael Get a McFlurry Today? 
## Created by Brooke & Jangael for the COM349 Final

This website is inspiration from the original [McBroken.com](https://mcbroken.com/) website, that visualizes all of the active and inactive ice cream machines in McDonalds

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
* Map shows all McDonald Locations and their Machine status
* Bar Chart shows the global counts of machine availability

## Availabile Interactions:
* Hover Over Machines on Map to get store details!
* Click on a Map Point to get the localized details!
* Shows the state if in the US or Countries Machine availability
