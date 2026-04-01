import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    router.push('../app/logout');
  };

  return (
    <View style={styles.bottomMenu}>
      <TouchableOpacity
        style={[styles.menuButton, pathname === '/HomePage' && styles.activeButton]}
        onPress={() => router.push('../app/(tabs)/HomePage')}
      >
        <Ionicons name="home" size={24} color="white" />
        <Text style={[styles.menuButtonText, pathname === '/HomePage' && styles.activeText]}>
          Accueil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, pathname === '/search' && styles.activeButton]}
        onPress={() => router.push('../app/(tabs)/search')}
      >
        <Ionicons name="search" size={24} color="white" />
        <Text style={[styles.menuButtonText, pathname === '/search' && styles.activeText]}>
          Recherche
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, pathname === '/historique' && styles.activeButton]}
        onPress={() => router.push('../app/(tabs)/historique')}
      >
        <Ionicons name="time" size={24} color="white" />
        <Text style={[styles.menuButtonText, pathname === '/historique' && styles.activeText]}>
          L'historique
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, pathname === '/logout' && styles.activeButton]}
        onPress={logout}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={[styles.menuButtonText, pathname === '/logout' && styles.activeText]}>
          Retour
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgb(110, 189, 72)',
    paddingVertical: 10,
  },
  menuButton: {
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 12,
    color: 'white',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  activeText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
