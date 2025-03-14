// @generated by protoc-gen-es v2.2.3 with parameter "target=ts"
// @generated from file dwango/nicolive/chat/data/Jump.proto (package dwango.nicolive.chat.data, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Duration } from "@bufbuild/protobuf/wkt";
import { file_google_protobuf_duration } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file dwango/nicolive/chat/data/Jump.proto.
 */
export const file_dwango_nicolive_chat_data_Jump: GenFile = /*@__PURE__*/
  fileDesc("CiRkd2FuZ28vbmljb2xpdmUvY2hhdC9kYXRhL0p1bXAucHJvdG8SGWR3YW5nby5uaWNvbGl2ZS5jaGF0LmRhdGEiUQoESnVtcBIPCgdjb250ZW50GAEgASgJEg8KB21lc3NhZ2UYAiABKAkSJwoEd2FpdBgEIAEoCzIZLmdvb2dsZS5wcm90b2J1Zi5EdXJhdGlvbkKyAQodY29tLmR3YW5nby5uaWNvbGl2ZS5jaGF0LmRhdGFCCUp1bXBQcm90b1ABogIERE5DRKoCGUR3YW5nby5OaWNvbGl2ZS5DaGF0LkRhdGHKAhlEd2FuZ29cTmljb2xpdmVcQ2hhdFxEYXRh4gIlRHdhbmdvXE5pY29saXZlXENoYXRcRGF0YVxHUEJNZXRhZGF0YeoCHER3YW5nbzo6Tmljb2xpdmU6OkNoYXQ6OkRhdGFiBnByb3RvMw", [file_google_protobuf_duration]);

/**
 * @generated from message dwango.nicolive.chat.data.Jump
 */
export type Jump = Message<"dwango.nicolive.chat.data.Jump"> & {
  /**
   * @generated from field: string content = 1;
   */
  content: string;

  /**
   * @generated from field: string message = 2;
   */
  message: string;

  /**
   * @generated from field: google.protobuf.Duration wait = 4;
   */
  wait?: Duration;
};

/**
 * Describes the message dwango.nicolive.chat.data.Jump.
 * Use `create(JumpSchema)` to create a new message.
 */
export const JumpSchema: GenMessage<Jump> = /*@__PURE__*/
  messageDesc(file_dwango_nicolive_chat_data_Jump, 0);

