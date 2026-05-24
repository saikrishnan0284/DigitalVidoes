import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { sendOTP, verifyOTP } from '../../store/slices/authSlice';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = async () => {
    try {
      await dispatch(sendOTP({ phoneOrEmail })).unwrap();
      Alert.alert('Success', 'OTP sent successfully');
      setStep(2);
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await dispatch(verifyOTP({ phoneOrEmail, otp })).unwrap();
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start celebrating life's special moments</Text>

        {step === 1 ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number or Email"
              value={phoneOrEmail}
              onChangeText={setPhoneOrEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSendOTP}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerifyOTP}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Verifying...' : 'Verify & Register'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep(1)}>
              <Text style={styles.link}>Change Number</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16
  },
  button: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center'
  },
  linkText: {
    color: '#666'
  },
  link: {
    color: '#ef4444',
    fontWeight: '600'
  }
});
