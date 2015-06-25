$(function () {
	
	//New Comment on page HTML Function
	function commentHtml (comment){
		return	'<tr><td>' + 
						comment.body + 
						'</td></tr>';
	}



	$('#newCommentForm').click(function(event){
		event.preventDefault();
		var body = $('#newComment').val();
		var data = {comment: {body: body}};

		$.ajax({
			type: 'POST',
			url: '/recipes/' + $('#recipeId').val() + '/comments',
			data: data,
		}).done(function(returnData){
			var newComment = commentHtml(returnData);
			
		});

	});




});
