import d3 from 'd3';

export default (svg, scales, dimensions, configuration, data) => {

  const contextContainer = svg.append("g")
    .classed('timeline-pf-context', true)
    .attr('width', dimensions.width)
    .attr('height', dimensions.ctxHeight)
    .attr('clip-path', 'url(#timeline-pf-context-brush-clipper)')
    .attr("transform", `translate(${configuration.padding.left + configuration.labelWidth},${configuration.padding.top + dimensions.height + 40})`);

  // let roundTo = 1; // 1ms     //3600000;//one hour
  let barWidth = 1; // Math.ceil((roundTo / (scales.ctx.domain()[1] - scales.ctx.domain()[0])) * dimensions.width);

  let counts = countEvents(data);
  counts.sort((a,b) => {
    if(a.date < b.date) {
        return -1;
    }
    if(a.date > b.date) {
      return 1;
    }
    return 0;
  });
  scales.cty.domain([0, d3.max(counts, (d) => {return d.count;})]);

  contextContainer.selectAll(".timeline-pf-bar")
        .data(counts)
        .enter().append("rect")
          .attr("class", "timeline-pf-bar")
          .attr("x", d => {return scales.ctx(d.date); })
          .attr("y", d => {return scales.cty(d.count); })
          .attr("width", barWidth)
          .attr("height", d => { return dimensions.ctxHeight - scales.cty(d.count); });

  contextContainer.append("g")
    .attr("class", "timeline-pf-brush");

  if (configuration.vertical) {
    const tx = -160; // correct values change with lineHeight, contextHeight and ??? #TODO calculate them correctly
    const ty = 135; //  these values assume lineHeight and contextHeight are both 40
    d3.select('.timeline-pf-labels').attr('transform', `rotate(-90) translate(${tx}, ${ty})`);
  }

};

// neuter counts logic so that every point is single: no grouping or stacking (original logic is below for reference)
function countEvents(data) {
  // Assumes just one timeline chart. If we want more fix here.
  return _.map(data[0].data, d => {
    return { date: d.date, count: 1}
  })
}

// function countEvents(data, toRoundTo, counts) {
//   let temp = {};
//   for(let i in data) {
//     for (let j in data[i].data) {
//       let rounded = Math.floor(data[i].data[j].date / toRoundTo) * toRoundTo;
//       temp[rounded] = temp[rounded] + 1 || 1;
//     }
//   }
//   for(let k in temp) {
//     let tempDate = new Date();
//     tempDate.setTime(+k);
//     counts.push({'date': tempDate, 'count': temp[k]});
//   }
// };
