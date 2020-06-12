var elements = document.getElementsByClassName('exportButton');
var x = document.getElementById('select_cidades');

async function wait() {
	return new Promise(function (resolve) {
		setTimeout(function () {
			elements[0].click();
			//console.log("vai resolver");
			resolve();
		}, 20000);
	}); a
}

(async function () {

	for (var i = 0; i < x.options.length; i++) {
		document.getElementById('select_cidades').selectedIndex = i;
		document.getElementById('select_cidades').dispatchEvent(new Event('change'));
		await wait();
		console.log('test')
	}
})()
