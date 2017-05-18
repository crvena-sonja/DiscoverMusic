

const myKey = "AIzaSyAoZTIZrg64L6UnWUI-qj8sTE8WhPF7VRQ";
const base_nearby_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const base_details_url = "https://maps.googleapis.com/maps/api/place/details/json";

const appState = {

	results: [],
}


function queryGoogleMaps (myAddress){
	// const query = {										
 //        key: myKey,
 //        location: myAddress,
 //        radius: 32186.88, //20 miles in meters
 //        rankby: "prominence",
 //        type: 'spa',
	// }

	const query1 = {
		type: 'artist',
		q: "Beyonce"
	}

	$.getJSON("https://api.spotify.com/v1/search", query1, (response) => {
			console.log(response);
		});

	const query2 = {
		type: 'artist',
		q: "Childish%20Gambino"
	}

	$.getJSON("https://api.spotify.com/v1/search", query2, (response) => {
			console.log(response);
		});

	// $.ajax({
	// 	 	url: "https://api.spotify.com/v1/artists/43ZHCT0cAZBISjO8DG9PnE/top-tracks?country=SE", 
	// 	 	type: "GET",  
	// 	 	cache: false, 
 //           	dataType: 'jsonp',
 //            success: function(response){                          
 //                console.log(response);                   
 //            }           
	// });
} 

queryGoogleMaps();


// https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyAoZTIZrg64L6UnWUI-qj8sTE8WhPF7VRQ

// https://maps.googleapis.com/maps/api/place/nearbysearch/?output=json&key=AIzaSyAoZTIZrg64L6UnWUI-qj8sTE8WhPF7VRQ&location=39.065718%2C%20-77.503350&radius=32186.88&rankby=prominence&type=spa