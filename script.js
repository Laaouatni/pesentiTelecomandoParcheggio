const ws = new WebSocket('wss://pesentiws-43f6274c0f11.herokuapp.com/');

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

ws.addEventListener("open", () => {
  document.getElementById("wsClose").hidden = true;
  document.getElementById("wsOpen").hidden = false;
  
  Object.keys(config).forEach(key => {
    ws.send(key + ":" + Number(config[key].isOpen));
  });
});

ws.addEventListener("close", () => {
  document.getElementById("wsClose").hidden = false;
  document.getElementById("wsOpen").hidden = true;
});


Object.keys(config).forEach(key => {
  const thisButton = config[key].button;
  thisButton.textContent = config[key].isOpen ? "APERTO" : "CHIUSO";
  thisButton.style.backgroundColor = config[key].isOpen ? "rgb(0, 255, 123)" : "rgb(255, 0, 8)";
  thisButton.addEventListener("click", () => {
    config[key].isOpen = !config[key].isOpen;
    thisButton.textContent = config[key].isOpen ? "APERTO" : "CHIUSO";
    thisButton.style.backgroundColor = config[key].isOpen ? "rgb(0, 255, 123)" : "rgb(255, 0, 8)";
    ws.send(key + ":" + Number(config[key].isOpen));
  });
});








