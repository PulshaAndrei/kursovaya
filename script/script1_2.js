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