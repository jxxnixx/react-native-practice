import React, { useState } from 'react';
import { Text, TextInput, View, FlatList } from 'react-native';
import { StyleSheet } from 'react-native';

const Cat = () => {
  const placeholder = 'Meow';

  const [name, setName] = useState(placeholder);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      gap: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      padding: 10,
      fontSize: 16,
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
    },
    item: {
      padding: 10,
      fontSize: 16,
      height: 40,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your Cat's name</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        onChangeText={(text) => setName(text)}
      />
      <FlatList
        data={[
          { id: 1, name: 'Meow 1' },
          { id: 2, name: 'Meow 2' },
          { id: 3, name: 'Meow 3' },
          { id: 4, name: 'Meow 4' },
          { id: 5, name: 'Meow 5' },
          { id: 6, name: 'Meow 6' },
          { id: 7, name: 'Meow 7' },
          { id: 8, name: 'Meow 8' },
          { id: 9, name: 'Meow 9' },
          { id: 10, name: 'Meow 10' },
          { id: 11, name: 'Meow 11' },
          { id: 12, name: 'Meow 12' },
          { id: 13, name: 'Meow 13' },
          { id: 14, name: 'Meow 14' },
          { id: 15, name: 'Meow 15' },
          { id: 16, name: 'Meow 16' },
          { id: 17, name: 'Meow 17' },
          { id: 18, name: 'Meow 18' },
          { id: 19, name: 'Meow 19' },
          { id: 20, name: 'Meow 20' },
          { id: 21, name: 'Meow 21' },
          { id: 22, name: 'Meow 22' },
          { id: 23, name: 'Meow 23' },
          { id: 24, name: 'Meow 24' },
          { id: 25, name: 'Meow 25' },
          { id: 26, name: 'Meow 26' },
          { id: 27, name: 'Meow 27' },
          { id: 28, name: 'Meow 28' },
          { id: 29, name: 'Meow 29' },
          { id: 30, name: 'Meow 30' },
          { id: 31, name: 'Meow 31' },
          { id: 32, name: 'Meow 32' },
          { id: 33, name: 'Meow 33' },
          { id: 34, name: 'Meow 34' },
          { id: 35, name: 'Meow 35' },
          { id: 36, name: 'Meow 36' },
          { id: 37, name: 'Meow 37' },
          { id: 38, name: 'Meow 38' },
          { id: 39, name: 'Meow 39' },
          { id: 40, name: 'Meow 40' },
          { id: 41, name: 'Meow 41' },
          { id: 42, name: 'Meow 42' },
          { id: 43, name: 'Meow 43' },
          { id: 44, name: 'Meow 44' },
          { id: 45, name: 'Meow 45' },
          { id: 46, name: 'Meow 46' },
          { id: 47, name: 'Meow 47' },
          { id: 48, name: 'Meow 48' },
          { id: 49, name: 'Meow 49' },
          { id: 50, name: 'Meow 50' },
          { id: 51, name: 'Meow 51' },
          { id: 52, name: 'Meow 52' },
          { id: 53, name: 'Meow 53' },
          { id: 54, name: 'Meow 54' },
          { id: 55, name: 'Meow 55' },
          { id: 56, name: 'Meow 56' },
          { id: 57, name: 'Meow 57' },
          { id: 58, name: 'Meow 58' },
          { id: 59, name: 'Meow 59' },
          { id: 60, name: 'Meow 60' },
          { id: 61, name: 'Meow 61' },
          { id: 62, name: 'Meow 62' },
          { id: 63, name: 'Meow 63' },
          { id: 64, name: 'Meow 64' },
          { id: 65, name: 'Meow 65' },
          { id: 66, name: 'Meow 66' },
          { id: 67, name: 'Meow 67' },
          { id: 68, name: 'Meow 68' },
          { id: 69, name: 'Meow 69' },
          { id: 70, name: 'Meow 70' },
          { id: 71, name: 'Meow 71' },
          { id: 72, name: 'Meow 72' },
          { id: 73, name: 'Meow 73' },
          { id: 74, name: 'Meow 74' },
          { id: 75, name: 'Meow 75' },
          { id: 76, name: 'Meow 76' },
          { id: 77, name: 'Meow 77' },
          { id: 78, name: 'Meow 78' },
          { id: 79, name: 'Meow 79' },
          { id: 80, name: 'Meow 80' },
          { id: 81, name: 'Meow 81' },
          { id: 82, name: 'Meow 82' },
          { id: 83, name: 'Meow 83' },
          { id: 84, name: 'Meow 84' },
          { id: 85, name: 'Meow 85' },
          { id: 86, name: 'Meow 86' },
          { id: 87, name: 'Meow 87' },
          { id: 88, name: 'Meow 88' },
          { id: 89, name: 'Meow 89' },
          { id: 90, name: 'Meow 90' },
          { id: 91, name: 'Meow 91' },
          { id: 92, name: 'Meow 92' },
          { id: 93, name: 'Meow 93' },
          { id: 94, name: 'Meow 94' },
          { id: 95, name: 'Meow 95' },
          { id: 96, name: 'Meow 96' },
          { id: 97, name: 'Meow 97' },
          { id: 98, name: 'Meow 98' },
          { id: 99, name: 'Meow 99' },
          { id: 100, name: 'Meow 100' },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />
    </View>
  );
};

export default Cat;
