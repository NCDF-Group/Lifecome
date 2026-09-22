import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';

/// Soft, blurred colour blobs behind a screen's content, matching the
/// website's hero sections (Lifecome-web's `.reveal` hero backgrounds).
/// Purely decorative: wrap a screen's body in a [Stack] with this behind it.
class BrandBackdrop extends StatelessWidget {
  const BrandBackdrop({super.key});

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Stack(
        children: [
          Positioned(
            top: -60,
            right: -80,
            child: _blob(220, AppColors.cyan.withValues(alpha: 0.22)),
          ),
          Positioned(
            top: 160,
            left: -90,
            child: _blob(200, AppColors.lime.withValues(alpha: 0.18)),
          ),
        ],
      ),
    );
  }

  Widget _blob(double size, Color color) {
    // ImageFiltered blurs this widget's own rendering (matching the
    // website's CSS `blur-3xl` on a solid div), unlike BackdropFilter,
    // which blurs whatever is drawn behind it instead.
    return ImageFiltered(
      imageFilter: ImageFilter.blur(sigmaX: 40, sigmaY: 40),
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      ),
    );
  }
}
