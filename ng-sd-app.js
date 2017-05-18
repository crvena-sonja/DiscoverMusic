

const appState = {

	results: [],
	artistID: [],
	artistAlbumID: [],
	artistTracks: []
}


function querySpotifyArtist (){

	const query1 = {
		type: 'artist', 														
		q: "beyonce"

	}

	$.getJSON("https://api.spotify.com/v1/search", query1, function(response)  {
			 appState.artistID.push(response.artists.items[0].id);
				querySpotifyAlbums();

	});

} 

function querySpotifyAlbums(){
		id: appState.artistID[0]
	}

	$.getJSON(`https://api.spotify.com/v1/artists/${appState.artistID[0]}/albums`, query2, (response) => {				//query2 GETS US THE TRACKS USING ARTIST ID
						response.items.forEach( item => appState.artistAlbumID.push(item.id))
						

	});
}

function querySpotifyTracks(){
	$.getJSON(``)               /////do a .join(',')
}

querySpotifyArtist();

// console.log('bam', appState.artistID);

//1 get artist
//2 get id
//3 get albums
//4 get songs

//https://api.spotify.com/v1/artists/{id}/albums