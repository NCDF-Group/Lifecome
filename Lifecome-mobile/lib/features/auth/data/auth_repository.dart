/// Talks to the backend's identity endpoints (see Lifecome-backend's
/// `IdentityModule`). Kept as an interface so the UI and controller never
/// depend on how a request is actually made.
abstract interface class AuthRepository {
  /// Signs in with an email and password. Throws an [AuthException] if the
  /// credentials are wrong.
  Future<void> signInWithPassword({
    required String email,
    required String password,
  });

  /// Registers by email and triggers a verification code. Personal details
  /// (blueprint view 03 — Patient Profile) are collected as part of signup
  /// here rather than as a separate later step, and sent along with the
  /// registration. Returns the id of the account the code was sent for.
  Future<String> requestEmailCode({
    required String email,
    String? fullName,
    String? phoneNumber,
    DateTime? dateOfBirth,
    String? gender,
    String? state,
    String? city,
  });

  /// Verifies a 6-digit code sent to [email]. Throws an [AuthException] if
  /// the code is wrong, expired, or has been tried too many times.
  Future<void> verifyEmailCode({required String email, required String code});

  /// Requests a new code for an email that already has one pending.
  Future<void> resendEmailCode({required String email});

  /// Step 1 of the forgot-password flow: sends a reset code to [email] if
  /// an account exists for it. Never reveals whether the account exists.
  Future<void> requestPasswordReset({required String email});

  /// Step 2: verifies the reset code sent to [email]. Throws an
  /// [AuthException] if the code is wrong or expired.
  Future<void> verifyPasswordResetCode({
    required String email,
    required String code,
  });

  /// Step 3: sets a new password once the reset code has been verified.
  Future<void> setNewPassword({
    required String email,
    required String code,
    required String newPassword,
  });
}

class AuthException implements Exception {
  const AuthException(this.message);
  final String message;

  @override
  String toString() => message;
}

/// A fake, in-memory implementation used until the backend's identity
/// endpoints are wired in through `core/network`. Accepts the fixed
/// password "password123" for sign in, and the fixed code 123456 for both
/// email verification and password reset, so the flow can be built and
/// demonstrated without a live server. Swap this for a real Dio-backed
/// implementation without changing anything in `application/` or
/// `presentation/`.
class FakeAuthRepository implements AuthRepository {
  static const _demoPassword = 'password123';
  static const _demoCode = '123456';

  @override
  Future<void> signInWithPassword({
    required String email,
    required String password,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
    if (password != _demoPassword) {
      throw const AuthException(
        'Incorrect email or password. Use password123 in this demo build.',
      );
    }
  }

  @override
  Future<String> requestEmailCode({
    required String email,
    String? fullName,
    String? phoneNumber,
    DateTime? dateOfBirth,
    String? gender,
    String? state,
    String? city,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
    return 'demo-account-id';
  }

  @override
  Future<void> verifyEmailCode({
    required String email,
    required String code,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
    if (code != _demoCode) {
      throw const AuthException(
        'That code is not correct. Use 123456 in this demo build.',
      );
    }
  }

  @override
  Future<void> resendEmailCode({required String email}) async {
    await Future<void>.delayed(const Duration(milliseconds: 500));
  }

  @override
  Future<void> requestPasswordReset({required String email}) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
  }

  @override
  Future<void> verifyPasswordResetCode({
    required String email,
    required String code,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
    if (code != _demoCode) {
      throw const AuthException(
        'That code is not correct. Use 123456 in this demo build.',
      );
    }
  }

  @override
  Future<void> setNewPassword({
    required String email,
    required String code,
    required String newPassword,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
    if (newPassword.length < 8) {
      throw const AuthException(
        'Your new password must be at least 8 characters.',
      );
    }
  }
}
