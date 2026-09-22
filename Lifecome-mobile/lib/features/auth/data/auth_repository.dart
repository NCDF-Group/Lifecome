/// Talks to the backend's identity endpoints (see Lifecome-backend's
/// `IdentityModule`). Kept as an interface so the UI and controller never
/// depend on how a request is actually made.
abstract interface class AuthRepository {
  /// Registers or signs in by email and triggers a verification code.
  /// Returns the id of the account the code was sent for.
  Future<String> requestEmailCode({
    required String email,
    String? fullName,
    String? phoneNumber,
  });

  /// Verifies a 6-digit code sent to [email]. Throws an [AuthException] if
  /// the code is wrong, expired, or has been tried too many times.
  Future<void> verifyEmailCode({required String email, required String code});

  /// Requests a new code for an email that already has one pending.
  Future<void> resendEmailCode({required String email});
}

class AuthException implements Exception {
  const AuthException(this.message);
  final String message;

  @override
  String toString() => message;
}

/// A fake, in-memory implementation used until the backend's identity
/// endpoints are wired in through `core/network`. Accepts the fixed code
/// 123456 for every email, so the flow can be built and demonstrated without
/// a live server. Swap this for a real Dio-backed implementation without
/// changing anything in `application/` or `presentation/`.
class FakeAuthRepository implements AuthRepository {
  static const _demoCode = '123456';

  @override
  Future<String> requestEmailCode({
    required String email,
    String? fullName,
    String? phoneNumber,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
    return 'demo-account-id';
  }

  @override
  Future<void> verifyEmailCode({required String email, required String code}) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
    if (code != _demoCode) {
      throw const AuthException('That code is not correct. Use 123456 in this demo build.');
    }
  }

  @override
  Future<void> resendEmailCode({required String email}) async {
    await Future<void>.delayed(const Duration(milliseconds: 500));
  }
}
