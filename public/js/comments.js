$(function () {
	
	$('#newCommentForm').click(function(event){
		event.preventDefault();
		var body = $('#newComment').val();
		var data = {comment: {body: body}};
		console.log(data);
		var testID = $('#recipeId').val();

		$.ajax({
			type: 'POST',
			url: '/recipes/' + testID + '/comments',
			data: data,
			dataType: 'json'
		}).done(function(returnData){});

	});




});
