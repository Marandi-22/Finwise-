import { View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function UpiSimulator() {
  return (
    <View>
      <TextInput label="Enter UPI ID" mode="outlined" style={{ marginBottom: 10 }} />
      <TextInput label="Amount" mode="outlined" keyboardType="numeric" />
      <Button mode="contained" style={{ marginTop: 12 }} onPress={() => alert("⚠ Fake UPI ID detected!")}>
        Simulate Payment
      </Button>
    </View>
  );
}
