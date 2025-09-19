import threading

a = 0;

lock = threading.Lock()

def run():
  global a;
  
  with lock:
    print("{0}".format(threading.current_thread))
    
    a = a + 1
    
    
