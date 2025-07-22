import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';

export default function SimulatorScreen() {
  const { scamId, scamTitle } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Card>
        <Card.Title title={`Simulating: ${scamTitle || 'Unknown Scam'}`} />
        <Card.Content>
          <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
            Scam ID: {scamId || 'N/A'}
          </Text>
          <Text variant="bodyMedium">
            This is a placeholder for the {scamTitle || 'selected'} scam simulation. Here, you can show the user how this scam works, offer interactive examples, or walk through a mock attack.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => router.back()}>Back to Feed</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
