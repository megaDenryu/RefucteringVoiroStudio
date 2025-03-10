// @generated by protoc-gen-es v2.2.3 with parameter "target=ts"
// @generated from file dwango/nicolive/chat/service/edge/ChunkedMessage.proto (package dwango.nicolive.chat.service.edge, syntax proto3)
/* eslint-disable */

import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { enumDesc, fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import { file_google_protobuf_timestamp } from "@bufbuild/protobuf/wkt";
import type { NicoliveMessage } from "../../data/NicoliveMessage_pb";
import { file_dwango_nicolive_chat_data_NicoliveMessage } from "../../data/NicoliveMessage_pb";
import type { NicoliveState } from "../../data/NicoliveState_pb";
import { file_dwango_nicolive_chat_data_NicoliveState } from "../../data/NicoliveState_pb";
import type { NicoliveOrigin } from "../../data/NicoliveOrigin_pb";
import { file_dwango_nicolive_chat_data_NicoliveOrigin } from "../../data/NicoliveOrigin_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file dwango/nicolive/chat/service/edge/ChunkedMessage.proto.
 */
export const file_dwango_nicolive_chat_service_edge_ChunkedMessage: GenFile = /*@__PURE__*/
  fileDesc("CjZkd2FuZ28vbmljb2xpdmUvY2hhdC9zZXJ2aWNlL2VkZ2UvQ2h1bmtlZE1lc3NhZ2UucHJvdG8SIWR3YW5nby5uaWNvbGl2ZS5jaGF0LnNlcnZpY2UuZWRnZSK1AwoOQ2h1bmtlZE1lc3NhZ2USRAoEbWV0YRgBIAEoCzI2LmR3YW5nby5uaWNvbGl2ZS5jaGF0LnNlcnZpY2UuZWRnZS5DaHVua2VkTWVzc2FnZS5NZXRhEj0KB21lc3NhZ2UYAiABKAsyKi5kd2FuZ28ubmljb2xpdmUuY2hhdC5kYXRhLk5pY29saXZlTWVzc2FnZUgAEjkKBXN0YXRlGAQgASgLMiguZHdhbmdvLm5pY29saXZlLmNoYXQuZGF0YS5OaWNvbGl2ZVN0YXRlSAASSgoGc2lnbmFsGAUgASgOMjguZHdhbmdvLm5pY29saXZlLmNoYXQuc2VydmljZS5lZGdlLkNodW5rZWRNZXNzYWdlLlNpZ25hbEgAGnUKBE1ldGESCgoCaWQYASABKAkSJgoCYXQYAiABKAsyGi5nb29nbGUucHJvdG9idWYuVGltZXN0YW1wEjkKBm9yaWdpbhgDIAEoCzIpLmR3YW5nby5uaWNvbGl2ZS5jaGF0LmRhdGEuTmljb2xpdmVPcmlnaW4iFQoGU2lnbmFsEgsKB0ZsdXNoZWQQAEIJCgdwYXlsb2FkQuYBCiVjb20uZHdhbmdvLm5pY29saXZlLmNoYXQuc2VydmljZS5lZGdlQhNDaHVua2VkTWVzc2FnZVByb3RvUAGiAgVETkNTRaoCIUR3YW5nby5OaWNvbGl2ZS5DaGF0LlNlcnZpY2UuRWRnZcoCIUR3YW5nb1xOaWNvbGl2ZVxDaGF0XFNlcnZpY2VcRWRnZeICLUR3YW5nb1xOaWNvbGl2ZVxDaGF0XFNlcnZpY2VcRWRnZVxHUEJNZXRhZGF0YeoCJUR3YW5nbzo6Tmljb2xpdmU6OkNoYXQ6OlNlcnZpY2U6OkVkZ2ViBnByb3RvMw", [file_google_protobuf_timestamp, file_dwango_nicolive_chat_data_NicoliveMessage, file_dwango_nicolive_chat_data_NicoliveState, file_dwango_nicolive_chat_data_NicoliveOrigin]);

/**
 * @generated from message dwango.nicolive.chat.service.edge.ChunkedMessage
 */
export type ChunkedMessage = Message<"dwango.nicolive.chat.service.edge.ChunkedMessage"> & {
  /**
   * @generated from field: dwango.nicolive.chat.service.edge.ChunkedMessage.Meta meta = 1;
   */
  meta?: ChunkedMessage_Meta;

  /**
   * @generated from oneof dwango.nicolive.chat.service.edge.ChunkedMessage.payload
   */
  payload: {
    /**
     * @generated from field: dwango.nicolive.chat.data.NicoliveMessage message = 2;
     */
    value: NicoliveMessage;
    case: "message";
  } | {
    /**
     * @generated from field: dwango.nicolive.chat.data.NicoliveState state = 4;
     */
    value: NicoliveState;
    case: "state";
  } | {
    /**
     * @generated from field: dwango.nicolive.chat.service.edge.ChunkedMessage.Signal signal = 5;
     */
    value: ChunkedMessage_Signal;
    case: "signal";
  } | { case: undefined; value?: undefined };
};

/**
 * Describes the message dwango.nicolive.chat.service.edge.ChunkedMessage.
 * Use `create(ChunkedMessageSchema)` to create a new message.
 */
export const ChunkedMessageSchema: GenMessage<ChunkedMessage> = /*@__PURE__*/
  messageDesc(file_dwango_nicolive_chat_service_edge_ChunkedMessage, 0);

/**
 * @generated from message dwango.nicolive.chat.service.edge.ChunkedMessage.Meta
 */
export type ChunkedMessage_Meta = Message<"dwango.nicolive.chat.service.edge.ChunkedMessage.Meta"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;

  /**
   * @generated from field: google.protobuf.Timestamp at = 2;
   */
  at?: Timestamp;

  /**
   * @generated from field: dwango.nicolive.chat.data.NicoliveOrigin origin = 3;
   */
  origin?: NicoliveOrigin;
};

/**
 * Describes the message dwango.nicolive.chat.service.edge.ChunkedMessage.Meta.
 * Use `create(ChunkedMessage_MetaSchema)` to create a new message.
 */
export const ChunkedMessage_MetaSchema: GenMessage<ChunkedMessage_Meta> = /*@__PURE__*/
  messageDesc(file_dwango_nicolive_chat_service_edge_ChunkedMessage, 0, 0);

/**
 * @generated from enum dwango.nicolive.chat.service.edge.ChunkedMessage.Signal
 */
export enum ChunkedMessage_Signal {
  /**
   * @generated from enum value: Flushed = 0;
   */
  Flushed = 0,
}

/**
 * Describes the enum dwango.nicolive.chat.service.edge.ChunkedMessage.Signal.
 */
export const ChunkedMessage_SignalSchema: GenEnum<ChunkedMessage_Signal> = /*@__PURE__*/
  enumDesc(file_dwango_nicolive_chat_service_edge_ChunkedMessage, 0, 0);

