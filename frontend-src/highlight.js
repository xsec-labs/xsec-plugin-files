// 预览用的轻量语法着色：逐行切出注释、字符串、数字和关键字，不认识的扩展名按纯文本显示。
// 只影响显示；行评论提交的仍是原始行文本。
const MAX_HIGHLIGHT_LENGTH = 2_000;
const KEYWORDS = "abstract as async await break case catch chan class const continue def default defer del do elif else enum export extends false final finally fn for from func function go if impl implements import in interface is let match mod mut new nil none null package private protected pub public raise return select self static struct super switch this throw true try type typeof undefined use var void while with yield";
const SLASH = "c cc cpp cs css go h hpp java js jsx kt mjs cjs php rs scala scss swift ts tsx";
const HASH = "bash cfg conf dockerfile env ini makefile mk pl py rb sh tf toml yaml yml zsh";
const DASH = "lua sql";

const STRING = "\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'|`[^`]*`";
const NUMBER = "\\b(?:0[xX][\\da-fA-F]+|\\d+(?:\\.\\d+)?)\\b";
const WORD = `\\b(?:${KEYWORDS.split(" ").join("|")})\\b`;

function grammar(comment) {
  return new RegExp(`(${comment})|(${STRING})|(${NUMBER})|(${WORD})`, "g");
}

const grammars = new Map();
for (const name of SLASH.split(" ")) grammars.set(name, grammar("//.*$|/\\*.*?\\*/"));
for (const name of HASH.split(" ")) grammars.set(name, grammar("#.*$"));
for (const name of DASH.split(" ")) grammars.set(name, grammar("--.*$"));
grammars.set("json", grammar("(?!)"));

const CLASSES = ["tok-comment", "tok-string", "tok-number", "tok-keyword"];

export function grammarFor(fileName) {
  const name = fileName.toLowerCase();
  const extension = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1) : name;
  return grammars.get(extension) ?? null;
}

// tokens 把一行切成 [文本, 类名] 片段，类名为空表示普通文本。
export function tokens(line, pattern) {
  if (!pattern || line.length > MAX_HIGHLIGHT_LENGTH) return [[line, ""]];
  const parts = [];
  let last = 0;
  pattern.lastIndex = 0;
  for (let match = pattern.exec(line); match; match = pattern.exec(line)) {
    if (!match[0]) { pattern.lastIndex += 1; continue; }
    if (match.index > last) parts.push([line.slice(last, match.index), ""]);
    parts.push([match[0], CLASSES[match.slice(1).findIndex((group) => group !== undefined)]]);
    last = match.index + match[0].length;
  }
  if (last < line.length) parts.push([line.slice(last), ""]);
  return parts;
}

export function highlightInto(target, line, pattern) {
  for (const [text, className] of tokens(line, pattern)) {
    if (!className) target.append(text);
    else {
      const span = document.createElement("span");
      span.className = className;
      span.textContent = text;
      target.append(span);
    }
  }
}
