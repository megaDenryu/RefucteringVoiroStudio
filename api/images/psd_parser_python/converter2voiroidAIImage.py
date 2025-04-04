import os
import shutil
import re
from typing import Literal

class converter2voiroidAIImage:

    @staticmethod
    def atoi(text):
        return int(text) if text.isdigit() else text
    
    @staticmethod
    def natural_keys(text):
        return [converter2voiroidAIImage.atoi(c) for c in re.split(r'(\d+)', text)]
    
    # 最も深い階層にあるフォルダを取得する関数
    @staticmethod
    def copyDeepestFolder(source_dir,destination_dir):
        count = 0
        print(os.walk(source_dir))
        # フォルダ名を昇順にwalkする    
        for root, dirs, files in os.walk(source_dir):
            dirs.sort(key=converter2voiroidAIImage.natural_keys)
            if not dirs:
                count = count + 1
                # フォルダがない場合はそのディレクトリの名前の先頭に番号を付けてdestination_dirにコピーする
                #rootのsource_dirからの相対パスを取得する
                root_relative_path = os.path.relpath(root,source_dir)
                #\を_に置換する
                root_relative_path = root_relative_path.replace("\\","_")
                new_basename = f"{count}_" + root_relative_path
                #new_basename = f"{count}_" + os.path.basename(root)
                shutil.copytree(root, os.path.join(destination_dir, new_basename))
    
    @staticmethod
    def normalizeFolder(source_dir):
        for root, dirs, files in os.walk(source_dir):
            #現在のディレクトリの深さを取得する
            current_depth = root[len(source_dir):].count(os.sep)
            if len(dirs) >= 1 and len(files) >= 1:
                #rootとfileの間にfileと同じ名前のフォルダを作成して、その中にファイルを移動する
                #filesから昇順にソートする
                files.sort()
                for file in files:
                    #fileから拡張子を取り除いた名前のフォルダを作成する
                    def decideFileName():
                        # current_depthが0の場合はレイヤーの順番が重要なのでまとめずにファイル名をそのまま使う
                        file_name:str|Literal["その他","未分類","無題"] = ""
                        if current_depth == 0:
                            file_name = os.path.splitext(file)[0]
                        else:
                            # file_nameを以下のどれかからdirにないものを選んで統一する。
                            file_name_candidate = ["その他","未分類","無題"]
                            for candidate in file_name_candidate:
                                if candidate not in dirs:
                                    file_name = candidate
                                    break
                        return file_name
                    file_name = decideFileName()
                    new_dir = os.path.join(root,file_name)
                    print("new_dir",new_dir)
                    if not os.path.exists(new_dir):
                        os.makedirs(new_dir)
                    shutil.move(os.path.join(root,file),new_dir)

# 以下メイン処理
if __name__ == "__main__":
    # コピー元のディレクトリの絶対パス。バックスラッシュは2つずつ書くこと。
    source_dir = "C:\\Users\\pokr301qup\\python_dev\\poke-fastapi-websockets\\api\\images\\ボイロキャラ素材\\IA\\kulori IA 立ち絵\\kulori IA 立ち絵_テスト\\tmp_output2\\10_IA"
    

    # コピー先のディレクトリの絶対パス。バックスラッシュは2つずつ書くこと。
    destination_dir = "C:\\Users\\pokr301qup\\python_dev\\poke-fastapi-websockets\\api\\images\\ボイロキャラ素材\\IA\\kulori IA 立ち絵\\kulori IA 立ち絵_テスト\\Parts2"
    # フォルダの正規化
    converter2voiroidAIImage.normalizeFolder(source_dir)
    # コピー元ディレクトリ内の最も深い階層にあるフォルダを取得する
    converter2voiroidAIImage.copyDeepestFolder(source_dir,destination_dir)
