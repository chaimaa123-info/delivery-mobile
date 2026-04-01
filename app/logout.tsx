// utils/useLogout.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export const useLogout = () => {
  const { setToken, setUserName } = useAuth();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user_name');
      setToken(null);
      setUserName(null);
      router.replace('/login'); 
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return logout;
};
