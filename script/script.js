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

function step3(currentDate1,currentDate2,myMap,searchControl){
	$('#map_play').remove();
	var priority = "middle_prior";
	var name = "";
	var coords;
	var time_limit1;
	var time_limit2;
	var time_duration;

	select_prior = function(arg){
		priority = arg;
		$("#select_priority a").removeClass("select_active");
		$("#map_add ."+arg).addClass("select_active");
	}

	change = function(n){
		if (n === 1) $('#select_priority').css("display","flex");
		else $('#select_priority').css("display","none");
		if (n === 2) $('#list_time').css("display","block");
		else $('#list_time').css("display","none");
		if (n === 3) $('#duration_time').css("display","block");
		else $('#duration_time').css("display","none");
	}

	addList = function (){
		time_duration = $("#duration_time input").val();
		if (navigator.userAgent.search(/Firefox/) === -1){
			time_limit1 = $("#list_time input:nth-child(2)").val();
			time_limit2 = $("#list_time input:nth-child(4)").val();
		} else {
			time_limit1 = $("#list_time input:nth-child(2)").val()+":"+$("#list_time input:nth-child(4)").val();
			time_limit2 = $("#list_time input:nth-child(6)").val()+":"+$("#list_time input:nth-child(8)").val();
		}

		if (priority === "low_prior") pr = 1;
		if (priority === "middle_prior") pr = 2;
		if (priority === "high_prior") pr = 3;

		var elem = {
			name: name,
			coords: coords,
			priority: pr,
			time_limit1: time_limit1,
			time_limit2: time_limit2,
			time_duration: time_duration
		};

		if (name == "") return;

		var z = $("#list_input li");
		for (var i = 0; i < z.length; i++)
			if($(z[i]).data("elem").coords == elem.coords) return;

		/*if (name.length>18)	var name20 = name.substring(0,18)+"...";
		else name20 = name;*/
		var time_limit_str = "C " + time_limit1 + " по " + time_limit2;

		$("#list_input").append("<li class='select_active "+priority+"'><p>"+name+"<span class='list_close'></span></p><span>"+time_limit_str+" </span><span style='float: right'> "+time_duration+" минут</span></li>");
		$("#list_input li:last-child").data("elem",elem);
		$("#list_input li:last-child .list_close").data("elem",elem);

		$("#list_input li:last-child .list_close").click(function(e){
			var dt = $(e.target).data("elem");
			var z = $("#list_input li");
			for (var i = 0; i < z.length; i++)
				if($(z[i]).data("elem")==dt) $(z[i]).remove();
		});

	}

	step4 = function(){
		var rez = [];
		var z = $("#list_input li");
		for (var i = 0; i < z.length; i++)
			rez.push($(z[i]).data("elem"));
		if (rez.length>1) createRezult(rez,currentDate1,currentDate2);
	}

	$('body>section').append('<div id="map_add"><h1>Выберите место для добавления</h1><p onclick="change(1)">Важность</p><div id="select_priority"><a href="#" class="high_prior" onclick="select_prior('+"'high_prior'"+')">Высокая</a><a href="#" class="middle_prior" onclick="select_prior('+"'middle_prior'"+')">Средняя</a><a href="#" class="low_prior" onclick="select_prior('+"'low_prior'"+')">Низкая</a></div><p onclick="change(2)">Время посещения</p><div id="list_time"></div><p onclick="change(3)">Длительность пребывания</p><div id="duration_time"><input type="number" value="30"><span> минут</span></div><input type="button" value="Добавить" id="add_place" onclick="addList()"></div><div id="map_list"><h1>Маршрут</h1><ul id="list_input"></ul></div>');
	var h = $("#map_add").innerHeight();
	$('#map_list').css("height",h-30);
	$('#map_list').append('<input type="button" value="Далее" id="rezult_btn" onclick="step4()">');

	$(".middle_prior").click();
	change(1);
	if (navigator.userAgent.search(/Firefox/) === -1) $('#list_time').append('<span>c </span><input type="time" value="00:00"/><span> по </span><input type="time" value="23:59"/>');
	else $('#list_time').append('<span>c </span><input type="text" value="00"><span> : </span><input type="text" value="00"><span> по </span><input type="text" value="23"><span> : </span><input type="text" value="59">');

	set_adress = function (n) {
		$('#map_add h1').text(n);
	}

	click_place = function(e){
		coords = e.get('coords');
		myMap.geoObjects.removeAll();
		myMap.geoObjects.add(new ymaps.Placemark(coords));

		var myGeocoder = ymaps.geocode(coords);
		myGeocoder.then(
		    function (res) {
		        name = res.geoObjects.get(0).properties.get('name');
		        set_adress(name);
		    });
	}

	myMap.events.add('click', function (e) { click_place(e); });
	searchControl.events.add('resultselect',function (e) {
				searchResult = searchControl.getResultsArray();
				name = searchResult[e.get('index')].properties.get('name');
				coords = searchResult[e.get('index')].geometry._Ng;
				set_adress(name);
			});
}

