import { Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import StarIcon from '@/assets/images/icons/star.svg';
import MoonIcon from '@/assets/images/icons/moon.svg';
import PlanetIcon from '@/assets/images/icons/planet.svg';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <StarIcon style={styles.svgIcon} width={24} height={24} />
        ),
        headerTitle: () => (
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Space</Text>
            <MoonIcon style={styles.svgIcon} width={24} height={24} />
          </View>
        ),
        headerRight: () => (
          <PlanetIcon style={styles.svgIcon} width={24} height={24} />
        ),
      }}
    >
      <Stack.Screen name="cafe" options={{ headerShown: true }} />
      <Stack.Screen name="cafe/dnd" options={{ headerShown: true }} />
      <Stack.Screen name="pub" options={{ headerShown: true }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  svgIcon: {
    marginHorizontal: 6,
  },
});
