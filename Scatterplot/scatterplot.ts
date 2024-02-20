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
    .csv(url, row => <Country>({
        ...d3.autoType(row)
    }))
    .then(data => {
        const filteredData = data.filter(d => d.Year === 2013);
        const map = d3.rollups(
            filteredData,
            v => ({
                count: v.length,
                avgBirthRate: d3.mean(v, d => d.BirthRate),
        avgDeathRate: d3.mean(v, d => d.DeathRate)
            }),
            d => d.Region
        )
        console.log(map)

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)


        const BirthRate_extent = d3.extent(filteredData, d => d.BirthRate) as [number, number]
        const DeathRate_extent = d3.extent(filteredData, d => d.DeathRate) as [number, number]

        const { xScale, yScale } = getScales(BirthRate_extent, DeathRate_extent)
        const maxX = d3.max(filteredData, d => xScale(d.BirthRate));
        const maxY = d3.max(filteredData, d => yScale(d.DeathRate));

        const meanBirthRate = d3.mean(filteredData, d => d.BirthRate);
        const medianBirthRate = d3.median(filteredData, d => d.BirthRate);
        const meanDeathRate = d3.mean(filteredData, d => d.DeathRate);
        const medianDeathRate = d3.median(filteredData, d => d.DeathRate);

        // Append the svg object to the body of the page

        svg.selectAll("circle")
            .data(filteredData)
            .join("circle")
            .attr("cx", d => xScale(d.BirthRate))
            .attr("cy", d => yScale(d.DeathRate))
            .attr("r", 4)
            .attr("fill", d => colorScale(d.Region))
            .attr("opacity", 0.8)
            .append("title")
            .text(d => `${d.Make} ${d.Model}`)

        svg.append("line")
            .attr("x1", xScale(meanBirthRate))
            .attr("y1", 0)
            .attr("x2", xScale(meanBirthRate))
            .attr("y2", maxY)
            .attr("stroke", "blue")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width",2);

        const meanBirthRatetext = `Mean Birth Rate: ${meanBirthRate}`
        svg.append("text")
            .attr("x", xScale(meanBirthRate)+75)  
            .attr("y", 120)  
            .text(meanBirthRatetext)
            .attr("dy", "1.5em")
            .attr("dx","-7em")
            .style("font-weight","bold")
            .attr("fill", "blue"); 

        svg.append("line")
            .attr("x1", xScale(medianBirthRate))
            .attr("y1", 0)
            .attr("x2", xScale(medianBirthRate))
            .attr("y2", maxY)
            .attr("stroke", "green")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width",2);

        const medianBirthRatetext = `Median Birth Rate: ${medianBirthRate}`
        svg.append("text")
            .attr("x", xScale(medianBirthRate)-60)  
            .attr("y", 100)  
            .text(medianBirthRatetext)
            .attr("dy", "1.5em")
            .attr("dx","-7em")
            .style("font-weight","bold")
            .attr("fill", "green"); 

        svg.append("line")
            .attr("x1", 0)
            .attr("y1", yScale(meanDeathRate))
            .attr("x2", maxX)
            .attr("y2", yScale(meanDeathRate))
            .attr("stroke", "darkred")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width",2);
            
        const meanDeathRatetext = `Mean Death Rate: ${meanDeathRate}`
        svg.append("text")
            .attr("x", 500)  
            .attr("y", yScale(meanDeathRate))  
            .text(meanDeathRatetext)
            .attr("dy", "1.5em")
            .attr("dx","-7em")
            .style("font-weight","bold")
            .attr("fill", "darkred"); 

        svg.append("line")
            .attr("x1", 0)
            .attr("y1", yScale(medianDeathRate))
            .attr("x2", maxX)
            .attr("y2", yScale(medianDeathRate))
            .attr("stroke", "red")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width",2);

        const medianDeathRatetext = `Median Death Rate: ${medianDeathRate}`
        svg.append("text")
            .attr("x", 500)  
            .attr("y", yScale(medianDeathRate))  
            .text(medianDeathRatetext)
            .attr("dy", "-1em")
            .attr("dx","-7em")
            .style("font-weight","bold")
            .attr("fill", "red"); 
        
        const legend = svg.append("g")
            .attr("transform", `translate(${INNER_WIDTH - MARGIN.RIGHT -80}, ${MARGIN.TOP})`)
            .selectAll("g")
            .data(colorScale.domain())
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", colorScale);

        legend.append("text")
            .attr("x", 22)
            .attr("y", 13)
            .text(d => d);

        svg.append("text")
            .attr("transform", `translate(${INNER_WIDTH / 2}, ${INNER_HEIGHT + MARGIN.TOP + 20})`)
            .style("text-anchor", "middle")
            .text("Birth Rate");
        
        svg.append("text")
            .attr("transform", "rotate(-90)") 
            .attr("y", 0 - 2*MARGIN.LEFT) 
            .attr("x", 0 - (INNER_HEIGHT/2)) 
            .attr("dy", "1em") 
            .style("text-anchor", "middle") 
            .text("Death Rate");

        svg.append("text")
            .attr("x", INNER_WIDTH / 2)
            .attr("y", MARGIN.TOP-40)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Birth Rate vs. Death Rate in Europe vs. South America in 2013");
    })