function getFileExtension(filename: string): string | null {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1 || lastDot === 0) return null; // Pas d'extension ou fichier comme ".gitignore"
  return filename.slice(lastDot).toLowerCase(); // Inclut le point : ".tsx"
}
 
export default getFileExtension;