function step2(currentDate1,currentDate2){
		$('body>section>*').remove();
		$('body>section').append('<div id="map_city"></div><div id="map_play"><h1>Места</h1><p>Добавьте места на карте, которые хотите посетить</p></div>');
		
		ymaps.ready(init);

		function init() {
		    var geolocation = ymaps.geolocation,
		        myMap = new ymaps.Map('map_city', {
		            center: [53.893795, 27.546793], 
		            zoom: 10,
		            controls: ['geolocationControl','zoomControl','searchControl','fullscreenControl']
		        });
			geolocation.get({
		        provider: 'browser',
		        mapStateAutoApply: true
		    }).then(function (result) {
		        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
		        myMap.geoObjects.add(result.geoObjects);
		    });
		    var searchControl = myMap.controls.get('searchControl');
			searchControl.options.set('provider', 'yandex#search');
			searchControl.search("достопримечательности",{ results: 200 });
			
			step2_1 = function(){
				step3(currentDate1,currentDate2,myMap,searchControl);
			};
			$("#map_play").append('<input onclick="step2_1()" type="button" value="Продолжить">');
		}
};

step1_2 = function (current_date) {
	$('#main_date h1').text("Время");
	$('#main_date p').text("Укажите время поездки");
	step2_0 = function(){
		var dt1 = current_date;
		dt1.setHours($('#time_h1').val(),$('#time_m1').val());
		var dt2 = new Date(dt1.getTime());
		dt2.setHours($('#time_h2').val(),$('#time_m2').val());
		step2(dt1, dt2);
	}
	$('#main_date input').remove();
	$('#main_date').append('<input onclick="step2_0()" type="button" value="Продолжить">');
	$('#calendar').remove();
	$('#calendar_box').addClass("new_calendar_box")
	$('#calendar_box').append('<h1>Время начала поездки: </h1><div><input type="number" id="time_h1" min="0" max="24" value="00"><span> : </span><input type="number" id="time_m1" min="0" max="60" value="00"></div><h1>Время окончания поездки: </h1><div><input type="number" id="time_h2" min="0" max="24" value="23"><span> : </span><input type="number" id="time_m2" min="0" max="60" value="59"><div>');
	
}

function step1(){
	var dayNam = ['ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА'];
	var monthNam = ['ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ', 'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'];
	step1_1 = function(){
		step1_2($( "#calendar" ).datepicker( "getDate" ));
	};
	$('body>section').append($('<div id="main_date"><h1>Дата</h1><p>Выберите в календаре дату поездки</p><input onclick="step1_1()" type="button" value="Продолжить"></div>'));
	$('#home').remove();$('body>section').append($('<div id="calendar_box"><div id="calendar"><div class="calendar_left"></div></div></div>'));
	$('#calendar').datepicker({
        inline: true,
        firstDay: 1,
        showOtherMonths: false, 
        dayNames: dayNam,
        dayNamesMin: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
        monthNames: ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ','ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'],
        onSelect: function (){
			$('.current_day_week').remove();
			$('.current_date').remove();
			$('.current_month').remove();
			var currentDate = $( "#calendar" ).datepicker( "getDate" );
			$('.calendar_left').append('<div class="current_day_week">'+dayNam[currentDate.getDay()]+'</div>');
			$('.calendar_left').append('<div class="current_date">'+currentDate.getDate()+'</div>');
			$('.calendar_left').append('<div class="current_month">'+monthNam[currentDate.getMonth()]+'</div>');
		}
    });
	var currentDate = $( "#calendar" ).datepicker( "getDate" );
	$('.calendar_left').append('<div class="current_day_week">'+dayNam[currentDate.getDay()]+'</div>');
	$('.calendar_left').append('<div class="current_date">'+currentDate.getDate()+'</div>');
	$('.calendar_left').append('<div class="current_month">'+monthNam[currentDate.getMonth()]+'</div>');
};

(function(){
	step1();
	/*$('body>section').append($('<div id="home"><input class="main_btn" onclick="step1()" type="button" value="Начать"></div>'));
*/})();