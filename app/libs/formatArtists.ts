export default function formatArtists(artists: string[]) {  
  if (artists.length > 1) {
    return `${artists.slice(0, -1).join(", ")} & ${artists.slice(-1)}`;
  }
  return artists.join("");
}
