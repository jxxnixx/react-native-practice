import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View, FlatList } from 'react-native';
import { StyleSheet } from 'react-native';

const Cat = () => {
  const placeholder = 'Meow';

  const [name, setName] = useState(placeholder);
  const [names, setNames] = useState<string[]>([placeholder]);

  const handleNameChange = (text: string) => {
    setName(text);
    setNames((prev) => [...prev, text]);
  };

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
        onChangeText={handleNameChange}
      />
      <FlatList
        data={names.map((name, index) => ({ id: index + 1, name }))}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />
    </View>
  );
};

export default Cat;
