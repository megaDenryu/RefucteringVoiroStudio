class c未完全入力:
    def __init__(self, buffer_text: str):
        self.buffer_text = buffer_text

class c完全入力:
    def __init__(self, buffer_text: str, should_respond: bool):
        self.buffer_text = buffer_text
        self.should_respond = should_respond