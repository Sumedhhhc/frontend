import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import Landing from './screens/Landing';
import UserSignup from './screens/Auth/UserSignup';
import NGOSignup from './screens/Auth/NGOSignup';
import UserDashboard from './screens/UserDashboard';
import MakeDonation from './screens/Donation/MakeDonation';
import NGODashboard from './screens/NGO/Requests';
import Login from './screens/Auth/Login';
import Celebrations from './screens/Donation/Celebrations';
import CoinsScreen from './screens/Donation/CoinsScreen';
import DonationHistory from './screens/Donation/DonationHistory';

const Stack = createStackNavigator();

//Linking
const linking = Platform.OS === 'web' ? {
  prefixes: [typeof window !== 'undefined' ? window.location.origin : ''],
  config: {
    screens: {
      Landing: '',
      Login: 'login',
      UserSignup: 'signup/user',
      NGOSignup: 'signup/ngo',
      UserDashboard: 'dashboard/user',
      NGODashboard: 'dashboard/ngo',
      MakeDonation: 'donation',
      Celebrations: 'celebrations',
      CoinsScreen: 'coins',
      DonationHistory: 'donation-history',
    },
  },
} : undefined;

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="UserSignup" component={UserSignup} />
        <Stack.Screen name="NGOSignup" component={NGOSignup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        <Stack.Screen name="Celebrations" component={Celebrations} />
        <Stack.Screen name="MakeDonation" component={MakeDonation} />
        <Stack.Screen name="NGODashboard" component={NGODashboard} />
        <Stack.Screen name="CoinsScreen" component={CoinsScreen} />
        <Stack.Screen name="DonationHistory" component={DonationHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
