// app/login.tsx
import { Stack } from 'expo-router';
import LoginScreen from '../screens/Login';
//export default function Login() {
    //return <LoginScreen />;
//} 


export default function Login() {
    return (
      <>
        <Stack.Screen options={{ 
          headerShown: false, // ← Désactive complètement le header
          title: '' // ← Optionnel: efface le titre
        }} />
        <LoginScreen/>
      </>
    );
  }   
 