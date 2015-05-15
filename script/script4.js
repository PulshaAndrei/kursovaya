createRezult = function(rez, current_date1, current_date2){
	$('#map_city').remove();
	$('#map_add').remove();
	$('#map_list').remove();

	$('body>section').append("<div id='map_rez'></div><div id='list_rez'><h1>Маршрут</h1><ul></ul></div>");

	myMap = new ymaps.Map('map_rez', {
		center: [53.893795, 27.546793], 
		zoom: 15,
		controls: ['zoomControl','fullscreenControl']
	});

	time = function(dt){
		var th, tm;
		if (dt.getHours()<10) var th = "0"+dt.getHours(); else th = dt.getHours();
		if (dt.getMinutes()<10) tm = "0"+dt.getMinutes(); else tm = dt.getMinutes();
		return th+":"+tm;
	}

	abc = function(x){
		return String.fromCharCode(65+x);
	}

	print = function(rez, time_r){
		var temp_route = [];
		var current_date = current_date1;
		for( var i = 0; i < rez.length; i++){
			temp_route.push(rez[i].coords);
			if (i!=0) current_date.setMinutes(current_date.getMinutes()+time_r[i-1]);
			time1 = time(current_date);
			current_date.setMinutes(current_date.getMinutes()+parseInt(rez[i].time_duration));
			time2 = time(current_date);
			if (i!=0) in_way = "<p>Время в пути: "+time_r[i-1]+" минут</p>"; else in_way="";
			$('#list_rez ul').append("<li class='select_active'><p style='font-weight: bold'><span style='color: blue'>"+abc(i)+". </span>"+rez[i].name+"</p>"+in_way+"<p>Пребывание с "+time1+" по "+time2+"</p></li>");	
		}

		ymaps.modules.require(['MultiRouteColorizer'], function (MultiRouteColorizer) { new MultiRouteColorizer(multiRoute); });
		ymaps.route(temp_route, {
		    multiRoute: true
		}).done(function (route) {
		    route.options.set("mapStateAutoApply", true);
		    route.options.set("boundsAutoApply", true);
		    myMap.geoObjects.add(route);
		});
	}

	var h = $("#map_rez").innerHeight();
	$('#list_rez').css("height",h-60);

	/*rez = rez.sort(function(a,b){ return b.priority - a.priority; });*/

	var way_points = [];
	for (var i=0; i<rez.length; i++){
		way_points.push({
		      location: new google.maps.LatLng(rez[i].coords[0],rez[i].coords[1]),
		      stopover: true
		    });
	}
	var ans;
	var request = {
		origin: new google.maps.LatLng(rez[0].coords[0],rez[0].coords[1]),
  		destination: new google.maps.LatLng(rez[0].coords[0],rez[0].coords[1]),
		waypoints: way_points,
	    travelMode: google.maps.TravelMode.DRIVING,
	    optimizeWaypoints: true
	  };
	  var directionsService = new google.maps.DirectionsService();
	  directionsService.route(request, function(result, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	    	temp = result.routes["0"].waypoint_order;

	    	var ans = [];
	    	for (var i=0; i<rez.length; i++)
	    		ans.push(rez[temp[i]]);

	    	ans.push(ans[0]);
	    	var z = [];
			for (var i=1; i<ans.length; i++)
				ymaps.route([ans[i-1].coords, ans[i].coords]).done(
	    			function (route) {
	    				z.push(parseInt(route.getTime()/60));
	    				if (z.length==ans.length-1) print(ans, z);
					});
	    }
	  });
}