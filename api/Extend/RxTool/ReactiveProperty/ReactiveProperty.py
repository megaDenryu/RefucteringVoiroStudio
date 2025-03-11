from typing import Callable, Generic, List, TypeVar

T = TypeVar('T')

class ReactiveProperty(Generic[T]):
    def __init__(self, value: T):
        self._value: T = value
        self.methods: List[Callable[[T], None]] = []

    @property
    def value(self) -> T:
        return self._value

    @value.setter
    def value(self, new_value: T):
        self._value = new_value

    def execute_methods(self, value: T) -> None:
        for method in self.methods:
            method(value)

    def get(self) -> T:
        return self._value

    def set(self, value: T) -> None:
        self._value = value
        self.execute_methods(value)

    def set_without_event(self, value: T) -> None:
        self._value = value

    def add_method(self, event: Callable[[T], None]) -> None:
        self.methods.append(event)

    def clear_methods(self) -> None:
        self.methods = []