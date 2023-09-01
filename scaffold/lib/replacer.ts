import * as fs from 'fs';

function replaceAll(
  full: string,
  start: string,
  end: string,
  replacement: string,
): string {
  const blockRegex = new RegExp(`${start}[\\s\\S]*?${end}`, 'g');
  const r = `${start}
${replacement}
${end}`;
  return full.replace(blockRegex, r);
}

function replaceFile(
  path: string,
  start: string,
  end: string,
  replacement: string,
) {
  const content = fs.readFileSync(path, 'utf8');
  const replaced = replaceAll(content, start, end, replacement);
  // write back
  fs.writeFileSync(path, replaced, 'utf8');
}

function removeAll(full: string, start: string, end: string): string {
  const blockRegex = new RegExp(`${start}[\\s\\S]*?${end}`, 'g');
  const r = ``;
  return full.replace(blockRegex, r);
}

function removeFile(path: string, start: string, end: string) {
  const content = fs.readFileSync(path, 'utf8');
  const replaced = removeAll(content, start, end);
  // write back
  fs.writeFileSync(path, replaced, 'utf8');
}

function simpleReplaceFile(path: string, search: string, replacement: string) {
  const content = fs.readFileSync(path, 'utf8');
  const replaced = content.replace(search, replacement);
  // write back
  fs.writeFileSync(path, replaced, 'utf8');
}

export { replaceFile, removeFile, simpleReplaceFile };
