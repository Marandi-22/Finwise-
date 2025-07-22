import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function BudgetRoadmapScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineSmall">Budget Roadmap</Text>
      <Text>Coming soon: set goals, get your gamified roadmap.</Text>
      <Button onPress={() => console.log('Start Budget Setup')}>Start</Button>
    </View>
  );
}
