import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/layout/bottom_nav_bar.dart';

const _destinations = [
  BottomNavDestination(
    icon: Icons.home_outlined,
    activeIcon: Icons.home,
    label: 'Home',
  ),
  BottomNavDestination(
    icon: Icons.calendar_today_outlined,
    activeIcon: Icons.calendar_today,
    label: 'Visits',
  ),
  BottomNavDestination(
    icon: Icons.chat_bubble_outline,
    activeIcon: Icons.chat_bubble,
    label: 'Messages',
  ),
  BottomNavDestination(
    icon: Icons.person_outline,
    activeIcon: Icons.person,
    label: 'Profile',
  ),
];

/// Hosts the four bottom-nav tabs (Home, Visits, Messages, Profile — view 04
/// onward in the blueprint) behind a `StatefulShellRoute`, so switching tabs
/// keeps each one's own navigation stack instead of losing it.
class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: BottomNavBar(
        currentIndex: navigationShell.currentIndex,
        destinations: _destinations,
        onTap: (index) => navigationShell.goBranch(
          index,
          initialLocation: index == navigationShell.currentIndex,
        ),
      ),
    );
  }
}
