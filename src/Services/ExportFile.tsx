import { saveAs } from 'file-saver';

/**
 * Exporte un fichier dans un format basé sur le langage de programmation.
 *
 * @param filename - Nom du fichier sans extension.
 * @param content - Contenu du fichier.
 * @param extension - Extension du fichier (ex: "js", "py", "html", etc.).
 */


function exportFile(filename: string, content: string, extension: string): void {
  const mimeTypes: Record<string, string> = {
    js: 'application/javascript',
    ts: 'application/typescript',
    py: 'text/x-python',
    java: 'text/x-java-source',
    cpp: 'text/x-c++src',
    c: 'text/x-csrc',
    html: 'text/html',
    css: 'text/css',
    json: 'application/json',
    xml: 'application/xml',
    md: 'text/markdown',
    txt: 'text/plain',
    php: 'application/x-httpd-php',
    sh: 'application/x-sh',
    go: 'text/x-go',
    rb: 'text/x-ruby',
    rs: 'text/rust',
    swift: 'text/x-swift',
    kt: 'text/x-kotlin',
    scala: 'text/x-scala',
    sql: 'application/sql',
    yaml: 'text/yaml',
    yml: 'text/yaml',
  };

  const ext = extension.toLowerCase();
  const mimeType = mimeTypes[ext] || 'text/plain';

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  saveAs(blob, `${filename}.${ext}`);
}

export default exportFile;
