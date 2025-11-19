import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function UserDashboardWeb({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userStats, setUserStats] = useState({
    totalDonations: 0,
    coinsEarned: 0,
    rank: "Bronze",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const email =
          Platform.OS === "web"
            ? localStorage.getItem("userEmail")
            : null;

        if (email) {
          const res = await fetch(
            `http://localhost:3000/api/users/by-email?email=${email}`
          );
          const data = await res.json();
          if (data.success && data.data) {
            setUserName(data.data.name || "User");
            setUserStats({
              totalDonations: data.data.totalDonations || 0,
              coinsEarned: data.data.coins || 0,
              rank: data.data.rank || "Bronze",
            });
            return;
          }
        }

        setUserName("User");
        setUserStats({ totalDonations: 0, coinsEarned: 0, rank: "Bronze" });
      } catch (err) {
        console.warn("fetch user error", err);
      }
    };
    load();
  }, []);

  const quickActions = [
    {
      title: "Make Donation",
      description: "Donate food, clothes, or money to those in need",
      icon: "favorite",
      gradientFrom: "#3b82f6",
      gradientTo: "#2563eb",
      route: "MakeDonation",
      badge: "Popular",
      badgeColor: "#e6f0ff",
      badgeText: "#0b5ed7",
    },
    {
      title: "Celebrations",
      description: "Share joy by donating on special occasions",
      icon: "celebration",
      gradientFrom: "#8b5cf6",
      gradientTo: "#7c3aed",
      route: "Celebrations",
      badge: null,
    },
    {
      title: "Your Coins",
      description: "View and redeem your earned reward coins",
      icon: "monetization-on",
      gradientFrom: "#f59e0b",
      gradientTo: "#d97706",
      route: "CoinsScreen",
      badge: `${userStats.coinsEarned}`,
      badgeColor: "#fff7ed",
      badgeText: "#92400e",
    },
    {
      title: "Donation History",
      description: "Track all your past donations and their status",
      icon: "history",
      gradientFrom: "#6366f1",
      gradientTo: "#4f46e5",
      route: "DonationHistory",
      badge: null,
    },
  ];

  const handleNavigation = (route) => {
    console.log("navigate to:", route);
    if (navigation && navigation.navigate) navigation.navigate(route);
  };

  return (
    <View style={styles.page}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.rankBadge}>
            <MaterialIcons name="emoji-events" size={16} color="#fff" />
            <Text style={styles.rankText}>{userStats.rank} Member</Text>
          </View>
          <Text style={styles.welcome}>Welcome back, {userName || "User"}! 👋</Text>
          <Text style={styles.subtitle}>
            Your kindness makes a difference. Continue your journey of giving and
            impact lives today.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Total Donations"
            value={userStats.totalDonations}
            icon="card-giftcard"
            iconBgFrom="#60a5fa"
            iconBgTo="#2563eb"
            note="Keep it up!"
          />

          <StatCard
            title="Coins Earned"
            value={userStats.coinsEarned}
            icon="monetization-on"
            iconBgFrom="#f59e0b"
            iconBgTo="#d97706"
            progress={0.65}
            note="35 more for next reward"
          />

          <StatCard
            title="Current Rank"
            value={userStats.rank}
            icon="emoji-events"
            iconBgFrom="#a78bfa"
            iconBgTo="#7c3aed"
            note="Donate more to unlock Silver rank"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionGrid}>
            {quickActions.map((a) => (
              <ActionCard
                key={a.title}
                action={a}
                onPress={() => handleNavigation(a.route)}
              />
            ))}
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={styles.ctaWrap}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaQuote}>
              "The best way to find yourself is to lose yourself in the service
              of others." - Gandhi
            </Text>
            <Pressable
              onPress={() => handleNavigation("MakeDonation")}
              style={({ pressed }) => [
                styles.ctaButton,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={styles.ctaButtonText}>Make Your First Donation Today</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ title, value, icon, iconBgFrom, iconBgTo, progress, note }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statRow}>
        <View>
          <Text style={styles.statLabel}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
        </View>

        <View
          style={[
            styles.statIconWrap,
            Platform.OS === "web"
              ? { backgroundImage: `linear-gradient(135deg, ${iconBgFrom}, ${iconBgTo})` }
              : { backgroundColor: iconBgFrom },
          ]}
        >
          <MaterialIcons name={icon} size={26} color="#fff" />
        </View>
      </View>

      {progress != null && (
        <View style={{ marginTop: 12 }}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      )}

      {progress == null && note && <Text style={[styles.noteText, { marginTop: 12 }]}>{note}</Text>}
    </View>
  );
}

