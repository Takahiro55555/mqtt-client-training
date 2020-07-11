import sys
from time import sleep
import paho.mqtt.client as mqtt


def main():
    client = mqtt.Client()

    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_publish = on_publish

    # [必須] 接続先ホスト名の取得
    hostname = get_option("--hostname")
    if hostname is None:
        print("[ERROR] Please set hostname", file=sys.stderr)
        print("ex) --hostname [hostname]", file=sys.stderr)
        exit()

    # [必須] 接続先ポート
    port = get_option("--port")
    if port is None:
        print("[ERROR] Please set port number", file=sys.stderr)
        print("ex) --port [port number]", file=sys.stderr)
        exit()
    if not port.isdecimal():
        print('[ERROR] "%s" is not number' % port, file=sys.stderr)
        exit()
    port = int(port)  # 整数型へ変換

    # [任意] keepalive (死活監視)
    keepalive = get_option("--keepalive")
    if keepalive is None:
        keepalive = "60"  # デフォルト値 (60 [sec])
    if not keepalive.isdecimal():
        print('[ERROR] "%s" is not number' % keepalive, file=sys.stderr)
        exit()
    keepalive = int(keepalive)  # 整数型へ変換

    # [任意] PublishするTopic
    topic = get_option("--topic")
    if topic is None:
        topic = "/topics/topic01"

    # 接続
    client.connect(hostname, port, keepalive)

    # 通信処理スタート
    client.loop_start()    # subはloop_forever()だが，pubはloop_start()で起動だけさせる

    # 永久に繰り返す
    counter = 0
    while True:
        # トピック名とメッセージを決めて送信
        client.publish(topic, "[COUNTER: %d] Hello, MQTT." % counter)
        counter += 1
        sleep(3)   # 3秒待つ


def on_connect(client, userdata, flag, rc):
    print("Connected with result code %d" % rc)


def on_disconnect(client, userdata, flag, rc):
    if rc == 0:
        print("Disconnected")
    else:
        print("Unexpected disconnection.")


def on_publish(client, userdata, mid):
    # publish完了時の処理
    print("Publish: %s" % mid)


def get_option(key):
    """コマンドライン引数をキーを元に取得する

    Args:
        key (str): オプションのキー

    Returns:
        str or None: オプションのキーに対応する値
    """
    is_found = False
    for v in sys.argv:
        if is_found:
            return v
        if v == key:
            is_found = True
    return None


if __name__ == "__main__":
    main()
