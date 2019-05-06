// $(document).ready(function() {
//   $('[data-toggle="popover"]').popover({
//     'container': '#pf-timeline',
//     'placement': 'top'
//   });
// });

// $(document).on('click', '.drop', function () {$(this).popover('show'); });
//
// $(document).on('click', '.grid', function () {$('[data-toggle="popover"]').popover('hide');});

const ONE_MINUTE = 60 * 1000,
      ONE_HOUR = 60 * ONE_MINUTE,
      ONE_DAY = 24 * ONE_HOUR,
      ONE_WEEK = 7 * ONE_DAY,
      ONE_MONTH = 30 * ONE_DAY,
      SIX_MONTHS = 6 * ONE_MONTH;

function classifierFn(feature) {
  return feature.properties.leg % 2 === 0 ? 'even' : 'odd';
}

let data = {
  name: geojson.id,
  data: _.map(geojson.features, (f) => {
    return {
      date: new Date(f.properties.time),
      feature: f,
      classifier: classifierFn(f)  // used for eventColor config below
    }
  })
};
let start = data.data[0].date;
let end = _.last(data.data).date;

const goVertical = true; // toggle this to show vertical or horizontal timeline

const config = goVertical ? {
  parentSelector: '#timeline-container',
  lineHeight: 40, // actually width
  hasZoomSlider: false,
  vertical: true,
  width: 960, // actually height
  sliderWidth: 15,
  contextHeight: 40, // actually width
  labelExcludeCounts: true,
  zoomButtons: {
    left: 141,
    top: 815
  }
} : { // default config
  lineHeight: 80
};

var timeline = d3.chart.timeline(config)
  .end(end)
  .start(start)
  .minScale(ONE_WEEK / ONE_MONTH)
  .maxScale(ONE_WEEK / ONE_HOUR)
  .eventColor((e) => { // Note: if eventColor is null, eventLineColor is called
    return  e.classifier === 'even' ? '#0088CE' : '#ec7a08';
  })
  .eventShape((e) => {
    return '\u2759';
  })
  .eventClick(function(e) {
    var table = '<table class="table table-striped table-bordered">';
    // if(e.hasOwnProperty("events")) {
    //   table = table + '<thead>This is a group of ' + e.events.length + ' events starting on '+ e.date + '</thead><tbody>';
    //   table = table + '<tr><th>Date</th><th>Event</th><th>Object</th></tr>';
    //   for (var i = 0; i < e.events.length; i++) {
    //     table = table + '<tr><td>' + e.events[i].date + ' </td> ';
    //     for (var j in e.events[i].feature) {
    //       table = table +'<td> ' + e.events[i].feature[j] + ' </td> ';
    //     }
    //     table = table + '</tr>';
    //   }
    //   table = table + '</tbody>';
    // } else {
      table = table + 'Date: ' + e.date + '<br>';
      for (i in e.feature) {
        table = table + i.charAt(0).toUpperCase() + i.slice(1) + ': ' + JSON.stringify(e.feature[i]) + '<br>';
      }
    // }
    $('#legend').html(table);

  })
  .eventShiftClick((e, selection) => {
    console.log('e: ' + JSON.stringify(e));
    console.log('selection: ' + JSON.stringify(selection));
    if (selection) {
      console.log('count: ' + selection.length)
    }
  });
// if(countNames(data) <= 0) {
//   timeline.labelWidth(60);
// }


if (config.vertical) {
  $('#pf-timeline').addClass('vertical');
}
var element = d3.select('#pf-timeline').append('div').datum([data]);
timeline(element);

// $('#timeline-selectpicker').on('changed.bs.select', function(event, clickedIndex, newValue, oldValue) {
//   data[clickedIndex].display = !data[clickedIndex].display;
//   element.datum(data.filter(function(eventGroup) {
//     return eventGroup.display === true;
//   }));
//   timeline(element);
//   $('[data-toggle="popover"]').popover({
//     'container': '#pf-timeline',
//     'placement': 'top'
//   });
// });

$(window).on('resize', function() {
  timeline(element);
  // $('[data-toggle="popover"]').popover({
  //   'container': '#pf-timeline',
  //   'placement': 'top'
  // });
});


// $('#datepicker').datepicker({
//   autoclose: true,
//   todayBtn: "linked",
//   todayHighlight: true
// });
//
// $('#datepicker').datepicker('setDate', end);
//
// $('#datepicker').on('changeDate', zoomFilter);

// $( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
//   var $target = $( event.currentTarget );
//     $target.closest( '.dropdown' )
//       .find( '[data-bind="label"]' ).text( $target.text() )
//         .end()
//       .children( '.dropdown-toggle' ).dropdown( 'toggle' );
//
//     zoomFilter();
//
//     return false;
//   });

// function countNames(data) {
//   var count = 0;
//   for (var i = 0; i < data.length; i++) {
//     if (data[i].name !== undefined && data[i].name !=='') {
//       count++;
//     }
//   }
//   return count;
// }

function zoomFilter() {
  var range = $('#range-dropdown').find('[data-bind="label"]' ).text(),
      position = $('#position-dropdown').find('[data-bind="label"]' ).text(),
      date = $('#datepicker').datepicker('getDate'),
      startDate,
      endDate;

  switch (range) {
    case '1 hour':
      range = ONE_HOUR;
      break;

    case '1 day':
      range = ONE_DAY;
      break;

    case '1 week':
      range = ONE_WEEK;
      break;

    case '1 month':
      range = ONE_MONTH;
      break;
  }
  switch (position) {
    case 'centered on':
      startDate = new Date(date.getTime() - range/2);
      endDate = new Date(date.getTime() + range/2);
      break;

    case 'starting':
      startDate = date;
      endDate = new Date(date.getTime() + range);
      break;

    case 'ending':
      startDate =  new Date(date.getTime() - range);
      endDate = date;
      break;
  }
  timeline.Zoom.zoomFilter(startDate, endDate);
}

$('#reset-button').click(function() {
  timeline(element);
  $('[data-toggle="popover"]').popover({
    'container': '#pf-timeline',
    'placement': 'top'
  });
});
