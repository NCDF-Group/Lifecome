import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers/core_providers.dart';
import '../data/auth_repository.dart';
import '../domain/models/auth_session.dart';

const _resendCooldown = Duration(seconds: 30);

/// Holds the state for the sign-in, create-account and verify-email screens.
/// One controller for the whole flow, since the three screens are really one
/// journey: request a code, then verify it.
class AuthController extends Notifier<AuthSessionState> {
  @override
  AuthSessionState build() => AuthSessionState.empty();

  /// Email + password sign in. Unlike [requestCode], this resolves
  /// immediately, there is no separate verification step.
  Future<bool> signIn({required String email, required String password}) async {
    state = state.copyWith(
      status: AuthStatus.submitting,
      flow: AuthFlow.signIn,
      email: email,
      clearError: true,
    );

    try {
      await ref
          .read(authRepositoryProvider)
          .signInWithPassword(email: email, password: password);
      state = state.copyWith(status: AuthStatus.verified);
      return true;
    } on AuthException catch (error) {
      state = state.copyWith(
        status: AuthStatus.failed,
        errorMessage: error.message,
      );
      return false;
    } catch (_) {
      state = state.copyWith(
        status: AuthStatus.failed,
        errorMessage: 'Something went wrong. Please try again.',
      );
      return false;
    }
  }

  Future<bool> requestCode({
    required AuthFlow flow,
    required String email,
    String? fullName,
    String? phoneNumber,
    DateTime? dateOfBirth,
    String? gender,
    String? region,
    String? city,
  }) async {
    state = state.copyWith(
      status: AuthStatus.submitting,
      flow: flow,
      email: email,
      fullName: fullName,
      phoneNumber: phoneNumber,
      clearError: true,
    );

    try {
      await ref
          .read(authRepositoryProvider)
          .requestEmailCode(
            email: email,
            fullName: fullName,
            phoneNumber: phoneNumber,
            dateOfBirth: dateOfBirth,
            gender: gender,
            state: region,
            city: city,
          );
      state = state.copyWith(
        status: AuthStatus.codeSent,
        resendAvailableAt: DateTime.now().add(_resendCooldown),
      );
      return true;
    } on AuthException catch (error) {
      state = state.copyWith(
        status: AuthStatus.failed,
        errorMessage: error.message,
      );
      return false;
    } catch (_) {
      state = state.copyWith(
        status: AuthStatus.failed,
        errorMessage: 'Something went wrong. Please try again.',
      );
      return false;
    }
  }

  Future<bool> verifyCode(String code) async {
    state = state.copyWith(status: AuthStatus.verifying, clearError: true);

    try {
      await ref
          .read(authRepositoryProvider)
          .verifyEmailCode(email: state.email, code: code);
      state = state.copyWith(status: AuthStatus.verified);
      return true;
    } on AuthException catch (error) {
      state = state.copyWith(
        status: AuthStatus.codeSent,
        errorMessage: error.message,
      );
      return false;
    } catch (_) {
      state = state.copyWith(
        status: AuthStatus.codeSent,
        errorMessage: 'Something went wrong. Please try again.',
      );
      return false;
    }
  }

  Future<void> resendCode() async {
    try {
      await ref
          .read(authRepositoryProvider)
          .resendEmailCode(email: state.email);
      state = state.copyWith(
        resendAvailableAt: DateTime.now().add(_resendCooldown),
        clearError: true,
      );
    } on AuthException catch (error) {
      state = state.copyWith(errorMessage: error.message);
    } catch (_) {
      state = state.copyWith(
        errorMessage: 'Could not resend the code. Please try again.',
      );
    }
  }

  void reset() {
    state = AuthSessionState.empty();
  }
}

final authControllerProvider =
    NotifierProvider<AuthController, AuthSessionState>(AuthController.new);
