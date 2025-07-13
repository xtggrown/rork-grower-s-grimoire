import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { X, Plus, Minus } from 'lucide-react-native';
import { FeedingEntry, NutrientMix, GrowStage } from '@/types';
import { colors } from '@/constants/colors';

interface FeedingFormProps {
  onSubmit: (entry: Omit<FeedingEntry, 'id'>) => void;
  onCancel: () => void;
  plantStage?: GrowStage;
}

export const FeedingForm = ({ onSubmit, onCancel, plantStage }: FeedingFormProps) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'nutrients' as 'water' | 'nutrients',
    amount: '',
    ppm: '',
    ec: '',
    ph: '',
    runoffPpm: '',
    runoffPh: '',
    notes: '',
  });

  const [nutrients, setNutrients] = useState<NutrientMix[]>([
    { name: '', amount: 0, unit: 'ml' },
  ]);

  const addNutrient = () => {
    setNutrients([...nutrients, { name: '', amount: 0, unit: 'ml' }]);
  };

  const removeNutrient = (index: number) => {
    if (nutrients.length > 1) {
      setNutrients(nutrients.filter((_, i) => i !== index));
    }
  };

  const updateNutrient = (index: number, field: keyof NutrientMix, value: any) => {
    const updated = [...nutrients];
    updated[index] = { ...updated[index], [field]: value };
    setNutrients(updated);
  };

  const handleSubmit = () => {
    if (!form.amount || parseFloat(form.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const entry: Omit<FeedingEntry, 'id'> = {
      date: form.date,
      type: form.type,
      amount: parseFloat(form.amount),
      ppm: form.ppm ? parseFloat(form.ppm) : undefined,
      ec: form.ec ? parseFloat(form.ec) : undefined,
      ph: form.ph ? parseFloat(form.ph) : undefined,
      runoffPpm: form.runoffPpm ? parseFloat(form.runoffPpm) : undefined,
      runoffPh: form.runoffPh ? parseFloat(form.runoffPh) : undefined,
      notes: form.notes.trim() || undefined,
      plantStage,
    };

    if (form.type === 'nutrients') {
      const validNutrients = nutrients.filter(n => n.name.trim() && n.amount > 0);
      if (validNutrients.length > 0) {
        entry.nutrients = validNutrients;
      }
    }

    onSubmit(entry);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Feeding Entry</Text>
        <TouchableOpacity onPress={onCancel}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={form.date}
              onChangeText={(text) => setForm(prev => ({ ...prev, date: text }))}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, form.type === 'water' && styles.typeButtonActive]}
                onPress={() => setForm(prev => ({ ...prev, type: 'water' }))}
              >
                <Text style={[styles.typeButtonText, form.type === 'water' && styles.typeButtonTextActive]}>
                  Water Only
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, form.type === 'nutrients' && styles.typeButtonActive]}
                onPress={() => setForm(prev => ({ ...prev, type: 'nutrients' }))}
              >
                <Text style={[styles.typeButtonText, form.type === 'nutrients' && styles.typeButtonTextActive]}>
                  Nutrients
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Amount (Liters)</Text>
            <TextInput
              style={styles.input}
              value={form.amount}
              onChangeText={(text) => setForm(prev => ({ ...prev, amount: text }))}
              placeholder="e.g., 1.5"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {form.type === 'nutrients' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nutrients</Text>
              <TouchableOpacity onPress={addNutrient} style={styles.addButton}>
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {nutrients.map((nutrient, index) => (
              <View key={index} style={styles.nutrientRow}>
                <TextInput
                  style={[styles.input, styles.nutrientName]}
                  value={nutrient.name}
                  onChangeText={(text) => updateNutrient(index, 'name', text)}
                  placeholder="Nutrient name"
                />
                <TextInput
                  style={[styles.input, styles.nutrientAmount]}
                  value={nutrient.amount.toString()}
                  onChangeText={(text) => updateNutrient(index, 'amount', parseFloat(text) || 0)}
                  placeholder="Amount"
                  keyboardType="decimal-pad"
                />
                <View style={styles.unitSelector}>
                  <TouchableOpacity
                    style={[styles.unitButton, nutrient.unit === 'ml' && styles.unitButtonActive]}
                    onPress={() => updateNutrient(index, 'unit', 'ml')}
                  >
                    <Text style={[styles.unitText, nutrient.unit === 'ml' && styles.unitTextActive]}>ml</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.unitButton, nutrient.unit === 'g' && styles.unitButtonActive]}
                    onPress={() => updateNutrient(index, 'unit', 'g')}
                  >
                    <Text style={[styles.unitText, nutrient.unit === 'g' && styles.unitTextActive]}>g</Text>
                  </TouchableOpacity>
                </View>
                {nutrients.length > 1 && (
                  <TouchableOpacity onPress={() => removeNutrient(index)} style={styles.removeButton}>
                    <Minus size={20} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Parameters</Text>
          
          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>PPM</Text>
              <TextInput
                style={styles.input}
                value={form.ppm}
                onChangeText={(text) => setForm(prev => ({ ...prev, ppm: text }))}
                placeholder="650"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>EC</Text>
              <TextInput
                style={styles.input}
                value={form.ec}
                onChangeText={(text) => setForm(prev => ({ ...prev, ec: text }))}
                placeholder="1.3"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>pH</Text>
            <TextInput
              style={styles.input}
              value={form.ph}
              onChangeText={(text) => setForm(prev => ({ ...prev, ph: text }))}
              placeholder="6.2"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Runoff (Optional)</Text>
          
          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Runoff PPM</Text>
              <TextInput
                style={styles.input}
                value={form.runoffPpm}
                onChangeText={(text) => setForm(prev => ({ ...prev, runoffPpm: text }))}
                placeholder="700"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Runoff pH</Text>
              <TextInput
                style={styles.input}
                value={form.runoffPh}
                onChangeText={(text) => setForm(prev => ({ ...prev, runoffPh: text }))}
                placeholder="6.0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={form.notes}
            onChangeText={(text) => setForm(prev => ({ ...prev, notes: text }))}
            placeholder="Any additional notes..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Entry</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
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
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 2,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  typeButtonTextActive: {
    color: 'white',
  },
  addButton: {
    padding: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutrientName: {
    flex: 2,
    marginRight: 8,
  },
  nutrientAmount: {
    flex: 1,
    marginRight: 8,
  },
  unitSelector: {
    flexDirection: 'row',
    marginRight: 8,
  },
  unitButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitText: {
    fontSize: 12,
    color: colors.textLight,
  },
  unitTextActive: {
    color: 'white',
  },
  removeButton: {
    padding: 8,
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