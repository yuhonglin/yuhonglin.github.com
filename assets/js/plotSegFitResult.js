
// The format of ```data``` structure:
// {
//     'data': [{'x':1, 'y':2}, {'x':3, 'y':4} ...],
//     'videoID' : ''
// }

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

$.getJSON("/assets/json/segResultData.json", function(data) {
    draw(data["1"], 1);
    draw(data["2"], 2);
    draw(data["3"], 3);
    draw(data["4"], 4);
    draw(data["5"], 5);
    draw(data["6"], 6);
    draw(data["7"], 7);
    draw(data["8"], 8);
    draw(data["9"], 9);
    draw(data["10"], 10);
    draw(data["11"], 11);
    draw(data["12"], 12);
});



function draw(data, idx) {
    nv.addGraph(
	function() {
	    var chart = nv.models.lineChart()
		    .margin({left: 50})  //Adjust chart margins to give the x-axis some breathing room.
		    .useInteractiveGuideline(false)  //We want nice looking tooltips and a guideline!
		    .duration(0)  //how fast do you want the lines to transition?
		    .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
		    .showYAxis(true)        //Show the y-axis
		    .showXAxis(true)        //Show the x-axis
	    ;
	    
	    chart.xAxis     //Chart x-axis settings
		.axisLabel('#days after uploading')
		.tickFormat(d3.format(',r'));
	    
	    chart.yAxis     //Chart y-axis settings
		.axisLabel('viewcount')
		.tickFormat(d3.format('d'));

	    d3.select("#chart{0} svg".format(idx))
		.datum(data["data"])
		.call(chart);
	    
	    //Update the chart when window resizes.
	    nv.utils.windowResize(function() { chart.update(); });
	    return chart;
	}
    );

    // set title
    $("#title{0}".format(idx)).text("videoID: " + data["videoID"]).attr("href", "https://www.youtube.com/watch?v=" + data["videoID"]);
    
    
}			    


function process_data (data, idx) {

    var ret = []; // return value

    // add viewcount
    var ii = 0;
    var viewcount = [];
    for (ii = 0; ii < data['viewcount'].length; ii++) {
	viewcount.push({x: ii+1, y: data['viewcount'][ii]});
    }
    ret.push({
	values: viewcount,
	key: 'viewcount',
	color: '#3399FF'
    });
    
    // add segments
    if ( idx >= 0 ) {
    var segInfo = data["segInfo"][idx];
    var seg = [];
    var k = 0;
    var j = 0;
    var si;
    var startDay = 0;
    for (k=0; k < segInfo.length; k++)
    {
	si = segInfo[k];
    	seg = [];
    	for ( j = 0; j < si.length; j++ )
    	{
    	    seg.push({x:startDay+j+1, y: si[j]});
    	}
    	ret.push({
    	    values: seg,
    	    key: String.format('s{0}', k+1),
    	    color: colorList[k%2],
	    'stroke-width': 5
    	});
	startDay += si.length;
    }
    }


    return ret;

}
