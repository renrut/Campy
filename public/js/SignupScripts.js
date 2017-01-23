$(function() {


  $('#login-form-link').click(function(e) {
    login();
  });

  $('#register-form-link').click(function(e) {
    register();
  });

  let login = function(){
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $("#login-form-link").addClass('active');
  }

  let register = function(){
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $("#register-form-link").addClass('active');
  }
  if((window.location.pathname).includes("login")){login();}
  if((window.location.pathname).includes("register")){register();}


});
