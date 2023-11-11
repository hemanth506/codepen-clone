const containerEditor = document.getElementById("container-editor");

containerEditor.addEventListener("keyup", (e) => {
  console.log("hemanth");
  const htmlCode = document.getElementById("html-editor").value;
  const cssCode = document.getElementById("css-editor").value;
  const jsCode = document.getElementById("js-editor").value;
  const outputFrame = document.getElementById("ui-viewer");
  
  // outputFrame.open();
  // outputFrame.write(`<style>${cssCode}</style>${htmlCode}`)
  // outputFrame.close();

  const htmlDiv = document.createElement("div");
  htmlDiv.innerHTML = htmlCode;
  outputFrame.appendChild(htmlDiv);

  const style = outputFrame.createElement("style");
  style.innerHTML = cssCode;
  outputFrame.appendChild(style);

  const script = outputFrame.createElement("script");
  script.innerHTML = jsCode;
  outputFrame.body.appendChild(script);
});

