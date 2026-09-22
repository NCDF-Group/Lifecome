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
import 'widgets/terms_consent_checkbox.dart';

/// View 01 (Create Account) and, once verified, leads into view 02.
/// Verification is by email rather than SMS in this build: no SMS provider
/// is connected yet (see Lifecome-backend's README), and email needs
/// nothing extra to work end to end. The mobile number field is kept, but
/// optional, for appointment reminders once that channel exists.
class CreateAccountScreen extends ConsumerStatefulWidget {
  const CreateAccountScreen({super.key});

  @override
  ConsumerState<CreateAccountScreen> createState() => _CreateAccountScreenState();
}

class _CreateAccountScreenState extends ConsumerState<CreateAccountScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _agreedToTerms = false;
  String? _nameError;
  String? _emailError;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  bool _isValidEmail(String value) {
    return RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(value.trim());
  }

  Future<void> _createAccount() async {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();

    setState(() {
      _nameError = name.isEmpty ? 'Enter your full name.' : null;
      _emailError = _isValidEmail(email) ? null : 'Enter a valid email address.';
    });

    if (_nameError != null || _emailError != null) return;

    if (!_agreedToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please agree to the Terms and Privacy Notice to continue.')),
      );
      return;
    }

    final phone = _phoneController.text.trim();
    final sent = await ref.read(authControllerProvider.notifier).requestCode(
          flow: AuthFlow.createAccount,
          email: email,
          fullName: name,
          phoneNumber: phone.isEmpty ? null : phone,
        );

    if (!mounted) return;
    if (sent) {
      context.push(RoutePaths.verifyEmail, extra: VerifyEmailArgs(email: email));
    }
  }

  void _openTerms() {
    // Placeholder until the legal screens are built (lib/features/legal).
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Terms of use are not published in the app yet.')),
    );
  }

  void _openPrivacy() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('The privacy notice is not published in the app yet.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final submitting = authState.status == AuthStatus.submitting;

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.blue),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: Stack(
          children: [
            const Positioned.fill(child: BrandBackdrop()),
            SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.lg,
                0,
                AppSpacing.lg,
                AppSpacing.xl,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  FadeIn(
                    child: Center(
                      child: SvgPicture.asset(
                        'assets/images/logo/lifecome-live-logo.svg',
                        height: 30,
                        semanticsLabel: 'LifeCome Live',
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  FadeIn(
                    delay: const Duration(milliseconds: 80),
                    child: Text.rich(
                      TextSpan(
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          color: AppColors.ink,
                          height: 1.15,
                        ),
                        children: [
                          const TextSpan(text: 'Your care '),
                          TextSpan(text: 'starts here', style: TextStyle(color: AppColors.blue)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  const FadeIn(
                    delay: Duration(milliseconds: 120),
                    child: Text(
                      'One account for your HMO and one-time care.',
                      style: TextStyle(fontSize: 15, color: AppColors.inkMuted, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  FadeIn(
                    delay: const Duration(milliseconds: 160),
                    child: AppTextField(
                      label: 'Full name',
                      controller: _nameController,
                      hintText: 'Enter your full name',
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.name],
                      errorText: _nameError,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  FadeIn(
                    delay: const Duration(milliseconds: 200),
                    child: AppTextField(
                      label: 'Email',
                      controller: _emailController,
                      hintText: 'you@example.com',
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.email],
                      errorText: _emailError,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  FadeIn(
                    delay: const Duration(milliseconds: 240),
                    child: AppTextField(
                      label: 'Mobile number (optional)',
                      controller: _phoneController,
                      hintText: 'Enter mobile number',
                      keyboardType: TextInputType.phone,
                      textInputAction: TextInputAction.done,
                      autofillHints: const [AutofillHints.telephoneNumber],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  FadeIn(
                    delay: const Duration(milliseconds: 260),
                    child: TermsConsentCheckbox(
                      checked: _agreedToTerms,
                      onChanged: (value) => setState(() => _agreedToTerms = value),
                      onTermsTap: _openTerms,
                      onPrivacyTap: _openPrivacy,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  FadeIn(
                    delay: const Duration(milliseconds: 300),
                    child: PrimaryButton(
                      label: 'Create account',
                      loading: submitting,
                      onPressed: _createAccount,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  const FadeIn(
                    delay: Duration(milliseconds: 320),
                    child: Center(
                      child: Text(
                        'We will send a code to verify your email.',
                        style: TextStyle(fontSize: 12, color: AppColors.inkMuted),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  FadeIn(
                    delay: const Duration(milliseconds: 340),
                    child: Center(
                      child: Wrap(
                        alignment: WrapAlignment.center,
                        children: [
                          const Text(
                            'Already have an account? ',
                            style: TextStyle(color: AppColors.inkMuted, fontSize: 14),
                          ),
                          GestureDetector(
                            onTap: () => context.pop(),
                            child: const Text(
                              'Sign in',
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
