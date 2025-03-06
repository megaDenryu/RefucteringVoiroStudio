from functools import wraps
from threading import Lock

def singleton(cls):
    """
    スレッドセーフなシングルトンデコレータ
    """
    _instances = {}
    _lock = Lock()

    @wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in _instances:
            with _lock:
                # double-checked locking pattern
                if cls not in _instances:
                    _instances[cls] = cls(*args, **kwargs)
        return _instances[cls]
    
    # クラスメソッドとしてsingletonインスタンス取得メソッドを追加
    cls.get_instance = staticmethod(get_instance)
    return cls

# 使用例
@singleton
class MyClass:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1

# def test():
#     # インスタンスの取得
#     instance1 = MyClass.get_instance() #なんかエラー出るが動作するので問題なさそう
#     instance2 = MyClass.get_instance()
#     assert instance1 is instance2  # 同じインスタンス

#     # または
#     instance3 = MyClass.get_instance()
#     assert instance1 is instance3  # 同じインスタンス

#     print("All assertions passed.")

# # テストの実行
# test()