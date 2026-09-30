/// Named route paths, kept in one place so a screen is never linked to by a
/// hand-typed string in more than one file.
abstract final class RoutePaths {
  static const splash = '/';

  /// The single static welcome screen shown after the splash screen when
  /// there is no remembered session. No "seen it before" flag is persisted
  /// (would need local storage beyond the session flag), so it shows on
  /// every cold launch that isn't already signed in.
  static const welcome = '/welcome';

  /// Shown instead of [welcome] when a session was remembered from a
  /// previous launch (see `SessionStore`). Reached with an [AppLockArgs]
  /// passed as `extra`.
  static const appLock = '/app-lock';

  static const signIn = '/sign-in';

  /// Step 1 of 2: full name, email and optional referral code.
  static const createAccount = '/create-account';

  /// Step 2 of 2: date of birth and phone number. Reached with a
  /// [PersonalDetailsArgs] passed as `extra`, carrying what step 1 collected.
  static const personalDetails = '/personal-details';

  /// Reached with a [VerifyEmailArgs] passed as the route's `extra`, so it
  /// knows which email to show and which flow to return to.
  static const verifyEmail = '/verify-email';

  /// Sets the account's password once its email is verified. Reached with a
  /// [CreatePasswordArgs] passed as `extra`.
  static const createPassword = '/create-password';

  /// Shown once sign-up finishes. Reached with an [AuthSuccessArgs] passed
  /// as `extra`.
  static const signUpSuccess = '/sign-up-success';

  /// Step 1 of the forgot-password flow: enter the account email.
  static const forgotPassword = '/forgot-password';

  /// Step 2: enter the reset code sent to that email. Reached with a
  /// [ResetPasswordArgs] passed as `extra`.
  static const resetPassword = '/reset-password';

  /// Step 3: choose a new password. Reached with a [NewPasswordArgs]
  /// passed as `extra`.
  static const newPassword = '/new-password';

  /// Shown once the password reset finishes. Reached with an
  /// [AuthSuccessArgs] passed as `extra`.
  static const passwordChanged = '/password-changed';

  /// The LifeCome Live Dashboard (blueprint view 04) — the Home tab of the
  /// bottom-nav shell (see `AppShell`).
  static const home = '/home';

  /// My Visits tab — upcoming/past appointments and their sub-flows.
  static const visits = '/visits';

  /// Messages tab — the single LifeCome care team conversation.
  static const messages = '/messages';

  /// Profile tab — account, health records, and support.
  static const profile = '/profile';

  static const healthRecords = '/profile/health-records';

  static const helpAndSupport = '/profile/help';

  /// Blueprint view 05 — Choose How to Pay.
  static const payerChoosePaymentMethod = '/payer/choose-payment-method';

  /// Blueprint view 06 — Select Your HMO.
  static const payerSelectHmo = '/payer/select-hmo';

  /// Blueprint view 07 — Verify HMO Membership. Reached with the chosen
  /// HMO's name passed as `extra`.
  static const payerVerifyMembership = '/payer/verify-membership';

  /// Blueprint view 08 — HMO Coverage & Benefits. Reached with the verified
  /// HMO's name passed as `extra`.
  static const payerCoverage = '/payer/coverage';
}
