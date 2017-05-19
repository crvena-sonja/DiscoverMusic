

const appState = {

	search: "",
	artistID: [],
	artistAlbumID: [],
	artistTracks: [],
	albumsIDs: [],
	availAlbums: [],
	initialTracks: [],
	trackIDs: [],
	lowPopTracks: []
}


function querySpotifyArtist (search){

	const query1 = {
		type: 'artist', 														
		q: search
	}
	$.getJSON("https://api.spotify.com/v1/search", query1, function(response)  {
			 appState.artistID.push(response.artists.items[0].id);
				querySpotifyAlbums();
				emptyState(appState);

	});

} 

function querySpotifyAlbums(){
	// const query ={
	// 	limit: 50
	// }

	$.getJSON(`https://api.spotify.com/v1/artists/${appState.artistID[0]}/albums`, (response) => {				//query2 GETS US THE TRACKS USING ARTIST ID
						console.log('this', response)
						response.items.forEach( item => appState.artistAlbumID.push(item.id));
						querySpotifyTrackIDs();
	});
}

function querySpotifyTrackIDs(){
	const query3 = {
		// limit: 50,
		ids: appState.artistAlbumID.splice(0, 20).join(','),
	}
	console.log(query3.ids);

	$.getJSON(`https://api.spotify.com/v1/albums`, query3, (response) => { 
		console.log('this', response);

		appState.availAlbums.push(response.albums.filter( function(element) {
			return (element.available_markets.includes("US"));
			}));

		//console.log(appState.availAlbums);
		appState.availAlbums[0].forEach(element2 => { element2.tracks.items.forEach(
			element => {appState.initialTracks.push(element);} )} );
		//console.log(appState.initialTracks);
		appState.initialTracks.forEach(element => appState.trackIDs.push(element.id));
		console.log(appState.trackIDs);
		querySpotifyTracks();
	});
}

function querySpotifyTracks(){
	const query4 = {
		ids: appState.trackIDs.slice(0, 50).join(','),
	}

	$.getJSON('https://api.spotify.com/v1/tracks', query4, (response) => {
		(response.tracks.filter(element => element.popularity <= 50)).forEach(element => appState.lowPopTracks.push(element));
		console.log(appState.lowPopTracks);
		renderTracks($('.tracks'));
		});
}

function emptyState(state){
	state.lowPopTracks = [];
}

function renderTracks(element){
	let html = ``;

	let j;
	appState.lowPopTracks.length >= 10 ? j=10 : j=appState.lowPopTracks.length;

	for(let i = 0; i < j; i++){
		html += `<div class="image-container col-3">
					
					<img src="${appState.lowPopTracks[i].album.images[0].url}">
					<a href="${appState.lowPopTracks[i].preview_url}"><h3>${appState.lowPopTracks[i].name}</h3><a/>


				</div>`;
	}

	//html += `</ul>`;
	element.html(html);
	element.removeClass("hidden");

}

function addListeners(){

	$('form').on('submit', function(event){
		event.preventDefault();
		appState.search = $('#search-spotify').val();
		querySpotifyArtist(appState.search);
	});
}

$(function () {

addListeners();

});


