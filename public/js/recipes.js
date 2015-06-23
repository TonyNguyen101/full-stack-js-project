$(function () {
	//The BigOven Search Query
	$('#searchBigOvenForm').submit(function(event){
		event.preventDefault();
		//Grab the search query
		var searchTerm = $('#searchTerm').val();
		var data = {term: {searchTerm:searchTerm}};

		//Send the search term to BigOven and receive it
		$.ajax({
			type: 'POST',
			url: '/recipes',
			data: data,
			dataType: 'json'
		})
		.done(function(returnData){

		});
	});

























});