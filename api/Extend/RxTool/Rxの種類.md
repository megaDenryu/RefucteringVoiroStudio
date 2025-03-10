# Rxの主要概念

ReactivePropertyはRxの一部の概念ですが、Reactive Programmingにはさらに多くの重要な概念があります。以下に主要なものをご紹介します：

## 1. Observable（オブザーバブル）
- Rxの中核となるデータストリーム
- 時間とともに複数の値を発行可能
- Python実装例:
  ```python
  from rx import Observable
  
  obs = Observable.from_([1, 2, 3, 4])
  obs.subscribe(lambda x: print(x))
  ```

## 2. Subject（サブジェクト）
- ObservableとObserverの両方の性質を持つ
- 複数のオブザーバーに対して値をマルチキャスト

## 3. 様々なSubject
- **BehaviorSubject**: 最新の値を保持し、新しい購読者に提供
- **ReplaySubject**: 指定した数の過去の値を新規購読者に再生
- **AsyncSubject**: 完了時に最後の値のみを発行
- **PublishSubject**: 購読後に発生したイベントのみを提供

## 4. Operators（オペレーター）
- **変換オペレーター**: `map`, `flatMap`, `switchMap` など
- **フィルターオペレーター**: `filter`, `take`, `skip`, `distinctUntilChanged` など
- **結合オペレーター**: `merge`, `zip`, `combineLatest` など
- **エラーハンドリングオペレーター**: `catchError`, `retry` など

## 5. Schedulers（スケジューラー）
- 処理の実行タイミングと実行コンテキストを制御

## 6. Hot と Cold Observable
- **Cold Observable**: 各購読者に専用のデータストリームを提供
- **Hot Observable**: すべての購読者に同じデータストリームを提供

## Pythonによる実装例

```python
import asyncio
from typing import Generic, TypeVar, List, Dict, Any, Callable, Coroutine

T = TypeVar('T')

class Subject(Generic[T]):
    """複数のオブザーバーにデータをマルチキャストするクラス"""
    
    def __init__(self):
        self._observers: List[Callable[[T], None]] = []
        
    def subscribe(self, observer: Callable[[T], None]) -> Callable[[], None]:
        """オブザーバーを登録し、購読解除用の関数を返す"""
        self._observers.append(observer)
        
        def unsubscribe():
            if observer in self._observers:
                self._observers.remove(observer)
                
        return unsubscribe
    
    def notify(self, value: T) -> None:
        """全てのオブザーバーに値を通知"""
        for observer in self._observers[:]:  # コピーを使用して安全に反復
            observer(value)

class BehaviorSubject(Subject[T]):
    """最新の値を保持し、新規購読者に提供するサブジェクト"""
    
    def __init__(self, initial_value: T):
        super().__init__()
        self._value = initial_value
        
    @property
    def value(self) -> T:
        return self._value
        
    def subscribe(self, observer: Callable[[T], None]) -> Callable[[], None]:
        # 購読時に最新の値を即座に通知
        observer(self._value)
        return super().subscribe(observer)
    
    def notify(self, value: T) -> None:
        self._value = value
        super().notify(value)
```

これらの概念を組み合わせることで、非同期データフローをエレガントに処理できる強力なリアクティブプログラミングパターンを構築できます。