$("#tagText").bind("keyup", function (event) {
	event.preventDefault();
	var tagSuggest = $("#tagText").val();
	var url = 'https://mangaowl.com/live_search/' + encodeURIComponent(tagSuggest);
	//console.log('Sending ', url);

	if (tagSuggest.length > 3) {
		$.getJSON({
			url: url,
			headers: {
				"Access-Control-Allow-Origin": "https://mangaowl.com",
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Methods": "*"
			}
		}, function (data) {

			//console.log(data);
			var optionss = document.getElementById('optionss');
			optionss.focus();
			var len = optionss.length;

			//console.log(len)

			for (let index = len; index >= 0; --index) {
				//console.log(index);
				optionss.remove(index);
			}

			var option = document.createElement("option");

			optionss.add(option, 0);
			optionss.selectedIndex = 0;

			data.map((e) => {
				var option = document.createElement("option");
				option.text = e.name;
				option.value = e.id;
				optionss.add(option);
			})
		});
	}
});	//https://mangaowl.com/live_search

function selected() {
	//console.log('cocococo');
	var optionss = document.getElementById('optionss');
	//console.log(optionss.selectedIndex);
	//console.log(optionss.value);
	app.mn_name = optionss.text;

	var url = '/chapters' + encodeURIComponent(optionss.value + '&' + optionss.nameShort);

	$.getJSON({
		url: url,
		headers: {
			"Access-Control-Allow-Origin": "https://mangaowl.com",
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Methods": "*"
		}
	}, function (data) {

		console.log(data);
		app.mn_name = data.shift().manga_name;
		var optionss = document.getElementById('ch_options');
		var len = optionss.length;
		optionss.focus();


		//console.log(len)

		for (let index = len; index >= 0; --index) {
			//console.log(index);
			optionss.remove(index);
		}

		var option = document.createElement("option");
		optionss.add(option, 0);
		optionss.selectedIndex = 0;

		data.map((e) => {
			var option = document.createElement("option");
			option.text = e.name;
			option.value = e.link;
			optionss.add(option);
		})

	});
}

function ch_select() {
	var optionss = document.getElementById('ch_options');
	optionss.focus();


	$.post("/getch", {
		link: optionss.value,
		manga_name: app.mn_name,
	}, function (data, status) {

		console.log('repeated message');

	});
}

function ch_next() {
	var optionss = document.getElementById('ch_options');

	optionss.selectedIndex = optionss.selectedIndex + 1;
	optionss.focus();

	$.post("/getch", {
		link: optionss.value,
		manga_name: app.mn_name,
	}, function (data, status) {
		console.log('repeated message');
	});
}

$('#ch_options').keypress(function (event) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if (keycode == '13') {
		var optionss = document.getElementById('ch_options');
		//optionss.focus();

		$.post("/getch", {
			link: optionss.value,
			manga_name: app.mn_name,
		}, function (data, status) {
			console.log('repeated message');
		});
		//alert('You pressed a "enter" key in textbox');	
	}
});

