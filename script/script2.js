function step2(currentDate){
		$('body>section>*').remove();
		$('body>section').append('<div id="map_city"></div><div id="map_play"><h1>Места</h1><p>Добавьте места на карте, которые хотите посетить</p></div>');
		
		ymaps.ready(init);

		function init() {
		    var geolocation = ymaps.geolocation,
		        myMap = new ymaps.Map('map_city', {
		            center: [53.893795, 27.546793], 
		            zoom: 15,
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
			/*searchResults = new ymaps.GeoObjectCollection(null, { hintContentLayout: ymaps.templateLayoutFactory.createClass('$[properties.name]') });
			myMap.geoObjects.add(searchResults);
			searchControl.events.add('resultselect', function (e) {
		        var index = e.get('index');
		        console.log(e);
		        searchControl.getResult(index).then(function (res) {
		           searchResults.add(res);
		        });
		    }).add('submit', function () {
		           searchResults.removeAll();
		        });*/
			
			step2_1 = function(){
				step3(currentDate,myMap,searchControl);
			};
			$("#map_play").append('<input onclick="step2_1()" type="button" value="Продолжить">');
		}
};