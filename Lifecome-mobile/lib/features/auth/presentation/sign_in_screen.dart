import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import '../../../core/animation/fade_in.dart';
import '../../../core/router/route_paths.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/buttons/primary_button.dart';
import '../../../core/widgets/inputs/app_text_field.dart';
import '../../../core/widgets/layout/brand_backdrop.dart';
import '../application/auth_controller.dart';
import '../domain/models/auth_session.dart';
import 'verify_email_screen.dart';

class SignInScreen extends ConsumerStatefulWidget {
  const SignInScreen({super.key});

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _emailController = TextEditingController();
  String? _errorText;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  bool _isValidEmail(String value) {
    return RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(value.trim());
  }

  Future<void> _continue() async {
    final email = _emailController.text.trim();
    if (!_isValidEmail(email)) {
      setState(() => _errorText = 'Enter a valid email address.');
      return;
    }
    setState(() => _errorText = null);

    final sent = await ref.read(authControllerProvider.notifier).requestCode(
          flow: AuthFlow.signIn,
          email: email,
        );

    if (!mounted) return;
    if (sent) {
      context.push(RoutePaths.verifyEmail, extra: VerifyEmailArgs(email: email));
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final submitting = authState.status == AuthStatus.submitting;

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Stack(
          children: [
            const Positioned.fill(child: BrandBackdrop()),
            SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.xl),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  FadeIn(
                    child: Center(
                      child: SvgPicture.asset(
                        'assets/images/logo/lifecome-live-logo.svg',
                        height: 32,
                        semanticsLabel: 'LifeCome Live',
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xxl),
                  FadeIn(
                    delay: const Duration(milliseconds: 80),
                    child: Text.rich(
                      TextSpan(
                        style: const TextStyle(
                          fontSize: 30,
                          fontWeight: FontWeight.w800,
                          color: AppColors.ink,
                          height: 1.15,
                        ),
                        children: [
                          const TextSpan(text: 'Welcome '),
                          const TextSpan(text: 'back', style: TextStyle(color: AppColors.blue)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  const FadeIn(
                    delay: Duration(milliseconds: 120),
                    child: Text(
                      'Sign in with your email to continue your care.',
                      style: TextStyle(fontSize: 15, color: AppColors.inkMuted, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  FadeIn(
                    delay: const Duration(milliseconds: 160),
                    child: AppTextField(
                      label: 'Email',
                      controller: _emailController,
                      hintText: 'you@example.com',
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.done,
                      autofillHints: const [AutofillHints.email],
                      errorText: _errorText,
                      onSubmitted: (_) => _continue(),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  FadeIn(
                    delay: const Duration(milliseconds: 200),
                    child: PrimaryButton(
                      label: 'Continue',
                      loading: submitting,
                      onPressed: _continue,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  FadeIn(
                    delay: const Duration(milliseconds: 240),
                    child: Center(
                      child: Wrap(
                        alignment: WrapAlignment.center,
                        children: [
                          const Text(
                            "Don't have an account? ",
                            style: TextStyle(color: AppColors.inkMuted, fontSize: 14),
                          ),
                          GestureDetector(
                            onTap: () => context.push(RoutePaths.createAccount),
                            child: const Text(
                              'Create one',
                              style: TextStyle(
                                color: AppColors.blue,
                                fontWeight: FontWeight.w700,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
