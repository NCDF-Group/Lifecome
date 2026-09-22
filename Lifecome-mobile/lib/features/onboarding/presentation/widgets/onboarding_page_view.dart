import 'package:flutter/material.dart';

import '../../../../core/animation/typewriter_text.dart';
import '../../../../core/theme/app_spacing.dart';

/// One slide's content: a full-bleed, unblurred photo with a darkening
/// gradient so white text stays readable over any image, and a headline
/// and body that type themselves out while the slide is on screen.
class OnboardingSlideData {
  const OnboardingSlideData({
    required this.imageAsset,
    required this.imageAlt,
    required this.headline,
    required this.body,
  });

  final String imageAsset;
  final String imageAlt;
  final String headline;
  final String body;
}

class OnboardingPage extends StatelessWidget {
  const OnboardingPage({super.key, required this.slide, required this.active});

  final OnboardingSlideData slide;

  /// Whether this is the slide currently on screen. Gates the typewriter
  /// animation so it plays while (and only while) the slide is visible.
  final bool active;

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(
          slide.imageAsset,
          fit: BoxFit.cover,
          semanticLabel: slide.imageAlt,
        ),
        // A plain darkening gradient over the photo (no blur), so white
        // text reads clearly over any part of any image.
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.black.withValues(alpha: 0.15),
                Colors.black.withValues(alpha: 0.25),
                Colors.black.withValues(alpha: 0.6),
              ],
            ),
          ),
        ),
        // Moved down from centre towards the lower third, clear of the
        // dots and Skip button.
        Align(
          alignment: const Alignment(0, 0.55),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TypewriterText(
                  text: slide.headline,
                  active: active,
                  textAlign: TextAlign.left,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    height: 1.25,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                TypewriterText(
                  text: slide.body,
                  active: active,
                  textAlign: TextAlign.left,
                  speed: const Duration(milliseconds: 16),
                  startDelay: const Duration(milliseconds: 300),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
