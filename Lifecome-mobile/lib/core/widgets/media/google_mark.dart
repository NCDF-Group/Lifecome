import 'package:flutter/material.dart';

/// Google's own "G" mark, as published for third-party sign-in buttons
/// (developers.google.com/identity/images/g-logo.png) — used only to label
/// a "Continue with Google" button.
class GoogleMark extends StatelessWidget {
  const GoogleMark({super.key, this.size = 20});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/images/logo/google-g-logo.png',
      width: size,
      height: size,
    );
  }
}
