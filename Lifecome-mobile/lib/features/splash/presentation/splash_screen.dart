import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_paths.dart';
import '../../../core/theme/app_colors.dart';

/// The launch screen: the LifeCome Live mark, animating in, then handing
/// off to sign in. There is no auth state to resolve yet (no backend
/// connection exists), so this is a short, fixed pause rather than a real
/// "checking your session" step; replace [_holdDuration] logic once one
/// does.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  static const _holdDuration = Duration(milliseconds: 1400);

  late final AnimationController _controller;
  late final Animation<double> _scale;
  late final Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _scale = Tween<double>(begin: 0.85, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );
    _opacity = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
    _controller.forward();

    Future<void>.delayed(_holdDuration, () {
      if (mounted) context.go(RoutePaths.signIn);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Center(
        child: FadeTransition(
          opacity: _opacity,
          child: ScaleTransition(
            scale: _scale,
            child: SvgPicture.asset(
              'assets/images/logo/lifecome-live-mark.svg',
              width: 96,
              height: 96,
              semanticsLabel: 'LifeCome Live',
            ),
          ),
        ),
      ),
    );
  }
}
