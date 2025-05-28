const ws = new WebSocket("wss://pesentiws-43f6274c0f11.herokuapp.com/");

const APERTO_COLOR = "rgb(0, 255, 123)";
const CHIUSO_COLOR = "rgb(255, 0, 8)";

let isStillWarning = {
  ingresso: false,
  uscita: false,
};

const config = {
  ingresso: createGateProxy("ingresso", {
    isOpen: false,
    button: document.getElementById("ingressoButton"),
  }),
  uscita: createGateProxy("uscita", {
    isOpen: false,
    button: document.getElementById("uscitaButton"),
  }),
};

function createGateProxy(gateName, obj) {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      if (config[gateName].isOpen) {
        setTimeout(() => {
          if (isStillWarning[gateName]) return;
          config[gateName].isOpen = false;
          console.log("chiuso " + gateName);
        }, 1000);
      }
      const thisButton = target.button;
      thisButton.textContent = value ? "APERTO" : "CHIUSO";
      thisButton.style.backgroundColor = value ? APERTO_COLOR : CHIUSO_COLOR;
      ws.send(gateName + ":" + Number(value));
      return Reflect.set(target, prop, value, receiver);
    },
  });
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

  if (ingressoWarning) config.ingresso.isOpen = true;
  if (uscitaWarning) config.uscita.isOpen = true;
});

Object.keys(config).forEach((key) => {
  const thisButton = config[key].button;
  thisButton.addEventListener("click", () => {
    config[key].isOpen = !config[key].isOpen;
  });
});
