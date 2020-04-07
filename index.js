"use strict";

/*Foursqaure API Client Info
CLIENT_ID = '4UGIHJMXKJGHFPVDOKYYKM43JNHRNSUVMDG2MOEMKXHOTPYJ' //Foursquare ID
CLIENT_SECRET = 'YB1ZXEFPZNPPONALNV3PCQDOTNSRE3LW41KNPKPQG45SYXGK' //Foursquare Secret
VERSION = '20180323' //Foursquare API version
print('Your credentails:')
print('CLIENT_ID: ', CLIENT_ID)
print('CLIENT_SECRET:', CLIENT_SECRET)*/
const CLIENT_ID = '4UGIHJMXKJGHFPVDOKYYKM43JNHRNSUVMDG2MOEMKXHOTPYJ' //Foursquare ID
const CLIENT_SECRET = 'YB1ZXEFPZNPPONALNV3PCQDOTNSRE3LW41KNPKPQG45SYXGK' //Foursquare Secret
const VERSION = '20180323' //Foursquare API version

var lat;
var lng;
var latLongObject;

function watchForm() {
    $('.searchForm').submit(function(event) {
        event.preventDefault();
        // let searchForm = $('#js-search-term').val();
        let cityName = $('#location').val();
        const maxVenuesDisplayed = 15;
        getBusiness(cityName, maxVenuesDisplayed);
    });
}

function getBusiness(cityName, maxVenuesDisplayed) {
    const url = `https://api.foursquare.com/v2/venues/search?near=${cityName}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERSION}`;

    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responsejson => {
            latLongObject = responsejson.response.geocode.feature.geometry.center;
            lat = latLongObject.lat;
            lng = latLongObject.lng;
            addGoogleMapsAPIScript();
            displayResults(responsejson);
        })
        .catch(err => {
            $('#error-message').text(`Something went wrong: ${err.message}`);
        });


    //Display business results 

    function displayResults(responseJson) {
        console.log(responseJson);
        $('#business-list').empty();
        // lat = getLatFromResponseJson
        // long = getLongFromResponseJson

        if (responseJson.response.venues.length > 0) {
            for (let i = 0; i < responseJson.response.venues.length && i < maxVenuesDisplayed; i++) {
                $('#business-list').append(`<tr>
        
                <td><br> ${responseJson.response.venues[i].name}</td> 
                <td><br> ${responseJson.response.venues[i].location.address}</td>
                <td><br> ${responseJson.response.venues[i].location.city}</td></tr>`);
            };
        } else {
            $('#business-list').append("<li>Sorry, no results match your search</li>");
        }
        $('.searchForm').removeClass('hidden');
    }
}

function businessTable() {
    document.getElementById("#business-list").style.tableLayout = "fixed";
  }

function addGoogleMapsAPIScript() {
    // Create a <script> tag and set the ggole maps URL as the source.
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAJ_wq_D6Grboah9szVhRr71p5uN2PsbtU&callback=initMap';
    document.getElementsByTagName('head')[0].appendChild(script);
}


// Loop through the results array and place a marker for each
// set of coordinates.
window.eqfeed_callback = function(results) {
    for (var i = 0; i < results.features.length; i++) {
        var coords = results.features[i].geometry.coordinates;
        var latLng = new google.maps.LatLng(coords[1], coords[0]);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
    }
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: 'terrain'
    });
}

// $(document).ready(function(){
//     $("button").click(function(){
//       $(".searchForm").toggle();
//     });
// });

// $(document).ready('#submitButton' ,function(){
//      $(".searchFrom").show();
//        });

$(document).ready('load', function() {
 $("#container").hide();
$("#map").hide();
 });


$(watchForm);
