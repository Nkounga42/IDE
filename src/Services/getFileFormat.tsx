function getFileFormat(extension) {
  const formats = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.jsx': 'React (JavaScript)',
    '.tsx': 'React (TypeScript)',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'Sass',
    '.json': 'JSON',
    '.md': 'Markdown',
    '.py': 'Python',
    '.java': 'Java',
    '.c': 'C',
    '.cpp': 'C++',
    '.cs': 'C#',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.go': 'Go',
    '.rs': 'Rust',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.xml': 'XML',
    '.yml': 'YAML',
    '.sh': 'Shell Script',
    '.bat': 'Batch File',
    '.sql': 'SQL',
  };

  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  return formats[ext.toLowerCase()] || 'Format inconnu';
}
 


export default getFileFormat