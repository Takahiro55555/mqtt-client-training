// MQTT の client インスタンス
let mqttClient;
let isConnecting = false;

function connect() {
    if (isConnecting) {
        // 切断処理
        mqttClient.disconnect();

        formOnDisconnect();
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

        formOnConnect();
        isConnecting = true;
    }
}

function onConnect() {
    const topic = document.getElementById("topic").value;

    logPrintln("Connected");
    mqttClient.subscribe(String(topic));
}

function onConnectionLost(responseObject) {
    formOnDisconnect();
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

function formOnConnect() {
    const hostNameInput = document.getElementById("hostName");
    const portInput = document.getElementById("port");
    const topicInput = document.getElementById("topic");
    const clientIdInput = document.getElementById("clientId");
    const connectButton = document.getElementById("connect");
    const publishButton = document.getElementById("publish");

    connectButton.innerText = "Disconnect";
    hostNameInput.setAttribute("disabled", true);
    portInput.setAttribute("disabled", true);
    topicInput.setAttribute("disabled", true);
    clientIdInput.setAttribute("disabled", true);

    publishButton.removeAttribute("disabled");
    connectButton.classList.add('btn-danger');
    connectButton.classList.remove('btn-primary');
}

function formOnDisconnect() {
    const hostNameInput = document.getElementById("hostName");
    const portInput = document.getElementById("port");
    const topicInput = document.getElementById("topic");
    const clientIdInput = document.getElementById("clientId");
    const connectButton = document.getElementById("connect");
    const publishButton = document.getElementById("publish");

    connectButton.innerText = "Connect";
    hostNameInput.removeAttribute("disabled");
    portInput.removeAttribute("disabled");
    topicInput.removeAttribute("disabled");
    clientIdInput.removeAttribute("disabled");

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

