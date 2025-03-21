// @generated by protoc-gen-es v2.2.3 with parameter "target=ts"
// @generated from file dwango/nicolive/chat/service/edge/ChunkedEntry.proto (package dwango.nicolive.chat.service.edge, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import { file_google_protobuf_timestamp } from "@bufbuild/protobuf/wkt";
import type { MessageSegment } from "./MessageSegment_pb";
import { file_dwango_nicolive_chat_service_edge_MessageSegment } from "./MessageSegment_pb";
import type { BackwardSegment } from "./BackwardSegment_pb";
import { file_dwango_nicolive_chat_service_edge_BackwardSegment } from "./BackwardSegment_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file dwango/nicolive/chat/service/edge/ChunkedEntry.proto.
 */
export const file_dwango_nicolive_chat_service_edge_ChunkedEntry: GenFile = /*@__PURE__*/
  fileDesc("CjRkd2FuZ28vbmljb2xpdmUvY2hhdC9zZXJ2aWNlL2VkZ2UvQ2h1bmtlZEVudHJ5LnByb3RvEiFkd2FuZ28ubmljb2xpdmUuY2hhdC5zZXJ2aWNlLmVkZ2Ui1gIKDENodW5rZWRFbnRyeRJECgdzZWdtZW50GAEgASgLMjEuZHdhbmdvLm5pY29saXZlLmNoYXQuc2VydmljZS5lZGdlLk1lc3NhZ2VTZWdtZW50SAASRgoIYmFja3dhcmQYAiABKAsyMi5kd2FuZ28ubmljb2xpdmUuY2hhdC5zZXJ2aWNlLmVkZ2UuQmFja3dhcmRTZWdtZW50SAASRQoIcHJldmlvdXMYAyABKAsyMS5kd2FuZ28ubmljb2xpdmUuY2hhdC5zZXJ2aWNlLmVkZ2UuTWVzc2FnZVNlZ21lbnRIABJMCgRuZXh0GAQgASgLMjwuZHdhbmdvLm5pY29saXZlLmNoYXQuc2VydmljZS5lZGdlLkNodW5rZWRFbnRyeS5SZWFkeUZvck5leHRIABoaCgxSZWFkeUZvck5leHQSCgoCYXQYASABKANCBwoFZW50cnlC5AEKJWNvbS5kd2FuZ28ubmljb2xpdmUuY2hhdC5zZXJ2aWNlLmVkZ2VCEUNodW5rZWRFbnRyeVByb3RvUAGiAgVETkNTRaoCIUR3YW5nby5OaWNvbGl2ZS5DaGF0LlNlcnZpY2UuRWRnZcoCIUR3YW5nb1xOaWNvbGl2ZVxDaGF0XFNlcnZpY2VcRWRnZeICLUR3YW5nb1xOaWNvbGl2ZVxDaGF0XFNlcnZpY2VcRWRnZVxHUEJNZXRhZGF0YeoCJUR3YW5nbzo6Tmljb2xpdmU6OkNoYXQ6OlNlcnZpY2U6OkVkZ2ViBnByb3RvMw", [file_google_protobuf_timestamp, file_dwango_nicolive_chat_service_edge_MessageSegment, file_dwango_nicolive_chat_service_edge_BackwardSegment]);

/**
 * *
 * ストリーミング配信されてくる各チャンク。
 * 開始時刻を指定してサーバーへストリームをリクエストすると、開始時刻から一定時間内に発生したメッセージがすべてチャンクとして送られてくる。
 * 開始時刻が過去の時刻の場合は指定時間内のすべてのチャンクが一瞬で送られてきて接続がすぐに終了する。
 * 開始時刻が現在の時刻の場合は一定時間の間接続が開いたままとなり、発生したメッセージがリアルタイムにストリームで送られてくる。
 *
 * @generated from message dwango.nicolive.chat.service.edge.ChunkedEntry
 */
export type ChunkedEntry = Message<"dwango.nicolive.chat.service.edge.ChunkedEntry"> & {
  /**
   * @generated from oneof dwango.nicolive.chat.service.edge.ChunkedEntry.entry
   */
  entry: {
    /**
     * @generated from field: dwango.nicolive.chat.service.edge.MessageSegment segment = 1;
     */
    value: MessageSegment;
    case: "segment";
  } | {
    /**
     * @generated from field: dwango.nicolive.chat.service.edge.BackwardSegment backward = 2;
     */
    value: BackwardSegment;
    case: "backward";
  } | {
    /**
     * @generated from field: dwango.nicolive.chat.service.edge.MessageSegment previous = 3;
     */
    value: MessageSegment;
    case: "previous";
  } | {
    /**
     * @generated from field: dwango.nicolive.chat.service.edge.ChunkedEntry.ReadyForNext next = 4;
     */
    value: ChunkedEntry_ReadyForNext;
    case: "next";
  } | { case: undefined; value?: undefined };
};

/**
 * Describes the message dwango.nicolive.chat.service.edge.ChunkedEntry.
 * Use `create(ChunkedEntrySchema)` to create a new message.
 */
export const ChunkedEntrySchema: GenMessage<ChunkedEntry> = /*@__PURE__*/
  messageDesc(file_dwango_nicolive_chat_service_edge_ChunkedEntry, 0);

/**
 * *
 * 　 * 次のストリームの開始時刻を表すチャンク。必ずストリームの末尾に送られてくる。
 * 　
 *
 * @generated from message dwango.nicolive.chat.service.edge.ChunkedEntry.ReadyForNext
 */
export type ChunkedEntry_ReadyForNext = Message<"dwango.nicolive.chat.service.edge.ChunkedEntry.ReadyForNext"> & {
  /**
   * @generated from field: int64 at = 1;
   */
  at: bigint;
};

/**
 * Describes the message dwango.nicolive.chat.service.edge.ChunkedEntry.ReadyForNext.
 * Use `create(ChunkedEntry_ReadyForNextSchema)` to create a new message.
 */
export const ChunkedEntry_ReadyForNextSchema: GenMessage<ChunkedEntry_ReadyForNext> = /*@__PURE__*/
  messageDesc(file_dwango_nicolive_chat_service_edge_ChunkedEntry, 0, 0);

