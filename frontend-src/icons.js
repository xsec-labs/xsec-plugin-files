const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const iconPaths = {
  alert: ["circle:12:12:9", "path:M12 8v5", "path:M12 16.5v.01"],
  arrowLeft: ["path:M19 12H5", "path:M11 6l-6 6 6 6"],
  at: ["circle:12:12:4", "path:M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"],
  check: ["circle:12:12:9", "path:M8.5 12.5l2.5 2.5 4.5-5"],
  chevronRight: ["path:M9 6l6 6-6 6"],
  file: ["path:M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z", "path:M14 3v5h5"],
  folder: ["path:M3 7a2 2 0 0 1 2-2h4.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"],
  folderOpen: ["path:M3 17V7a2 2 0 0 1 2-2h4.5l2 2H18a2 2 0 0 1 2 2v1", "path:M3 17l2.2-5.6A2 2 0 0 1 7 10h13.5a1 1 0 0 1 .9 1.4L19 17.7a2 2 0 0 1-1.9 1.3H5a2 2 0 0 1-2-2Z"],
  message: ["path:M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.7-.9L3 21l1.8-4.6a8.4 8.4 0 0 1-.9-3.9 8.4 8.4 0 0 1 8.4-8.4 8.5 8.5 0 0 1 8.7 7.5Z"],
  plus: ["path:M12 5v14", "path:M5 12h14"],
  refresh: ["path:M20 11a8 8 0 0 0-14.3-4.3L4 8.5", "path:M4 4v4.5h4.5", "path:M4 13a8 8 0 0 0 14.3 4.3l1.7-1.8", "path:M20 20v-4.5h-4.5"],
};

function svgElement(name) {
  return document.createElementNS(SVG_NAMESPACE, name);
}

function appendShape(svg, descriptor) {
  const [kind, ...values] = descriptor.split(":");
  const node = svgElement(kind);
  if (kind === "circle") ["cx", "cy", "r"].forEach((name, index) => node.setAttribute(name, values[index]));
  if (kind === "path") node.setAttribute("d", values.join(":"));
  svg.append(node);
}

export function icon(name, size = 16) {
  const svg = svgElement("svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("fill", "none");
  svg.setAttribute("height", String(size));
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("stroke-width", size <= 12 ? "2.5" : "1.75");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(size));
  for (const descriptor of iconPaths[name] ?? []) appendShape(svg, descriptor);
  return svg;
}
