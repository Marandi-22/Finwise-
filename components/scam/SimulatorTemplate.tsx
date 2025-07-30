import { ReactNode, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

type SimulatorTemplateProps = {
  steps: ReactNode[];
  scamTitle: string;
  scamSummary: string;
};

export default function SimulatorTemplate({
  steps,
  scamTitle,
  scamSummary,
}: SimulatorTemplateProps) {
  const [step, setStep] = useState(0);

  return (
    <View style={{ padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 12 }}>
        {scamTitle}
      </Text>

      {steps[step]}

      {step < steps.length - 1 && (
        <Button mode="contained" onPress={() => setStep(step + 1)} style={{ marginTop: 16 }}>
          Next
        </Button>
      )}

      {step === steps.length - 1 && (
        <View style={{ marginTop: 24 }}>
          <Text variant="bodyMedium">{scamSummary}</Text>
        </View>
      )}
    </View>
  );
}
