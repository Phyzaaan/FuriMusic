import fs from "fs"
import path from 'path'
import {getAudioDurationInSeconds} from "get-audio-duration";

const songsDir = "/home/lenovo/Projects/furi-music/public/Songs";
const bannerDir = "/home/lenovo/Projects/furi-music/public/SongsBanner";
const artistDir = "/home/lenovo/Projects/furi-music/public/ArtistsBanner";
const SongsScriptPath = "/home/lenovo/Projects/furi-music/app/data/songs.js";
const ArtistsScriptPath =
  "/home/lenovo/Projects/furi-music/app/data/artists.js";

function getArtists(filename) {
  let artist = filename.includes("-")
    ? filename.split(/-/g).slice(0, -1).join("-")
    : "Unknown";
  artist = artist.includes("ft.") ? artist.split("ft.")[0] : artist;
  artist = artist.replace(/_/g, " ");

  // If it has neither, return the single trimmed string
  if (!artist.includes(",") && !artist.includes("&")) {
    return artist.trim();
  }

  // Split by both "," and "&", then clean up the whitespace
  return artist.split(/[,&]/).map((name) => name.trim());
}

// Helper to get song artist name
function getArtistName(filename) {
  let artist = filename.includes("-")
    ? filename.split(/-/g).slice(0, -1).join("-")
    : "Unknown";
  return artist.replace(/_/g, " ").trim();
}

// Helper to get song name
function getSongName(filename) {
  let name = filename.includes("-")
    ? filename.split(/-/g).slice(-1)[0]
    : filename;
  console.log(name);
  name = name.includes(".") ? name.split(".").slice(0, -1).join(".") : name;
  return name.replace(/_/g, " ").trim();
}

// Helper to get song image
function getSongBanner(songName) {
  let files = fs.readdirSync(bannerDir);
  let path = files.find(
    (items) =>
      items.split(".").slice(0, -1).join(".").toLowerCase() ==
      songName.toLowerCase(),
  );
  return !!path ? path : "Music.png";
}
// Helper to get artist image
function getArtistBanner(artistName) {
  let files = fs.readdirSync(artistDir);
  let path = files.find(
    (items) =>
      items.split(".").slice(0, -1).join(".").toLowerCase() ==
      artistName.toLowerCase(),
  );
  return !!path ? path : "Artist.png";
}

// Read songs directory
fs.readdir(songsDir, async (err, files) => {
  if (err) {
    console.error("Error reading songs directory:", err);
    return;
  }

  const songs = files.filter((file) => {
    let song =
      file.endsWith(".mp3") ||
      file.endsWith(".wav") ||
      file.endsWith(".opus") ||
      file.endsWith(".m4a");
    return song;
  });

  {
    /* Code for  Songs data generator is Below */
  }
  const SongsData = await Promise.all(
    songs.map(async (file, id) => {
      const baseName = path.basename(file);

      // Check if corresponding image exists
      const songName = getSongName(baseName);
      const songBanner = getSongBanner(songName);
      try {
        // 3. Use standard await here instead of .then() so the data flows downward cleanly
        const duration = await getAudioDurationInSeconds(`${songsDir}/${file}`);

        console.log(`Duration: ${duration} seconds`);
        const mins = Math.floor(duration / 60);
        const secs = Math.floor(duration % 60)
          .toString()
          .padStart(2, "0"); // Nicely formats seconds like :05 instead of :5

        // 4. Return the object directly to the map function
        return {
          id: id.toString(),
          name: songName.replace(/_/g, " "),
          artist: getArtistName(baseName),
          banner: songBanner,
          url: baseName,
          duration: `${mins}:${secs}`,
        };
      } catch (e) {
        console.error(`Error getting duration for ${file}:`, e);
        // Return a fallback object so your app doesn't crash if one audio file is corrupted
        return {
          id: id.toString(),
          name: songName.replace(/_/g, " "),
          artist: getArtistName(baseName),
          banner: songBanner,
          src: baseName,
          duration: "0:00",
        };
      }
    }),
  );

  {
    /* Code for Songs dummy data generator is above */
  }

  {
    /* Code for artists dummy data generator is below */
  }
  const artists = [];

  songs.forEach((song) => {
    const baseName = path.basename(song);
    const artistsName = getArtists(baseName);
    console.log(artistsName);

    if (!artists.includes(artistsName)) {
      Array.isArray(artistsName)
        ? artists.push(...artistsName)
        : artists.push(artistsName);
    }
  });

  const ArtistsData = artists.map((artist, id) => {
    return {
      id: id.toString(),
      name: artist,
      image: getArtistBanner(artist),
      songs: [],
    };
  });

  songs.forEach((song, index) => {
    const baseName = path.basename(song);
    const artistName = getArtists(baseName);
    ArtistsData.forEach((artistObj) => {
      if (artistName.includes(artistObj.name)) {
        artistObj.songs.push(index.toString());
      }
    });
  });
  {
    /* Code for artists dummy data generator is above */
  }

  // Read songs.js
  fs.readFile(SongsScriptPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading script.js:", err);
      return;
    }

    const playlistString = `// [START]
      let Songs = ${JSON.stringify(SongsData, null, 4)};
      // [END]`;

    // Replace content between markers
    const regex = /\/\/ \[START\][\s\S]*?\/\/ \[END\]/;
    const updatedData = data.replace(regex, playlistString);

    // Write back to script.js
    fs.writeFile(SongsScriptPath, updatedData, "utf8", (err) => {
      if (err) {
        console.error("Error writing to script.js:", err);
        return;
      }
      console.log("Playlist updated successfully!");
      console.log(`Added ${SongsData.length} song.`);
    });
  });

  // Read artists.js
  fs.readFile(ArtistsScriptPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading script.js:", err);
      return;
    }

    const playlistString = `// [START]
      let Artists = ${JSON.stringify(ArtistsData, null, 4)};
      // [END]`;

    // Replace content between markers
    const regex = /\/\/ \[START\][\s\S]*?\/\/ \[END\]/;
    const updatedData = data.replace(regex, playlistString);

    // Write back to script.js
    fs.writeFile(ArtistsScriptPath, updatedData, "utf8", (err) => {
      if (err) {
        console.error("Error writing to script.js:", err);
        return;
      }
      console.log("Playlist updated successfully!");
      console.log(`Added ${ArtistsData.length} song.`);
    });
  });
});
