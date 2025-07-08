export async function loadTemplate(filePath) {
  const res = await fetch(new URL(filePath, import.meta.url));
  const htmlText = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const template = doc.querySelector('template');

  if (!template) {
    throw new Error(`Template not found in ${filePath}`);
  }

  return template.content.cloneNode(true);
}
