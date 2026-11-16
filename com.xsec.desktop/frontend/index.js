function text(value,label){if(typeof value!="string"||!value)throw new Error(`${label}格式无效`);return value}function fileEntry(value){if(!value||typeof value!="object"||Array.isArray(value))throw new Error("项目文件条目格式无效");let entry=value;if(typeof entry.is_dir!="boolean"||typeof entry.size!="number"||!Number.isFinite(entry.size))throw new Error("项目文件元数据格式无效");return{name:text(entry.name,"文件名"),path:text(entry.path,"文件路径"),isDirectory:entry.is_dir,size:entry.size}}function fileEntries(value){if(!value||typeof value!="object"||Array.isArray(value)||!Array.isArray(value.files))throw new Error("项目文件列表结果无效");return value.files.map(fileEntry)}function fileContent(value){if(!value||typeof value!="object"||Array.isArray(value)||typeof value.content!="string")throw new Error("文件读取结果无有效文本内容");return value.content}function previewLines(content){let lines=content.split(/\r?\n/,2001);return{lines:lines.slice(0,2e3),truncated:lines.length>2e3}}function formatFileSize(size){return size<1024?`${size} B`:size<1048576?`${(size/1024).toFixed(size<1024*10?1:0)} KB`:`${(size/1048576).toFixed(1)} MB`}function workspaceKey(context){let revision=context?.surface?.bindingRevision;return typeof revision=="string"?revision:""}function composerWritable(context){return context?.workspace?.canAddComposerReference===!0}function commentText(value){let comment=text(value,"评论").trim();if(!comment||comment.length>32768)throw new Error("评论内容无效");return comment}var KEYWORDS="abstract as async await break case catch chan class const continue def default defer del do elif else enum export extends false final finally fn for from func function go if impl implements import in interface is let match mod mut new nil none null package private protected pub public raise return select self static struct super switch this throw true try type typeof undefined use var void while with yield",SLASH="c cc cpp cs css go h hpp java js jsx kt mjs cjs php rs scala scss swift ts tsx",HASH="bash cfg conf dockerfile env ini makefile mk pl py rb sh tf toml yaml yml zsh",DASH="lua sql",STRING="\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'|`[^`]*`",NUMBER="\\b(?:0[xX][\\da-fA-F]+|\\d+(?:\\.\\d+)?)\\b",WORD=`\\b(?:${KEYWORDS.split(" ").join("|")})\\b`;function grammar(comment){return new RegExp(`(${comment})|(${STRING})|(${NUMBER})|(${WORD})`,"g")}var grammars=new Map;for(let name of SLASH.split(" "))grammars.set(name,grammar("//.*$|/\\*.*?\\*/"));for(let name of HASH.split(" "))grammars.set(name,grammar("#.*$"));for(let name of DASH.split(" "))grammars.set(name,grammar("--.*$"));grammars.set("json",grammar("(?!)"));var CLASSES=["tok-comment","tok-string","tok-number","tok-keyword"];function grammarFor(fileName){let name=fileName.toLowerCase(),extension=name.includes(".")?name.slice(name.lastIndexOf(".")+1):name;return grammars.get(extension)??null}function tokens(line,pattern){if(!pattern||line.length>2e3)return[[line,""]];let parts=[],last=0;pattern.lastIndex=0;for(let match=pattern.exec(line);match;match=pattern.exec(line)){if(!match[0]){pattern.lastIndex+=1;continue}match.index>last&&parts.push([line.slice(last,match.index),""]),parts.push([match[0],CLASSES[match.slice(1).findIndex(group=>group!==void 0)]]),last=match.index+match[0].length}return last<line.length&&parts.push([line.slice(last),""]),parts}function highlightInto(target,line,pattern){for(let[text2,className]of tokens(line,pattern))if(!className)target.append(text2);else{let span=document.createElement("span");span.className=className,span.textContent=text2,target.append(span)}}var SVG_NAMESPACE="http://www.w3.org/2000/svg",iconPaths={alert:["circle:12:12:9","path:M12 8v5","path:M12 16.5v.01"],arrowLeft:["path:M19 12H5","path:M11 6l-6 6 6 6"],at:["circle:12:12:4","path:M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"],check:["circle:12:12:9","path:M8.5 12.5l2.5 2.5 4.5-5"],chevronRight:["path:M9 6l6 6-6 6"],file:["path:M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z","path:M14 3v5h5"],folder:["path:M3 7a2 2 0 0 1 2-2h4.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"],folderOpen:["path:M3 17V7a2 2 0 0 1 2-2h4.5l2 2H18a2 2 0 0 1 2 2v1","path:M3 17l2.2-5.6A2 2 0 0 1 7 10h13.5a1 1 0 0 1 .9 1.4L19 17.7a2 2 0 0 1-1.9 1.3H5a2 2 0 0 1-2-2Z"],message:["path:M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.7-.9L3 21l1.8-4.6a8.4 8.4 0 0 1-.9-3.9 8.4 8.4 0 0 1 8.4-8.4 8.5 8.5 0 0 1 8.7 7.5Z"],plus:["path:M12 5v14","path:M5 12h14"],refresh:["path:M20 11a8 8 0 0 0-14.3-4.3L4 8.5","path:M4 4v4.5h4.5","path:M4 13a8 8 0 0 0 14.3 4.3l1.7-1.8","path:M20 20v-4.5h-4.5"]};function svgElement(name){return document.createElementNS(SVG_NAMESPACE,name)}function appendShape(svg,descriptor){let[kind,...values]=descriptor.split(":"),node=svgElement(kind);kind==="circle"&&["cx","cy","r"].forEach((name,index)=>node.setAttribute(name,values[index])),kind==="path"&&node.setAttribute("d",values.join(":")),svg.append(node)}function icon(name,size=16){let svg=svgElement("svg");svg.setAttribute("aria-hidden","true"),svg.setAttribute("fill","none"),svg.setAttribute("height",String(size)),svg.setAttribute("stroke","currentColor"),svg.setAttribute("stroke-linecap","round"),svg.setAttribute("stroke-linejoin","round"),svg.setAttribute("stroke-width",size<=12?"2.5":"1.75"),svg.setAttribute("viewBox","0 0 24 24"),svg.setAttribute("width",String(size));for(let descriptor of iconPaths[name]??[])appendShape(svg,descriptor);return svg}function element(name,className,content){let node=document.createElement(name);return className&&(node.className=className),content!==void 0&&(node.textContent=content),node}function actionButton(className,label,onClick){let button=element("button",className);return button.type="button",button.setAttribute("aria-label",label),button.addEventListener("click",onClick),button}function errorNotice(message,retry){let notice=element("div","ui-notice");if(notice.setAttribute("role","alert"),notice.append(icon("alert",14),element("span","",message)),retry){let button=actionButton("ui-button","重试",retry);button.textContent="重试",notice.append(button)}return notice}function errorPanel(message,retry){let panel=element("section","ui-empty is-error");panel.setAttribute("role","alert");let mark=element("span","ui-empty-mark");if(mark.append(icon("alert",20)),panel.append(mark,element("p","",message)),retry){let button=actionButton("ui-button","重试",retry);button.textContent="重试",panel.append(button)}return panel}function emptyPanel(message,iconName="folderOpen"){let panel=element("section","ui-empty"),mark=element("span","ui-empty-mark");return mark.append(icon(iconName,20)),panel.append(mark,element("strong","",message)),panel}function noticePanel(message){let notice=element("div","ui-toast");return notice.setAttribute("aria-live","polite"),notice.setAttribute("role","status"),notice.append(icon("check",16),element("span","",message)),notice}function loadingPanel(rows=8){let panel=element("section","ui-skeleton");panel.setAttribute("aria-busy","true"),panel.setAttribute("aria-label","加载中");for(let index=0;index<rows;index+=1)panel.append(element("span",""));return panel}function focusLater(selector){queueMicrotask(()=>document.querySelector(selector)?.focus())}function composerButton(controller,file){let button=actionButton("ui-button is-ghost is-icon project-file-header-action",`添加 ${file.name} 到会话`,()=>{controller.addPath(file)}),busy=controller.state.addingPaths.has(file.path);return button.disabled=!controller.composerWritable||busy,button.title=controller.composerWritable?"添加到会话":"当前会话不可编辑",busy&&button.setAttribute("aria-busy","true"),button.append(icon(busy?"refresh":"at")),button}function commentEditor(controller,lineNumber,code){let editor=element("form","file-line-comment-editor"),heading=element("div","file-line-comment-heading");heading.append(icon("message"),element("strong","","本地评论"),element("small","",`对第 ${lineNumber} 行发表评论`));let input=document.createElement("textarea");input.dataset.commentInput="",input.setAttribute("aria-label","评论"),input.placeholder="输入给 Agent 的评论…",input.value=controller.state.comment;let submit;input.addEventListener("input",()=>{controller.state.comment=input.value,submit&&(submit.disabled=!controller.composerWritable||!input.value.trim())}),input.addEventListener("keydown",event=>{(event.metaKey||event.ctrlKey)&&event.key==="Enter"&&(event.preventDefault(),controller.submitComment(lineNumber,code))});let footer=element("footer","file-line-comment-footer"),cancel=actionButton("ui-button","取消评论",()=>controller.cancelComment());cancel.textContent="取消",submit=actionButton("ui-button is-primary project-files-primary","添加到对话框",()=>{controller.submitComment(lineNumber,code)}),submit.disabled=!controller.composerWritable||controller.state.submittingComment||!input.value.trim(),controller.state.submittingComment&&submit.setAttribute("aria-busy","true"),submit.textContent="添加到对话框",editor.addEventListener("submit",event=>{event.preventDefault(),controller.submitComment(lineNumber,code)});let hint=element("kbd","",/mac/i.test(navigator.platform)?"⌘ Enter 提交":"Ctrl Enter 提交");return hint.setAttribute("aria-hidden","true"),footer.append(hint,cancel,submit),editor.append(heading,input,footer),focusLater("[data-comment-input]"),editor}function codeRows(controller){let table=element("div","project-file-code");table.setAttribute("aria-label",`${controller.state.selected.name} 文件内容`),table.setAttribute("role","table");let preview=previewLines(controller.state.content),pattern=grammarFor(controller.state.selected.name);return table.style.setProperty("--line-digits",String(String(preview.lines.length).length)),preview.lines.forEach((code,index)=>{let lineNumber=index+1,line=element("div",`project-file-line${controller.state.commentLine===lineNumber?" is-commenting":""}`);line.setAttribute("role","row");let trigger=actionButton("file-line-comment-trigger",`评论第 ${lineNumber} 行`,()=>controller.startComment(lineNumber));trigger.disabled=!controller.composerWritable,trigger.append(icon("plus",12));let text2=element("code","");code?highlightInto(text2,code,pattern):text2.textContent=" ",line.append(trigger,element("span","file-line-number",String(lineNumber)),text2),controller.state.commentLine===lineNumber&&line.append(commentEditor(controller,lineNumber,code)),table.append(line)}),{table,truncated:preview.truncated}}function renderPreview(controller){let file=controller.state.selected,view=element("section","project-files-view has-preview"),preview=element("section","project-file-preview"),header=element("header",""),back=actionButton("ui-button is-ghost is-icon project-file-header-action","返回项目文件树",()=>controller.closeFile());back.title="返回",back.append(icon("arrowLeft"));let title=element("div","project-file-title"),path=element("small","");if(path.title=file.path,path.append(element("bdi","",file.path)),title.append(element("strong","",file.name),path),header.append(back,title,composerButton(controller,file)),preview.append(header),controller.state.actionError&&preview.append(errorNotice(controller.state.actionError)),controller.state.actionNotice&&preview.append(noticePanel(controller.state.actionNotice)),controller.state.previewError)preview.append(errorPanel(controller.state.previewError,()=>{controller.openFile(file)}));else if(controller.state.fileLoading)preview.append(loadingPanel());else{let code=codeRows(controller);preview.append(code.table),code.truncated&&preview.append(element("p","project-file-truncated",`文件行数较多，仅显示前 ${2e3.toLocaleString()} 行`))}return view.append(preview),view}var themeStyles=`
:root {
  --d-canvas: #f7f7f8; --d-surface: #ffffff; --d-subtle: #f0f0f2; --d-hover: #eaeaed;
  --d-text: #18181b; --d-muted: #62626b; --d-border: #dcdce1; --d-accent: #0169cc;
  --d-danger: #b42318; --d-success: #187344; --d-warning: #8a5700;
}
@media (prefers-color-scheme: dark) {
  :root {
    --d-canvas: #111113; --d-surface: #19191c; --d-subtle: #232327; --d-hover: #2d2d33;
    --d-text: #f4f4f5; --d-muted: #a1a1aa; --d-border: #35353c; --d-accent: #0169cc;
    --d-danger: #ff938a; --d-success: #7ad6a0; --d-warning: #e9bd70;
  }
}
:root {
  --ui-canvas: var(--xsec-window-background, var(--d-canvas));
  --ui-surface: var(--xsec-content-surface, var(--d-surface));
  --ui-subtle: var(--xsec-bg-subtle, var(--d-subtle));
  --ui-hover: var(--xsec-bg-hover, var(--d-hover));
  --ui-text: var(--xsec-text-primary, var(--d-text));
  --ui-muted: var(--xsec-text-secondary, var(--d-muted));
  --ui-border: var(--xsec-border-default, var(--d-border));
  --ui-accent: var(--xsec-text-accent, var(--d-accent));
  --ui-on-accent: #ffffff;
  --ui-danger: var(--xsec-status-error, var(--d-danger));
  --ui-success: var(--xsec-status-success, var(--d-success));
  --ui-warning: var(--xsec-status-warning, var(--d-warning));
  --ui-radius: var(--xsec-radius-md, 8px);
  --ui-radius-panel: var(--xsec-radius-lg, 12px);
  /* 由上面几项推出：强调色当文字用时向正文色靠拢，亮暗两套底上都读得清；淡底用于选中和高亮。 */
  --ui-accent-text: color-mix(in srgb, var(--ui-accent) 64%, var(--ui-text));
  --ui-accent-soft: color-mix(in srgb, var(--ui-accent) 14%, transparent);
  --ui-accent-hover: color-mix(in srgb, var(--ui-accent) 88%, var(--ui-text));
  --ui-faint: color-mix(in srgb, var(--ui-muted) 72%, var(--ui-surface));
  --ui-hairline: color-mix(in srgb, var(--ui-text) 10%, transparent);
  --ui-danger-soft: color-mix(in srgb, var(--ui-danger) 12%, transparent);
  --ui-success-soft: color-mix(in srgb, var(--ui-success) 14%, transparent);
  --ui-warning-soft: color-mix(in srgb, var(--ui-warning) 16%, transparent);
  --ui-shadow: 0 8px 24px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 8%);
  --ui-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif;
  --ui-mono: ui-monospace, "SF Mono", "Cascadia Mono", Consolas, "Liberation Mono", monospace;
  --ui-ease: cubic-bezier(.2, 0, 0, 1);
  background: var(--ui-surface);
  color: var(--ui-text);
  font: 14px/1.45 var(--ui-font);
  -webkit-font-smoothing: antialiased;
}
*, *::before, *::after { box-sizing: border-box; }
html, body, [data-xsec-plugin-root] { min-width: 0; min-height: 100%; margin: 0; }
button, textarea, input { font: inherit; color: inherit; }
button { -webkit-tap-highlight-color: transparent; }
:focus-visible { outline: 2px solid var(--ui-accent-text); outline-offset: 1px; }
::selection { background: color-mix(in srgb, var(--ui-accent) 28%, transparent); }
* { scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--ui-muted) 40%, transparent) transparent; }

/* 按钮：默认灰底，主操作强调色实心，图标按钮透明底。高度 32，与 Desktop 的紧凑密度一致。 */
.ui-button {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  height: 32px; padding: 0 12px; border: 0; border-radius: var(--ui-radius);
  background: var(--ui-subtle); color: var(--ui-text); font-weight: 500; white-space: nowrap; cursor: pointer;
  transition: background-color .12s var(--ui-ease), color .12s var(--ui-ease), opacity .12s var(--ui-ease);
}
.ui-button:hover:not(:disabled) { background: var(--ui-hover); }
.ui-button:active:not(:disabled) { background: color-mix(in srgb, var(--ui-hover) 80%, var(--ui-text)); }
.ui-button:disabled { cursor: not-allowed; opacity: .45; }
.ui-button.is-primary { background: var(--ui-accent); color: var(--ui-on-accent); }
.ui-button.is-primary:hover:not(:disabled) { background: var(--ui-accent-hover); }
.ui-button.is-ghost { background: transparent; color: var(--ui-muted); }
.ui-button.is-ghost:hover:not(:disabled) { background: var(--ui-hover); color: var(--ui-text); }
.ui-button.is-icon { width: 32px; padding: 0; }
.ui-button[aria-busy="true"] svg { animation: ui-spin .9s linear infinite; }
.ui-button svg { flex: 0 0 auto; }

/* 提示条只用于错误；成功的确认用底部的状态气泡。 */
.ui-notice {
  display: flex; align-items: flex-start; gap: 8px; margin: 8px 12px 0; padding: 8px 12px;
  border-radius: var(--ui-radius); background: var(--ui-danger-soft); color: var(--ui-danger); overflow-wrap: anywhere;
}
.ui-notice svg { flex: 0 0 auto; margin-top: 2px; }
.ui-notice span { flex: 1; min-width: 0; }
.ui-notice .ui-button { height: 26px; padding: 0 8px; font-size: 12px; margin: -2px 0; background: transparent; color: inherit; box-shadow: inset 0 0 0 1px currentColor; }
.ui-toast {
  position: fixed; left: 50%; bottom: 16px; z-index: 5; transform: translateX(-50%);
  display: flex; align-items: center; gap: 8px; max-width: calc(100% - 32px); padding: 7px 12px 7px 10px;
  border: 1px solid var(--ui-hairline); border-radius: 999px; background: var(--ui-surface); color: var(--ui-text);
  box-shadow: var(--ui-shadow); animation: ui-rise .2s var(--ui-ease);
}
.ui-toast svg { flex: 0 0 auto; color: var(--ui-success); }
.ui-toast span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ui-empty { display: grid; justify-items: center; align-content: center; gap: 10px; min-height: 220px; padding: 32px 24px; color: var(--ui-muted); text-align: center; }
.ui-empty-mark { display: grid; width: 40px; height: 40px; place-items: center; border-radius: var(--ui-radius-panel); background: var(--ui-subtle); color: var(--ui-muted); }
.ui-empty strong { color: var(--ui-text); font-size: 14px; font-weight: 600; }
.ui-empty.is-error .ui-empty-mark { background: var(--ui-danger-soft); color: var(--ui-danger); }
.ui-empty p { max-width: 320px; margin: 0; overflow-wrap: anywhere; }

.ui-skeleton { display: grid; gap: 10px; padding: 12px 16px; }
.ui-skeleton span {
  display: block; height: 14px; border-radius: 4px;
  background: linear-gradient(90deg, var(--ui-subtle) 25%, var(--ui-hover) 50%, var(--ui-subtle) 75%) 0 0 / 200% 100%;
  animation: ui-shimmer 1.4s linear infinite;
}
.ui-skeleton span:nth-child(3n + 1) { width: 62%; }
.ui-skeleton span:nth-child(3n + 2) { width: 84%; }
.ui-skeleton span:nth-child(3n) { width: 46%; }

@keyframes ui-spin { to { transform: rotate(360deg); } }
@keyframes ui-shimmer { to { background-position: -200% 0; } }
@keyframes ui-rise { from { opacity: 0; transform: translate(-50%, 6px); } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
`;var styles=`${themeStyles}
.project-files-view { display: flex; flex-direction: column; min-height: 100vh; background: var(--ui-surface); }

/* 面板头：标题在左、操作在右，滚动时留在顶部。 */
.project-files-toolbar, .project-file-preview > header {
  position: sticky; top: 0; z-index: 3; display: flex; align-items: center; gap: 8px;
  height: 52px; flex: 0 0 auto; padding: 0 8px 0 12px;
  border-bottom: 1px solid var(--ui-hairline); background: var(--ui-surface);
}
.project-files-toolbar strong { flex: 1; min-width: 0; font-size: 14px; font-weight: 600; }

/* 文件树 */
.file-tree { display: grid; padding: 8px 8px 56px; }
.file-tree-branch { display: contents; }
.file-tree-row {
  position: relative; display: grid; min-width: 0; height: 32px;
  grid-template-columns: minmax(0, 1fr) auto; align-items: center;
  padding-left: calc(var(--file-tree-depth) * 16px); border-radius: var(--ui-radius);
  transition: background-color .12s var(--ui-ease);
}
.file-tree-row:hover, .file-tree-row:focus-within { background: var(--ui-hover); }
.file-tree-row::before {
  content: ""; position: absolute; inset: 0 auto 0 11px; width: calc(var(--file-tree-depth) * 16px);
  background: repeating-linear-gradient(90deg, var(--ui-hairline) 0 1px, transparent 1px 16px);
  pointer-events: none;
}
.file-tree-main-action {
  display: grid; min-width: 0; height: 100%; grid-template-columns: 14px 16px minmax(0, 1fr) auto;
  align-items: center; gap: 6px; padding: 0 8px 0 4px; border: 0; border-radius: var(--ui-radius);
  background: transparent; color: var(--ui-muted); cursor: pointer; text-align: left;
}
.file-tree-main-action:focus-visible { outline-offset: -2px; }
.file-tree-chevron { display: grid; place-items: center; color: var(--ui-faint); transition: transform .12s var(--ui-ease); }
.file-tree-chevron.is-open { transform: rotate(90deg); }
.file-tree-icon { display: grid; place-items: center; }
.file-tree-icon.is-directory { color: var(--ui-accent-text); }
.file-tree-name { overflow: hidden; color: var(--ui-text); text-overflow: ellipsis; white-space: nowrap; }
.file-tree-metadata { color: var(--ui-faint); font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.file-tree-add-action { margin-right: 2px; opacity: 0; }
.file-tree-add-action.ui-button { width: 26px; height: 26px; padding: 0; }
.file-tree-row:hover .file-tree-add-action,
.file-tree-add-action:focus-visible,
.file-tree-add-action[aria-busy="true"] { opacity: 1; }
.file-tree-add-action:hover:not(:disabled) { background: var(--ui-accent-soft); color: var(--ui-accent-text); }
.file-tree-add-action:disabled { opacity: 0; }
.file-tree-row:hover .file-tree-add-action:disabled { opacity: .4; }
.file-tree .ui-skeleton { padding: 6px 8px 6px calc(var(--file-tree-depth) * 16px + 28px); }
.file-tree .ui-notice { margin: 4px 0 4px calc(var(--file-tree-depth) * 16px + 8px); }

/* 预览 */
.project-file-preview { display: flex; flex: 1; flex-direction: column; min-width: 0; }
.project-file-preview > header { padding-left: 8px; }
.project-file-preview > .ui-notice { margin-bottom: 8px; }
.project-file-title { display: grid; flex: 1; min-width: 0; line-height: 1.25; }
.project-file-title strong { overflow: hidden; font-size: 14px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.project-file-title small {
  overflow: hidden; color: var(--ui-faint); direction: rtl; font: 12px/1.3 var(--ui-mono);
  text-align: left; text-overflow: ellipsis; white-space: nowrap;
}
.project-file-title small bdi { direction: ltr; }
.project-file-code {
  flex: 1; overflow: auto hidden; padding: 6px 0 56px; background: var(--ui-surface);
  font: 13px/20px var(--ui-mono); tab-size: 4;
}
.project-file-line {
  position: relative; display: grid; min-width: max-content;
  grid-template-columns: 26px calc(var(--line-digits, 3) * 1ch + 18px) minmax(240px, 1fr);
}
.project-file-line:hover { background: color-mix(in srgb, var(--ui-hover) 60%, transparent); }
.project-file-line.is-commenting { background: var(--ui-accent-soft); box-shadow: inset 2px 0 0 var(--ui-accent); }
.file-line-comment-trigger {
  display: grid; width: 18px; height: 18px; place-items: center; place-self: center end; padding: 0; border: 0;
  border-radius: 5px; background: var(--ui-accent); color: var(--ui-on-accent); cursor: pointer;
  opacity: 0; pointer-events: none; transition: transform .12s var(--ui-ease);
}
.project-file-line:hover .file-line-comment-trigger:not(:disabled), .file-line-comment-trigger:focus-visible { opacity: 1; pointer-events: auto; }
.file-line-comment-trigger:hover { transform: scale(1.12); }
.file-line-number { padding: 0 12px 0 6px; color: var(--ui-faint); font-variant-numeric: tabular-nums; text-align: right; user-select: none; }
.project-file-line.is-commenting .file-line-number { color: var(--ui-accent-text); }
.project-file-line code { padding-right: 16px; color: var(--ui-text); font: inherit; white-space: pre; }
.tok-comment { color: var(--ui-faint); font-style: italic; }
.tok-string { color: var(--ui-success); }
.tok-number { color: var(--ui-warning); }
.tok-keyword { color: var(--ui-accent-text); }

/* 行评论：一张卡片，取消在左、提交在右。 */
.file-line-comment-editor {
  position: sticky; left: 12px; grid-column: 1 / -1; width: min(480px, calc(100vw - 24px));
  margin: 6px 0 10px 12px; padding: 12px; border: 1px solid var(--ui-border); border-radius: var(--ui-radius-panel);
  background: var(--ui-surface); box-shadow: var(--ui-shadow); font: 14px/1.45 var(--ui-font);
}
.file-line-comment-heading { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: var(--ui-muted); }
.file-line-comment-heading strong { color: var(--ui-text); font-weight: 600; }
.file-line-comment-heading small { margin-left: auto; padding: 1px 8px; border-radius: 999px; background: var(--ui-subtle); font-size: 12px; }
.file-line-comment-editor textarea {
  display: block; width: 100%; min-height: 72px; resize: vertical; padding: 8px 10px; border: 1px solid transparent;
  border-radius: var(--ui-radius); background: var(--ui-subtle); color: var(--ui-text); line-height: 1.5;
  transition: border-color .12s var(--ui-ease), background-color .12s var(--ui-ease);
}
.file-line-comment-editor textarea::placeholder { color: var(--ui-faint); }
.file-line-comment-editor textarea:focus { border-color: var(--ui-accent-text); background: var(--ui-surface); outline: 0; }
.file-line-comment-footer { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
.file-line-comment-footer .ui-button:first-of-type { margin-left: auto; }
.file-line-comment-footer kbd { color: var(--ui-faint); font: 11px/1 var(--ui-font); }
.project-file-truncated { margin: 0; padding: 10px 16px 56px; border-top: 1px solid var(--ui-hairline); color: var(--ui-muted); font-size: 12px; text-align: center; }

@media (hover: none) {
  .file-tree-add-action:not(:disabled) { opacity: 1; }
  .file-line-comment-trigger:not(:disabled) { opacity: .55; pointer-events: auto; }
}
@media (max-width: 380px) {
  .file-line-comment-footer kbd { display: none; }
}
`;function entryAction(controller,entry){return entry.isDirectory?()=>{controller.toggleDirectory(entry)}:()=>{controller.openFile(entry)}}function addButton(controller,entry){let label=`添加 ${entry.name} 到会话`,button=actionButton("ui-button is-ghost is-icon file-tree-add-action",label,()=>{controller.addPath(entry)}),busy=controller.state.addingPaths.has(entry.path);return button.disabled=!controller.composerWritable||busy,button.title=controller.composerWritable?"添加到会话":"当前会话不可编辑",busy&&button.setAttribute("aria-busy","true"),button.append(icon(busy?"refresh":"at",14)),button}function row(controller,entry,depth){let branch=element("div","file-tree-branch"),item=element("div","file-tree-row");item.style.setProperty("--file-tree-depth",String(depth));let main=actionButton("file-tree-main-action",entry.isDirectory?`展开 ${entry.name}`:`打开 ${entry.name}`,entryAction(controller,entry));main.setAttribute("role","treeitem");let expanded=controller.state.expanded.has(entry.path);entry.isDirectory&&main.setAttribute("aria-expanded",String(expanded));let chevron=element("span",`file-tree-chevron${expanded?" is-open":""}`);entry.isDirectory&&chevron.append(icon("chevronRight",12));let glyph=element("span",`file-tree-icon${entry.isDirectory?" is-directory":""}`);glyph.append(icon(entry.isDirectory?expanded?"folderOpen":"folder":"file"));let name=element("span","file-tree-name",entry.name),metadata=element("small","file-tree-metadata",entry.isDirectory&&controller.state.loadingDirectories.has(entry.path)?"加载中…":entry.isDirectory?"":formatFileSize(entry.size));return main.append(chevron,glyph,name,metadata),item.append(main,addButton(controller,entry)),branch.append(item),entry.isDirectory&&expanded&&appendDirectory(branch,controller,entry.path,depth+1),branch}function appendDirectory(parent,controller,directory,depth){let files=controller.state.filesByDirectory.get(directory),error=controller.state.directoryErrors.get(directory);if(error){let notice=errorNotice(error,()=>{controller.loadDirectory(directory)});notice.style.setProperty("--file-tree-depth",String(depth)),parent.append(notice);return}if(!files){let loading=loadingPanel(3);loading.style.setProperty("--file-tree-depth",String(depth)),parent.append(loading);return}for(let entry of files)parent.append(row(controller,entry,depth))}function toolbar(controller){let header=element("header","project-files-toolbar");header.append(element("strong","","项目文件"));let refresh=actionButton("ui-button is-ghost is-icon project-files-refresh","刷新项目文件",()=>controller.refresh()),loading=controller.state.loadingDirectories.has("");return refresh.disabled=loading,refresh.title="刷新",loading&&refresh.setAttribute("aria-busy","true"),refresh.append(icon("refresh")),header.append(refresh),header}function renderTree(controller){let rootFiles=controller.state.filesByDirectory.get(""),rootError=controller.state.directoryErrors.get(""),view=element("section","project-files-view");if(view.append(toolbar(controller)),controller.state.actionError&&view.append(errorNotice(controller.state.actionError)),controller.state.actionNotice&&view.append(noticePanel(controller.state.actionNotice)),rootError&&!rootFiles)return view.append(errorPanel(rootError,()=>{controller.loadDirectory("")})),view;if(!rootFiles&&controller.state.loadingDirectories.has(""))return view.append(loadingPanel()),view;if(!rootFiles?.length)return view.append(emptyPanel(controller.contextKey?"项目目录为空":"尚未绑定工作区")),view;let tree=element("div","file-tree");tree.setAttribute("aria-label","项目文件"),tree.setAttribute("role","tree");for(let entry of rootFiles)tree.append(row(controller,entry,0));return view.append(tree),view}function initialState(){return{actionError:"",actionNotice:"",addingPaths:new Set,comment:"",commentLine:null,content:"",directoryErrors:new Map,expanded:new Set,fileLoading:!1,filesByDirectory:new Map,loadingDirectories:new Set,previewError:"",selected:null,submittingComment:!1}}function pathRequest(entry){return{path:entry.path,expectedIsDirectory:entry.isDirectory}}var ProjectFilesController=class{constructor(api){this.api=api,this.state=initialState(),this.contextKey="",this.composerWritable=!1,this.directoryRequests=new Map,this.fileRequest=0,this.revision=0,this.root=null}async mount(root,context){this.root=root,console.info("project-files.mount",{composerWritable:composerWritable(context),workspaceBound:!!workspaceKey(context)}),this.applyContext(context,!0)}update(context){this.applyContext(context,!1)}dispose(){console.debug("project-files.dispose"),this.revision+=1,this.root=null}applyContext(context,initial){let nextKey=workspaceKey(context);if(this.composerWritable=composerWritable(context),!initial&&nextKey===this.contextKey){this.render();return}this.contextKey=nextKey,this.reset(),this.loadDirectory("")}reset(){this.revision+=1,this.directoryRequests.clear(),this.fileRequest=0,this.state=initialState(),this.render()}refresh(){this.reset(),this.loadDirectory("")}render(){if(!this.root)return;let style=element("style","",styles),content=this.state.selected?renderPreview(this):renderTree(this);this.root.replaceChildren(style,content)}directoryCurrent(directory,request,revision){return this.revision===revision&&this.directoryRequests.get(directory)===request}fileCurrent(revision,request,selected){return this.revision===revision&&this.fileRequest===request&&this.state.selected===selected}async loadDirectory(directory){let revision=this.revision,request=(this.directoryRequests.get(directory)??0)+1;this.directoryRequests.set(directory,request),this.state.loadingDirectories.add(directory),this.state.directoryErrors.delete(directory),this.render(),console.info("project-files.directory-list.started",{scope:directory?"nested":"root"});try{let result=await this.api.list(directory);if(!this.directoryCurrent(directory,request,revision))return;let entries=fileEntries(result);this.state.filesByDirectory.set(directory,entries),console.info("project-files.directory-list.completed",{entryCount:entries.length,scope:directory?"nested":"root"})}catch(error){if(!this.directoryCurrent(directory,request,revision))return;console.error("project-files.directory-list.failed",{errorType:error instanceof Error?error.name:typeof error,scope:directory?"nested":"root"}),this.state.directoryErrors.set(directory,`列出项目文件失败：${String(error)}`)}finally{this.directoryCurrent(directory,request,revision)&&(this.state.loadingDirectories.delete(directory),this.render())}}async toggleDirectory(entry){if(this.state.expanded.has(entry.path)){this.state.expanded.delete(entry.path),this.render();return}this.state.expanded.add(entry.path),this.render(),this.state.filesByDirectory.has(entry.path)||await this.loadDirectory(entry.path)}async openFile(entry){let revision=this.revision,request=this.fileRequest+1;this.fileRequest=request,this.state.comment="",this.state.commentLine=null,this.state.content="",this.state.fileLoading=!0,this.state.previewError="",this.state.submittingComment=!1,this.state.selected=entry,this.render(),console.info("project-files.file-read.started",{targetType:"file"});try{let result=await this.api.read(entry.path);if(this.revision!==revision||this.fileRequest!==request)return;this.state.content=fileContent(result),console.info("project-files.file-read.completed",{characterCount:this.state.content.length})}catch(error){if(this.revision!==revision||this.fileRequest!==request)return;console.error("project-files.file-read.failed",{errorType:error instanceof Error?error.name:typeof error}),this.state.previewError=`读取文件失败：${String(error)}`}finally{this.revision===revision&&this.fileRequest===request&&(this.state.fileLoading=!1,this.render())}}closeFile(){this.fileRequest+=1,this.state.submittingComment=!1,this.state.comment="",this.state.commentLine=null,this.state.selected=null,this.render()}startComment(line){this.composerWritable&&(this.state.comment="",this.state.commentLine=line,this.render())}cancelComment(){this.state.comment="",this.state.commentLine=null,this.render()}async addPath(entry){if(!this.composerWritable||this.state.addingPaths.has(entry.path))return;let revision=this.revision,addingPaths=this.state.addingPaths;addingPaths.add(entry.path),this.state.actionError="",this.state.actionNotice="",this.render(),console.info("project-files.composer-path-add.started",{targetType:entry.isDirectory?"directory":"file"});try{if(await this.api.addPath(pathRequest(entry)),this.revision!==revision)return;console.info("project-files.composer-path-add.completed",{targetType:entry.isDirectory?"directory":"file"}),this.state.actionNotice=`已将“${entry.name}”添加到会话`}catch(error){if(this.revision!==revision)return;console.error("project-files.composer-path-add.failed",{errorType:error instanceof Error?error.name:typeof error,targetType:entry.isDirectory?"directory":"file"}),this.state.actionError=`添加“${entry.name}”失败：${String(error)}`}finally{this.state.addingPaths===addingPaths&&(addingPaths.delete(entry.path),this.render())}}async submitComment(line,code){if(!this.composerWritable||!this.state.selected||this.state.submittingComment)return;let revision=this.revision,request=this.fileRequest,selected=this.state.selected,comment;try{comment=commentText(this.state.comment)}catch(error){this.state.actionError=String(error),this.render();return}try{if(this.state.actionError="",this.state.submittingComment=!0,this.render(),console.info("project-files.line-comment-add.started",{line}),await this.api.addLineComment({comment,expectedLine:code,line,path:this.state.selected.path}),!this.fileCurrent(revision,request,selected))return;console.info("project-files.line-comment-add.completed",{line}),this.cancelComment()}catch(error){if(!this.fileCurrent(revision,request,selected))return;console.error("project-files.line-comment-add.failed",{errorType:error instanceof Error?error.name:typeof error,line}),this.state.actionError=`添加第 ${line} 行评论失败：${String(error)}`}finally{this.fileCurrent(revision,request,selected)&&(this.state.submittingComment=!1,this.render())}}};function createProjectFilesController(host){let api={list(directory){return host.request("xsec.files.list",{directory:directory||void 0})},read(path){return host.request("xsec.files.read",{path})},addPath(entry){return host.request("xsec.workspace.composer.path.add",entry)},addLineComment(comment){return host.request("xsec.workspace.composer.line-comment.add",comment)}};return new ProjectFilesController(api)}export function activate(host){console.debug("project-files.activate",{apiVersion:host.apiVersion});let controller=createProjectFilesController(host);return{mount(root,context){return controller.mount(root,context)},update(context){return controller.update(context)},dispose(){return controller.dispose()}}}
