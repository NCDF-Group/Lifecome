import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import '../../../core/animation/fade_in.dart';
import '../../../core/router/route_paths.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/buttons/primary_button.dart';
import '../../../core/widgets/inputs/app_text_field.dart';
import '../../../core/widgets/layout/auth_form_card.dart';
import '../../../core/widgets/layout/brand_backdrop.dart';
import '../application/auth_controller.dart';
import '../domain/models/auth_session.dart';
import 'verify_email_screen.dart';

/// What step 1 ([CreateAccountScreen]) collected, carried forward so step 2
/// can send it all together when the account is actually created.
class PersonalDetailsArgs {
  const PersonalDetailsArgs({
    required this.fullName,
    required this.email,
    this.phoneNumber,
  });

  final String fullName;
  final String email;
  final String? phoneNumber;
}

const _genderOptions = ['Female', 'Male', 'Prefer not to say'];

/// View 01 (Create Account) — step 2 of 2, and most of view 03's (Patient
/// Profile) demographic fields, collected here as part of signup rather
/// than as a separate step afterwards. Submitting here is what actually
/// creates the account and sends the verification code.
class PersonalDetailsScreen extends ConsumerStatefulWidget {
  const PersonalDetailsScreen({super.key, required this.args});

  final PersonalDetailsArgs args;

  @override
  ConsumerState<PersonalDetailsScreen> createState() =>
      _PersonalDetailsScreenState();
}

class _PersonalDetailsScreenState extends ConsumerState<PersonalDetailsScreen> {
  final _dobController = TextEditingController();
  final _stateController = TextEditingController();
  final _cityController = TextEditingController();

  DateTime? _dateOfBirth;
  String? _gender;
  String? _dobError;
  String? _genderError;

  @override
  void dispose() {
    _dobController.dispose();
    _stateController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  Future<void> _pickDateOfBirth() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(now.year - 25),
      firstDate: DateTime(now.year - 120),
      lastDate: now,
      helpText: 'Date of birth',
    );
    if (picked == null) return;
    setState(() {
      _dateOfBirth = picked;
      _dobController.text =
          '${picked.day.toString().padLeft(2, '0')} '
          '${_monthName(picked.month)} ${picked.year}';
      _dobError = null;
    });
  }

  String _monthName(int month) {
    const names = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return names[month - 1];
  }

  Future<void> _submit() async {
    setState(() {
      _dobError = _dateOfBirth == null ? 'Select your date of birth.' : null;
      _genderError = _gender == null ? 'Select an option.' : null;
    });

    if (_dobError != null || _genderError != null) return;

    final state = _stateController.text.trim();
    final city = _cityController.text.trim();

    final sent = await ref
        .read(authControllerProvider.notifier)
        .requestCode(
          flow: AuthFlow.createAccount,
          email: widget.args.email,
          fullName: widget.args.fullName,
          phoneNumber: widget.args.phoneNumber,
          dateOfBirth: _dateOfBirth,
          gender: _gender,
          region: state.isEmpty ? null : state,
          city: city.isEmpty ? null : city,
        );

    if (!mounted) return;
    if (sent) {
      context.push(
        RoutePaths.verifyEmail,
        extra: VerifyEmailArgs(email: widget.args.email),
      );
    } else {
      final message = ref.read(authControllerProvider).errorMessage;
      if (message != null) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(message)));
      }
    }
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
              padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
              child: AuthFormCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
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
                    const SizedBox(height: AppSpacing.xl),
                    const FadeIn(
                      delay: Duration(milliseconds: 40),
                      child: Text(
                        'STEP 2 OF 2',
                        style: TextStyle(
                          color: AppColors.blue,
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.6,
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    const FadeIn(
                      delay: Duration(milliseconds: 80),
                      child: Text(
                        'Tell us about you',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          color: AppColors.ink,
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    const FadeIn(
                      delay: Duration(milliseconds: 120),
                      child: Text(
                        'Help your care team identify you correctly.',
                        style: TextStyle(
                          fontSize: 15,
                          color: AppColors.inkMuted,
                          height: 1.4,
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xl),
                    FadeIn(
                      delay: const Duration(milliseconds: 160),
                      child: AppTextField(
                        label: 'Date of birth',
                        controller: _dobController,
                        hintText: 'Select date of birth',
                        readOnly: true,
                        onTap: _pickDateOfBirth,
                        prefixIcon: Icons.calendar_today_outlined,
                        errorText: _dobError,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    FadeIn(
                      delay: const Duration(milliseconds: 200),
                      child: _GenderField(
                        value: _gender,
                        errorText: _genderError,
                        onChanged: (value) => setState(() {
                          _gender = value;
                          _genderError = null;
                        }),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    FadeIn(
                      delay: const Duration(milliseconds: 240),
                      child: AppTextField(
                        label: 'State (optional)',
                        controller: _stateController,
                        hintText: 'e.g. Lagos',
                        textInputAction: TextInputAction.next,
                        prefixIcon: Icons.map_outlined,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    FadeIn(
                      delay: const Duration(milliseconds: 280),
                      child: AppTextField(
                        label: 'City or area (optional)',
                        controller: _cityController,
                        hintText: 'e.g. Ikeja',
                        textInputAction: TextInputAction.done,
                        prefixIcon: Icons.location_on_outlined,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    FadeIn(
                      delay: const Duration(milliseconds: 320),
                      child: PrimaryButton(
                        label: 'Create account',
                        loading: submitting,
                        onPressed: _submit,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    const FadeIn(
                      delay: Duration(milliseconds: 340),
                      child: Center(
                        child: Text(
                          'We will send a code to verify your email.',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.inkMuted,
                          ),
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
    );
  }
}

class _GenderField extends StatelessWidget {
  const _GenderField({
    required this.value,
    required this.onChanged,
    this.errorText,
  });

  final String? value;
  final ValueChanged<String?> onChanged;
  final String? errorText;

  @override
  Widget build(BuildContext context) {
    final hasError = errorText != null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Gender',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.ink,
          ),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          initialValue: value,
          icon: const Icon(
            Icons.keyboard_arrow_down,
            color: AppColors.inkMuted,
          ),
          decoration: InputDecoration(
            hintText: 'Select gender',
            errorText: errorText,
            prefixIcon: const Icon(
              Icons.wc_outlined,
              size: 20,
              color: AppColors.inkMuted,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.control),
              borderSide: BorderSide(
                color: hasError ? AppColors.error : AppColors.line,
                width: 1.5,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.control),
              borderSide: BorderSide(
                color: hasError ? AppColors.error : AppColors.line,
                width: 1.5,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.control),
              borderSide: BorderSide(
                color: hasError ? AppColors.error : AppColors.blue,
                width: 2,
              ),
            ),
          ),
          items: _genderOptions
              .map(
                (option) =>
                    DropdownMenuItem(value: option, child: Text(option)),
              )
              .toList(),
          onChanged: onChanged,
        ),
      ],
    );
  }
}
