var socket = io();

socket.on('connect', function () {
	console.log('Conncted to socket.io server!');
});

socket.on('snapshot', function (data) {
	chart(data);

	jQuery('#chart').append('<p>' + data + '<p>');
});

socket.on('data', function(data){
  //console.log(data);
	//for(var i = 0; i < data.length; ++i){
	//	jQuery('.messages').append('<p>' + data[i] + '<p>')
	//}
	chart(data);
});

// Handle submiting of new message

var $form = jQuery("#getHistorical");

$form.on('submit', function(event){
	event.preventDefault();
	var $message = $form.find('input[name=symbol]');
	var $start = $form.find('input[name=start]');
	var $end = $form.find('input[name=end]');
	console.log($message.val());
	socket.emit('snapshot', {
		symbol: $message.val(),
		startDate: $start.val(),
		endDate: $end.val()
	});
	$message.val('');
	$start.val('');
	$end.val('');
});

function chart (chartData) {
		console.log(chartData);

        // Create the chart
        $('#container').highcharts('StockChart', {


            rangeSelector: {
                selected: 1
            },

            title: {
                text:  chartData.title
            },

            series: [{
                name: 'AAPL',
                data: chartData.data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });

}
