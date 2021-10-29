d3.csv("driving.csv", d3.autoType).then((data) => {
  const margin = { top: 20, left: 50, right: 20, bottom: 20 };
  const totalWidth = 640;
  const totalHeight = 400;
  const width = totalWidth - margin.left - margin.right,
    height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xAxisGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`);

  const yAxisGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`);

  const textGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`);

  const circleGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`);

  const xScale = d3
    .scaleLinear()
    .domain([3500, d3.max(data, (d) => d.miles) + 500])
    .range([0, width])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([1.2, d3.max(data, (d) => d.gas)])
    .range([height, 0])
    .nice();

  var dollarFormat = function (d) {
    return "$" + d3.format(".3s")(d);
  };

  const xAxis = d3.axisBottom(xScale).ticks(width / 80);
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(height / 50)
    .tickFormat(dollarFormat);

  xAxisGroup
    .append("g")
    .attr("class", "x-axis")
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`);

  yAxisGroup.append("g").attr("class", "y-axis").call(yAxis);

  svg
    .append("text")
    .attr("x", 60)
    .attr("y", 25)
    .text("Cost per gallon")
    .call(halo);

  svg
    .append("text")
    .attr("x", 555)
    .attr("y", 380)
    .text("Miles Driven")
    .call(halo);

  circleGroup
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return xScale(d.miles);
    })
    .attr("cy", (d) => {
      return yScale(d.gas);
    })
    .attr("r", 3)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  textGroup
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text((d) => {
      return d.year;
    })
    .attr("x", (d) => {
      return xScale(d.miles);
    })
    .attr("y", (d) => {
      return yScale(d.gas);
    })
    .each(position)
    .call(halo);

  function position(d) {
    const t = d3.select(this);
    switch (d.side) {
      case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
      case "right":
        t.attr("dx", "0.5em").attr("dy", "0.32em").attr("text-anchor", "start");
        break;
      case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
      case "left":
        t.attr("dx", "-0.5em").attr("dy", "0.32em").attr("text-anchor", "end");
        break;
    }
  }

  function halo(text) {
    text
      .select(function () {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
  }

  xAxisGroup.selectAll(".domain").remove();
  yAxisGroup.selectAll(".domain").remove();

  xAxisGroup
    .selectAll(".tick line")
    .clone()
    .attr("y2", -height)
    .attr("stroke-opacity", 0.1); // make it transparent

  yAxisGroup
    .selectAll(".tick line")
    .clone()
    .attr("x2", width)
    .attr("stroke-opacity", 0.1); // make it transparent

  const line = d3
    .line()
    .curve(d3.curveCatmullRom)
    .x((d) => {
      return xScale(d.miles) + margin.left;
    })
    .y((d) => {
      return yScale(d.gas) + margin.top;
    });

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "black")
    .attr("d", line);
});
