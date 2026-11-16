import { icon } from "./icons.js";

export function element(name, className, content) {
  const node = document.createElement(name);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

export function actionButton(className, label, onClick) {
  const button = element("button", className);
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.addEventListener("click", onClick);
  return button;
}

// 行内的错误提示条，可带一个重试按钮。
export function errorNotice(message, retry) {
  const notice = element("div", "ui-notice");
  notice.setAttribute("role", "alert");
  notice.append(icon("alert", 14), element("span", "", message));
  if (retry) {
    const button = actionButton("ui-button", "重试", retry);
    button.textContent = "重试";
    notice.append(button);
  }
  return notice;
}

// 占满内容区的错误状态。
export function errorPanel(message, retry) {
  const panel = element("section", "ui-empty is-error");
  panel.setAttribute("role", "alert");
  const mark = element("span", "ui-empty-mark");
  mark.append(icon("alert", 20));
  panel.append(mark, element("p", "", message));
  if (retry) {
    const button = actionButton("ui-button", "重试", retry);
    button.textContent = "重试";
    panel.append(button);
  }
  return panel;
}

export function emptyPanel(message, iconName = "folderOpen") {
  const panel = element("section", "ui-empty");
  const mark = element("span", "ui-empty-mark");
  mark.append(icon(iconName, 20));
  panel.append(mark, element("strong", "", message));
  return panel;
}

// 底部的状态气泡：确认刚完成的操作。
export function noticePanel(message) {
  const notice = element("div", "ui-toast");
  notice.setAttribute("aria-live", "polite");
  notice.setAttribute("role", "status");
  notice.append(icon("check", 16), element("span", "", message));
  return notice;
}

export function loadingPanel(rows = 8) {
  const panel = element("section", "ui-skeleton");
  panel.setAttribute("aria-busy", "true");
  panel.setAttribute("aria-label", "加载中");
  for (let index = 0; index < rows; index += 1) panel.append(element("span", ""));
  return panel;
}

export function focusLater(selector) {
  queueMicrotask(() => document.querySelector(selector)?.focus());
}
