# Furi Music

## Purpose

Furi Music is for myself, sharing with friends, and showcasing in my portfolio. It aims to deliver a modern, interactive experience with playlist management, artist discovery, lyrics display.

## Key Features

- Responsive home page with navigation, search, music controls, and featured content.
- Keyword, artist, playlist search, and filter support.
- Playlist creation with public and private visibility.
- Artist library with unofficial collections and filtering.
- Lyrics toggle for individual songs.
- Songs favorite system.
- User accounts storing favorites, playlists, uploaded songs, and qued song.
- Dashboard for admin to edit and accept the songs and playlist uploaded by users.
- Users can import playlists directly from youtube, apple music and spotify.

## Home Page Structure

The home page includes several main sections:

- **Navigation Bar:** Links for Home, Playlists, Artists, Profile and Credits.
- **Search Bar:** Search by keyword, artist, or playlist, with filter options.
- **Music Bar:** Player controls and currently playing track info.
- **Main Body:** Display of playlists, artists and songs.

### Main Body Sections

- **Playlists:** A horizontal row showcasing featured playlists.
- **Songs:** A horizontal row showcasing featured songs.
- **Artists:** A horizontal row showcasing featured artists.

## Songs

- Users can suggest me songs.
- Songs will be added if I approve.
- Added Songs may apper on Home page.
- Playlists support content filtering to help users find songs quickly.

### Songs Suggestion

Songs suggestion will have a feild for importing it from the other music player apps.
It will also have an edit option which will have following feilds.

- Title
- Image Banner
- Artist Selector
- Mood Selector
- Lyrics

### Songs Page

Songs page will be a page where current playing song will be displayed.

## Lyrics Support

- Songs can display lyrics that users can enable or disable individually.

## Playlist System

- Users can create playlists and select its visibility.
- I can edit playlists.
- Playlists will be published if I approve.
- Public playlists may appear on the home page.
- Playlists support content filtering to help users find songs quickly.

### Playlist Creation

Playlist creator will have following feilds:

- Import playlist
- Title
- Image Banner

### Playlist Page

- **Hero**: Shows title and Banner Image.
- **Main Body**: Shows songs.

## Artists Library

- Contains an unofficial collection of artists.
- I can create Artists or edit song's artist.
- Artists may appear on the home page.
- Includes filtering options to narrow down results.

### Artist Creation

Artist creator will have following feilds:

- Artist Name
- Artist Image

### Artist Page

- **Hero**: Shows Artist's Name and Image.
- **Main Body**: Shows songs.

## Account Features

- User accounts store details such as played songs, favorite songs, playlists, and uploaded tracks.
- Account creation is not required for playlist creation and song uploads.

## Library

Here is where all the user's created playlists and favorite songs will be displayed
It will contain:

- **My Favoriets**: User's favorite songs.
- **Playlists**: User created playlists.

## About Me

This is is where all the information about me and the music player is shown. Like:

- My perosnal info and socials
- technologizes used for creating this music app.
- Other stuff like copyrights etc.

## Clean Up Funtion

Run this commad for clean up!

```
curl -i --request POST 'https://omdzngdkqxzjgodfrjlf.supabase.co/functions/v1/clean-up' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tZHpuZ2RrcXh6amdvZGZyamxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDQxNTYsImV4cCI6MjA5NTI4MDE1Nn0.pWeeLGdCya__TCzq-XwhqovF749v9SroUNLh9s-JoCg'
```
