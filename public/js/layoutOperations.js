$(document).ready( function () {
	// show/hide the search bar
	$("#controller").hide(); // hide controller
	function hideController(){
		$("#controller").slideToggle(200); // hide controller
	};

	// show/hide the tree
	$("#leftTree").hide();

	function hideTree(){
  	$("#leftTree").toggle(200);
	}

	$("#signup-toggle-btn").click(function(e){
		console.log("Click");
		$("#loginModal").modal('hide');
		$("#signupModal").modal('show');
	});

	$("#login-btn").click(function(e){
					e.preventDefault();
					var data = {};
					data.title = "title";
					data.message = "message";

					$.ajax({
						type: 'POST',
						data: JSON.stringify(data),
				        contentType: 'application/json',
                        url: '/users/login',
											 data: JSON.stringify( {
 													email: $("#login-email-input").val(),
 											 password: $("#login-password-input").val()
										 }),
										 success: function(result) {
											 			$("#loginModal").modal('hide');
                            console.log(JSON.stringify(result));
														$("#login-signup-btn").html('Logout');
														$("#user-text").html(result.User.firstname);

                        },
											error: function(result){

											}
          });
	});

	$("#signup-btn").click(function(e){
					e.preventDefault();
					console.log("clicked");
					var data = {};
					data.title = "title";
					data.message = "message";
					console.log($("#email-input").val());
			 		console.log($("#password-input").val());
					console.log( $("#lastname-input").val());
					console.log($("#firstname-input").val());

					$.ajax({
						type: 'POST',
						data: JSON.stringify(data),
				        contentType: 'application/json',
                        url: '/users',
											 data: JSON.stringify( {
 													email: $("#email-input").val(),
 											 password: $("#password-input").val(),
											 lastname: $("#lastname-input").val(),
											firstname: $("#firstname-input").val()
										 }),
										 success: function(result) {
											      $("#loginModal").modal('show');
                            console.log('success');
                            console.log(JSON.stringify(result));
														//location.href = "/"
                        },
										error: function(result){
														console.log("fail");
										}
          });
	});
});
