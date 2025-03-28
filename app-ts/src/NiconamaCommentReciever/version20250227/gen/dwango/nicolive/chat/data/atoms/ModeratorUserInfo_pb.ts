// @generated by protoc-gen-es v2.2.3 with parameter "target=ts"
// @generated from file dwango/nicolive/chat/data/atoms/ModeratorUserInfo.proto (package dwango.nicolive.chat.data.atoms, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file dwango/nicolive/chat/data/atoms/ModeratorUserInfo.proto.
 */
export const file_dwango_nicolive_chat_data_atoms_ModeratorUserInfo: GenFile = /*@__PURE__*/
  fileDesc("Cjdkd2FuZ28vbmljb2xpdmUvY2hhdC9kYXRhL2F0b21zL01vZGVyYXRvclVzZXJJbmZvLnByb3RvEh9kd2FuZ28ubmljb2xpdmUuY2hhdC5kYXRhLmF0b21zImoKEU1vZGVyYXRvclVzZXJJbmZvEg8KB3VzZXJfaWQYASABKAMSFQoIbmlja25hbWUYAiABKAlIAIgBARIUCgdpY29uVXJsGAQgASgJSAGIAQFCCwoJX25pY2tuYW1lQgoKCF9pY29uVXJsQt8BCiNjb20uZHdhbmdvLm5pY29saXZlLmNoYXQuZGF0YS5hdG9tc0IWTW9kZXJhdG9yVXNlckluZm9Qcm90b1ABogIFRE5DREGqAh9Ed2FuZ28uTmljb2xpdmUuQ2hhdC5EYXRhLkF0b21zygIfRHdhbmdvXE5pY29saXZlXENoYXRcRGF0YVxBdG9tc+ICK0R3YW5nb1xOaWNvbGl2ZVxDaGF0XERhdGFcQXRvbXNcR1BCTWV0YWRhdGHqAiNEd2FuZ286Ok5pY29saXZlOjpDaGF0OjpEYXRhOjpBdG9tc2IGcHJvdG8z");

/**
 * @generated from message dwango.nicolive.chat.data.atoms.ModeratorUserInfo
 */
export type ModeratorUserInfo = Message<"dwango.nicolive.chat.data.atoms.ModeratorUserInfo"> & {
  /**
   * @generated from field: int64 user_id = 1;
   */
  userId: bigint;

  /**
   * @generated from field: optional string nickname = 2;
   */
  nickname?: string;

  /**
   * @generated from field: optional string iconUrl = 4;
   */
  iconUrl?: string;
};

/**
 * Describes the message dwango.nicolive.chat.data.atoms.ModeratorUserInfo.
 * Use `create(ModeratorUserInfoSchema)` to create a new message.
 */
export const ModeratorUserInfoSchema: GenMessage<ModeratorUserInfo> = /*@__PURE__*/
  messageDesc(file_dwango_nicolive_chat_data_atoms_ModeratorUserInfo, 0);

