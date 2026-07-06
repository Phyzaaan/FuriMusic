export default async function base64ToFile(base64DataUrl: string, filename: string) {
  const response = await fetch(base64DataUrl);
  const blob = await response.blob();
  const mimeType = blob.type; 
  return new File([blob], filename, { type: mimeType });
}