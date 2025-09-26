// Matrix animation
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];
const themeSwitch = document.getElementById("themeSwitch");
const themeLabel = document.getElementById("themeLabel");

// Set default theme
document.body.classList.add("light-mode");
themeLabel.innerText = "Light Mode";

themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
    themeLabel.innerText = "Dark Mode";
  } else {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
    themeLabel.innerText = "Light Mode";
  }
});

// Initialize drops
for (let i = 0; i < columns; i++) drops[i] = 1;

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff99";
  ctx.font = fontSize + "px monospace";
  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(drawMatrix, 33);

// Fake loading steps
const steps = [
  "🔎 Parsing SQL query...",
  "📊 Understanding joins and filters...",
  "⚡ Summarizing in plain English..."
];

function showSteps(div) {
  let i = 0;
  div.innerText = steps[i];
  const interval = setInterval(() => {
    i++;
    if (i < steps.length) {
      div.innerText = steps[i];
    } else {
      clearInterval(interval);
    }
  }, 1500);
}

// Typing effect for final summary
function typeWriter(text, element) {
  let i = 0;
  element.innerText = "";
  const interval = setInterval(() => {
    element.innerText += text.charAt(i);
    element.scrollTop = element.scrollHeight; // auto scroll
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 30);
}

// Form submit
document.getElementById("queryForm").onsubmit = async function(e) {
  e.preventDefault();
  const query = document.getElementById("sqlQuery").value;
  const loadingDiv = document.getElementById("loading");
  const resultDiv = document.getElementById("result");

  if (!query.trim()) return;

  loadingDiv.style.display = "block";
  resultDiv.innerText = "";

  showSteps(loadingDiv);

  try {
    const formData = new FormData();
    formData.append("query", query);

    const response = await fetch("/summarize", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    loadingDiv.style.display = "none";
    typeWriter(data.summary, resultDiv);
  } catch (error) {
    loadingDiv.style.display = "none";
    resultDiv.innerText = "❌ Error: Unable to summarize query.";
  }
};

// Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.onclick = function() {
    window.location.href = "/logout";
  };
}
