function drawScatterPlot(dataset) {
  var margin = {top: 50, right: 50, bottom: 50, left: 50 },
      width = 800,
      height = 400
  
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var yearDate = dataset.map(item => new Date(item.Year))
  
  var xScale = d3.scaleLinear()
              .domain([d3.min(dataset, d => d.Year) - 1, d3.max(dataset, d => d.Year) + 1])
              .range([0, width])
  
  dataset.forEach(function(d) {
                  var parsedTime = d.Time.split(':');
                  d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);})
  
  var yScale = d3.scaleTime()
              .domain(d3.extent(dataset, (d) => d.Time ))
              .range([0, height])
  
  var timeFormat = d3.timeFormat('%M:%S')
  
  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
  var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)
  
  var svg = d3.select('#graph')
            .append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')' )
  
  var tooltip = d3.select('#graph')
                  .append('div')
                  .attr('id','tooltip')
                  .attr('class', 'tooltip')
                  .style('opacity', 0)
  
  function mouseoverHandler(d,i) {
   tooltip.style('opacity', 0.8).attr('data-year', d.Year)
   tooltip.style('left' , d3.event.pageX + 10 + 'px')
          .style('top' , (d3.event.pageY + 15) + 'px') 
          .html('<p> Year: ' + d.Year + '</p>'
              + '<p> Time: ' + timeFormat(d.Time) + '</p>')
    d3.select(this).style('opacity', 0)
  }

  function mouseoutHandler() {
      tooltip.style('opacity', 0)
      d3.select(this).style('opacity', 1)
  }

  function mouseMoving () {
      d3.select(this).style('opacity', 1)
  }
  
  svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .attr('id', 'x-axis')
  
  svg.append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
  
  svg.selectAll('.dot')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(d.Time))
      .attr('r', 6)
      .style("fill", (d) => color(d.Doping != "") )
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => d.Time)
      .on('mouseover', mouseoverHandler)
      .on("mousemove", mouseMoving)
      .on("mouseout", mouseoutHandler)
  
  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + (height/2 - i * 20) + ")";
    });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      if (d) return "Riders with doping allegations";
      else {
        return "No doping allegations";
      };
    });
  
} //end of drawScatterPlot function 

var url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

d3.json(url).then(function(data) {
    drawScatterPlot(data)
}).catch(function(error) {
    console.log(error)
})