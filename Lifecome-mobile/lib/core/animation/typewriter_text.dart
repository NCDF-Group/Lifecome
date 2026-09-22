import 'dart:async';

import 'package:flutter/material.dart';

/// Reveals [text] one character at a time, restarting whenever [active]
/// turns from false to true (and clearing back to blank when it turns
/// false), so a slide that becomes visible again — for example after
/// swiping back to it — types out again rather than showing stale text.
class TypewriterText extends StatefulWidget {
  const TypewriterText({
    super.key,
    required this.text,
    required this.style,
    this.textAlign = TextAlign.center,
    this.active = true,
    this.speed = const Duration(milliseconds: 32),
    this.startDelay = Duration.zero,
  });

  final String text;
  final TextStyle style;
  final TextAlign textAlign;
  final bool active;
  final Duration speed;
  final Duration startDelay;

  @override
  State<TypewriterText> createState() => _TypewriterTextState();
}

class _TypewriterTextState extends State<TypewriterText> {
  Timer? _timer;
  int _charCount = 0;

  @override
  void initState() {
    super.initState();
    if (widget.active) _start();
  }

  @override
  void didUpdateWidget(covariant TypewriterText oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.active && !oldWidget.active) {
      _restart();
    } else if (!widget.active && oldWidget.active) {
      _timer?.cancel();
      setState(() => _charCount = 0);
    }
  }

  void _restart() {
    _timer?.cancel();
    _charCount = 0;
    _start();
  }

  void _start() {
    Future<void>.delayed(widget.startDelay, () {
      if (!mounted || !widget.active) return;
      _timer = Timer.periodic(widget.speed, (timer) {
        if (!mounted) {
          timer.cancel();
          return;
        }
        if (_charCount >= widget.text.length) {
          timer.cancel();
          return;
        }
        setState(() => _charCount++);
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Give the text a stable width to wrap within (the caller should
    // constrain this widget's width, e.g. with a SizedBox or Padding) so it
    // wraps onto the same lines throughout, instead of reflowing line
    // breaks as each character appears.
    return SizedBox(
      width: double.infinity,
      child: Text(
        widget.text.substring(0, _charCount),
        style: widget.style,
        textAlign: widget.textAlign,
      ),
    );
  }
}
