function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length >= 2) return parts.pop().split(";").shift();
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$( document ).ready(function() {
    let height = $("#logo").height();
    $(".navigation").height(height);

    //setloggedin on nav
    let text = "";

    if(getCookie("username") != null){
    	text = "<li><a class='nav-btn' href='/register'>Register</a></li><li><a class='nav-btn' href='/login'>Login</a></li>"
    }else{
    	text = "<li><a class='profileimg' href='/register'>Register</a></li><li><a class='nav-btn' href='/login'>Login</a></li>"
    }
    $("#loginInfo").html(text);
});