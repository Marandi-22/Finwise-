import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import UpiSimulator from '@/components/scam/UpiSimulator';
import LotterySimulator from '@/components/scam/LotterySimulator';
import JobSimulator from '@/components/scam/JobSimulator';
import PhishingSimulator from '@/components/scam/PhishingSimulator';

const simulators: Record<string, React.FC> = {
  upi: UpiSimulator,
  '1': UpiSimulator,
  lottery: LotterySimulator,
  '3': LotterySimulator,
  job: JobSimulator,
  '4': JobSimulator,
  phishing: PhishingSimulator,
  '2': PhishingSimulator,
};

export default function SimulatorScreen() {
  const { scamId, scamTitle } = useLocalSearchParams();
  const router = useRouter();

  const SimComponent = simulators[scamId as string];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulating: {scamTitle || scamId}</Text>
      {SimComponent ? <SimComponent /> : <Text>Scam simulation not found.</Text>}
      <Button mode="outlined" onPress={() => router.back()} style={styles.backButton}>
        Back to Feed
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, marginBottom: 8 },
  backButton: { marginTop: 20 },
});
