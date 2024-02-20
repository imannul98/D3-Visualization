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
        const europedata = data.filter(d => d.Region === "Europe");
        const SouthAmericadata = data.filter(d => d.Region === "SouthAmerica");
        const LifeexpectancymaleEurope = d3.rollups(
            europedata,
            v => d3.mean(v, d => d.LifeExpectancyMale),
            d => d.Year
        );
        const LifeexpectancyfemaleEurope = d3.rollups(
            europedata,
            v => d3.mean(v, d => d.LifeExpectancyFemale),
            d => d.Year
        );

        const LifeexpectancymaleSA = d3.rollups(
            SouthAmericadata,
            v => d3.mean(v, d => d.LifeExpectancyMale),
            d => d.Year
        );
        const LifeexpectancyfemaleSA = d3.rollups(
            SouthAmericadata,
            v => d3.mean(v, d => d.LifeExpectancyFemale),
            d => d.Year
        );
        const x = d3.scaleBand()
            .domain(data.map(d => d.Year))
            .range([0, INNER_WIDTH - MARGIN.RIGHT])
            .padding(0.1);

        const year_extent = d3.extent(data, d => d.Year) as [number, number];
        const LifeExpectancy=[60,86] as [number,number];

        const { xScale, yScale } = getScales(year_extent, LifeExpectancy);

        const line = d3.line().x(d => xScale(d[0])).y(d => yScale(d[1]));


        svg.append("path")
            .datum(LifeexpectancymaleEurope)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", line(LifeexpectancymaleEurope));

        svg.append("path")
            .datum(LifeexpectancyfemaleEurope)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        svg.append("path")
            .datum(LifeexpectancymaleSA)
            .attr("fill", "none")
            .attr("stroke", "darkred")
            .attr("stroke-width", 1.5)
            .attr("d", line);    
    
        svg.append("path")
            .datum(LifeexpectancyfemaleSA)
            .attr("fill", "none")
            .attr("stroke", "darkblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    
        const maleeuropelegend = LifeexpectancymaleEurope[LifeexpectancymaleEurope.length - 1];
        const femaleeuropelegend = LifeexpectancyfemaleEurope[LifeexpectancyfemaleEurope.length - 1];
        const femalesalegend = LifeexpectancyfemaleSA[LifeexpectancyfemaleSA.length - 1];
        const maleesalegend = LifeexpectancymaleSA[LifeexpectancymaleSA.length - 1];

        svg.append("text")
            .attr("x", xScale(maleeuropelegend[0]))  
            .attr("y", yScale(maleeuropelegend[1]))  
            .text("European Male")
            .attr("dy", "2.5em")
            .attr("dx","-8em")
            .attr("fill","red")
            .style("font-weight","bold")  
            .attr("text-anchor", "start");  
    
        svg.append("text")
            .attr("x", xScale(femaleeuropelegend[0]))  
            .attr("y", yScale(femaleeuropelegend[1]))  
            .text("European Female")
            .attr("dy", "-0.5em")
            .attr("dx","-9em")
            .attr("fill","blue")
            .style("font-weight","bold")  
            .attr("text-anchor", "start"); 
        
        svg.append("text")
            .attr("x", xScale(femalesalegend[0]))  
            .attr("y", yScale(femalesalegend[1]))  
            .text("South American Female")
            .attr("dy", "-0.5em")
            .attr("dx","-13em")
            .attr("fill","darkblue")
            .style("font-weight","bold")  
            .attr("text-anchor", "start"); 

        svg.append("text")
            .attr("x", xScale(maleesalegend[0]))  
            .attr("y", yScale(maleesalegend[1]))  
            .text("South American Male")
            .attr("dy", "-0.5em")
            .attr("dx","-13em")
            .attr("fill","darkred")
            .style("font-weight","bold")  
            .attr("text-anchor", "start"); 

        const lifeexpectancyall = d3.rollups(
            data,
            v => d3.mean(v, d => d.LifeExpectancyTotal),
            d => d.Year
        );

        svg.append("path")
            .datum(lifeexpectancyall)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "5,5")
            .attr("stroke","green")
            .attr("d", line);

        svg.append("text")
            .attr("x", 180)
            .attr("y", 170)
            .text("Mean Total")
            .attr("fill","green")
            .style("font-weight","bold")
            .attr("text-anchor", "start");
        
        
        svg.append("text")
            .attr("x", INNER_WIDTH / 2)
            .attr("y", MARGIN.TOP-40)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Male vs. Female Life Expectancy in Europe & South America");
});