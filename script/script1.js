function step1(){
	var dayNam = ['ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА'];
	var monthNam = ['ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ', 'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'];
	step1_1 = function(){
		step2($( "#calendar" ).datepicker( "getDate" ));
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