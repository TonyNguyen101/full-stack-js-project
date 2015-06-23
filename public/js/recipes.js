$(function () {
		
	//Search Results HTML Function
	function recipeHtml (recipe){
		return	'<tr>	<td><img src=' + 
						recipe.ImageURL120 + 
						' alt=""></td><td>' + 
						recipe.RecipeID + 
						'</td><td>' + 
						recipe.Title + 
						'</td></tr>';
	}


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
		}).done(function(returnData){
			//Remove the previous search results
			$('tr').remove();
			//Iterate of the returned array from BigOven
			returnData.Results.forEach(function(recipe){ 
				if (recipe.ImageURL !== "http://redirect.bigoven.com/pics/recipe-no-image.jpg") {
					var newRecipe = recipeHtml(recipe);
					//add to the table body
					$('tbody').append(newRecipe);	
				}
			});
		});
	});	




});
