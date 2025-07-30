import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';

export default function LotterySimulator() {
  const [step, setStep] = useState(1);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {step === 1 && (
        <View>
          <Text variant="titleLarge">📩 New SMS</Text>
          <Text style={{ marginVertical: 12 }}>
            “Congrats! You’ve won ₹25,00,000 in the KBC Lucky Draw 2025.”
          </Text>
          <Button mode="contained" onPress={() => setStep(2)}>
            Open WhatsApp Chat
          </Button>
        </View>
      )}

      {step === 2 && (
        <View style={{ flex: 1, backgroundColor: '#e5ddd5' }}>
          <View style={styles.whatsappHeader}>
            <Text style={styles.whatsappTitle}>KBC Lottery Dept.</Text>
          </View>

          <ScrollView style={{ padding: 10 }}>
            <View style={styles.msgLeft}>
              <Text>🎉 *Congratulations!* You’ve won ₹25,00,000!</Text>
            </View>
            <View style={styles.msgLeft}>
              <Text>
                Click below to claim your reward.{"\n"}⚠️ *Valid for 5 minutes only!*
              </Text>
            </View>
            <View style={styles.msgRight}>
              <Text>Is this real? Who are you?</Text>
            </View>
            <View style={styles.msgLeft}>
              <Text>We’re official KBC partners. Please scratch below.</Text>
            </View>
          </ScrollView>

          <Button mode="contained" onPress={() => setStep(3)} style={{ margin: 10 }}>
            🎯 Go to Scratch Card
          </Button>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text variant="titleLarge">🧧 Scratch Card</Text>
          <Text style={{ marginBottom: 20 }}>You’ve won ₹25,00,000!</Text>
          <Button mode="contained" onPress={() => setStep(4)}>Claim Prize</Button>
        </View>
      )}

      {step === 4 && (
        <View>
          <Text variant="titleLarge">Enter Your Details</Text>
          <TextInput label="Name" style={{ marginBottom: 10 }} />
          <TextInput label="Phone" style={{ marginBottom: 10 }} />
          <TextInput label="Aadhar No." style={{ marginBottom: 10 }} />
          <Button mode="contained" onPress={() => setStep(5)}>Submit</Button>
        </View>
      )}

      {step === 5 && (
        <View>
          <Text variant="titleLarge">Pay ₹299 Processing Fee</Text>
          <Text style={{ marginVertical: 12 }}>
            Send via UPI to: `lottery-kbc@upi`
          </Text>
          <Button mode="contained" onPress={() => setStep(6)}>I've Paid</Button>
        </View>
      )}

      {step === 6 && (
        <View>
          <Text variant="headlineMedium" style={{ color: 'red' }}>⚠️ You’ve Been Scammed</Text>
          <Text>
            This was a simulation. Lottery scams lure you in, gain your trust, and steal your money or data.
          </Text>
          <Button mode="outlined" onPress={() => setStep(1)} style={{ marginTop: 20 }}>Try Again</Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  whatsappHeader: {
    backgroundColor: '#075e54',
    padding: 10,
  },
  whatsappTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  msgLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 4,
  },
  msgRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderRadius: 10,
    padding: 10,
    marginVertical: 4,
  },
});
