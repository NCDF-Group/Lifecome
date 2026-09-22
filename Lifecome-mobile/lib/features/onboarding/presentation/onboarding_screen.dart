import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_paths.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/buttons/glass_button.dart';
import 'widgets/onboarding_dot_indicator.dart';
import 'widgets/onboarding_page_view.dart';

/// A three-slide, full-bleed introduction shown once after the splash
/// screen, before Sign In. The three images and their order retell the
/// same story as the website's home page: discover LifeCome Live, consult
/// a doctor, then start your care. There is no "Next" button; the slides
/// advance by swipe, and Skip is the only way to leave early.
const _slides = [
  OnboardingSlideData(
    imageAsset: 'assets/images/onboarding/onboarding-1-access.webp',
    imageAlt: 'A woman smiling as she uses her phone at home',
    headline: 'Quality healthcare, anywhere.',
    body: 'Access care from home. Use your HMO where it is accepted, or pay directly.',
  ),
  OnboardingSlideData(
    imageAsset: 'assets/images/onboarding/onboarding-2-consult.webp',
    imageAlt: 'A doctor waving during an online video consultation',
    headline: 'See a doctor, online.',
    body: 'Talk to a licensed doctor by video or audio and leave with a clear plan.',
  ),
  OnboardingSlideData(
    imageAsset: 'assets/images/onboarding/onboarding-3-start.webp',
    imageAlt: 'A smiling man checking his phone outdoors',
    headline: 'Your health journey starts here.',
    body: 'One account for every visit. Your care plan and records stay with you.',
  ),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _index = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _finish() => context.go(RoutePaths.signIn);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Shows for an instant while the first image decodes.
      backgroundColor: Colors.black,
      // The image goes edge to edge, including under the status bar and
      // home indicator; only the Skip button and dots below are inset from
      // those, via the SafeArea wrapped around just that overlay.
      extendBodyBehindAppBar: true,
      body: Stack(
        fit: StackFit.expand,
        children: [
          PageView.builder(
            controller: _controller,
            itemCount: _slides.length,
            onPageChanged: (value) => setState(() => _index = value),
            itemBuilder: (context, index) {
              return OnboardingPage(
                slide: _slides[index],
                active: index == _index,
              );
            },
          ),
          SafeArea(
            child: Column(
              children: [
                Align(
                  alignment: Alignment.topRight,
                  child: Padding(
                    padding: const EdgeInsets.only(
                      right: AppSpacing.lg,
                      top: AppSpacing.xs,
                    ),
                    child: GlassButton(label: 'Skip', onPressed: _finish),
                  ),
                ),
                const Spacer(),
                OnboardingDotIndicator(
                  count: _slides.length,
                  activeIndex: _index,
                ),
                const SizedBox(height: AppSpacing.xl),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
