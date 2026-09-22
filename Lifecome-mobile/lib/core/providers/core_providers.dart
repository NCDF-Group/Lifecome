import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/data/auth_repository.dart';

/// The auth repository the rest of the app depends on. Overridden in tests
/// (or once a real backend connection exists) without touching any widget.
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return FakeAuthRepository();
});
