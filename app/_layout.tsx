import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitle: 'Cat Growing Game' }}>
      <Stack.Screen name="Cat" options={{ headerShown: true }} />
    </Stack>
  );
}
