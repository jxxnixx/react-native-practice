import Cat from '@/components/Cat';
import DynamicComp from '@/components/platform/DynamicComp';
import { Text, View } from 'react-native';
import BigButton from '@/components/platform/buttons/BigButton';
import CatBox from '@/components/CatBox';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <DynamicComp />
      <BigButton />

      <CatBox />
    </View>
  );
}
