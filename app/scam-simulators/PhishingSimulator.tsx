import { View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function PhishingSimulator() {
  return (
    <View>
      <TextInput label="Username" mode="outlined" />
      <TextInput label="Password" mode="outlined" secureTextEntry />
      <Button mode="contained" style={{ marginTop: 12 }} onPress={() => alert("⚠️ Login captured by scammer!")}>
        Login
      </Button>
    </View>
  );
}
