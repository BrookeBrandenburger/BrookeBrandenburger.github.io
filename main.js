var NHANES = null;

const data = d3.dsv(",", "NHANES.imp.csv", (d) => {
    return {
        Education: d.Education,
        Education_imp: +d.Education_imp,
        Poverty: +d.Poverty,
        Poverty_imp: +d.Poverty_imp,
        HardDrugs: d.HardDrugs,
        HardDrugs_imp: +d.HardDrugs_imp
    };
}).then((res,err)=>{
    //console.log(err);
    NHANES = res;

    console.log(NHANES);

    //make viz here (observable code here)
    const width  = 1000;
    const height = 1610;
    const margin = 40;
    //make axis now up here? need to already have data
    const xScale = d3.scaleBand().domain(["8thGrade","9_11thGrade", "HighSchool", "SomeCollege", "CollegeGrad"]).range([margin,width-margin]).padding(1);
    const yScale = d3.scaleLinear().domain([-0.1, 5]).range([height-margin, margin]);

    var tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("z-index", "10")
        .attr("class", "tooltip")
        .style("background-color", "#ffffff")
        .style("border", "solid")
        .style("border-width", "3px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    var toolmouseover = function(e, d) {
        let impMessage = "";

        if (d.Education_imp == 1) {
            impMessage += "<br> Edu Imp";
        }
        if (d.Poverty_imp == 1) {
            impMessage += "<br> Pov Imp";
        }
        if (d.HardDrugs_imp == 1) {
            impMessage += "<br> Drugs Imp";
        }
        if (impMessage == "") {
            impMessage = "<br> No imputation";
        }
        tooltip.style("opacity", 1)
            .html("Education: " + d.Education + "<br>Poverty Index: " + d.Poverty + "<br>Hard Drugs? " + d.HardDrugs + impMessage)
            .style("left", (d3.pointer(e)[0]+30) + "px")
            .style("top", (d3.pointer(e)[1]) + "px");
    };

    var toolmouseoff = function(e, d) {
        tooltip.style("opacity", 0)
    }

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .selectAll("circle")
        .data(NHANES) //bind data
        .enter() //go into the data and append to each point what is below
        .call(g => g.append("text")
            .attr("x", function(d,i) { return xScale(d.Education); })
            .attr("y", function(d,i) { return yScale(d.Poverty); })
            .attr("fill", "#ffa2a2")
            .attr("text-anchor", "start"))
        .append("circle") //create a circle with below specifications
        .attr("cx", function(d,i) { return xScale(d.Education); })
        .attr("cy", function(d,i) { return yScale(d.Poverty); })
        .attr("r", function(d,i) { if (d.HardDrugs == "Yes"){return "10"} else {return "5"}})
        .attr("fill", function(d, i) {
            if (d.Education_imp == 1) {
                return "#3e8173";
            } else if (d.Poverty_imp == 1) {
                return "#3e4481";
            } else if (d.HardDrugs_imp == 1) {
                return "#5c3e81";
            } else {
                return "rgb(148,125,179)";
            }
        })
        .style("z-index", "1")

        .on("mouseover", function(e, d) {
            d3.select(this).attr("fill","#ff8888")
                .attr("r", "5").style("z-index", "3")
            toolmouseover(e,d)
        })

        .on("mouseout", function (e, d) {
            d3.select(this).attr("fill", function(d, i) {
                if (d.Education_imp == 1) {
                    return "#3e8173";
                } else if (d.Poverty_imp == 1) {
                    return "#3e4481";
                } else if (d.HardDrugs_imp == 1) {
                    return "#5c3e81";
                } else {
                    return "rgb(148,125,179)";
                }
            })
                .style("z-index", "1")
                .attr("r", function(d,i) { if (d.HardDrugs == "Yes"){return "10"} else {return "5"}})
            toolmouseoff(e,d)
        });

    const ax = svg.append("g")
        .attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(xScale));
    const ay = svg.append("g")
        .attr("transform", `translate(30,0)`)
        .call(d3.axisLeft(yScale).tickValues(d3.range(-1, 5.25, 0.25)));
})