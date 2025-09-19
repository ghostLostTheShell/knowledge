class ClssDecort(object):
    def __init__(self, **kwargs):
        self.attr = kwargs
        
        #for key in kwargs:
        #    setattr(self, key, kwargs)

    def __call__(self, cls) -> Any:
        