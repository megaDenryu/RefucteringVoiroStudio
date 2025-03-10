// @generated by protoc-gen-es v2.2.3 with parameter "target=ts"
// @generated from file dwango/nicolive/chat/data/TagUpdated.proto (package dwango.nicolive.chat.data, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file dwango/nicolive/chat/data/TagUpdated.proto.
 */
export const file_dwango_nicolive_chat_data_TagUpdated: GenFile = /*@__PURE__*/
  fileDesc("Cipkd2FuZ28vbmljb2xpdmUvY2hhdC9kYXRhL1RhZ1VwZGF0ZWQucHJvdG8SGWR3YW5nby5uaWNvbGl2ZS5jaGF0LmRhdGEiqQEKClRhZ1VwZGF0ZWQSNwoEdGFncxgBIAMoCzIpLmR3YW5nby5uaWNvbGl2ZS5jaGF0LmRhdGEuVGFnVXBkYXRlZC5UYWcSFAoMb3duZXJfbG9ja2VkGAIgASgIGkwKA1RhZxIMCgR0ZXh0GAEgASgJEg4KBmxvY2tlZBgCIAEoCBIQCghyZXNlcnZlZBgDIAEoCBIVCg1uaWNvcGVkaWFfdXJpGAQgASgJQrgBCh1jb20uZHdhbmdvLm5pY29saXZlLmNoYXQuZGF0YUIPVGFnVXBkYXRlZFByb3RvUAGiAgRETkNEqgIZRHdhbmdvLk5pY29saXZlLkNoYXQuRGF0YcoCGUR3YW5nb1xOaWNvbGl2ZVxDaGF0XERhdGHiAiVEd2FuZ29cTmljb2xpdmVcQ2hhdFxEYXRhXEdQQk1ldGFkYXRh6gIcRHdhbmdvOjpOaWNvbGl2ZTo6Q2hhdDo6RGF0YWIGcHJvdG8z");

/**
 * @generated from message dwango.nicolive.chat.data.TagUpdated
 */
export type TagUpdated = Message<"dwango.nicolive.chat.data.TagUpdated"> & {
  /**
   * @generated from field: repeated dwango.nicolive.chat.data.TagUpdated.Tag tags = 1;
   */
  tags: TagUpdated_Tag[];

  /**
   * @generated from field: bool owner_locked = 2;
   */
  ownerLocked: boolean;
};

/**
 * Describes the message dwango.nicolive.chat.data.TagUpdated.
 * Use `create(TagUpdatedSchema)` to create a new message.
 */
export const TagUpdatedSchema: GenMessage<TagUpdated> = /*@__PURE__*/
  messageDesc(file_dwango_nicolive_chat_data_TagUpdated, 0);

/**
 * @generated from message dwango.nicolive.chat.data.TagUpdated.Tag
 */
export type TagUpdated_Tag = Message<"dwango.nicolive.chat.data.TagUpdated.Tag"> & {
  /**
   * @generated from field: string text = 1;
   */
  text: string;

  /**
   * @generated from field: bool locked = 2;
   */
  locked: boolean;

  /**
   * @generated from field: bool reserved = 3;
   */
  reserved: boolean;

  /**
   * @generated from field: string nicopedia_uri = 4;
   */
  nicopediaUri: string;
};

/**
 * Describes the message dwango.nicolive.chat.data.TagUpdated.Tag.
 * Use `create(TagUpdated_TagSchema)` to create a new message.
 */
export const TagUpdated_TagSchema: GenMessage<TagUpdated_Tag> = /*@__PURE__*/
  messageDesc(file_dwango_nicolive_chat_data_TagUpdated, 0, 0);

