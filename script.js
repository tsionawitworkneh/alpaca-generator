const PARTS = {
  hair: ["default", "bang", "curls", "elegant", "fancy", "quiff", "short"],
  ears: ["default", "tilt-backward", "tilt-forward"],
  eyes: ["default", "angry", "naughty", "panda", "smart", "star"],
  mouth: ["default", "astonished", "eating", "laugh", "tongue"],
  neck: ["default", "bend-backward", "bend-forward", "thick"],
  leg: ["default", "bubble-tea", "cookie", "game-console", "tilt-backward", "tilt-forward"],
  accessories: ["earings", "flower", "glasses", "headphone"],
  backgrounds: [
    "blue50","blue60","blue70",
    "darkblue30","darkblue50","darkblue70",
    "green50","green60","green70",
    "grey40","grey70","grey80",
    "red50","red60","red70",
    "yellow50","yellow60","yellow70"
  ],
};


const CATEGORY_LABELS = {
  hair: "Hair",
  ears: "Ears",
  eyes: "Eyes",
  mouth: "Mouth",
  neck: "Neck",
  leg: "Leg",
  accessories: "Accessories",
  backgrounds: "Background",
};
const CATEGORY_ORDER = ["hair","ears","eyes","mouth","neck","leg","accessories","backgrounds"];


const RENDER_ORDER = ["backgrounds","ears","hair","neck","accessories","__nose","eyes","mouth","leg"];

function pathFor(category, variant) {
  return `images/${category}/${variant}.png`;
}
const NOSE_PATH = "images/nose.png";

function defaultSelection() {
  const sel = {};
  for (const cat of Object.keys(PARTS)) {
    sel[cat] = PARTS[cat].includes("default") ? "default" : PARTS[cat][0];
  }
  return sel;
}
function randomSelection() {
  const sel = {};
  for (const cat of Object.keys(PARTS)) {
    const list = PARTS[cat];
    sel[cat] = list[Math.floor(Math.random() * list.length)];
  }
  return sel;
}

let selection = defaultSelection();
let activeCategory = "hair";


const stage = document.getElementById("alpacaStage");
const categoryRow = document.getElementById("categoryRow");
const variantRow = document.getElementById("variantRow");

function renderAlpaca() {
  stage.innerHTML = "";
  for (const layer of RENDER_ORDER) {
    const src = layer === "__nose" ? NOSE_PATH : pathFor(layer, selection[layer]);
    const img = document.createElement("img");
    img.src = src;
    img.alt = layer;
    img.draggable = false;
    stage.appendChild(img);
  }
}

function renderCategoryChips() {
  categoryRow.innerHTML = "";
  for (const cat of CATEGORY_ORDER) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (cat === activeCategory ? " active" : "");
    btn.textContent = CATEGORY_LABELS[cat];
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderCategoryChips();
      renderVariantChips();
    });
    categoryRow.appendChild(btn);
  }
}

function renderVariantChips() {
  variantRow.innerHTML = "";
  for (const variant of PARTS[activeCategory]) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (selection[activeCategory] === variant ? " active" : "");
    btn.textContent = variant.replace(/-/g, " ");
    btn.addEventListener("click", () => {
      selection[activeCategory] = variant;
      renderAlpaca();
      renderVariantChips();
    });
    variantRow.appendChild(btn);
  }
}


document.getElementById("randomBtn").addEventListener("click", () => {
  selection = randomSelection();
  renderAlpaca();
  renderVariantChips();
});

document.getElementById("downloadBtn").addEventListener("click", async () => {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  for (const layer of RENDER_ORDER) {
    const src = layer === "__nose" ? NOSE_PATH : pathFor(layer, selection[layer]);
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, size, size); resolve(); };
      img.onerror = reject;
      img.src = src;
    });
  }

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "alpaca.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

renderAlpaca();
renderCategoryChips();
renderVariantChips();