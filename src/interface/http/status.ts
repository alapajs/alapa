export enum HTTP_STATUS {
  // Success (2xx)
  SUCCESS = "success",
  CREATED = "resource_created",
  UPDATED = "resource_updated",
  DELETED = "resource_deleted",
  ACCEPTED = "accepted",
  PROCESSING = "processing",
  OK = "ok",

  // Client Errors (4xx)
  ERROR = "error",
  BAD_REQUEST = "bad_request",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not_found",
  METHOD_NOT_ALLOWED = "method_not_allowed",
  NOT_ACCEPTABLE = "not_acceptable",
  CONFLICT = "conflict",
  DATA_CONFLICT = "data_conflict",
  GONE = "gone",
  LENGTH_REQUIRED = "length_required",
  PRECONDITION_FAILED = "precondition_failed",
  PAYLOAD_TOO_LARGE = "payload_too_large",
  UNSUPPORTED_MEDIA_TYPE = "unsupported_media_type",
  TOO_MANY_REQUESTS = "too_many_requests",
  UNPROCESSABLE_ENTITY = "unprocessable_entity",
  LOCKED = "locked",
  FAILED_DEPENDENCY = "failed_dependency",
  TOO_EARLY = "too_early",
  UPGRADE_REQUIRED = "upgrade_required",

  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = "internal_server_error",
  NOT_IMPLEMENTED = "not_implemented",
  BAD_GATEWAY = "bad_gateway",
  SERVICE_UNAVAILABLE = "service_unavailable",
  GATEWAY_TIMEOUT = "gateway_timeout",
  HTTP_VERSION_NOT_SUPPORTED = "http_version_not_supported",
  VARIANT_ALSO_NEGOTIATES = "variant_also_negotiates",
  INSUFFICIENT_STORAGE = "insufficient_storage",
  LOOP_DETECTED = "loop_detected",
  NOT_EXTENDED = "not_extended",
  NETWORK_AUTHENTICATION_REQUIRED = "network_authentication_required",

  // Business Logic & Application Specific
  INVALID_REQUEST = "invalid_request",
  DATA_VALIDATION_FAILED = "data_validation_failed",
  PAYMENT_REQUIRED = "payment_required",
  FEATURE_NOT_AVAILABLE = "feature_not_available",
  DEPENDENCY_ERROR = "dependency_error",
  ACCOUNT_LOCKED = "account_locked",
  SESSION_EXPIRED = "session_expired",
  SUSPENDED = "suspended",
  NOT_AUTHORIZED = "not_authorized",

  // Custom Business Statuses
  PENDING_APPROVAL = "pending_approval",
  UNDER_REVIEW = "under_review",
  PARTIAL_SUCCESS = "partial_success",
  RATE_LIMITED = "rate_limited",
  MAINTENANCE_MODE = "maintenance_mode",
  OUTDATED_CLIENT = "outdated_client",
  QUOTA_EXCEEDED = "quota_exceeded",
  EXPIRED = "expired",
  DUPLICATE = "duplicate",
  INSUFFICIENT_PERMISSIONS = "insufficient_permissions",
  THROTTLED = "throttled",
  BLOCKED = "blocked",
  NOT_VERIFIED = "not_verified",
  UNKNOWN_ERROR = "unknown_error",
}

export type HttpStatusValue =
  | "success"
  | "resource_created"
  | "resource_updated"
  | "resource_deleted"
  | "accepted"
  | "processing"
  | "ok"
  | "error"
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "method_not_allowed"
  | "not_acceptable"
  | "conflict"
  | "data_conflict"
  | "gone"
  | "length_required"
  | "precondition_failed"
  | "payload_too_large"
  | "unsupported_media_type"
  | "too_many_requests"
  | "unprocessable_entity"
  | "locked"
  | "failed_dependency"
  | "too_early"
  | "upgrade_required"
  | "internal_server_error"
  | "not_implemented"
  | "bad_gateway"
  | "service_unavailable"
  | "gateway_timeout"
  | "http_version_not_supported"
  | "variant_also_negotiates"
  | "insufficient_storage"
  | "loop_detected"
  | "not_extended"
  | "network_authentication_required"
  | "invalid_request"
  | "data_validation_failed"
  | "payment_required"
  | "feature_not_available"
  | "dependency_error"
  | "account_locked"
  | "session_expired"
  | "suspended"
  | "not_authorized"
  | "pending_approval"
  | "under_review"
  | "partial_success"
  | "rate_limited"
  | "maintenance_mode"
  | "outdated_client"
  | "quota_exceeded"
  | "expired"
  | "duplicate"
  | "insufficient_permissions"
  | "throttled"
  | "blocked"
  | "not_verified"
  | "unknown_error";
