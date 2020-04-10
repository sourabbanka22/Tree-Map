
const container = d3.select("#main");

container
  .append("h1")
  .attr("id", "title")
  .text("Visualizing Data with Tree Map")
  .append("h6")
  .attr("id", "description")
  .text("Movie Sales");

const screenTip = container.append("div")
                         .attr("id", "tooltip");

screenTip.append("p")
       .attr("class", "movieName");

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const boxSize = {
  upper: 20,
  lower:20,
  right: 20,
  left: 20
}

const width = 850 - boxSize.left - boxSize.right;
const height = 400 - boxSize.upper - boxSize.lower;

const svgContainer = container
  .append("svg")
  .attr("viewBox", `0 0 ${width + boxSize.left + boxSize.right} ${height + boxSize.upper + boxSize.lower}`);

const svg = svgContainer
  .append("g")
  .attr("transform", `translate(${boxSize.left}, ${boxSize.upper})`);


const movieUrl = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";

const request = new XMLHttpRequest();
request.open("GET", movieUrl, true);
request.send();

request.onload = function() {
    let json = JSON.parse(request.responseText);
    createTreeMap(json);


function createTreeMap(data){

  let hierarchy = d3.hierarchy(data);
  hierarchy.sum((d) => d.value);

  const treeMap = d3.treemap();
  const treeMapLayout = treeMap(hierarchy);

  let movies = [];
  for(let i = 0; i < treeMapLayout.children.length; i++) {
    for(let j = 0; j < treeMapLayout.children[i].children.length; j++) {
      movies.push(treeMapLayout.children[i].children[j]);
    }
  }

  svg
    .selectAll("rect")
    .data(movies)
    .enter()
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d, i) => d.data.name)
    .attr("data-category", (d, i) => d.data.category)
    .attr("data-value", (d, i) => d.data.value)
    .on("mouseenter", (d, i) => {
      screenTip
        .style("opacity", 1)
        .attr("data-value", () => d.data.value)
        .style("left", `${d3.event.layerX + 5}px`)
        .style("top", `${d3.event.layerY + 5}px`);
      screenTip
        .select("p.movieName")
        .text(() => d.data.name);
    })
    .on("mouseout", () => screenTip.style("opacity", 0)).attr("width", (d, i) => (d.x1 - d.x0) * width)
    .attr("height", (d, i) => (d.y1 - d.y0) * height)
    .attr("x", (d, i) => d.x0 * width)
    .attr("y", (d, i) => d.y0 * height+40)
    .attr("fill", (d, i) => colorScale(d.data.category));


  let movieCategory = movies.map((movie) => movie.data.category);
  let movieCategories = movieCategory.filter((category, i) => {
    if (movieCategory.slice(0, i).indexOf(category) === -1) {
      return category;
    }
  });
  
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${0}, ${0})`);

  legend
    .selectAll("rect")
    .data(movieCategories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", 40)
    .attr("height", 20)
    .attr("x", (d, i) => width-7*50+ i*50)
    .attr("y", 0)
    .attr("fill", (d, i) => colorScale(d))
    .attr("opacity", 0.7);

  legend
    .selectAll("text")
    .data(movieCategories)
    .enter()
    .append("text")
    .attr("x", (d, i) => width-7*50 + i*50)
    .attr("font-size", "0.5rem")
    .attr("y", 30)
    .text((d, i) => d);

}
}