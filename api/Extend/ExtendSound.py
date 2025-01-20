import contextlib
import io
import wave


class ExtendSound:

    @staticmethod
    def get_wav_duration(file_path):
        with contextlib.closing(wave.open(file_path, 'r')) as Wave_read:
            frames = Wave_read.getnframes()
            rate = Wave_read.getframerate()
            duration = frames / float(rate)
            return duration
        
    @staticmethod
    def get_wav_duration_from_data(wav_data):
        with wave.open(io.BytesIO(wav_data), 'rb') as Wave_read:
            frames = Wave_read.getnframes()
            rate = Wave_read.getframerate()
            duration = frames / float(rate)
            return duration