const containerEditor = document.getElementById("container-editor");
const resizeDiv = document.getElementById("main-resize-div");
const iFrameElement = document.getElementById("ui-viewer");
const headViewBtn = document.querySelector(".btn-img");
const changeViewBtn = document.querySelectorAll(".option-view-btn");
const viewDiv = document.querySelector(".view-outer-div");
const headImg = document.getElementById("head-img");
const wipButtons = document.querySelectorAll(".header-btn");
const outputFrame = document.getElementById("ui-viewer");
const resizerHC = document.getElementById("html-css-separator");
const resizerCJ = document.getElementById("css-js-separator");


const iFrameWidth = "100%";
const iFrameheight = "100%";
const DEBOUNCE_TIME = 5000;

const htmlMirror = CodeMirror.fromTextArea(
  document.getElementById("html-editor"),
  {
    lineNumbers: true,
    tabSize: 2,
    theme: "dracula",
    mode: "xml",
  }
);
// htmlMirror.setSize(iFrameWidth, iFrameheight);

const cssMirror = CodeMirror.fromTextArea(
  document.getElementById("css-editor"),
  {
    lineNumbers: true,
    tabSize: 2,
    theme: "dracula",
    mode: "xml",
  }
);
// cssMirror.setSize(iFrameWidth, iFrameheight);

const jsMirror = CodeMirror.fromTextArea(document.getElementById("js-editor"), {
  lineNumbers: true,
  tabSize: 2,
  theme: "dracula",
  mode: "xml",
});
// jsMirror.setSize(iFrameWidth, iFrameheight);

const getCodeMirrorValue = () => {
  return [htmlMirror.getValue(), cssMirror.getValue(), jsMirror.getValue()];
};

const setLocalStorage = (htmlCode, cssCode, jsCode) => {
  localStorage.setItem("htmlCode", htmlCode);
  localStorage.setItem("cssCode", cssCode);
  localStorage.setItem("jsCode", jsCode);
};

const getLocalStorage = () => {
  return [
    localStorage.getItem("htmlCode"),
    localStorage.getItem("cssCode"),
    localStorage.getItem("jsCode"),
  ];
};

const appendCodeToIFrame = (htmlCode, cssCode, jsCode) => {
  outputFrame.contentDocument.body.innerHTML = `<style>${cssCode}</style>${htmlCode}`;
  try {
    outputFrame.contentWindow.eval(jsCode);
  } catch (err) {}
};

let timeId = null;
const debounce = () => {
  if (timeId) clearTimeout(timeId);
  timeId = setTimeout(() => {
    const [htmlCode, cssCode, jsCode] = getCodeMirrorValue();
    setLocalStorage(htmlCode, cssCode, jsCode);
    timeId = null;
  }, DEBOUNCE_TIME);
};

containerEditor.addEventListener("keyup", () => {
  const [htmlCode, cssCode, jsCode] = getCodeMirrorValue();
  appendCodeToIFrame(htmlCode, cssCode, jsCode);
  debounce();
});

const toggleDiv = () => {
  const classList = viewDiv.classList;
  if (classList.contains("view-active")) {
    viewDiv.classList.remove("view-active");
  } else {
    viewDiv.classList.add("view-active");
  }
};

headViewBtn.addEventListener("click", () => {
  toggleDiv();
});

const removeActiveClass = () => {
  changeViewBtn.forEach((elt) => {
    elt.classList.remove("isactive");
  });
};

changeViewBtn.forEach((elt) => {
  elt.addEventListener("click", (e) => {
    removeActiveClass();
    const closestDiv = e.target.closest("div");
    const rotateClassName = closestDiv.getAttribute("imgPosition");
    console.log("rotateClassName", rotateClassName);
    headImg.classList = [];
    headImg.classList.add(`${rotateClassName}`);
    elt.classList.add("isactive");
  });
});

wipButtons.forEach((elt) => {
  elt.addEventListener("click", () => {
    alert("Work in progress");
  });
});

