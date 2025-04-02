import yaml
from api.DataStore.data_dir import DataDir
from api.Extend.ExtendFunc import ExtendFunc


class AppSettingJson:
    @staticmethod
    def loadAppSettingYamlAsString(yml_file_name:str)->str:
        """
        CharSetting.ymlを読み込み、その内容を文字列として返します。
        """
        yml_path = DataDir._().AppSettingJson / yml_file_name
        with open(yml_path,encoding="UTF8") as f:
                content = f.read()
        return content
    
    @staticmethod
    def loadAppSettingYamlAsReplacedDict(yml_file_name:str, replace_dict:dict)->dict:
        """
        CharSetting.ymlを読み込み、その内容を辞書として返します。
        """
        content = AppSettingJson.loadAppSettingYamlAsString(yml_file_name)
        replaced_content = ExtendFunc.replaceBulkString(content, replace_dict)
        content_dict = yaml.safe_load(replaced_content)
        return content_dict