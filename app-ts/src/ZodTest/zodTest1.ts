import { z } from "zod";
import { NiconicoLiveSettingModel } from "../ZodObject/DataStore/AppSetting/AppSettingModel/CommentReciver/NiconicoLive/NiconicoLiveSettingModel";
import { YoutubeLiveSettingModel } from "../ZodObject/DataStore/AppSetting/AppSettingModel/CommentReciver/YoutubeLive/YoutubeLiveSettingModel";
import { TwitchSettingModel } from "../ZodObject/DataStore/AppSetting/AppSettingModel/CommentReciver/TwitchLive/TwitchSettingModel";
import { CommentReceiveSettingModel } from "../ZodObject/DataStore/AppSetting/AppSettingModel/CommentReciver/CommentReceiveSettingModel";

// Enumの定義
const Role = z.enum(["Admin", "User", "Guest"]);

// オブジェクトの定義
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
});

// メインオブジェクトの定義
const UserSchema = z.object({
  name: z.string(),
  age: z.number().int().nonnegative(),
  isActive: z.boolean(),
  address: AddressSchema,
  roles: z.array(Role),
  所有物: z.array(z.string()),
});

const nameType = UserSchema.shape.name._type;
const UserSchemaType = UserSchema._type;

const roles = UserSchema.shape.roles;
const rolesElementType = roles.element;
console.log("Roles element type:", rolesElementType); // z.ZodEnum



// スキーマに合ったオブジェクトの型を生成する
type User = z.infer<typeof UserSchema>;

// オブジェクトのインスタンスを作成
const user: User = {
  name: "Jane Doe",
  age: 28,
  isActive: true,
  address: {
    street: "123 Main St",
    city: "Sapporo",
    zipCode: "060-0000",
  },
  roles: ["Admin", "User"],
};

// バリデーション
try {
  UserSchema.parse(user); // 正常な場合、この行はエラーを出さない
  console.log("バリデーション成功！");
} catch (e) {
  console.error("バリデーション失敗:", e.errors);
}


let niconamaSetting: NiconicoLiveSettingModel = {
  配信URL: "https://live.nicovideo.jp/watch/lv123456789",
}

let YoutubeLiveSetting: YoutubeLiveSettingModel = {
  配信URL: "https://www.youtube.com/watch?v=123456789",
}

let TwitchLiveSetting: TwitchSettingModel = { 配信URL: "https://www.twitch.tv/username" };
let commentReceiveSettingModel: CommentReceiveSettingModel = {
  ニコニコ生放送: niconamaSetting,
  YoutubeLive: YoutubeLiveSetting,
  Twitch: TwitchLiveSetting,
}
