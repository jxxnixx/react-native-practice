import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="cafe/(click)" />
      <Tabs.Screen name="cafe/dnd" />
      <Tabs.Screen name="pub" />
    </Tabs>
  );
}
