import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/app_lock_screen.dart';
import '../../features/auth/presentation/create_account_screen.dart';
import '../../features/auth/presentation/create_password_screen.dart';
import '../../features/auth/presentation/forgot_password_screen.dart';
import '../../features/auth/presentation/new_password_screen.dart';
import '../../features/auth/presentation/password_changed_screen.dart';
import '../../features/auth/presentation/personal_details_screen.dart';
import '../../features/auth/presentation/reset_password_screen.dart';
import '../../features/auth/presentation/sign_in_screen.dart';
import '../../features/auth/presentation/sign_up_success_screen.dart';
import '../../features/auth/presentation/verify_email_screen.dart';
import '../../features/booking/presentation/my_visits_screen.dart';
import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/health_records/presentation/health_records_screen.dart';
import '../../features/messaging/presentation/message_threads_screen.dart';
import '../../features/profile/presentation/patient_profile_screen.dart';
import '../../features/splash/presentation/splash_screen.dart';
import '../../features/support/presentation/help_centre_screen.dart';
import '../../features/welcome/presentation/welcome_screen.dart';
import 'app_shell.dart';
import 'route_paths.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: RoutePaths.splash,
    routes: [
      GoRoute(
        path: RoutePaths.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: RoutePaths.welcome,
        builder: (context, state) => const WelcomeScreen(),
      ),
      GoRoute(
        path: RoutePaths.appLock,
        builder: (context, state) => const AppLockScreen(),
      ),
      GoRoute(
        path: RoutePaths.signIn,
        builder: (context, state) => const SignInScreen(),
      ),
      GoRoute(
        path: RoutePaths.createAccount,
        builder: (context, state) => const CreateAccountScreen(),
      ),
      GoRoute(
        path: RoutePaths.personalDetails,
        builder: (context, state) =>
            PersonalDetailsScreen(args: state.extra! as PersonalDetailsArgs),
      ),
      GoRoute(
        path: RoutePaths.verifyEmail,
        builder: (context, state) =>
            VerifyEmailScreen(args: state.extra! as VerifyEmailArgs),
      ),
      GoRoute(
        path: RoutePaths.createPassword,
        builder: (context, state) => const CreatePasswordScreen(),
      ),
      GoRoute(
        path: RoutePaths.signUpSuccess,
        builder: (context, state) => const SignUpSuccessScreen(),
      ),
      GoRoute(
        path: RoutePaths.forgotPassword,
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: RoutePaths.resetPassword,
        builder: (context, state) =>
            ResetPasswordScreen(args: state.extra! as ResetPasswordArgs),
      ),
      GoRoute(
        path: RoutePaths.newPassword,
        builder: (context, state) =>
            NewPasswordScreen(args: state.extra! as NewPasswordArgs),
      ),
      GoRoute(
        path: RoutePaths.passwordChanged,
        builder: (context, state) => const PasswordChangedScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            AppShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RoutePaths.home,
                builder: (context, state) => const DashboardScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RoutePaths.visits,
                builder: (context, state) => const MyVisitsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RoutePaths.messages,
                builder: (context, state) => const MessageThreadsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RoutePaths.profile,
                builder: (context, state) => const PatientProfileScreen(),
                routes: [
                  GoRoute(
                    path: 'health-records',
                    builder: (context, state) => const HealthRecordsScreen(),
                  ),
                  GoRoute(
                    path: 'help',
                    builder: (context, state) => const HelpCentreScreen(),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
