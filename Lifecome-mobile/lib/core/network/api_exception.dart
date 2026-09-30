/// Thrown by [ApiClient] for any failed request — a non-2xx response or a network failure.
/// Carries the backend's own `error.code`/`error.message` (see Lifecome-Backen's
/// `HttpExceptionFilter`) when the server responded with one.
class ApiException implements Exception {
  const ApiException(this.message, {this.code, this.statusCode});

  final String message;
  final String? code;
  final int? statusCode;

  @override
  String toString() => message;
}
