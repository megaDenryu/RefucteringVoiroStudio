import time

from api.LLM.エージェント.会話用エージェント.返答判定機.AnalysisResponse import AnalysisResponse

class AIParameters:
    def __init__(self):
        self.response_desire = 0.0  # 返答欲求（0.0〜1.0）
        self.energy = 1.0  # エネルギー（0.0〜1.0）
        self.response_threshold = 0.5  # 返答閾値
        self.last_response_time = time.time()
    
    def update_desire(self, analysis: AnalysisResponse):
        # 分析結果に基づいて返答欲求を更新
        if analysis.is_complete:
            self.response_desire += 0.3  # 完全な発話なら欲求を増加
        self.response_desire += analysis.confidence * 0.1  # 信頼度に応じて微調整
        self.response_desire = min(self.response_desire, 1.0)  # 上限を1.0に制限
    
    def apply_energy_debuff(self):
        # エネルギーに応じたデバフを適用
        debuff = 1.0 - self.energy
        return self.response_desire * (1.0 - debuff)
    
    def should_respond(self):
        # 調整後の欲求が閾値を超えるかを判定
        adjusted_desire = self.apply_energy_debuff()
        return adjusted_desire > self.response_threshold
    
    def respond(self):
        # 返答時にエネルギーを消費し、欲求をリセット
        self.energy -= 0.2
        self.response_desire = 0.0
        self.last_response_time = time.time()
    
    def recover_energy(self):
        # 時間経過でエネルギーを回復
        elapsed = time.time() - self.last_response_time
        self.energy += elapsed * 0.001  # 徐々に回復
        self.energy = min(self.energy, 1.0)