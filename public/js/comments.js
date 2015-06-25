$(function () {
	
	$('#newCommentForm').click(function(event){
		event.preventDefault();
		var body = $('#newComment').val();
		var data = {comment: {body: body}};

		$.ajax({
			type: 'POST',
			url: '/recipes/' + $('#recipeId').val() + '/comments',
			data: data,
		}).done(function(returnData){});

	});




});
