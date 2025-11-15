import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Landing({ navigation }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.95);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
      
      {/* Top Branding */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.logo}>HelpHub</Text>
        <Text style={styles.tagline}>Connect. Support. Empower.</Text>
      </Animated.View>

      {/* Main Content Box */}
      <Animated.View style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}>
        <Text style={styles.title}>Welcome to HelpHub!</Text>
        <Text style={styles.subtitle}>
          Join the movement to bridge kindness and community. Whether you're here to give or receive help, you're in the right place.
        </Text>

        {/* CTA Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('UserSignup')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Join as User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('NGOSignup')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Join as NGO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.loginButtonText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Trust Indicators */}
      <View style={styles.trustIndicators}>
        <View style={styles.trustItem}>
          <View style={styles.trustDot} />
          <Text style={styles.trustText}>Trusted Platform</Text>
        </View>
        <View style={styles.trustItem}>
          <View style={[styles.trustDot, { backgroundColor: '#4FC3F7' }]} />
          <Text style={styles.trustText}>Secure & Safe</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A11CB',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.12,
    paddingHorizontal: 20,
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: height * 0.15,
    left: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.6,
  },
  decorativeCircle2: {
    position: 'absolute',
    top: height * 0.25,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    opacity: 0.4,
  },
  decorativeCircle3: {
    position: 'absolute',
    bottom: height * 0.2,
    left: width * 0.2,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    opacity: 0.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    letterSpacing: 1,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '50%',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#6A11CB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 25,
    elevation: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    fontWeight: '400',
    paddingHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#2575FC',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#2575FC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    borderColor: '#2575FC',
    borderWidth: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#2575FC',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    color: '#2575FC',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginButton: {
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: '#4A5568',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.8,
  },
  trustDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
    marginRight: 8,
    shadowColor: '#4ADE80',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
  trustText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
