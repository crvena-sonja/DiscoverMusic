

const appState = {

  search: '',
  artistID: [],
  artistAlbumID: [],
  artistTracks: [],
  albumsIDs: [],
  availAlbums: [],
  initialTracks: [],
  trackIDs: [],
  lowPopTracks: []
};
//State Modification functions
/**
 * @function getArtist
 * @desc get the first item(playlist/album) of the artist
 * @param {state} state that will be modified
 * @param {response} response data from the spotify api
 * @returns state.artistID (first item of the artist)
 */
function getArtist(state,response){
  state.artistID.push(response.artists.items[0].id);
  return state.artistID;
}
/**
 * @function getArtistAlbums
 * @desc get all albums from searched artist
 * @param {state} state that will be modified
 * @param {response} response data from the spotify api
 * @returns state.artistAlbumID (all albums from searched artist)
 */
function getArtistAlbums(state,response){
  response.items.forEach( item => state.artistAlbumID.push(item.id));
  return state.artistAlbumID;
}
/**
 * @function availAlbumsInUS
 * @desc filter all the albums available in U.S.
 * @param {state} state that will be modified
 * @param {response} response data from the spotify api
 * @returns state.availAlbums (all albums that are available in US)
 * changed element to album
 */
function availAlbumsInUS(state,response){
  state.availAlbums.push(response.albums.filter( album => album.available_markets.includes('US')));
  return state.availAlbums;
}
/**
 * @function availTracksInUS
 * @desc grabs a array of albums that are available in U.S. and add tracks from each of these albums into initalTracks
 * @param {state} state that will be modified
 * @returns state.initialTracks (all tracks that are available in US)
 * changed element2 to albumsInUS
 * changed element to tracks
 */
function availTracksInUS(state){
  state.availAlbums[0].forEach(albumsInUS => { albumsInUS.tracks.items.forEach(
	tracks => {state.initialTracks.push(tracks);} );} );
  return state.initialTracks;
}
/**
 * @function getTrackIDs
 * @desc gets all the track ids
 * @param {state} state that will be modified
 * @returns state.trackIDs (all track ids that are available in US)
 * changed element to track
 */
function getTrackIDs(state){
  state.initialTracks.forEach(track => state.trackIDs.push(track.id));
  return state.trackIDs;
}


/**
 * @function querySpotifyArtist
 * @desc gets the JSON element from the Spotify API 
 *       use JSON element to get the first item(playlist/album) of the artist
 *       send that data to querySpotifyAlbums
 * @param {search} search string that was inputted in the input box (artist name)
 * @returns undefined
 */
 
function querySpotifyArtist (search){

  const query1 = {
    type: 'artist', 														
    q: search
  };
  $.getJSON('https://api.spotify.com/v1/search', query1, function(response)  {
			 	emptyState(appState);
			 	console.log(response);
			 	if (response.artists.items.length === 0){
			 		renderTracks($('.tracks'));
			 	}
			 	else{
			 		getArtist(appState,response);
			 		querySpotifyAlbums();
			 	}
				
  });

} 

/**
 * @function querySpotifyAlbums
 * @desc  get the JSON element from the Spotify API 
 *        use JSON element to get the albums from the artist the user searched
 *        send that data to querySpotifyTrackIDS
 * @returns undefined
 */
function querySpotifyAlbums(){

  $.getJSON(`https://api.spotify.com/v1/artists/${appState.artistID[0]}/albums`, (response) => {				//query2 GETS US THE TRACKS USING ARTIST ID
    console.log('this', response);
    getArtistAlbums(appState,response);
    querySpotifyTrackIDs();
  });
}

/**
 * @function querySpotifyTrackIDs
 * @desc get the JSON element from the Spotify API 
 *       use JSON element to get albums that are available in US and push the tracks from each of these albums into initalTracks
 *       send that data to querySpotifyTracks
 * @returns undefined
 * 
 */
