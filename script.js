const ws = new WebSocket('wss://pesentiws-43f6274c0f11.herokuapp.com/');

ws.addEventListener("open", () => {
  document.getElementById("wsClose").hidden = true;
  document.getElementById("wsOpen").hidden = false;
});

ws.addEventListener("close", () => {
  document.getElementById("wsClose").hidden = false;
  document.getElementById("wsOpen").hidden = true;
});

let config = {
  uscita: {
    isOpen: false,
    button: document.getElementById("uscitaButton")
  },
  ingresso: {
    isOpen: false,
    button: document.getElementById("ingressoButton")
  }
};

Object.keys(config).forEach(key => {
  const thisButton = config[key].button;
  thisButton.textContent = config[key].isOpen ? "APERTO" : "CHIUSO";
  thisButton.style.backgroundColor = config[key].isOpen ? "green" : "red";
  thisButton.addEventListener("click", () => {
    config[key].isOpen = !config[key].isOpen;
    thisButton.textContent = config[key].isOpen ? "APERTO" : "CHIUSO";
    thisButton.style.backgroundColor = config[key].isOpen ? "green" : "red";
    ws.send(key + ":" + Number(config[key].isOpen));
  });
});








