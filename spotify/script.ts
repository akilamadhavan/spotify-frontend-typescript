import { SpotifyApi } from "../src/index";
import AuthorizationCodeWithPKCEStrategy from "../src/auth/AuthorizationCodeWithPKCEStrategy";
import TracksEndpoints from "../src/endpoints/TracksEndpoints";
import CurrentUserTracksEndpoints from "../src/endpoints/TracksEndpoints";
import axios from 'axios';
import { Subscribed } from '../src/entities/Subscribed';


//startServer();
const implicitGrantStrategy = new AuthorizationCodeWithPKCEStrategy(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private, user-read-playback-state, user-modify-playback-state', 'user-library-modify', 'user-library-read', 'playlist-modify-private']
);


const spotify = new SpotifyApi(implicitGrantStrategy);
const profile = await spotify.currentUser.profile();
const apikeyResult = await getTracks();




document.getElementById("displayName")!.innerText = profile.display_name;
if (profile.images[0]) {
    const profileImage = new Image(200, 200);
    profileImage.src = profile.images[0].url;
    document.getElementById("avatar")!.appendChild(profileImage);
}
console.log(profile);
document.getElementById("id")!.innerText = profile.id;
document.getElementById("email")!.innerText = profile.email;
document.getElementById("uri")!.innerText = profile.uri;
document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
document.getElementById("url")!.innerText = profile.href;
document.getElementById("url")!.setAttribute("href", profile.href);
document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? '(no profile image)';

const resultDiv = document.getElementById("result");
const nameInput = document.getElementById("search") as HTMLInputElement;
const nameArtistInput = document.getElementById("artist_search") as HTMLInputElement;
const submitBtn = document.getElementById("submit_btn") as HTMLInputElement;

submitBtn.addEventListener("click", (e) => loadTracks(), false);

async function loadTracks()
{
   
    const search = nameInput.value;
    const artistVal = nameArtistInput.value
    //fetching tracks based on isrc code
     if (search != "") {
      
       
        await spotify.tracks.api.tracks.get(search).then((result: string) => {
        
         try {
                const response = axios.post('http://localhost:3000/api/store', 
                {   userId: profile.id, 
                    email: profile.email, 
                    display_name: profile.display_name,
                    name: result.name,
                    path: result.href,
                    artist: result.artists[0].name,
                    type: result.type,
                    track_id:result.id,
                    api_key: apikeyResult
                }, { headers: { Authorization: apikeyResult }});

                console.log('Server response:', response );
            } catch (error) {
                console.error('Error sending data to server:', error);
            }
  
              document.getElementById('track_artist').innerHTML = result.artists[0].name;
               document.getElementById('track_name').innerHTML = result.name;
        })
            .catch((error) => {
                console.error('result :', error);
            });
    }
    //fetching based on artist
    if (artistVal != "") {
        console.log(apikeyResult);       
        const respt = await spotify.search(artistVal, 'artist').then((result: string) => {
      //take first result for store in db for reference
            try {
                const response = axios.post('http://localhost:3000/api/store',
                {   userId: profile.id, 
                    email: profile.email, 
                    display_name: profile.display_name,
                    name: result.artists.items[0].name,
                    path: result.artists.href,
                    artist: artistVal,
                    type: result.artists.items[0].type,
                    track_id:result.artists.items[0].id,
                    api_key: apikeyResult
                }, { headers: { Authorization: apikeyResult }});

                console.log('Server response:', response );
            } catch (error) {
                console.error('Error sending data to server:', error);
            }
       
              document.getElementById('track_artist').innerHTML = result.artists.items[0].name;
            document.getElementById('track_name').innerHTML = result.artists.items[0].genres[0];
        }).catch((error) => {
            console.error('result :', error);
        });


    }

}


/**
fetching list and api key
*/
function getTracks() {
	 const apikey = axios.post('http://localhost:3000/api/list',  
         {   userId: profile.id,       email: profile.email, 
                    display_name: profile.display_name, }).
                    then((result: string, apiKey: result.data.apikey ) => {
        
         try {
             
             
             show(result);
              return result.data.apikey;
            } catch (error) {
                console.error('Error sending data to server:', error);
            }
         });
       return apikey;

}


/**
show tables from track list
*/
function show(result) {
   
        let tab =
            `<tr>
          <th>Name</th>
          <th>Artist</th>
          <th>Type</th>
          <th>Path</th>
         </tr>`;

        // Loop to access all rows
        for (let r of result.data.trackList) {

            tab += `<tr>
    <td>${r.name} </td>
    <td>${r.artist}</td>
    <td>${r.type}</td>
    <td><a href=${r.path}>Track Path </a></td>         
    </tr>`;
        }
        // Setting innerHTML as tab variable
        document.getElementById("track_list_table").innerHTML = tab;
    
}
