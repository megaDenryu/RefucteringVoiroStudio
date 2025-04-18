// @generated by protoc-gen-es v2.2.3 with parameter "target=ts"
// @generated from file dwango/nicolive/chat/data/atoms/ModeratorUpdated.proto (package dwango.nicolive.chat.data.atoms, syntax proto3)
/* eslint-disable */

import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { enumDesc, fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import { file_google_protobuf_timestamp } from "@bufbuild/protobuf/wkt";
import type { ModeratorUserInfo } from "./ModeratorUserInfo_pb";
import { file_dwango_nicolive_chat_data_atoms_ModeratorUserInfo } from "./ModeratorUserInfo_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file dwango/nicolive/chat/data/atoms/ModeratorUpdated.proto.
 */
export const file_dwango_nicolive_chat_data_atoms_ModeratorUpdated: GenFile = /*@__PURE__*/
  fileDesc("CjZkd2FuZ28vbmljb2xpdmUvY2hhdC9kYXRhL2F0b21zL01vZGVyYXRvclVwZGF0ZWQucHJvdG8SH2R3YW5nby5uaWNvbGl2ZS5jaGF0LmRhdGEuYXRvbXMiiwIKEE1vZGVyYXRvclVwZGF0ZWQSVwoJb3BlcmF0aW9uGAEgASgOMkQuZHdhbmdvLm5pY29saXZlLmNoYXQuZGF0YS5hdG9tcy5Nb2RlcmF0b3JVcGRhdGVkLk1vZGVyYXRvck9wZXJhdGlvbhJECghvcGVyYXRvchgCIAEoCzIyLmR3YW5nby5uaWNvbGl2ZS5jaGF0LmRhdGEuYXRvbXMuTW9kZXJhdG9yVXNlckluZm8SLQoJdXBkYXRlZEF0GAMgASgLMhouZ29vZ2xlLnByb3RvYnVmLlRpbWVzdGFtcCIpChJNb2RlcmF0b3JPcGVyYXRpb24SBwoDQUREEAASCgoGREVMRVRFEAFC3gEKI2NvbS5kd2FuZ28ubmljb2xpdmUuY2hhdC5kYXRhLmF0b21zQhVNb2RlcmF0b3JVcGRhdGVkUHJvdG9QAaICBUROQ0RBqgIfRHdhbmdvLk5pY29saXZlLkNoYXQuRGF0YS5BdG9tc8oCH0R3YW5nb1xOaWNvbGl2ZVxDaGF0XERhdGFcQXRvbXPiAitEd2FuZ29cTmljb2xpdmVcQ2hhdFxEYXRhXEF0b21zXEdQQk1ldGFkYXRh6gIjRHdhbmdvOjpOaWNvbGl2ZTo6Q2hhdDo6RGF0YTo6QXRvbXNiBnByb3RvMw", [file_google_protobuf_timestamp, file_dwango_nicolive_chat_data_atoms_ModeratorUserInfo]);

/**
 * @generated from message dwango.nicolive.chat.data.atoms.ModeratorUpdated
 */
export type ModeratorUpdated = Message<"dwango.nicolive.chat.data.atoms.ModeratorUpdated"> & {
  /**
   * @generated from field: dwango.nicolive.chat.data.atoms.ModeratorUpdated.ModeratorOperation operation = 1;
   */
  operation: ModeratorUpdated_ModeratorOperation;

  /**
   * @generated from field: dwango.nicolive.chat.data.atoms.ModeratorUserInfo operator = 2;
   */
  operator?: ModeratorUserInfo;

  /**
   * @generated from field: google.protobuf.Timestamp updatedAt = 3;
   */
  updatedAt?: Timestamp;
};

/**
 * Describes the message dwango.nicolive.chat.data.atoms.ModeratorUpdated.
 * Use `create(ModeratorUpdatedSchema)` to create a new message.
 */
export const ModeratorUpdatedSchema: GenMessage<ModeratorUpdated> = /*@__PURE__*/
  messageDesc(file_dwango_nicolive_chat_data_atoms_ModeratorUpdated, 0);

/**
 * @generated from enum dwango.nicolive.chat.data.atoms.ModeratorUpdated.ModeratorOperation
 */
export enum ModeratorUpdated_ModeratorOperation {
  /**
   * @generated from enum value: ADD = 0;
   */
  ADD = 0,

  /**
   * @generated from enum value: DELETE = 1;
   */
  DELETE = 1,
}

/**
 * Describes the enum dwango.nicolive.chat.data.atoms.ModeratorUpdated.ModeratorOperation.
 */
export const ModeratorUpdated_ModeratorOperationSchema: GenEnum<ModeratorUpdated_ModeratorOperation> = /*@__PURE__*/
  enumDesc(file_dwango_nicolive_chat_data_atoms_ModeratorUpdated, 0, 0);

