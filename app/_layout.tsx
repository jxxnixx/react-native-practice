import { Stack } from 'expo-router';
import { Image, StyleSheet, View, Text } from 'react-native';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <Image
            source={require('@/assets/images/icons/star.svg')}
            style={[styles.svgIcon, { marginInline: 6 }]}
          />
        ),
        headerTitle: () => (
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Space</Text>
            <Image
              source={require('@/assets/images/icons/moon.svg')}
              style={[styles.svgIcon, { marginInline: 6 }]}
            />
          </View>
        ),
        headerRight: () => (
          <Image
            source={require('@/assets/images/icons/planet.svg')}
            style={styles.svgIcon}
          />
        ),
      }}
    >
      {/* <Stack.Screen name="Cat" options={{ headerShown: true }} /> */}
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
    width: 24,
    height: 24,
  },
});
