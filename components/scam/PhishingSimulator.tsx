import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';

export default function PhishingSimulator() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleLogin = () => {
    setSubmitted(true);
  };

  return (
    <View style={styles.container}>
      {!submitted ? (
        <>
          <Text style={styles.alertText}>
            ⚠ Urgent: Your account will be suspended unless you verify your login.
          </Text>
          <TextInput
            label="Email or Username"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleLogin}>
            Verify Account
          </Button>
        </>
      ) : (
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>⚠ SCAM ALERT!</Text>
          <Text style={styles.alertDescription}>
            This was a fake login screen designed to steal your credentials. Real services will never send you urgent login links through email or messages.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  alertText: {
    fontSize: 16,
    color: '#d9534f',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: { marginBottom: 12 },
  alertBox: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
    alignItems: 'center',
  },
  alertTitle: { fontSize: 20, fontWeight: 'bold', color: '#721c24', marginBottom: 10 },
  alertDescription: { fontSize: 14, color: '#721c24', textAlign: 'center' },
});
