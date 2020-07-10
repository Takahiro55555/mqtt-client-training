# mqtt-training 'Python'


## 動かし方

### 環境構築

```
$ python3.8
Python 3.8.2
$ python3.8 -m venv .venv
$ poetry install
```

### 動かす

```
$ poetry run python src/Subscriber01.py --hostname [HOSTNAME] --port 1883
```

Open new terminal and type this...

```
$ poetry run python src/Publisher01.py --hostname [HOSTNAME] --port 1883
```

## 参考文献

- [[Qiita] pythonでMQTT送受信](https://qiita.com/hsgucci/items/6461d8555ea1245ef6c2)