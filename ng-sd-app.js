

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
			 		appState.artistID.push(response.artists.items[0].id);
			 		querySpotifyAlbums();
			 	}
				
  });

} 

function querySpotifyAlbums(){

  $.getJSON(`https://api.spotify.com/v1/artists/${appState.artistID[0]}/albums`, (response) => {				//query2 GETS US THE TRACKS USING ARTIST ID
    console.log('this', response);
    response.items.forEach( item => appState.artistAlbumID.push(item.id));
    querySpotifyTrackIDs();
  });
}

function querySpotifyTrackIDs(){
  const query3 = {
		// limit: 50,
    ids: appState.artistAlbumID.splice(0, 20).join(','),
  };
  console.log(query3.ids);

  $.getJSON('https://api.spotify.com/v1/albums', query3, (response) => { 
    console.log('this', response);

    appState.availAlbums.push(response.albums.filter( function(element) {
      return (element.available_markets.includes('US'));
    }));

		//console.log(appState.availAlbums);
    appState.availAlbums[0].forEach(element2 => { element2.tracks.items.forEach(
			element => {appState.initialTracks.push(element);} );} );
		//console.log(appState.initialTracks);
    appState.initialTracks.forEach(element => appState.trackIDs.push(element.id));
    console.log(appState.trackIDs);
    querySpotifyTracks();
  });
}

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

