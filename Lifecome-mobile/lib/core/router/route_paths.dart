/// Named route paths, kept in one place so a screen is never linked to by a
/// hand-typed string in more than one file.
abstract final class RoutePaths {
  static const splash = '/';

  /// Shown once after the splash screen, before Sign In. No "seen it
  /// before" flag is persisted yet (would need local storage, not wired in
  /// this build), so it currently shows on every launch.
  static const onboarding = '/onboarding';

  static const signIn = '/sign-in';

  /// Step 1 of 2: name, email, phone and terms.
  static const createAccount = '/create-account';

  /// Step 2 of 2: date of birth, gender and location. Reached with a
  /// [PersonalDetailsArgs] passed as `extra`, carrying what step 1 collected.
  static const personalDetails = '/personal-details';

  /// Reached with a [VerifyEmailArgs] passed as the route's `extra`, so it
  /// knows which email to show and which flow to return to.
  static const verifyEmail = '/verify-email';

  /// Step 1 of the forgot-password flow: enter the account email.
  static const forgotPassword = '/forgot-password';

  /// Step 2: enter the reset code sent to that email. Reached with a
  /// [ResetPasswordArgs] passed as `extra`.
  static const resetPassword = '/reset-password';

  /// Step 3: choose a new password. Reached with a [NewPasswordArgs]
  /// passed as `extra`.
  static const newPassword = '/new-password';

  /// Placeholder destination once verification succeeds. Replaced by the
  /// real dashboard (blueprint view 04) when that feature is built.
  static const home = '/home';
}
