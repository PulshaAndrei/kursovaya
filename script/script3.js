function step3(currentDate,myMap,searchControl){
	$('#map_play').remove();
	var priority = "middle_prior";
	var name = "";
	var coords;
	var time_limit;
	var time_duration;

	select_prior = function(arg){
		priority = arg;
		$("#select_priority a").removeClass("select_active");
		$("#map_add ."+arg).addClass("select_active");
	}
	change = function(n){
		if (n === 1) $('#select_priority').css("display","block");
		else $('#select_priority').css("display","none");
		if (n === 2) $('#list_time').css("display","block");
		else $('#list_time').css("display","none");
		if (n === 3) $('#duration_time').css("display","block");
		else $('#duration_time').css("display","none");
	}

	addList = function (){
		time_duration = $("#time_duration").val();

		var elem = {
			name: name,
			coords: coords,
			priority: priority,
			time_limit: time_limit,
			time_duration: time_duration
		};

		if (name.length>25)	var name25 = name.substring(0,25)+"...";
		else name25 = name;

		$("#list_input").append("<li class='"+priority+"''><p>"+name25+"</p><span>"+time_limit+"</span><span>"+time_duration+"</span></li>");

	}

	$('body>section').append('<div id="map_add"><h1>Выберите место для добавления</h1><p onclick="change(1)">Важность</p><div id="select_priority"><a href="#" class="high_prior" onclick="select_prior('+"'high_prior'"+')">Высокая</a><a href="#" class="middle_prior" onclick="select_prior('+"'middle_prior'"+')">Средняя</a><a href="#" class="low_prior" onclick="select_prior('+"'low_prior'"+')">Низкая</a></div><p onclick="change(2)">Время посещения</p><div id="list_time"></div><p onclick="change(3)">Длительность пребывания</p><div id="duration_time"><input type="number" value="30"><span> минут</span></div><input type="button" value="Добавить" id="add_place" onclick="addList()"></div><div id="map_list"><h1>Маршрут</h1><ul id="list_input"></ul></div>');
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
		        console.log(name+" "+coords);
		        set_adress(name);
		        if (name.length>25) $('#map_add h1').css("font-size", "20px");
					else $('#map_add h1').css("font-size", "36px");
		    });
	}

	myMap.events.add('click', function (e) { click_place(e); });
	searchControl.events.add('resultselect',function (e) {
				searchResult = searchControl.getResultsArray();
				name = searchResult[e.get('index')].properties.get('name');
				coords = searchResult[e.get('index')].geometry._Ng;
				console.log(name+" "+coords);
				set_adress(name);
				if (name.length>25) $('#map_add h1').css("font-size", "22px");
				else $('#map_add h1').css("font-size", "36px");
			});
}