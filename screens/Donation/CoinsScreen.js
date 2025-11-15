import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GIFT_CARDS = [
  { id: 1, name: 'Amazon ₹100', coinsRequired: 10000, icon: 'store' },
  { id: 2, name: 'Flipkart ₹200', coinsRequired: 20000, icon: 'cart' },
  { id: 3, name: 'Amazon ₹500', coinsRequired: 50000, icon: 'store' },
  { id: 4, name: 'Paytm ₹100', coinsRequired: 10000, icon: 'wallet' },
  { id: 5, name: 'Paytm ₹200', coinsRequired: 20000, icon: 'wallet' },
  { id: 6, name: 'Flipkart ₹500', coinsRequired: 50000, icon: 'cart' },
  { id: 7, name: 'BookMyShow ₹100', coinsRequired: 10000, icon: 'ticket-confirmation' },
  { id: 8, name: 'BookMyShow ₹200', coinsRequired: 20000, icon: 'ticket-confirmation' },
  { id: 9, name: 'BookMyShow ₹500', coinsRequired: 50000, icon: 'ticket-confirmation' },
];

export default function CoinsScreen() {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

useEffect(() => {
  const getUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      console.log('Loaded userEmail:', email);
      setUserEmail(email);
    } catch (err) {
      console.error('Error getting userEmail:', err);
    }
  };
  getUserEmail();
}, []);

useEffect(() => {
  if (userEmail) fetchCoins();
}, [userEmail]);

const fetchCoins = async () => {
  try {
    setLoading(true);
    const res = await fetch(`http://localhost:3000/api/users/?email=${userEmail}`);
    const data = await res.json();

    if (data.success && data.data) {
      const user = data.data.find(u => u.email === userEmail);
      if (user) setCoins(user.coins || 0);
      else window.alert('User not found');
    }
  } catch (err) {
    window.alert('Error fetching coins');
  } finally {
    setLoading(false);
  }
};

  const handleRedeem = async (giftCard) => {
    if (coins < giftCard.coinsRequired) {
      window.alert(`You need ${giftCard.coinsRequired} coins to redeem ${giftCard.name}.`);
      return;
    }

    try {
      setRedeeming(true);
      const res = await fetch('http://localhost:3000/api/coins/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: giftCard.coinsRequired,
          giftCardName: giftCard.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCoins(data.coinsLeft);
        window.alert(`Redeemed ${giftCard.name} successfully!`);
      } else {
        window.alert(data.message);
      }
    } catch (err) {
      window.alert('Redeem failed');
    } finally {
      setRedeeming(false);
    }
  };

  const renderGiftCard = ({ item }) => {
    const canRedeem = coins >= item.coinsRequired;
    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: canRedeem ? '#ffffff' : '#f1f5f9' },
        ]}
        onPress={() => handleRedeem(item)}
        disabled={redeeming || !canRedeem}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={40}
          color={canRedeem ? '#2563EB' : '#9CA3AF'}
          style={{ marginBottom: 8 }}
        />
        <Text style={styles.cardName}>{item.name}</Text>
        <Text
          style={[
            styles.cardCoins,
            { color: canRedeem ? '#2563EB' : '#9CA3AF' },
          ]}
        >
          {item.coinsRequired} Coins
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#2563EB"
        style={{ marginTop: 50 }}
      />
    );

  return (
    <View style={styles.container}>
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      <View style={styles.cardContainer}>
        <Text style={styles.title}>💰 Your Coins</Text>
        <Text style={styles.coinsText}>{coins} Coins</Text>
        <Text style={styles.subtitle}>Redeem your coins for exciting gift cards!</Text>

        <FlatList
          data={GIFT_CARDS}
          renderItem={renderGiftCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.grid}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A11CB',
    alignItems: 'center',
    paddingTop: 20,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(59,130,246,0.1)',
    top: -50,
    left: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(16,185,129,0.1)',
    top: 80,
    right: -100,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(239,68,68,0.1)',
    bottom: -60,
    left: 40,
  },
  cardContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 6,
  },
  coinsText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2563EB',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 16,
  },
  grid: {
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 100,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1e3a8a',
  },
  cardCoins: {
    fontSize: 12,
    fontWeight: '500',
  },
});
