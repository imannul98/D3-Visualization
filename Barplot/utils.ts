import * as d3 from 'd3'
import './style.css'

const MARGIN = { TOP: 20, RIGHT: 20, BOTTOM: 20, LEFT: 20 },
    PADDING = { TOP: 60, RIGHT: 60, BOTTOM: 60, LEFT: 60 },
    WIDTH = 960,
    HEIGHT = 500,
    OUTER_WIDTH = WIDTH - MARGIN.LEFT - MARGIN.RIGHT,
    OUTER_HEIGHT = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM,
    INNER_WIDTH = OUTER_WIDTH - PADDING.LEFT - PADDING.RIGHT,
    INNER_HEIGHT = OUTER_HEIGHT - PADDING.TOP - PADDING.BOTTOM



type SvgGroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>
type SvgRectSelection = d3.Selection<SVGRectElement, unknown, HTMLElement, any>

let outer_g: SvgGroupSelection,
    rect: SvgRectSelection,
    inner_g: SvgGroupSelection

export function init() {
    outer_g = d3
        .select("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .append("g")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

    rect = outer_g.append("rect")
        .attr("class", "outer")
        .attr("width", OUTER_WIDTH)
        .attr("height", OUTER_HEIGHT)

    inner_g = outer_g.append("g")
        .attr("transform", `translate(${PADDING.LEFT}, ${PADDING.TOP})`)

    inner_g.append("rect")
        .attr("class", "inner")
        .attr("width", INNER_WIDTH)
        .attr("height", INNER_HEIGHT)

    return inner_g
}

export function getScales(mpgExtent: [number, number], hpExtent: [number, number]) {
    
    const xScale = d3.scaleTime()
        .domain(mpgExtent)
        .range([0, INNER_WIDTH])

    const yScale = d3.scaleLinear()
        .domain(hpExtent)
        .range([INNER_HEIGHT, 0])

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale)

    inner_g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${INNER_HEIGHT})`)
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    inner_g.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    return { xScale, yScale }
}
export { MARGIN, INNER_WIDTH, INNER_HEIGHT };