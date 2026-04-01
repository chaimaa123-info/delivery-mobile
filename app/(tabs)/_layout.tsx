
// app/tabs/layout.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none', // Cette option cache complètement la barre d'onglets en bas
        },
      }}
    >
      
      {/* Tu peux ajouter d'autres pages ici sans afficher les onglets */}
      <Tabs.Screen
        name="HomePage"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      

      <Tabs.Screen
        name="versement"  
        options={{
          title: 'Versement',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
 