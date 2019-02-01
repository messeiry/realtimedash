import Highcharts from 'highcharts';

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});



// Charts Sample with High Chart
Template.chart101.helpers({
    createChart: function () {

    var chartData = Perfmon.find().fetch();
	/*
	var chartData =  [
					 	{y:100, name:"Counter1"},
					 	{y:110, name:"Counter1"},
					 	{y:120, name:"Counter1"},
					 	{y:140, name:"Counter1"},
					 	{y:110, name:"Counter1"},
					 	{y:90, name:"Counter1"},
					 	{y:70, name:"Counter1"},
					 	{y:100, name:"Counter1"},
					 	{y:110, name:"Counter1"},
					 	{y:120, name:"Counter1"},
					 	{y:120, name:"Counter1"},
					 	{y:190, name:"Counter1"},
					 	{y:10, name:"Counter1"},
					 	{y:60, name:"Counter1"},
					 	{y:60, name:"Counter1"}

					 ];
	*/				 
    // Use Meteor.defer() to craete chart after DOM is ready:
    Meteor.defer(function() {
        // Create standard Highcharts chart with options:
        Highcharts.chart('chart', {
        	title : { 
        		text: 'Tectronics Prob 101'
        	},
        	series: [{
            	type: 'line',
            	data: chartData
          	}]
        });
      });
    }


});






Template.reactiveChart.onRendered(function () {
		var cursor = Template.currentData(),
				// .sort({_id:-1}).limit(1)
				query = Perfmon.find({}, {sort: {DateTime: -1, limit: -1}});
				initializing = true, // add initializing variable, see:  http://docs.meteor.com/#/full/meteor_publish
				liveChart;
	
		// Create basic line-chart:
		liveChart = Highcharts.chart(cursor.chart_id, {
				title: {
						text: 'Tectronics Prob 102'
				},
				series: [{
						type: 'line',
						data: [query]
				}]
		});
	
		// Add watchers:
		query.observeChanges({
				added: function (id, doc) {
					if (!initializing) {
						console.log("--->" + doc.y);
						// We will use Highcharts API to add point with "value = previous_value + 1" to indicate number of tasks
						//var points = liveChart.series[0].points;
						//liveChart.series[0].addPoint(
						//		points[points.length - 1].y + 1
						//);
						liveChart.series[0].addPoint({y: doc.y, name: doc.name});
						var points = liveChart.series[0].points;
						console.log("Count of point on screen --->" + points.length);

						if (points.length > 20) {
							//liveChart.series[0].
							liveChart.series[0].removePoint(0);
						}

					}
				},
				removed: function () {
					if (!initializing) {
						// We will use Highcharts API to add point with "value = previous_value - 1" to indicate number of tasks
						var points = liveChart.series[0].points;
						liveChart.series[0].addPoint(
								points[points.length - 1].y - 1
						);
					}
			}
		});   
		initializing = false;
	});