// To set the height of the iframe [Temperory work around]
const init = () => {
  const rect = resizeDiv.getBoundingClientRect();
  const bottomOfDiv = rect.bottom;
  const screenHeight = window.innerHeight;
  const heightOfIframe = screenHeight - bottomOfDiv - 4;
  iFrameElement.style.height = `${heightOfIframe}px`;
};

window.onresize = () => {
  init();
};

(function () {
  let [codeHtml, codecss, codeJs] = getLocalStorage();
  if (!codeHtml && !codecss && !codeJs) {
    codeHtml = `<body>
      <h1>Welcome to Codepen...🎉🎉</h1>
  </body>`;
    codecss = `h1 {
      color: tomato;
}`;
    codeJs = "";
    setLocalStorage(codeHtml, codecss, codeJs);
  }
  htmlMirror.setValue(codeHtml);
  cssMirror.setValue(codecss);
  jsMirror.setValue(codeJs);

  appendCodeToIFrame(codeHtml, codecss, codeJs);

  init();
})();

resizerHC.addEventListener("mousedown", onmousedown);

function onmousedown(e) {
  e.preventDefault();
  document.addEventListener("mousemove", onmousemove);
  document.addEventListener("mouseup", onmouseup);
}
function onmousemove(e) {
  e.preventDefault();
  const clientX = e.clientX;
  const deltaX = clientX - (resizerHC._clientX || clientX);
  console.log(
    "🚀 ~ clientX =",
    clientX,
    "resizerHC._clientX =",
    resizerHC._clientX,
    " deltaX =",
    deltaX
  );
  resizerHC._clientX = clientX;
  const l = resizerHC.previousElementSibling;
  const r = resizerHC.nextElementSibling;
  // LEFT
  if (deltaX < 0) {
    const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
    console.log("going left", getComputedStyle(l).width, " new width=", w);
    l.style.flex = `0 ${w < 10 ? 0 : w}px`;
    r.style.flex = "1 0";
  }
  // RIGHT
  if (deltaX > 0) {
    console.log("going right");
    const w = Math.round(parseInt(getComputedStyle(r).width) - deltaX);
    r.style.flex = `0 ${w < 10 ? 0 : w}px`;
    l.style.flex = "1 0";
  }
}
function onmouseup(e) {
  e.preventDefault();
  document.removeEventListener("mousemove", onmousemove);
  document.removeEventListener("mouseup", onmouseup);
  delete e._clientX;
}

// =============================================================

// resizerCJ.addEventListener("mousedown", onmousedown);

// function onmousedown(e) {
//   e.preventDefault();
//   document.addEventListener("mousemove", onmousemove);
//   document.addEventListener("mouseup", onmouseup);
// }
// function onmousemove(e) {
//   e.preventDefault();
//   const clientX = e.clientX;
//   const deltaX = clientX - (resizerCJ._clientX || clientX);
//   console.log(
//     "🚀 ~ clientX =",
//     clientX,
//     "resizerCJ._clientX =",
//     resizerCJ._clientX,
//     " deltaX =",
//     deltaX
//   );
//   resizerCJ._clientX = clientX;
//   const l = resizerCJ.previousElementSibling;
//   const r = resizerCJ.nextElementSibling;
//   // LEFT
//   if (deltaX < 0) {
//     const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
//     console.log("going left", getComputedStyle(l).width, " new width=", w);
//     l.style.flex = `0 ${w < 10 ? 0 : w}px`;
//     r.style.flex = "1 0";
//   }
//   // RIGHT
//   if (deltaX > 0) {
//     console.log("going right");
//     const w = Math.round(parseInt(getComputedStyle(r).width) - deltaX);
//     r.style.flex = `0 ${w < 10 ? 0 : w}px`;
//     l.style.flex = "1 0";
//   }
// }
// function onmouseup(e) {
//   e.preventDefault();
//   document.removeEventListener("mousemove", onmousemove);
//   document.removeEventListener("mouseup", onmouseup);
//   delete e._clientX;
// }


