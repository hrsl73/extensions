// @ts-nocheck

const vscode = acquireVsCodeApi();

let savedBoardUrl = "";

// Load saved URL from storage
window.addEventListener("load", () => {
  const urlInput = document.getElementById("boardUrl");
  const saveBoardUrlBtn = document.getElementById("saveBoardUrl");

  // Try to get saved URL from VS Code storage
  vscode.postMessage({ type: "get-saved-url" });

  saveBoardUrlBtn.addEventListener("click", () => {
    const url = urlInput.value.trim();
    if (url) {
      savedBoardUrl = url;
      vscode.postMessage({ type: "update-board-url", value: url });
      loadBoard(url);
    } else {
      alert("Please enter a valid URL");
    }
  });

  // Allow Enter key to save
  urlInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveBoardUrlBtn.click();
    }
  });
});

// Handle messages from extension
window.addEventListener("message", (event) => {
  const message = event.data;
  switch (message.type) {
    case "set-saved-url":
      if (message.value) {
        savedBoardUrl = message.value;
        document.getElementById("boardUrl").value = message.value;
        loadBoard(message.value);
      }
      break;
  }
});

function loadBoard(url) {
  const boardContent = document.getElementById("board-content");

  console.log("Loading board URL:", url);

  if (!url.includes("github.com")) {
    console.warn("Invalid URL - does not contain github.com");
    boardContent.innerHTML =
      '<p class="placeholder">⚠️ Invalid URL</p><p class="info">Please provide a valid GitHub Projects URL (must contain github.com)</p>';
    boardContent.classList.add("has-content");
    return;
  }

  // Ensure URL starts with https://
  let finalUrl = url;
  if (!url.startsWith("http")) {
    finalUrl = "https://" + url;
  }

  console.log("Final URL:", finalUrl);

  // GitHub Projects cannot be embedded via iframe due to security restrictions
  // Show the link directly with "Open in Browser" button
  boardContent.innerHTML = `
    <div style="padding: 20px; text-align: center; display: flex; flex-direction: column; gap: 16px;">
      <div>
        <p class="placeholder" style="margin: 0 0 8px 0;">🔗 GitHub Projects Board</p>
        <p class="info" style="margin: 0;">Your board has been configured!</p>
      </div>
      
      <div style="background-color: var(--vscode-editor-background); padding: 12px; border-radius: 4px; border: 1px solid var(--vscode-widget-border);">
        <p class="info" style="margin: 0 0 8px 0; font-size: 11px;">Board URL:</p>
        <code style="word-break: break-all; display: block; font-size: 12px; color: var(--vscode-textLink-foreground);">${finalUrl}</code>
      </div>

      <button id="openInBrowser" style="padding: 8px 16px; font-size: 13px; cursor: pointer;">
        Open Board in Browser
      </button>
    </div>
  `;

  boardContent.classList.add("has-content");

  // Attach click handler
  const openBtn = document.getElementById("openInBrowser");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      console.log("Opening URL in browser:", finalUrl);
      vscode.postMessage({ type: "open-url-external", value: finalUrl });
    });
  }
}
