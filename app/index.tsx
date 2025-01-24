import Cat from '@/components/Cat';
import DynamicComp from '@/components/platform/DynamicComp';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import BigButton from '@/components/platform/buttons/BigButton';
import CatBox from '@/components/CatBox';
import ImageBox from '@/components/ImageBox';
import ColorBox from '@/components/ColorBox';

export default function Index() {
  return (
    <View style={styles.container}>
      <DynamicComp />
      <BigButton />

      {/* <CatBox /> */}
      {/* <ImageBox /> */}
      <ColorBox />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
