import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../core/providers/core_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/services/session_store.dart';

/// The LifeCome Live Dashboard — blueprint view 04, the Home tab of the
/// bottom-nav shell. Matches the "new patient, nothing booked yet" state:
/// once a patient has an upcoming visit or an active care plan, those
/// replace the access-options section (not built yet — no booking backend
/// exists for this to reflect).
class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  StoredSession? _session;

  @override
  void initState() {
    super.initState();
    ref.read(sessionStoreProvider).read().then((session) {
      if (mounted) setState(() => _session = session);
    });
  }

  String get _firstName {
    final name = _session?.displayName;
    if (name == null || name.isEmpty) return 'there';
    return name.split(' ').first;
  }

  String get _greeting {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  void _comingSoon(BuildContext context) {
    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('This is coming soon.')));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(
            AppSpacing.lg,
            AppSpacing.md,
            AppSpacing.lg,
            AppSpacing.lg,
          ),
          children: [
            Row(
              children: [
                SvgPicture.asset(
                  'assets/images/logo/lifecome-live-logo.svg',
                  height: 26,
                  semanticsLabel: 'LifeCome Live',
                ),
                const Spacer(),
                _NotificationBell(onTap: () => _comingSoon(context)),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),
            Text(
              '$_greeting, $_firstName',
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.inkMuted,
              ),
            ),
            const SizedBox(height: AppSpacing.xxs),
            Text.rich(
              const TextSpan(
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.ink,
                  height: 1.15,
                ),
                children: [
                  TextSpan(text: 'Care that fits '),
                  TextSpan(
                    text: 'your life',
                    style: TextStyle(color: AppColors.greenStrong),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            const _TalkToADoctorCard(),
            const SizedBox(height: AppSpacing.lg),
            const Text(
              'How would you like to access care?',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppColors.ink,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            _AccessOptionCard(
              filled: true,
              icon: Icons.health_and_safety_outlined,
              title: 'Use my LifeCome HMO',
              subtitle: 'Access care covered by your plan',
              onTap: () => _comingSoon(context),
            ),
            const SizedBox(height: AppSpacing.sm),
            _AccessOptionCard(
              filled: false,
              icon: Icons.account_balance_wallet_outlined,
              title: 'Pay for a one-time service',
              subtitle: 'No HMO membership needed',
              onTap: () => _comingSoon(context),
            ),
            const SizedBox(height: AppSpacing.lg),
            const Text(
              'Your care, in one place',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppColors.ink,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(
                  child: _SmallActionCard(
                    background: const Color(0xFFEAF7E8),
                    iconColor: AppColors.greenStrong,
                    icon: Icons.calendar_today_outlined,
                    title: 'My visits',
                    subtitle: 'View and manage your appointments',
                    onTap: () => _comingSoon(context),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: _SmallActionCard(
                    background: const Color(0xFFE8F4FC),
                    iconColor: AppColors.blue,
                    icon: Icons.description_outlined,
                    title: 'My care plan',
                    subtitle: 'Track your health goals and progress',
                    onTap: () => _comingSoon(context),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            _UrgentHelpBanner(onTap: () => _comingSoon(context)),
          ],
        ),
      ),
    );
  }
}

class _NotificationBell extends StatelessWidget {
  const _NotificationBell({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(AppRadius.pill),
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xxs),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            const Icon(
              Icons.notifications_outlined,
              color: AppColors.blue,
              size: 26,
            ),
            Positioned(
              top: -1,
              right: -1,
              child: Container(
                width: 9,
                height: 9,
                decoration: const BoxDecoration(
                  color: AppColors.green,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TalkToADoctorCard extends StatelessWidget {
  const _TalkToADoctorCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: const Color(0xFFE8F4FC),
        borderRadius: BorderRadius.circular(AppRadius.card),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 3,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Talk to a doctor',
                  style: TextStyle(
                    fontSize: 19,
                    fontWeight: FontWeight.w800,
                    color: AppColors.ink,
                  ),
                ),
                const Text(
                  'From wherever you are',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.blue,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                const _FeatureRow(
                  icon: Icons.videocam_outlined,
                  label: 'Video consultations',
                ),
                const SizedBox(height: AppSpacing.xxs),
                const _FeatureRow(
                  icon: Icons.call_outlined,
                  label: 'Phone calls',
                  color: AppColors.greenStrong,
                ),
                const SizedBox(height: AppSpacing.xxs),
                const _FeatureRow(
                  icon: Icons.chat_bubble_outline,
                  label: 'Secure messaging',
                ),
                const SizedBox(height: AppSpacing.sm),
                const Text(
                  'A healthier you, brighter tomorrow',
                  style: TextStyle(
                    fontSize: 12,
                    fontStyle: FontStyle.italic,
                    color: AppColors.ink,
                  ),
                ),
                const SizedBox(height: 2),
                Container(width: 100, height: 2, color: AppColors.gold),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          const Expanded(
            flex: 2,
            child: Column(
              children: [
                CircleAvatar(
                  radius: 36,
                  backgroundColor: AppColors.blue,
                  child: Icon(
                    Icons.medical_services_outlined,
                    color: AppColors.white,
                    size: 32,
                  ),
                ),
                SizedBox(height: AppSpacing.xs),
                Text(
                  'People\nHealthier\nBrighter Nigeria',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppColors.blue,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  const _FeatureRow({
    required this.icon,
    required this.label,
    this.color = AppColors.blue,
  });

  final IconData icon;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: AppSpacing.xs),
        Text(label, style: const TextStyle(fontSize: 13, color: AppColors.ink)),
      ],
    );
  }
}

class _AccessOptionCard extends StatelessWidget {
  const _AccessOptionCard({
    required this.filled,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final bool filled;
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final foreground = filled ? AppColors.white : AppColors.ink;
    final subtitleColor = filled
        ? AppColors.white.withValues(alpha: 0.85)
        : AppColors.inkMuted;
    final accent = filled ? AppColors.white : AppColors.gold;

    return Material(
      color: filled ? AppColors.blue : AppColors.white,
      borderRadius: BorderRadius.circular(AppRadius.card),
      child: InkWell(
        borderRadius: BorderRadius.circular(AppRadius.card),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(AppRadius.card),
            border: filled ? null : Border.all(color: AppColors.line),
          ),
          child: Row(
            children: [
              Icon(icon, color: accent, size: 26),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: foreground,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: TextStyle(fontSize: 13, color: subtitleColor),
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right, color: accent),
            ],
          ),
        ),
      ),
    );
  }
}

class _SmallActionCard extends StatelessWidget {
  const _SmallActionCard({
    required this.background,
    required this.iconColor,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final Color background;
  final Color iconColor;
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: background,
      borderRadius: BorderRadius.circular(AppRadius.card),
      child: InkWell(
        borderRadius: BorderRadius.circular(AppRadius.card),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.sm),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, color: iconColor, size: 22),
                  const Spacer(),
                  Icon(Icons.chevron_right, color: iconColor, size: 18),
                ],
              ),
              const SizedBox(height: AppSpacing.xs),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: AppColors.ink,
                ),
              ),
              Text(
                subtitle,
                style: const TextStyle(fontSize: 11, color: AppColors.inkMuted),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _UrgentHelpBanner extends StatelessWidget {
  const _UrgentHelpBanner({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFFCEAEA),
      borderRadius: BorderRadius.circular(AppRadius.card),
      child: InkWell(
        borderRadius: BorderRadius.circular(AppRadius.card),
        onTap: onTap,
        child: const Padding(
          padding: EdgeInsets.all(AppSpacing.sm),
          child: Row(
            children: [
              Icon(Icons.emergency_outlined, color: AppColors.error, size: 22),
              SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Need urgent help?',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: AppColors.error,
                      ),
                    ),
                    Text(
                      'View emergency guidance',
                      style: TextStyle(fontSize: 12, color: AppColors.inkMuted),
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right, color: AppColors.error),
            ],
          ),
        ),
      ),
    );
  }
}
