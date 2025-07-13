import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { X } from 'lucide-react-native';
import { EnvironmentalReading } from '@/types';
import { colors } from '@/constants/colors';

interface EnvironmentalFormProps {
  onSubmit: (reading: Omit<EnvironmentalReading, 'id'>) => void;
  onCancel: () => void;
}

export const EnvironmentalForm = ({ onSubmit, onCancel }: EnvironmentalFormProps) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    temperature: '',
    humidity: '',
    vpd: '',
    co2: '',
    lightIntensity: '',
    notes: '',
  });

  const calculateVPD = (temp: number, rh: number) => {
    // VPD calculation: VPD = SVP × (1 - RH/100)
    // SVP (Saturated Vapor Pressure) = 0.6108 × exp(17.27 × T / (T + 237.3))
    const svp = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
    const vpd = svp * (1 - rh / 100);
    return Math.round(vpd * 100) / 100; // Round to 2 decimal places
  };

  const handleTemperatureChange = (temp: string) => {
    setForm(prev => ({ ...prev, temperature: temp }));
    
    // Auto-calculate VPD if both temp and humidity are available
    if (temp && form.humidity) {
      const tempNum = parseFloat(temp);
      const humidityNum = parseFloat(form.humidity);
      if (!isNaN(tempNum) && !isNaN(humidityNum)) {
        const vpd = calculateVPD(tempNum, humidityNum);
        setForm(prev => ({ ...prev, vpd: vpd.toString() }));
      }
    }
  };

  const handleHumidityChange = (humidity: string) => {
    setForm(prev => ({ ...prev, humidity }));
    
    // Auto-calculate VPD if both temp and humidity are available
    if (humidity && form.temperature) {
      const tempNum = parseFloat(form.temperature);
      const humidityNum = parseFloat(humidity);
      if (!isNaN(tempNum) && !isNaN(humidityNum)) {
        const vpd = calculateVPD(tempNum, humidityNum);
        setForm(prev => ({ ...prev, vpd: vpd.toString() }));
      }
    }
  };

  const handleSubmit = () => {
    if (!form.temperature || !form.humidity) {
      Alert.alert('Error', 'Temperature and humidity are required');
      return;
    }

    const reading: Omit<EnvironmentalReading, 'id'> = {
      date: form.date,
      temperature: parseFloat(form.temperature),
      humidity: parseFloat(form.humidity),
      vpd: form.vpd ? parseFloat(form.vpd) : undefined,
      co2: form.co2 ? parseFloat(form.co2) : undefined,
      lightIntensity: form.lightIntensity ? parseFloat(form.lightIntensity) : undefined,
      notes: form.notes.trim() || undefined,
    };

    onSubmit(reading);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Environmental Reading</Text>
        <TouchableOpacity onPress={onCancel}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={form.date}
            onChangeText={(text) => setForm(prev => ({ ...prev, date: text }))}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Temperature (°F) *</Text>
            <TextInput
              style={styles.input}
              value={form.temperature}
              onChangeText={handleTemperatureChange}
              placeholder="75"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Humidity (%) *</Text>
            <TextInput
              style={styles.input}
              value={form.humidity}
              onChangeText={handleHumidityChange}
              placeholder="60"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>VPD (kPa)</Text>
          <TextInput
            style={styles.input}
            value={form.vpd}
            onChangeText={(text) => setForm(prev => ({ ...prev, vpd: text }))}
            placeholder="Auto-calculated"
            keyboardType="decimal-pad"
          />
          <Text style={styles.helpText}>
            Optimal VPD: Veg 0.8-1.2, Flower 1.0-1.5
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>CO₂ (PPM)</Text>
            <TextInput
              style={styles.input}
              value={form.co2}
              onChangeText={(text) => setForm(prev => ({ ...prev, co2: text }))}
              placeholder="400"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Light (Lux)</Text>
            <TextInput
              style={styles.input}
              value={form.lightIntensity}
              onChangeText={(text) => setForm(prev => ({ ...prev, lightIntensity: text }))}
              placeholder="35000"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={form.notes}
            onChangeText={(text) => setForm(prev => ({ ...prev, notes: text }))}
            placeholder="Environmental conditions, observations..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Reading</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});