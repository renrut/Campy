marker = null;
function placeMarker(latLng, map){
    if(marker){
        marker.setMap(null);
    }
    marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: {
            scaledSize: new google.maps.Size(30, 30),
            url: 'img/marker.png' 
        }
    });
}



function initMap() {
  $("#map").height($( window ).height()*.3);

  var nash = {lat: 36.1627, lng: -86.7816};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: nash
  });

  map.addListener('click', function(e) {
    placeMarker(e.latLng, map);
});

}



jQuery(document).ready(function() {
	
    /*
        Fullscreen background
    */
    $.backstretch("assets/img/backgrounds/1.jpg");
    
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$.backstretch("resize");
    });
    
    /*
        Form
    */
    $('.registration-form fieldset:first-child').fadeIn('slow');
    
    $('.registration-form input[type="text"], .registration-form input[type="password"], .registration-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    // next step
    $('.registration-form .btn-next').on('click', function() {
    	var parent_fieldset = $(this).parents('fieldset');
    	var next_step = true;
    	
    	parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			$(this).addClass('input-error');
    			next_step = false;
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	
    	if( next_step ) {
    		parent_fieldset.fadeOut(400, function() {
	    		$(this).next().fadeIn();
	    	});
    	}
    	
    });
    
    // previous step
    $('.registration-form .btn-previous').on('click', function() {
    	$(this).parents('fieldset').fadeOut(400, function() {
    		$(this).prev().fadeIn();
    	});
    });
    
    // submit
    $('#add-site').on('click', function(e) {
        let tags = []
        let rating = 0;
        let size = 0;
        let price = 0;
        let tag = $("#tags").val().split(",");
        let lng = marker.position.lng();
        let lat = marker.position.lat();
        let fire = $("input[name='fire']").val()=="on";
        tag.forEach(function(tagr){tags.push($.trim(tagr));})
        

        $.ajax({
            url: "/site",
            type: "POST",
            data: {
                name:$("#sitename").val(),
                lng: lng,
                lat:lat,
                description: $("#description").val(),
                directions: $("#directions").val(),
                size:$("input[name='siteSize']:checked").val(),
                price:$("input[name='price']:checked").val(),
                rating:$("input[name='rating']:checked").val(),
                sitetags: tags,
                fire: fire
            },
            dataType:"json",
            success: function(xml, textStatus, xhr) {
                console.log(xml);
                window.location.replace("/?campsite="+xml);
            },
            complete: function(xhr, textStatus) {
                if(xhr.status >= 400){
                    console.log(textStatus);
                    $("#error").text("");
                }
            }
        });
    });


    
});
