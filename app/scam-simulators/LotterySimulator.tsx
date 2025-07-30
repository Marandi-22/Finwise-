import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

export default function LotterySimulator() {
  return (
    <View>
      <Text>You won ₹10,00,000! Click below to claim now.</Text>
      <Button mode="contained" style={{ marginTop: 12 }} onPress={() => alert("⚠ You’ve been phished!")}>
        Claim Reward
      </Button>
    </View>
  );
}
