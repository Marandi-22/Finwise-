import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function ScamAvoided() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/scams/safe_transaction.png')} style={styles.image} />
      <Text style={styles.title}>Good Job!</Text>
      <Text style={styles.description}>
        You recognized the red flags and avoided a scam. Stay alert and always confirm identities before payments.
      </Text>
      <Button title="Back to Scam Feed" onPress={() => router.push('/(tabs)/explore')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fff4',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
});
