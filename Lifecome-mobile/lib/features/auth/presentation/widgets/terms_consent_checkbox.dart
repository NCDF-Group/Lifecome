import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';

import '../../../../core/theme/app_colors.dart';

/// "I agree to the Terms and Privacy Notice", with both words as tappable
/// links. The checkbox is required before Create Account is enabled
/// (blueprint 12.1: consent purpose, version and timestamp are recorded
/// once this is wired to the real consent endpoint).
class TermsConsentCheckbox extends StatelessWidget {
  const TermsConsentCheckbox({
    super.key,
    required this.checked,
    required this.onChanged,
    required this.onTermsTap,
    required this.onPrivacyTap,
  });

  final bool checked;
  final ValueChanged<bool> onChanged;
  final VoidCallback onTermsTap;
  final VoidCallback onPrivacyTap;

  @override
  Widget build(BuildContext context) {
    const bodyStyle = TextStyle(
      color: AppColors.inkMuted,
      fontSize: 14,
      height: 1.4,
    );
    const linkStyle = TextStyle(
      color: AppColors.blue,
      fontWeight: FontWeight.w700,
      fontSize: 14,
      decoration: TextDecoration.underline,
    );

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Checkbox(
          value: checked,
          onChanged: (value) => onChanged(value ?? false),
        ),
        const SizedBox(width: 4),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Text.rich(
              TextSpan(
                style: bodyStyle,
                children: [
                  const TextSpan(text: 'I agree to the '),
                  TextSpan(
                    text: 'Terms',
                    style: linkStyle,
                    recognizer: TapGestureRecognizer()..onTap = onTermsTap,
                  ),
                  const TextSpan(text: ' and '),
                  TextSpan(
                    text: 'Privacy Notice',
                    style: linkStyle,
                    recognizer: TapGestureRecognizer()..onTap = onPrivacyTap,
                  ),
                  const TextSpan(text: '.'),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
