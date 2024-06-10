class Array():
    type_object = [int, str, float]
    count = 0

    def __init__(self, typecode):
        self.array = []
        if typecode in self.type_object:
            self.typecode = typecode

    def __str__(self):
        return f"{self.array}"

    def __iter__(self):
        return iter(self.array)   
    
    def insert(self, value):
        try:
            if type(value) != self.typecode:
                raise ValueError("Invalid type")
        except ValueError as ex:
            print(ex)
        self.array[self.count] = value
        self.count += 1

a = Array(int)
a.insert(1)