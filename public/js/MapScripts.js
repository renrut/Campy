

let mapcenter = null;
let allmarkers = [];
let map;
let sideBarLoaded = false;

//Once close enough
function checkZoom(map){
  return map.zoom >= 8;
}
//Once a big enough change occurs.
function checkChange(map){

  dLng = Math.abs(map.center.lat()-mapcenter.lat());
  dLat = Math.abs(map.center.lng()-mapcenter.lng());
  manDis = dLng + dLat;
  if(manDis > 2){
    mapcenter = map.center;
    return true;
  }
  return false;
  
}

function initMap() {
  $("#map").height($( window ).height()*.80);

  var nash = {lat: 36.1627, lng: -86.7816};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: nash
  });
  mapcenter = map.center;

  map.addListener('zoom_changed', function(e) {
    if(checkZoom(map)){
      loadMarkers(map.getBounds());
    }
  });

  map.addListener('dragend', function(e) {
    if(checkZoom(map) && checkChange(map)){
      loadMarkers(map.getBounds());
    }
  });  
  

}
let h;
let loadSidebar = function(marker){
  if(!sideBarLoaded){
    h = $("#logo").height()*1.2;
    sideBarLoaded = true;
    console.log(marker);
    $("#everything").addClass("col-md-9");
    $("#sidebar").addClass("col-md-3");
    $("#logo").height($("#logo").height()*.7);
    $("#logo").css("margin-top", "8%");
    $("#search-bar").css("margin-top", "4%");
    $("#search").height(h);
    $("#search-bar").height($("#search").height()*.5);
    $(".nav-btn").css('margin-top',h*.30 +"px");
    $(".login-nav-btn").css('margin-top',h*.2 +"px");
    $(".login-nav-btn").addClass('pull-right');
    $(".register-nav-btn").addClass('pull-left');
    $("#search-bar").css('font-size', "140%")
    $("#map").width("100%");
  }

  let d = marker.dateCreated.toString();
  d = d.substring(0, d.indexOf("T"));
  $("#sidebar").html("<div class='side-margin'></div><div class='sidebar'><div class='info text-center'></div></div>");
  $("#sidebar").height($( window ).height());
  $(".side-margin").css("margin-top", h);
  $(".info").html("<h1>"+marker.name+"</h1><p>Created On: "+ d + "</p>");
  $(".sidebar").height($("#map").height());
}

let attachMarkers = function(markers){
  markers.forEach(function(markerData){
    latLng = {}
    console.log(markerData);

    if(($.grep(allmarkers, function(e){ return e.id == markerData._id; }).length) == 0){
      
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(markerData.lat, markerData.lng),
        map: map,
        icon: {
            scaledSize: new google.maps.Size(30, 30),
            url: 'img/marker.png' 
        },
        id: markerData._id
      });

      (function (marker, markerData) {
        google.maps.event.addListener(marker, "click", function (e) {
          loadSidebar(markerData);
      });
      })(marker, markerData);

    }

   
  });
}
function loadMarkers(mapBounds){
  let markers = [];
  let lats = [mapBounds.getSouthWest().lat(), mapBounds.getNorthEast().lat()]
  let lngs = [mapBounds.getSouthWest().lng(), mapBounds.getNorthEast().lng()]

  $.ajax({
    url: "/markers",
    type: "GET",
    data: {
      lats: lats,
      lngs: lngs
    },
    dataType:"json",
    success: function(xml, textStatus, xhr) {
        attachMarkers(xml);
    },
    complete: function(xhr, textStatus) {
        if(xhr.status >= 400){
            console.log(textStatus);
            $("#error").text("");
        }
    }
  });
}


$( document ).ready(function() {
  let h = $("#logo").height()*1.2;
  $("#search").height(h);
  $("#search-bar").height($("#search").height()*.5);
  $(".nav-btn").css('margin-top',h*.38 +"px");
  $(".login-nav-btn").css('margin-top',h*.25 +"px");
  $(".user").css('margin-top',h*.34 +"px")
  $("#search-bar").on('keyup', function (e) {
      if (e.keyCode == 13) {
          let query = ($("#search-bar").val());
      }
  });

});
