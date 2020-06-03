const { remote } = require("electron");

document.getElementById("appVersion").innerText = "v" + remote.app.getVersion();
