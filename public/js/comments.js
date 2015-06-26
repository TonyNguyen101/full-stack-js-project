$(function () {
	
	//New Comment on page HTML Function
	function commentHtml (comment){
		return	'<tr><td>' + 
						comment.body + 
						'</td><td>' + 
						comment.user.userName + 
						'</td></tr>';
	}


	//Captures the comments and packages 
	$('#newCommentForm').submit(function(event){
		event.preventDefault();
		var body = $('#newComment').val();
		var data = {comment: {body: body}};

		//send ajax to /recipes/:id/comments with the hidden recipeid from the form
		$.ajax({
			type: 'POST',
			url: '/recipes/' + $('#recipeId').val() + '/comments',
			data: data,
		}).done(function(returnData){
			//Receive and add to the front of the table
			var newComment = commentHtml(returnData);
			$('tbody').prepend(newComment);
		});

	});




});


