import React, { useState } from 'react';
import {
  SectionList,
  Text,
  TextInput,
  View,
  FlatList,
  Platform,
} from 'react-native';
import { StyleSheet } from 'react-native';

const Cat = () => {
  const placeholder = 'Meow';

  const [name, setName] = useState(placeholder);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      gap: 10,
      ...Platform.select({
        ios: {
          backgroundColor: 'aliceblue',
        },
        android: {
          backgroundColor: 'ivory',
        },
        default: {
          backgroundColor: 'lavender',
        },
      }),
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    sectionHeader: {
      padding: 8,
      fontSize: 16,
      fontWeight: 'bold',
      backgroundColor: Platform.OS === 'ios' ? 'skyblue' : 'mediumpurple',
    },
    input: {
      padding: 10,
      fontSize: 16,
      height: 40,
      borderWidth: 1,
      borderColor: Platform.OS === 'ios' ? 'skyblue' : 'mediumpurple',
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
      <SectionList
        sections={[
          {
            title: '0 - 10',
            data: [
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
            ],
          },
          {
            title: '11 - 20',
            data: [
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
            ],
          },
          {
            title: '21 - 30',
            data: [
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
            ],
          },
          {
            title: '31 - 40',
            data: [
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
            ],
          },
          {
            title: '41 - 50',
            data: [
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
            ],
          },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Cat;
