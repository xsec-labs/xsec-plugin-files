import { themeStyles } from "./theme.js";

export const styles = `${themeStyles}
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
`;
