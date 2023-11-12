const containerEditor = document.getElementById("container-editor");
const resizeDiv = document.getElementById("main-resize-div");
const iFrameElement = document.getElementById("ui-viewer");
const headViewBtn = document.querySelector(".btn-img");
const changeViewBtn = document.querySelectorAll(".option-view-btn");
const viewDiv = document.querySelector(".view-outer-div");
const headImg = document.getElementById("head-img");

const htmlMirror = CodeMirror.fromTextArea(
  document.getElementById("html-editor"),
  {
    lineNumbers: true,
    tabSize: 2,
    theme: "dracula",
    mode: "xml",
  }
);

const cssMirror = CodeMirror.fromTextArea(
  document.getElementById("css-editor"),
  {
    lineNumbers: true,
    tabSize: 2,
    theme: "dracula",
    mode: "xml",
  }
);

const jsMirror = CodeMirror.fromTextArea(document.getElementById("js-editor"), {
  lineNumbers: true,
  tabSize: 2,
  theme: "dracula",
  mode: "xml",
});

containerEditor.addEventListener("keyup", () => {
  const htmlCode = htmlMirror.getValue();
  const cssCode = cssMirror.getValue();
  const jsCode = jsMirror.getValue();
  const outputFrame = document.getElementById("ui-viewer");

  outputFrame.contentDocument.body.innerHTML = `<style>${cssCode}</style>${htmlCode}`;
  try {
    outputFrame.contentWindow.eval(jsCode);
  } catch (err) {}
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

init();

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
  })
}

changeViewBtn.forEach((elt) => {
  elt.addEventListener("click", (e) => {
    removeActiveClass();
    const closestDiv = e.target.closest("div");
    const rotateClassName = closestDiv.getAttribute("imgPosition");
    headImg.classList = [];
    headImg.classList.add(`${rotateClassName}`);
    elt.classList.add("isactive")
  });
})
