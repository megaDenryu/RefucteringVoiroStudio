from __future__ import annotations
import sys
from typing import Literal
import unittest

class Interval:
    epsilon = sys.float_info.epsilon
    start_oc:Literal["(","["]
    start:float
    end:float
    end_oc:Literal[")","]"]
    def __init__(self, start_oc:Literal["(","["], start:float, end:float , end_oc:Literal[")","]"]):
        

        self.start_oc = start_oc
        self.start = float(start)
        self.end = float(end)
        self.end_oc = end_oc
        if self.start > self.end:
            raise ValueError( f"エラー:start<=endにしてください。{self}")

    def __contains__(self, item:float):
        if self.start_oc == "(" and self.end_oc == ")":
            return self.start < item and item < self.end
        elif self.start_oc == "(" and self.end_oc == "]":
            return self.start < item and item <= self.end
        elif self.start_oc == "[" and self.end_oc == ")":
            return self.start <= item and item < self.end
        else:
            return self.start <= item and item <= self.end

    def create(self, value:float):
        if self.start <= value and value <= self.end:
            return value
        else:
            raise ValueError(f"エラー:値が範囲外です。{self}")
    
    def __repr__(self):
        return f"{self.start_oc}{self.start},{self.end}{self.end_oc}"

    def __str__(self):
        return f"{self.start_oc}{self.start},{self.end}{self.end_oc}"
    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Interval):
            return False
        return self.start_oc == other.start_oc and self.start == other.start and self.end == other.end and self.end_oc == other.end_oc
    def subset(self, other: Interval):
        if self.start_oc == "[":
            if self.start < other.start:
                return False
        else:
            if self.start <= other.start:
                return False

        if self.end_oc == "]":
            if self.end > other.end:
                return False
        else:
            if self.end >= other.end:
                return False

        return True
    def superset(self, other: Interval):
        return other.subset(self)
    def openToClose(self):
        new_start = self.start + self.epsilon
        new_end = self.end - self.epsilon
        return Interval("[", new_start, new_end, "]")
    def intersect(self, other: Interval):
        # start_ocの決定
        other_closinize_interval = other.openToClose()
        self_closinize_interval = self.openToClose()
        # 
        if other_closinize_interval.start in self:
            start_oc = other.start_oc
            start = other.start
        elif self_closinize_interval.start in other:
            start_oc = self.start_oc
            start = self.start
        else :
            return None
        
        if other_closinize_interval.end in self:
            end_oc = other_closinize_interval.end_oc
            end = other_closinize_interval.end
        elif self_closinize_interval.end in other:
            end_oc = self.end_oc
            end = self.end
        else:
            return None



        return Interval(start_oc, start, end, end_oc)

class ExtendSet:
    def __init__(self, element_type, range:Interval):
        pass

class DictPath:
    _path_list = []
    def __init__(self, path_list):
        self._path_list = path_list
    @staticmethod
    def new(path_str:str, delimiter="."):
        return DictPath(path_str.split(delimiter))

class ExtendDict:
    @staticmethod
    def setByPath(dic:dict, path:list, value):
        if len(path) == 1:
            dic[path[0]] = value
        else:
            if path[0] not in dic:
                dic[path[0]] = {}
            ExtendDict.setByPath(dic[path[0]], path[1:], value)
    @staticmethod
    def getByPath(dic:dict, path:list):
        if len(path) == 1:
            return dic[path[0]]
        else:
            return ExtendDict.getByPath(dic[path[0]], path[1:])
        
    @staticmethod
    def test():
        dic = {}
        ExtendDict.setByPath(dic, ["a", "b", "c"], 1)
        print(dic)
        print(ExtendDict.getByPath(dic, ["a", "b"]))
        ExtendDict.setByPath(dic, ["a", "b", "d"], 2)
        ExtendDict.setByPath(dic, ["a", "b", "c"], 3)
        ExtendDict.setByPath(dic, ["a", "b", "c", "w"], 4)
        print(dic)

        


class ExtendSetTest():
    def __init__(self) -> None:
        self.ExtendSet_test1()

    def ExtendSet_test1(self):
        print(sys.float_info.epsilon) # 2.220446049250313e-16
        print(sys.float_info.min) # 2.2250738585072014e-308
        print(1.0+sys.float_info.epsilon) 
        print(1.0 + sys.float_info.min > 1.0) # False
        print(      sys.float_info.min > 0)   # True

    def ExtendSet_test2(self):
        A = Interval("[", 1, 2, "]")
        print(A)
        B = Interval("(", 2, 3, "]")
        print(A.intersect(B))
        print(isinstance(A, Interval))

    
