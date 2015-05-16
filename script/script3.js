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