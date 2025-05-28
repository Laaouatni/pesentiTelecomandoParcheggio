const ws = new WebSocket("wss://pesentiws-43f6274c0f11.herokuapp.com/");

let config = {
  ingresso: {
    isOpen: false,
    button: document.getElementById("ingressoButton"),
  },
  uscita: {
    isOpen: false,
    button: document.getElementById("uscitaButton"),
  },
};

ws.addEventListener("open", () => {
  Object.keys(config).forEach((key) => {
    ws.send(key + ":" + Number(config[key].isOpen));
  });
});

ws.addEventListener("close", () => {
  window.location.reload();
});

ws.addEventListener("message", async (e) => {
  const blob = e.data;
  const text = await blob.text();
  const [key, value] = text.split(":");
  if (key == "cancelloCameraInput") {
    const ingressoWarning = value.split(",")[0] == "1";
    const uscitaWarning = value.split(",")[1] == "1";
    if (ingressoWarning) config.ingresso.isOpen = true;
    if (uscitaWarning) config.uscita.isOpen = true;
  }
});

Object.keys(config).forEach((key) => {
  const thisButton = config[key].button;
  thisButton.textContent = config[key].isOpen ? "APERTO" : "CHIUSO";
  thisButton.style.backgroundColor = config[key].isOpen
    ? "rgb(0, 255, 123)"
    : "rgb(255, 0, 8)";
  thisButton.addEventListener("click", () => {
    config[key].isOpen = !config[key].isOpen;
    thisButton.textContent = config[key].isOpen ? "APERTO" : "CHIUSO";
    thisButton.style.backgroundColor = config[key].isOpen
      ? "rgb(0, 255, 123)"
      : "rgb(255, 0, 8)";
    ws.send(key + ":" + Number(config[key].isOpen));
  });
});
