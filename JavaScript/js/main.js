// MQTT の client インスタンス
let mqttClient;
let isConnecting = false;

function connect() {
    if (isConnecting) {
        // 切断処理
        mqttClient.disconnect();

        buttonsOnDisconnect();
        isConnecting = false;
    } else {
        // 接続処理
        const hostname = document.getElementById("hostName").value;
        const port = document.getElementById("port").value;
        const clientId = document.getElementById("clientId").value;

        // MQTT の client インスタンスを作成・ハンドラの登録
        mqttClient = new Paho.MQTT.Client(hostname, Number(port), clientId);
        mqttClient.onConnectionLost = onConnectionLost;
        mqttClient.onMessageArrived = onMessageArrived;
        mqttClient.connect({ onSuccess: onConnect });

        buttonsOnConnect();
        isConnecting = true;
    }
}

function onConnect() {
    logPrintln("Connected");
}

function onConnectionLost(responseObject) {
    buttonsOnDisconnect();
    isConnecting = false;

    if (responseObject.errorCode != 0) {
        errorPrintln("Connection Lost: " + responseObject.errorMessage);
    } else {
        logPrintln("Disconnected");
    }
}

function onMessageArrived(message) {
    logPrintln("[Arrived message] " + message.payloadString);
}

function buttonsOnConnect() {
    const connectButton = document.getElementById("connect");
    const publishButton = document.getElementById("publish");

    connectButton.innerText = "Disconnect";
    publishButton.removeAttribute("disabled");

    connectButton.classList.add('btn-danger');
    connectButton.classList.remove('btn-primary');
}

function buttonsOnDisconnect() {
    const connectButton = document.getElementById("connect");
    const publishButton = document.getElementById("publish");

    connectButton.innerText = "Connect";
    publishButton.setAttribute("disabled", true);

    connectButton.classList.add('btn-primary');
    connectButton.classList.remove('btn-danger');
}

function publish() {
    const publishTopic = document.getElementById("topic").value;
    const publishData = document.getElementById("publishData").value;
    logPrintln("[Publish message] " + publishData);

    const message = new Paho.MQTT.Message(publishData);
    message.destinationName = publishTopic;
    mqttClient.send(message);
}

