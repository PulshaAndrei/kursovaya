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