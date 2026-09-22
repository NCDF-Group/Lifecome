import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import '../../../core/animation/fade_in.dart';
import '../../../core/router/route_paths.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/buttons/primary_button.dart';
import '../../../core/widgets/inputs/otp_input.dart';
import '../application/auth_controller.dart';
import '../domain/models/auth_session.dart';
import 'widgets/otp_timer.dart';

/// What this screen needs to know: which email the code was sent to, and
/// which flow (sign in or create account) it should return to if the user
/// taps "Change email".
class VerifyEmailArgs {
  const VerifyEmailArgs({required this.email});
  final String email;
}

class VerifyEmailScreen extends ConsumerStatefulWidget {
  const VerifyEmailScreen({super.key, required this.args});

  final VerifyEmailArgs args;

  @override
  ConsumerState<VerifyEmailScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends ConsumerState<VerifyEmailScreen> {
  final _otpKey = GlobalKey<OtpInputState>();
  String _code = '';

  Future<void> _submit([String? completedCode]) async {
    final code = completedCode ?? _code;
    if (code.length != 6) return;

    final verified = await ref
        .read(authControllerProvider.notifier)
        .verifyCode(code);
    if (!mounted) return;

    if (verified) {
      context.go(RoutePaths.home);
    } else {
      _otpKey.currentState?.clear();
      setState(() => _code = '');
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final verifying = authState.status == AuthStatus.verifying;

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.blue),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: AppSpacing.md),
              FadeIn(
                child: Center(
                  child: SvgPicture.asset(
                    'assets/images/logo/lifecome-live-mark.svg',
                    height: 44,
                    width: 44,
                    semanticsLabel: 'LifeCome Live',
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xxl),
              FadeIn(
                delay: const Duration(milliseconds: 80),
                child: Center(
                  child: Container(
                    width: 88,
                    height: 88,
                    decoration: BoxDecoration(
                      color: AppColors.blue.withValues(alpha: 0.08),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.mark_email_read_outlined,
                      color: AppColors.blue,
                      size: 40,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              const FadeIn(
                delay: Duration(milliseconds: 120),
                child: Text(
                  'Verify your email',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: AppColors.ink,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xs),
              FadeIn(
                delay: const Duration(milliseconds: 160),
                child: Text(
                  'Enter the 6-digit code sent to ${widget.args.email}',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.inkMuted,
                    height: 1.4,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
              FadeIn(
                delay: const Duration(milliseconds: 200),
                child: Center(
                  child: OtpInput(
                    key: _otpKey,
                    onCompleted: (code) => _submit(code),
                    onChanged: (value) => setState(() => _code = value),
                    errorText: authState.errorMessage,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              FadeIn(
                delay: const Duration(milliseconds: 240),
                child: PrimaryButton(
                  label: 'Verify and continue',
                  loading: verifying,
                  onPressed: _code.length == 6 ? () => _submit() : null,
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              Center(
                child: TextButton(
                  onPressed: () => context.pop(),
                  child: const Text(
                    'Change email',
                    style: TextStyle(
                      color: AppColors.blue,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xs),
              Center(
                child: authState.resendAvailableAt != null
                    ? OtpTimer(
                        availableAt: authState.resendAvailableAt!,
                        onResend: () => ref
                            .read(authControllerProvider.notifier)
                            .resendCode(),
                      )
                    : const SizedBox.shrink(),
              ),
              const SizedBox(height: AppSpacing.lg),
              const Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.lock_outline,
                      size: 16,
                      color: AppColors.inkMuted,
                    ),
                    SizedBox(width: 6),
                    Text(
                      'Never share your verification code.',
                      style: TextStyle(fontSize: 12, color: AppColors.inkMuted),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
            ],
          ),
        ),
      ),
    );
  }
}
