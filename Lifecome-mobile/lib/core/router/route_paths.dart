/// Named route paths, kept in one place so a screen is never linked to by a
/// hand-typed string in more than one file.
abstract final class RoutePaths {
  static const splash = '/';
  static const signIn = '/sign-in';
  static const createAccount = '/create-account';

  /// Reached with a [VerifyEmailArgs] passed as the route's `extra`, so it
  /// knows which email to show and which flow to return to.
  static const verifyEmail = '/verify-email';

  /// Placeholder destination once verification succeeds. Replaced by the
  /// real dashboard (blueprint view 04) when that feature is built.
  static const home = '/home';
}
