
var tableRows = document.querySelectorAll('.switch-background'); 
var swap = true; 

for (var i = 0; i < tableRows.length; i++) {

	if (swap) 

		tableRows[i].style.background = '#e8eaed';
	else

		tableRows[i].style.background = '#d9dadb';

	swap = !swap;
}
