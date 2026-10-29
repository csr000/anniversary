const { herName, signature, startDate, moments, letter } = ANNIVERSARY;
const $ = (id) => document.getElementById(id);

const DAY_MS = 86_400_000;
const daysTogether = Math.floor((Date.now() - new Date(startDate)) / DAY_MS);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });
  window.scrollTo(0, 0);
}

function createCard({ label, text }, onOpen) {
  const card = document.createElement("button");
  card.className = "card";
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front"></div>
      <div class="card-face card-back"><small></small><p></p></div>
    </div>`;
  card.querySelector(".card-front").textContent = label;
  card.querySelector(".card-back small").textContent = label;
  card.querySelector(".card-back p").textContent = text;

  card.addEventListener("click", () => {
    if (card.classList.contains("flipped")) return;
    card.classList.add("flipped");
    onOpen();
  });
  return card;
}

function renderMoments() {
  const REVEAL_DELAY_MS = 1500;
  let opened = 0;
  const updateProgress = () => {
    const done = opened === moments.length;
    $("progress").textContent = done
      ? `${opened} of ${moments.length}, but there's one more thing…`
      : `${opened} of ${moments.length}`;
    if (done) setTimeout(() => $("next").classList.add("show"), REVEAL_DELAY_MS);
  };

  moments.forEach((moment) => {
    $("grid").append(createCard(moment, () => { opened++; updateProgress(); }));
  });
  updateProgress();
}

function renderLetter() {
  const greeting = document.createElement("p");
  greeting.textContent = `${herName},`;
  [greeting, ...letter.map((text) => Object.assign(document.createElement("p"), { textContent: text }))]
    .forEach((paragraph, i) => {
      paragraph.style.animationDelay = `${i * 1.2}s`;
      $("letter").append(paragraph);
    });

  $("signature").textContent = signature;
  $("signature").style.animationDelay = `${(letter.length + 1) * 1.2}s`;
}

$("greeting").textContent =
  `${herName}, it's been ${daysTogether.toLocaleString()} days, and I'd choose you on every single one of them.`;
renderMoments();
renderLetter();

$("begin").addEventListener("click", () => showScreen("moments"));
$("next").addEventListener("click", () => showScreen("finale"));
