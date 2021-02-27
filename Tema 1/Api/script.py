import threading
from time import time
import requests


def Forecast(city):
    requests.get(f"http://127.0.0.1:5000/forecast/?city={city}")


for j in range(10):
    threads = []
    for i in range(10):
        threads.append(threading.Thread(target=Forecast, args=("Iasi",)))

    start = time()

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()

    finish = time()

    print(finish - start)