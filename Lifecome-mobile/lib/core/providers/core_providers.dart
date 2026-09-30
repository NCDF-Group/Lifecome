import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/data/auth_repository.dart';
import '../services/biometric_service.dart';
import '../services/session_store.dart';

/// The auth repository the rest of the app depends on. Overridden in tests
/// (or once a real backend connection exists) without touching any widget.
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return FakeAuthRepository();
});

/// Remembers the signed-in session between launches (see [SessionStore]).
final sessionStoreProvider = Provider<SessionStore>((ref) => SessionStore());

/// Face ID / fingerprint unlock for the app-lock screen.
final biometricServiceProvider = Provider<BiometricService>(
  (ref) => BiometricService(),
);
