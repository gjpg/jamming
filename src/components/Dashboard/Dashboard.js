import { useEffect, useState } from "react";
import useAuth from "../useAuth";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "../TrackSearchResult/TrackSearchResult";
import Playlist from "../Playlist/Playlist";
import styles from "./Dashboard.module.css";
import Notification from "../Notification/Notification";

const spotifyApi = new SpotifyWebApi({
  clientId: "eb5d23a5344c4b2d9aa3775ae3b3b929",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isError: false,
  });

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const albumThumb = track.album.images.reduce((smallest, image) => {
            if (image.height < smallest.height) return image;
            return smallest;
          }, track.album.images[0]);

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: albumThumb.url,
          };
        })
      );
    });
    return () => (cancel = true);
  }, [search, accessToken]);

  const addTrackToPlaylist = (track) => {
    if (playlistTracks.some((savedTrack) => savedTrack.uri === track.uri)) {
      return;
    }
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrackFromPlaylist = (track) => {
    setPlaylistTracks(
      playlistTracks.filter((savedTrack) => savedTrack.uri !== track.uri)
    );
  };

  const savePlaylistToSpotify = async (name) => {
    try {
      if (!playlistTracks.length) return;

      const me = await spotifyApi.getMe();
      const createdPlaylist = await spotifyApi.createPlaylist(me.body.id, {
        name: name,
        public: true,
        description: "Created via Spotify App",
      });

      const trackUris = playlistTracks.map((track) => track.uri);
      await spotifyApi.addTracksToPlaylist(createdPlaylist.body.id, trackUris);

      setNotification({
        show: true,
        message: `"${name}" playlist saved to Spotify!`,
        isError: false,
      });

      setPlaylistTracks([]);
    } catch (error) {
      console.error("Error saving playlist:", error);
      setNotification({
        show: true,
        message: "Failed to save playlist. Please try again.",
        isError: true,
      });
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  return (
    <Container className={styles.container}>
      <Form.Control
        className={styles.searchInput}
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.contentWrapper}>
        {/* Search Results Column */}
        <div className={styles.searchColumn}>
          <h3>Search Results</h3>
          <div className={styles.searchResults}>
            {searchResults.length > 0 ? (
              searchResults.map((track) => (
                <TrackSearchResult
                  key={track.uri}
                  track={track}
                  variant="add"
                  onButtonClick={() => addTrackToPlaylist(track)}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                {search
                  ? "No results found"
                  : "Search for tracks to add to your playlist"}
              </div>
            )}
          </div>
        </div>

        {/* Playlist Column */}
        <div className={styles.playlistColumn}>
          <Playlist
            tracks={playlistTracks}
            onRemoveTrack={removeTrackFromPlaylist}
            onSavePlaylist={savePlaylistToSpotify}
          />
        </div>
      </div>
      {notification.show && (
        <Notification
          message={notification.message}
          isError={notification.isError}
          onClose={closeNotification}
        />
      )}
    </Container>
  );
}
