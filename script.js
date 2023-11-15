const containerEditor = document.getElementById("container-editor");
const resizeDiv = document.getElementById("main-resize-div");
const iFrameElement = document.getElementById("ui-viewer");
const headViewBtn = document.querySelector(".btn-img");
const changeViewBtn = document.querySelectorAll(".option-view-btn");
const viewDiv = document.querySelector(".view-outer-div");
const headImg = document.getElementById("head-img");
const wipButtons = document.querySelectorAll(".header-btn");
const outputFrame = document.getElementById("ui-viewer");

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
      <h1>Welcome to codepen...🎉🎉</h1>
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
