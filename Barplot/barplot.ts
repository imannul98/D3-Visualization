import * as d3 from 'd3'
import { init, getScales } from './utils'

const url = '../countries.csv'

const table = d3.select("table")
const svg = init() 

import { MARGIN, INNER_WIDTH, INNER_HEIGHT } from './utils';

let button = document.createElement('button');
button.textContent = "Back";
button.style.position = "absolute"; 
button.style.top = "10px"; 
button.style.left = "10px";
button.addEventListener('click', () => {
    history.back();
});
document.body.appendChild(button);

interface CountryData {
    Country: string
    Region: string
    Year: number
    BirthRate: number
    DeathRate: number
    FertilityRate: number
    LifeExpectancyFemale: number
    LifeExpectancyMale: number
    LifeExpectancyTotal: number
    PopulationGrowth: number
    PopulationTotal: number
    MobileCellularSubscriptions: number
    MobileCellularSubscriptionsPerHundred: number
    TelephoneLines: number
    TelephoneLinesPerHundred: number
    AgriculturalLand: number
    AgriculturalLandPercent: number
    ArableLand: number
    ArableLandPercent: number
    LandArea: number
    RuralPopulation: number
    RuralPopulationGrowth: number
    SurfaceArea: number
    PopulationDensity: number
    UrbanPopulationPercent: number
    UrbanPopulationPercentGrowth: number
}


d3
    .csv(url, row => ({
        ...d3.autoType(row)
    }))
    .then(data => {
        const filteredData = data.filter(d => d.Year === 2013);
        const avgTelephoneLinesPerYear = d3.rollups(
            data,
            v => d3.mean(v, d => d.TelephoneLines),
            d => d.Year,
            d => d.Region
        );
        const stackedData = [];
        avgTelephoneLinesPerYear.forEach(([Year, values]) => {
            const yearData = { Year: +Year };
            values.forEach(([Region, avgTelephoneLines]) => {
                yearData[Region] = avgTelephoneLines;
            });
            stackedData.push(yearData);
        });
        const regions = Array.from(new Set(data.map(d => d.Region)));
        console.log(data)

        const year_extent = d3.extent(data, d => d.Year) as [number, number]
        const telephone_extent =  [0, 20000000] as [number,number]
        console.log(telephone_extent)
        const { xScale, yScale } = getScales(year_extent, telephone_extent)

        const x = d3.scaleBand()
            .domain(data.map(d => d.Year))
            .range([0, INNER_WIDTH])
            .padding(0.1);

        const color = d3.scaleOrdinal()
            .domain(regions)
            .range(d3.schemeCategory10);

        const series = d3.stack()
            .keys(regions)
            (stackedData);

        console.log(INNER_WIDTH-MARGIN.RIGHT)

        svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", d => x(d.data.Year))
            .attr("y", d => yScale(d[1]))
            .attr("height", d => yScale(d[0]) - yScale(d[1]))
            .attr("width", x.bandwidth());

        svg.append("text")
            .attr("x", INNER_WIDTH / 2)
            .attr("y", MARGIN.TOP-40)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Average Telephone Lines in Europe & South America 1980-2013");

        const legend = svg.append("g")
            .attr("transform", `translate(${INNER_WIDTH - MARGIN.RIGHT -80}, ${MARGIN.TOP})`)
            .selectAll("g")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", color);

        legend.append("text")
            .attr("x", 22)
            .attr("y", 13)
            .text(d => d);

        const avgTelephoneLinesTotalPerYear = d3.rollups(
            data,
            v => d3.mean(v, d => d.TelephoneLines),
            d => d.Year
        );
        console.log(avgTelephoneLinesTotalPerYear)
        const line = d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
            
        svg.append("path")
            .datum(avgTelephoneLinesTotalPerYear)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    const lastDataPoint = avgTelephoneLinesTotalPerYear[avgTelephoneLinesTotalPerYear.length - 1];

    svg.append("text")
        .attr("x", xScale(lastDataPoint[0]))  
        .attr("y", yScale(lastDataPoint[1]))  
        .text("Overall Mean")
        .attr("dy", "-1em")
        .attr("dx","-7em")
        .style("font-weight","bold")  
        .attr("text-anchor", "start");  
})