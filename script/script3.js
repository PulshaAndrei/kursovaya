function step3(currentDate,myMap,searchControl){
	$('#map_play').remove();
	var priority = "middle_prior";

	select_prior = function(arg){
		priority = arg;
		$("#select_priority a").removeClass("select_active");
		$("."+arg).addClass("select_active");
	}
	change = function(n){
		if (n === 1) $('#select_priority').css("display","block");
		else $('#select_priority').css("display","none");
		if (n === 2) $('#list_time').css("display","block");
		else $('#list_time').css("display","none");
		if (n === 3) $('#duration_time').css("display","block");
		else $('#duration_time').css("display","none");
	}

	$('body>section').append('<div id="map_add"><h1>Выберите место для добавления</h1><p onclick="change(1)">Важность</p><div id="select_priority"><a href="#" class="high_prior" onclick="select_prior('+"'high_prior'"+')">Высокая</a><a href="#" class="middle_prior" onclick="select_prior('+"'middle_prior'"+')">Средняя</a><a href="#" class="low_prior" onclick="select_prior('+"'low_prior'"+')">Низкая</a></div><p onclick="change(2)">Время посещения</p><div id="list_time"></div><p onclick="change(3)">Длительность пребывания</p><div id="duration_time"><input type="number" value="30"><span> минут</span></div><input type="button" value="Добавить" id="add_place"></div><div id="map_list"><h1>Маршрут</h1></div>');
	$(".middle_prior").click();
	change(1);
	if (navigator.userAgent.search(/Firefox/) === -1) $('#list_time').append('<span>c </span><input type="time" value="00:00"/><span> по </span><input type="time" value="23:59"/>');
	else $('#list_time').append('<span>c </span><input type="text" value="00"><span> : </span><input type="text" value="00"><span> по </span><input type="text" value="23"><span> : </span><input type="text" value="59">');


	set_adress = function (name) {
		$('#map_add h1').text(name);
	}

	click_place = function(e){
		var coords = e.get('coords');
		myMap.geoObjects.removeAll();
		myMap.geoObjects.add(new ymaps.Placemark(coords));

		var myGeocoder = ymaps.geocode(coords);
		myGeocoder.then(
		    function (res) {
		        var name = res.geoObjects.get(0).properties.get('name');
		        console.log(name+" "+coords);
		        set_adress(name);
		        if (name.length>25) $('#map_add h1').css("font-size", "20px");
					else $('#map_add h1').css("font-size", "36px");
		    });
	}

	myMap.events.add('click', function (e) { click_place(e); });
	searchControl.events.add('resultselect',function (e) {
				searchResult = searchControl.getResultsArray();
				var name = searchResult[e.get('index')].properties.get('name');
				var coords = searchResult[e.get('index')].geometry._Ng;
				console.log(name+" "+coords);
				set_adress(name);
				if (name.length>25) $('#map_add h1').css("font-size", "22px");
				else $('#map_add h1').css("font-size", "36px");
			});
}