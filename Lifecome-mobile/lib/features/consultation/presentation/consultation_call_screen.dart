import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_paths.dart';
import '../../../core/theme/app_colors.dart';
import '../../booking/domain/models/appointment.dart';

/// Blueprint view 19 — Video / Audio Consultation. UI only: there is no
/// WebRTC/media-server integration behind this yet (blueprint §10), so the
/// "call" is a static screen with a running timer, not a real connection.
class ConsultationCallScreen extends StatefulWidget {
  const ConsultationCallScreen({super.key, required this.selection});

  final BookingSelection selection;

  @override
  State<ConsultationCallScreen> createState() => _ConsultationCallScreenState();
}

class _ConsultationCallScreenState extends State<ConsultationCallScreen> {
  Duration _elapsed = Duration.zero;
  Timer? _timer;
  bool _muted = false;
  bool _cameraOff = false;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() => _elapsed += const Duration(seconds: 1));
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String get _formattedElapsed {
    final minutes = _elapsed.inMinutes.toString().padLeft(2, '0');
    final seconds = (_elapsed.inSeconds % 60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  void _endCall() {
    context.pushReplacement(RoutePaths.careplan, extra: widget.selection);
  }

  @override
  Widget build(BuildContext context) {
    final doctor = widget.selection.doctor!;

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          doctor.name,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: AppColors.white,
                          ),
                        ),
                        Text(
                          doctor.specialty,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white24,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      _formattedElapsed,
                      style: const TextStyle(color: AppColors.white),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Stack(
                children: [
                  Center(
                    child: _cameraOff
                        ? const Icon(
                            Icons.person,
                            color: Colors.white38,
                            size: 96,
                          )
                        : CircleAvatar(
                            radius: 72,
                            backgroundColor: AppColors.blue.withValues(
                              alpha: 0.3,
                            ),
                            child: const Icon(
                              Icons.person,
                              color: AppColors.white,
                              size: 72,
                            ),
                          ),
                  ),
                  Positioned(
                    right: 16,
                    bottom: 16,
                    child: Container(
                      width: 90,
                      height: 120,
                      decoration: BoxDecoration(
                        color: Colors.white12,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white38),
                      ),
                      child: const Icon(
                        Icons.person_outline,
                        color: Colors.white54,
                        size: 32,
                      ),
                    ),
                  ),
                  const Positioned(
                    left: 16,
                    top: 8,
                    child: Row(
                      children: [
                        Icon(
                          Icons.signal_cellular_alt,
                          size: 16,
                          color: AppColors.greenStrong,
                        ),
                        SizedBox(width: 4),
                        Text(
                          'Connection good',
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _CallButton(
                    icon: _muted ? Icons.mic_off : Icons.mic,
                    label: 'Mute',
                    onTap: () => setState(() => _muted = !_muted),
                  ),
                  _CallButton(
                    icon: _cameraOff ? Icons.videocam_off : Icons.videocam,
                    label: 'Camera',
                    onTap: () => setState(() => _cameraOff = !_cameraOff),
                  ),
                  _CallButton(
                    icon: Icons.chat_bubble_outline,
                    label: 'Chat',
                    onTap: () {},
                  ),
                  _CallButton(
                    icon: Icons.call_end,
                    label: 'End',
                    color: AppColors.error,
                    onTap: _endCall,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CallButton extends StatelessWidget {
  const _CallButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.color = Colors.white24,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          borderRadius: BorderRadius.circular(28),
          onTap: onTap,
          child: CircleAvatar(
            radius: 26,
            backgroundColor: color,
            child: Icon(icon, color: AppColors.white),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 12),
        ),
      ],
    );
  }
}
