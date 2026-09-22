import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

/// Manrope, matching the website's typeface.
///
/// This uses `google_fonts`, which downloads and caches the font on first
/// run rather than bundling it in the app. That is a deliberate, temporary
/// choice: no .ttf files were available to bundle when this was written.
/// Before release, replace this with the asset-based `fonts:` block already
/// prepared in pubspec.yaml (see assets/fonts/Manrope and this app's
/// README), so the app never depends on a font CDN being reachable.
TextTheme buildAppTextTheme(TextTheme base) {
  return GoogleFonts.manropeTextTheme(base)
      .apply(bodyColor: AppColors.ink, displayColor: AppColors.ink);
}
