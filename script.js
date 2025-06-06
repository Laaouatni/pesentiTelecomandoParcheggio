const ws = new WebSocket("wss://pesentiws-43f6274c0f11.herokuapp.com/");

const APERTO_COLOR = "rgb(0, 255, 123)";
const CHIUSO_COLOR = "rgb(255, 0, 8)";

const APERTO_URLIMG = "./imgs/barraOpen.jpg";
const CHIUSO_URLIMG = "./imgs/barraClose.jpg";

const TIMEOUT = 2000;

let isStillWarning = {
  ingresso: false,
  uscita: false,
};

const config = {
  ingresso: createGateProxy("ingresso", {
    isOpen: false,
    button: document.getElementById("ingressoButton"),
    img: document.getElementById("ingressoImg"),
  }),
  uscita: createGateProxy("uscita", {
    isOpen: false,
    button: document.getElementById("uscitaButton"),
    img: document.getElementById("uscitaImg"),
  }),
};

/**
 *
 * @param {String} gateName
 * @param {Object} obj
 */
function createGateProxy(gateName, obj) {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      const thisButton = target.button;
      const thisImg = target.img;
      thisButton.textContent = value ? "APERTO" : "CHIUSO";
      thisButton.style.backgroundColor = value ? APERTO_COLOR : CHIUSO_COLOR;
      thisImg.src = value ? APERTO_URLIMG : CHIUSO_URLIMG
      ws.send(gateName + ":" + Number(value));
      return Reflect.set(target, prop, value, receiver);
    },
  });
}

function autoCloseGate(gateName) {
  setTimeout(() => {
    if (isStillWarning[gateName]) return;
    config[gateName].isOpen = false;
  }, TIMEOUT);
}

ws.addEventListener("open", () => {
  config.ingresso.isOpen = false;
  config.uscita.isOpen = false;
});

ws.addEventListener("close", () => {
  window.location.reload();
});

ws.addEventListener("message", async (e) => {
  const blob = e.data;
  const text = await blob.text();
  const [key, value] = text.split(":");

  const hasReceivedWarning = key == "cancelloCameraInput";
  if (!hasReceivedWarning) return;

  const ingressoWarning = value.split(",")[0] == "1";
  const uscitaWarning = value.split(",")[1] == "1";

  isStillWarning = {
    ingresso: ingressoWarning,
    uscita: uscitaWarning,
  };

  Object.entries(isStillWarning).forEach(([gateName, isWarning]) => {
    if (!isWarning) return;
    config[gateName].isOpen = true;
    autoCloseGate(gateName);
  });
});

Object.keys(config).forEach((gateName) => {
  const thisButton = config[gateName].button;
  thisButton.addEventListener("click", () => {
    if (isStillWarning[gateName]) return;
    config[gateName].isOpen = !config[gateName].isOpen;
    if (!config[gateName].isOpen) return;
    autoCloseGate(gateName);
  });
});