function ActionCard({ action, onPress }) {
  const anim = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current; 

  const [hovered, setHovered] = useState(false);

  const handleHoverIn = () => {
    setHovered(true);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
    Animated.timing(bar, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  };

  const handleHoverOut = () => {
    setHovered(false);
    Animated.spring(anim, { toValue: 0, useNativeDriver: true, friction: 10 }).start();
    Animated.timing(bar, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  };

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const shadowOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.22] });
  const iconScale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.16] });
  const titleColor = hovered ? "#6d28d9" : "#111827";

  const barScaleX = bar; 

  const iconBgWeb = Platform.OS === "web"
    ? { backgroundImage: `linear-gradient(135deg, ${action.gradientFrom}, ${action.gradientTo})` }
    : { backgroundColor: action.gradientFrom || "#ddd" };

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={{ width: "100%" }}
    >
      <Animated.View
        style={[
          styles.actionCard,
          {
            transform: [{ scale }, { translateY }],
            shadowOpacity: shadowOpacity,
          },
        ]}
      >

        {action.badge && (
          <View style={styles.badgeWrap}>
            <Text style={[styles.badgeText, action.badgeColor ? { color: action.badgeText } : {}]}>
              {action.badge}
            </Text>
          </View>
        )}

        <View style={styles.actionInner}>
          <Animated.View
            style={[
              styles.actionIconWrap,
              Platform.OS === "web"
                ? { backgroundImage: `linear-gradient(135deg, ${action.gradientFrom}, ${action.gradientTo})` }
                : { backgroundColor: action.gradientFrom },
              { transform: [{ scale: iconScale }] },
            ]}
          >
            <MaterialIcons name={action.icon} size={20} color="#fff" />
          </Animated.View>

          <View style={{ flex: 1 }}>
            <Animated.Text style={[styles.actionTitle, { color: titleColor }]}>
              {action.title}
            </Animated.Text>
            <Text style={styles.actionDesc}>{action.description}</Text>

            <View style={styles.getStartedRow}>
              <Text style={[styles.getStartedText, hovered && { color: "#6d28d9" }]}>
                Get started
              </Text>
              <Animated.View style={{ marginLeft: 8 }}>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={hovered ? "#6d28d9" : "#9ca3af"}
                />
              </Animated.View>
            </View>
          </View>
        </View>
        <Animated.View
          style={[
            styles.bottomBar,
            {
              transform: [{ scaleX: barScaleX }],
              opacity: barScaleX,
              backgroundColor: "#0000", 
            },
          ]}
        >
          {Platform.OS === "web" ? (
            <View style={{
              position: 'absolute',
              left: 0, right: 0, top: 0, bottom: 0,
              backgroundImage: `linear-gradient(90deg, ${action.gradientFrom}, ${action.gradientTo})`
            }} />
          ) : (
            <View style={[styles.bottomBarFill, { backgroundColor: action.gradientFrom || "#ccc" }]} />
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: "100vh",
    backgroundColor: "#5b21b6",
    position: "relative",
  },
  container: {
    paddingHorizontal: 40,
    paddingTop: 36,
    paddingBottom: 80,
    maxWidth: 1200,
    marginHorizontal: "auto",
  },

  bgCircle1: Platform.OS === "web" ? {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    top: -80,
    left: -120,
    backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), rgba(255,255,255,0))",
    filter: "blur(36px)",
    zIndex: 0,
  } : { display: "none" },

  bgCircle2: Platform.OS === "web" ? {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    bottom: -80,
    right: -80,
    backgroundImage: "radial-gradient(circle at 60% 60%, rgba(79,70,229,0.14), rgba(79,70,229,0))",
    filter: "blur(36px)",
    zIndex: 0,
  } : { display: "none" },

  bgCircle3: Platform.OS === "web" ? {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    top: "45%",
    right: "20%",
    backgroundImage: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.06), rgba(59,130,246,0))",
    filter: "blur(24px)",
    zIndex: 0,
  } : { display: "none" },

  header: {
    alignItems: "center",
    marginBottom: 24,
    zIndex: 2,
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  rankText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "700",
  },
  welcome: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    textAlign: "center",
    maxWidth: 800,
  },

  statsRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 12,
    marginBottom: 24,
    flexWrap: "wrap",
    zIndex: 2,
  },
  statCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 18,
    margin: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statLabel: { color: "#6b7280", marginBottom: 6 },
  statValue: { color: "#111827", fontSize: 20, fontWeight: "700" },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "#eef2ff",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#f59e0b",
  },
  noteText: { fontSize: 12, color: "#6b7280", marginTop: 8 },

  section: {
    marginTop: 8,
    zIndex: 2,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  actionGrid: {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
},

actionCard: {
  width: "100%",
  borderRadius: 14,
  backgroundColor: "rgba(255,255,255,0.95)",
  padding: 24,
  position: "relative",
  overflow: "hidden",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 20,
  elevation: 8,
},

  actionInner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  actionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  actionDesc: {
    color: "#6b7280",
    marginBottom: 10,
  },
  getStartedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  getStartedText: {
    color: "#9ca3af",
    fontWeight: "600",
  },

  badgeWrap: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    zIndex: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 6,
    transformOrigin: "left",
  },
  bottomBarFill: { height: "100%" },

  ctaWrap: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaCard: {
    width: "80%",
    padding: 28,
    borderRadius: 14,
    backgroundColor: "rgba(124,58,237,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaQuote: {
    color: "#fff",
    marginBottom: 18,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  ctaButtonText: {
    color: "#6d28d9",
    fontWeight: "800",
  },

  "@media (max-width: 900px)": {
    actionCard: {
      width: "100%",
      minWidth: "auto",
    },
    statsRow: {
      flexDirection: "column",
    },
  },
});
