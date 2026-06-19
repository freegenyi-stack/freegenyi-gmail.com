/** Codes d'erreur messagerie — traduits côté client via Messages.errors */
export type MessagingErrorCode =
  | "unauthorized"
  | "access_denied"
  | "invalid_id"
  | "invalid_user"
  | "user_not_found"
  | "cannot_contact"
  | "empty_message"
  | "message_too_long"
  | "invalid_message_type"
  | "rate_limited"
  | "file_not_allowed"
  | "school_hours_blocked"
  | "reply_not_found"
  | "message_not_found"
  | "message_deleted"
  | "cannot_edit_attachment"
  | "edit_window_expired"
  | "cannot_post_channel"
  | "cannot_pin_channel"
  | "invalid_reaction"
  | "forward_text_only"
  | "already_reported"
  | "cannot_report_own"
  | "file_not_found"
  | "file_required"
  | "upload_failed"
  | "already_can_contact"
  | "action_not_allowed";

export const MESSAGING_ERROR = {
  UNAUTHORIZED: "unauthorized",
  ACCESS_DENIED: "access_denied",
  INVALID_ID: "invalid_id",
  INVALID_USER: "invalid_user",
  USER_NOT_FOUND: "user_not_found",
  CANNOT_CONTACT: "cannot_contact",
  EMPTY_MESSAGE: "empty_message",
  MESSAGE_TOO_LONG: "message_too_long",
  INVALID_MESSAGE_TYPE: "invalid_message_type",
  RATE_LIMITED: "rate_limited",
  FILE_NOT_ALLOWED: "file_not_allowed",
  SCHOOL_HOURS_BLOCKED: "school_hours_blocked",
  REPLY_NOT_FOUND: "reply_not_found",
  MESSAGE_NOT_FOUND: "message_not_found",
  MESSAGE_DELETED: "message_deleted",
  CANNOT_EDIT_ATTACHMENT: "cannot_edit_attachment",
  EDIT_WINDOW_EXPIRED: "edit_window_expired",
  CANNOT_POST_CHANNEL: "cannot_post_channel",
  CANNOT_PIN_CHANNEL: "cannot_pin_channel",
  INVALID_REACTION: "invalid_reaction",
  FORWARD_TEXT_ONLY: "forward_text_only",
  ALREADY_REPORTED: "already_reported",
  CANNOT_REPORT_OWN: "cannot_report_own",
  FILE_NOT_FOUND: "file_not_found",
  FILE_REQUIRED: "file_required",
  UPLOAD_FAILED: "upload_failed",
  ALREADY_CAN_CONTACT: "already_can_contact",
  ACTION_NOT_ALLOWED: "action_not_allowed",
} as const satisfies Record<string, MessagingErrorCode>;

export type MessagingErrorResult = { error: MessagingErrorCode; code: MessagingErrorCode };

export function messagingError(code: MessagingErrorCode): MessagingErrorResult {
  return { error: code, code };
}

export function messagingAccessHttpStatus(code: MessagingErrorCode): number {
  if (code === MESSAGING_ERROR.UNAUTHORIZED) return 401;
  if (
    code === MESSAGING_ERROR.ACCESS_DENIED ||
    code === MESSAGING_ERROR.CANNOT_CONTACT ||
    code === MESSAGING_ERROR.CANNOT_POST_CHANNEL ||
    code === MESSAGING_ERROR.CANNOT_PIN_CHANNEL ||
    code === MESSAGING_ERROR.FILE_NOT_ALLOWED ||
    code === MESSAGING_ERROR.CANNOT_REPORT_OWN
  ) {
    return 403;
  }
  if (code === MESSAGING_ERROR.MESSAGE_NOT_FOUND || code === MESSAGING_ERROR.FILE_NOT_FOUND) return 404;
  return 400;
}
