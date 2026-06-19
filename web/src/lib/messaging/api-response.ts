import { NextResponse } from "next/server";
import {
  MESSAGING_ERROR,
  messagingAccessHttpStatus,
  messagingError,
  type MessagingErrorCode,
} from "./messaging-errors";

export function messagingJsonError(code: MessagingErrorCode, status?: number) {
  const err = messagingError(code);
  return NextResponse.json(err, { status: status ?? messagingAccessHttpStatus(code) });
}

export function messagingUnauthorized() {
  return messagingJsonError(MESSAGING_ERROR.UNAUTHORIZED);
}

export function messagingAccessDenied() {
  return messagingJsonError(MESSAGING_ERROR.ACCESS_DENIED);
}

export function messagingInvalidId() {
  return messagingJsonError(MESSAGING_ERROR.INVALID_ID);
}

export function messagingResultError(result: { error: MessagingErrorCode; code: MessagingErrorCode }) {
  return NextResponse.json(result, { status: messagingAccessHttpStatus(result.code) });
}
