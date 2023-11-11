const containerEditor = document.getElementById("container-editor");

containerEditor.addEventListener("keyup", (e) => {
  console.log("hemnath");
  const htmlCode = document.getElementById("html-editor").value;
  const cssCode = document.getElementById("css-editor").value;
  const jsCode = document.getElementById("js-editor").value;
  const outputFrame = document.getElementById("ui-viewer");

  outputFrame.contentDocument.body.innerHTML = `<style>${cssCode}</style>${htmlCode}`
  outputFrame.contentWindow.eval(jsCode)
});