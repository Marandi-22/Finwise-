import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function UpiMockScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineSmall">Mock UPI Transaction</Text>
      <Text>Simulate a payment, test fraud detection.</Text>
      <Button onPress={() => console.log('Simulate UPI Send')}>
        Try UPI Demo
      </Button>
    </View>
  );
}