function querySpotifyTrackIDs(){
  const query3 = {
		// limit: 50,
    ids: appState.artistAlbumID.splice(0, 20).join(','),
  };
  console.log(query3.ids);

  $.getJSON('https://api.spotify.com/v1/albums', query3, (response) => { 
    console.log('this', response);
    availAlbumsInUS(appState,response);

		//console.log(appState.availAlbums);
    availTracksInUS(appState);

		//console.log(appState.initialTracks);
    getTrackIDs(appState);
    console.log(appState.trackIDs);
    querySpotifyTracks();
  });
}

/**
 * @function querySpotifyTracks
 * @desc  gets a JSON element from Spotify API 
 *        use JSON element to get tracks with popularity less than 50 and then add those objects into lowPopTracks
 * @returns undefined
 */
function querySpotifyTracks(){
  const query4 = {
    ids: appState.trackIDs.slice(0, 50).join(','),
  };

  $.getJSON('https://api.spotify.com/v1/tracks', query4, (response) => {
    (response.tracks.filter(element => element.popularity <= 50)).forEach(element => appState.lowPopTracks.push(element));
    console.log(appState.lowPopTracks);
    renderTracks($('.tracks'));
  });
}

/**
 * @function emptyState
 * @desc resets the state to the original
 * @param {state} the appState
 * @returns undefined
 */
function emptyState(state){
  state.artistID = [];
  state.artistAlbumID = [];
  state.artistTracks = [];
  state.albumsIDs = [];
  state.availAlbums = [];
  state.initialTracks = [];
  state.trackIDs = [];
  state.lowPopTracks = [];

}

/**
 * @function renderTracks
 * @desc renders the tracks onto the DOM
 * @param {element} the jQuery element that will get affected 
 * @returns undefined
 */
function renderTracks(element){
  let html = '';

  if(appState.artistID.length === 0){
    html += '<h2>Oops! We can\'t find that artist, try another.</h2>'; 
  }
  else{
    let j;
    appState.lowPopTracks.length >= 9 ? j=9 : j=appState.lowPopTracks.length;


		 html += '<iframe src="" class="hidden"></iframe>';
		// html += `<audio controls autoplay  class="hidden">
		// 			<source src="" type="audio/mpeg">
		// 		</audio>`
    for(let i = 0; i < j; i+=3){ //0, 3, 6, 9
      html += `<div class="row">
						<div class="col-4">
							<div class="track">
								<img class="image-container" src="${appState.lowPopTracks[i].album.images[0].url}">
								<a id="${i}" href="${appState.lowPopTracks[i].preview_url}"><h3>${appState.lowPopTracks[i].name}</h3><a/>
							</div>
						</div>
						<div class="col-4">
							<div class="track">
								<img class="image-container" src="${appState.lowPopTracks[i+1].album.images[0].url}">
								<a id="${i+1}" href="${appState.lowPopTracks[i+1].preview_url}"><h3>${appState.lowPopTracks[i+1].name}</h3><a/>
							</div>
						</div>
						<div class="col-4">
							<div class="track">
								<img class="image-container" src="${appState.lowPopTracks[i+2].album.images[0].url}">
								<a id="${i+2}" href="${appState.lowPopTracks[i+2].preview_url}"><h3>${appState.lowPopTracks[i+2].name}</h3><a/>
							</div>
						</div>
					</div>`;
    }
  }

	//html += `</ul>`;
  element.html(html);
  element.removeClass('hidden');

}

/**
 * @function addListeners
 * @desc code gets runned when the user clicks on submit, 
 *        when the user clicks on the song name, 
 *        when the user click on the iframe that shows up
 * @returns undefined
 */
function addListeners(){

  $('form').on('submit', function(event){
    event.preventDefault();
    appState.search = $('#search-spotify').val();
    querySpotifyArtist(appState.search);
  });

  $('.tracks').on('click', 'a', function(event){
    event.preventDefault();
    let iframe = $(this).attr('href');
		// console.log(audio);
		// $('audio').find('source').attr("src", audio).toggle("hidden");

    $('iframe').attr('src', iframe).toggle('hidden');
  });

  $('main').on( 'click', 'iframe',function(event){
    event.preventDefault();	
    $(this).css({display: 'none'});
		//$(this).addClass('hidden');
  });
}

$(function () {

  addListeners();

});

