var Auth;
var User;
//***********************************************************************
// Cookie methods
//***********************************************************************
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	console.log("cookie set");
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function hideController(){
	$("#controller").slideToggle(200); // hide controller
	if(sessionStorage.User){
		console.log(sessionStorage.User);
	}
};

function hideTree(){
	$("#leftTree").toggle(200);
}

//***********************************************************************
// Dom methods
//***********************************************************************
$(document).ready( function () {
	// show/hide the search bar
	//$("#controller").hide(); // hide controller

	//hide elements
	$("#control").hide();
	$("#loginAlerts").hide();
	//$("#controller").hide();

	// show/hide the tree
	$("#leftTree").hide();

	//***********************************************************************
	//Click methods
	//***********************************************************************
	$("#control").click(function(e){
		$("#controller").slideToggle(200);
	});
	$("#login-signup-btn").click(function(e){
		$("#loginAlerts").hide();
		$("#loginModal").modal('show');
	});
	$("#signup-toggle-btn").click(function(e){
		$("#loginModal").modal('hide');
		$("#signupModal").modal('show');
	});

	$("#addstock").click(function(e){
		getStocks(e);
	});
	function getStocks(e){
		e.preventDefault();
		var data = {};
		data.title = "title";
		data.message = "message";
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
					contentType: 'application/json',
									url: '/stocks',
								 data: JSON.stringify( {
										Auth: Auth,
										symbol: $("#symbol").val(),
										quantity: $("#quantity").val(),
										initialInvestment: $("#initialInvestment").val()
							 }),
							 success: function(result) {
								 console.log(result);
							 },
							 error: function(result){

							 }
		});
	}

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
														if($("#login-remember").is(":checked")){
															console.log("checked");
														} else {
															console.log("unchecked");
														}
														User = result.User;
														console.log(User);
														setCookie("email", result.User.email, 21);
														setCookie("Auth", result.Auth, 21);

														console.log(getCookie("Auth"));

														$("#user-text").html(User.firstname);
														$(".nav-link").hide();
														$("#control").show();

														sessionStorage.firstname = result.User.firstname;
														sessionStorage.Auth = result.Auth;

														window.location.href = "/html/main.html";


                        },
											error: function(result){
												$("#loginAlerts").show();
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
											 			$("#signupModal").modal('hide');
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

//***********************************************************************
// end of file
//***********************************************************************
