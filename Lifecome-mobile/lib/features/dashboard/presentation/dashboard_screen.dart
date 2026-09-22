import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';

/// A placeholder landing screen for a verified session. This is not view 04
/// (LifeCome Live Dashboard) from the blueprint; it exists only so the auth
/// flow has somewhere real to go. Replace with the actual dashboard
/// (upcoming visit, care plan summary, quick actions) when that feature is
/// built.
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SvgPicture.asset(
                  'assets/images/logo/lifecome-live-mark.svg',
                  width: 64,
                  height: 64,
                  semanticsLabel: 'LifeCome Live',
                ),
                const SizedBox(height: AppSpacing.lg),
                const Text(
                  "You're signed in",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.ink),
                ),
                const SizedBox(height: AppSpacing.xs),
                const Text(
                  'The dashboard is not built yet. Sign in worked.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14, color: AppColors.inkMuted),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
