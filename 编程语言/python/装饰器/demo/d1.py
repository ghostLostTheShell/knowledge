"""装饰器demo"""


class Decorator(object):
    """"""
    def __init__(self, a, b, c):
        print(a,b,c)
        
    def __call__(self, cls):
        print(cls)
        return cls
    
def d1(a,b,c):
    print(a,b,c)
    
@Decorator(12,3,5)
class ee():
    def __init__(self):
        print("---")
        
        
ddd = ee()