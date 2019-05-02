export default (svg, scales, configuration) => function dropsSelector(data) {
  const dropLines = svg.selectAll('.timeline-pf-drop-line').data(data);

  dropLines.enter()
    .append('g')
    .classed('timeline-pf-drop-line', true)
    .attr('transform', (d, idx) => `translate(0, ${scales.y(idx) + (configuration.lineHeight/2)})`)
    .attr('fill', configuration.eventLineColor);

  dropLines.each(function dropLineDraw(drop) {

    const drops = d3.select(this).selectAll('.timeline-pf-drop').data(drop.data);

    drops.attr('transform', (d) => `translate(${scales.x(d.date)})`);

    const shape = drops.enter()
        .append('text')
          .classed('timeline-pf-drop', true)
          // .classed('timeline-pf-event-group', (d) => {return d.hasOwnProperty("events") ? true : false})
          .attr('transform', (d) => `translate(${scales.x(d.date)})`)
          .attr('fill', configuration.eventColor)
          .attr('text-anchor', 'middle')
          // .attr('data-toggle', 'popover')
          .attr('data-html', 'true')
          // .attr('data-content', configuration.eventPopover)
          .attr('dominant-baseline', 'central')
          .text(configuration.eventShape);

    let lastShiftSelectedIdx = null;
    let isMultiSelecting = false;

    if (configuration.eventClick) {
      shape.on('click', function(d, selectedIdx) {
        console.log('clicked: ' + selectedIdx);
        if (configuration.eventShiftClick && d3.event.shiftKey) {
          if (isMultiSelecting) {
            // we've made a multiselection.
            const low = Math.min(selectedIdx, lastShiftSelectedIdx);
            const high = Math.max(selectedIdx, lastShiftSelectedIdx);
            const selection = [];
            // Remove any previous selection
            d3.selectAll('.timeline-pf-drop').classed('selected', false);
            d3.selectAll('.timeline-pf-drop').filter((d, i) => {
              let include = low <= i  && i <= high;
              if (include) {
                selection.push(d);
              }
              return include;
            }).classed('selected', true);
            configuration.eventShiftClick(d, selection);
            isMultiSelecting = false;
          } else {
            isMultiSelecting = true;
            configuration.eventShiftClick(d);
          }
          lastShiftSelectedIdx = selectedIdx;
        } else { // not a shift-click, just a click
          isMultiSelecting = false;
          d3.selectAll('.timeline-pf-drop').classed('selected', false);
          configuration.eventClick(d)
        }
      });
    }

    if (configuration.eventHover) {
      shape.on('mouseover', configuration.eventHover);
    }

    // unregister previous event handlers to prevent from memory leaks
    drops.exit()
      .on('click', null)
      .on('mouseover', null);

    drops.exit().remove();
  });

  dropLines.exit().remove();
};
