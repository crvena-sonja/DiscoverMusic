

const appState = {

	results: [],
	artistID: [],
	artistAlbumID: [],
	artistTracks: [],
	albumsIDs: []
}

// console.log('that', appState.albumsIDs);
function querySpotifyArtist (artist){

	const query = {
		type: 'artist', 														
		q: artist

	}

	$.getJSON("https://api.spotify.com/v1/search", query, function(response)  {
			 appState.artistID.push(response.artists.items[0].id);
				querySpotifyAlbums();

	});

} 

function querySpotifyAlbums(){
									///STORE RESULT IN A VARIABLE TO BE USED LATER
	const query = {
		id: appState.artistID[0]
	}

	$.getJSON(`https://api.spotify.com/v1/artists/${appState.artistID[0]}/albums`, query, (response) => {				//query2 GETS US THE TRACKS USING ARTIST ID
						response.items.forEach( item => appState.artistAlbumID.push(item.id))
				// console.log(appState.artistAlbumID);	
				 querySpotifyTracks();	
// 
	});
}

 	function querySpotifyTracks(){
 	 albumIDs = appState.artistAlbumID.join(",");
 		console.log(albumIDs);
 		// const query = {

 		// 	id: albumIDs

 		// }



 	// 	$.getJSON(`https://api.spotify.com/v1/albums`, query, (response) => {				//query2 GETS US THE TRACKS USING ARTIST ID
		// 				// response.items.forEach( item => appState.artistAlbumID.push(item.id))
		// 		console.log(response);	
		// })



		$.ajax({
    type: "POST",
    url: "https://api.spotify.com/v1/albums",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: "{id: '" + albumIDs + "'}",
    success: function(json) {
        $("#success").html("json.length=" + json.length);
        itemAddCallback(json);
    },
    // error: function (xhr, textStatus, errorThrown) {
    //     $("#error").html(xhr.responseText);
    // }
});
	}

querySpotifyArtist('adele');

// console.log('bam', appState.artistID);

//1 get artist
//2 get id
//3 get albums

//4 get songs

//https://api.spotify.com/v1/artists/{id}/albums