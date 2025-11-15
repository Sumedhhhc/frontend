import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Login({ navigation }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showError, setShowError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setShowError(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("userEmail", form.email);
        }
        console.log("Stored userEmail:", form.email);

        alert("Logged in successfully!");
        setForm({ email: "", password: "" });
        
        if (navigation) {
          navigation.navigate(
            data.type === "ngo" ? "NGODashboard" : "UserDashboard"
          );
        }
      } else {
        setShowError(true);
        alert("Error: " + (data.message || "Login failed"));
        setTimeout(() => setShowError(false), 2000);
      }
    } catch (err) {
      setShowError(true);
      alert("Error: Unable to login");
      console.error("Login error:", err);
      setTimeout(() => setShowError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View ref={containerRef} style={styles.container}>
      {/* Background decorations */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      {/* Left Half - Animated Characters */}
      <View style={styles.leftSection}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Your Efforts. Their Smiles!</Text>
          <Text style={styles.welcomeSubtitle}>Together, we make compassion unstoppable!</Text>
        </View>

        <AnimatedCharacters
          mousePosition={mousePosition}
          showPassword={showPassword}
          showError={showError}
        />
      </View>

      {/* Right Half - Login Form */}
      <View style={styles.rightSection}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Icon name="lock-outline" size={30} color="#6A11CB" />
          </View>

          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Your journey of helping continues here!</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Icon name="email-outline" size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="  example@email.com"
                placeholderTextColor="#999"
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock-outline" size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="  ••••••••"
                placeholderTextColor="#999"
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Signup Prompt */}
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text
              style={styles.signupText}
              onPress={() => navigation && navigation.navigate("Landing")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

function AnimatedCharacters({ mousePosition, showPassword, showError }) {
  const characters = [
    { id: 1, baseX: 150, baseY: 300, type: 'apple' },
    { id: 2, baseX: 350, baseY: 250, type: 'clothing' },
    { id: 3, baseX: 550, baseY: 320, type: 'coin' },
  ];

  return (
    <View style={styles.charactersContainer}>
      {characters.map((char) => (
        <Character
          key={char.id}
          baseX={char.baseX}
          baseY={char.baseY}
          type={char.type}
          mousePosition={mousePosition}
          showPassword={showPassword}
          showError={showError}
        />
      ))}
    </View>
  );
}

function Character({ baseX, baseY, type, mousePosition, showPassword, showError }) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (showError) {
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [showError]);

  useEffect(() => {
    if (showPassword) {
      // Look away
      setEyeOffset({ x: -8, y: -5 });
      return;
    }

    // Follow cursor
    const dx = mousePosition.x - baseX;
    const dy = mousePosition.y - baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const angle = Math.atan2(dy, dx);
      setEyeOffset({
        x: Math.cos(angle) * 8,
        y: Math.sin(angle) * 8,
      });
    }
  }, [mousePosition, showPassword, baseX, baseY]);

  const getCharacterConfig = () => {
    switch (type) {
      case 'apple':
        return {
          body: '🍎',
          bgColor: '#FF6B6B',
          size: 100,
        };
      case 'clothing':
        return {
          body: '👕',
          bgColor: '#4ECDC4',
          size: 110,
        };
      case 'coin':
        return {
          body: '🪙',
          bgColor: '#FFD93D',
          size: 95,
        };
      default:
        return {
          body: '⚪',
          bgColor: '#95E1D3',
          size: 100,
        };
    }
  };

  const config = getCharacterConfig();

  return (
    <Animated.View
      style={[
        styles.character,
        {
          left: baseX,
          top: baseY,
          width: config.size,
          height: config.size,
          transform: [{ translateX: shakeAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.characterBody,
          { backgroundColor: config.bgColor, width: config.size, height: config.size },
        ]}
      >
        {/* Character Icon */}
        <Text style={styles.characterEmoji}>{config.body}</Text>

        {/* Face Container */}
        <View style={styles.faceContainer}>
          {/* Eyes */}
          <View style={styles.eyesRow}>
            {/* Left Eye */}
            <View style={styles.eyeWhite}>
              <View
                style={[
                  styles.pupil,
                  {
                    transform: [
                      { translateX: eyeOffset.x },
                      { translateY: eyeOffset.y },
                    ],
                  },
                ]}
              />
            </View>

            {/* Right Eye */}
            <View style={styles.eyeWhite}>
              <View
                style={[
                  styles.pupil,
                  {
                    transform: [
                      { translateX: eyeOffset.x },
                      { translateY: eyeOffset.y },
                    ],
                  },
                ]}
              />
            </View>
          </View>

          {/* Mouth */}
          <View style={styles.mouth} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#6A11CB',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: "absolute",
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -192,
    left: -192,
    opacity: 0.5,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(37, 117, 252, 0.2)",
    top: '50%',
    right: -160,
    opacity: 0.5,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    top: '25%',
    right: '25%',
    opacity: 0.3,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    position: 'relative',
    zIndex: 10,
  },
  welcomeSection: {
    position: 'absolute',
    top: 80,
    alignItems: 'center',
    zIndex: 20,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  welcomeSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  charactersContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  character: {
    position: 'absolute',
  },
  characterBody: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    position: 'relative',
  },
  characterEmoji: {
    fontSize: 200,
    position: 'absolute',
    top: -105,
  },
  faceContainer: {
    marginTop: 45,
    alignItems: 'center',
  },
  eyesRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 8,
  },
  eyeWhite: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pupil: {
    width: 10,
    height: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 5,
  },
  mouth: {
    width: 28,
    height: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 14,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  iconWrapper: {
    backgroundColor: "#f3f4f6",
    padding: 20,
    borderRadius: 50,
    marginBottom: 24,
  },
  lockIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    outlineStyle: 'none',
  },
  eyeIcon: {
    fontSize: 20,
  },
  loginBtn: {
    backgroundColor: "#6A11CB",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#6A11CB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    marginTop: 24,
    textAlign: 'center',
  },
  signupText: {
    color: "#6A11CB",
    fontWeight: "600",
  },
});
