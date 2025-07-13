import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { X, Plus, Star } from 'lucide-react-native';
import { Session, Effect, SessionSetting, ConsumptionMethod } from '@/types';
import { effectOptions, flavorOptions, aromaOptions, consumptionMethods, purposeOptions } from '@/mocks/sessionData';
import { colors } from '@/constants/colors';

interface SessionFormProps {
  onSubmit: (session: Omit<Session, 'id'>) => void;
  onCancel: () => void;
  availableStrains: { id: string; strain: string }[];
}

export const SessionForm = ({ onSubmit, onCancel, availableStrains }: SessionFormProps) => {
  const [form, setForm] = useState({
    date: new Date().toISOString(),
    strains: [] as string[],
    method: 'vape_flower' as ConsumptionMethod,
    dose: '',
    duration: '',
    rating: 3,
    notes: '',
    setting: 'solo' as SessionSetting,
    participants: '',
  });

  const [effects, setEffects] = useState<Effect[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedAromas, setSelectedAromas] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [showSpiritual, setShowSpiritual] = useState(false);
  const [spiritualForm, setSpiritualForm] = useState({
    moonPhase: '',
    ritualName: '',
    intention: '',
    messages: '',
  });

  const addEffect = (category: Effect['category'], name: string) => {
    const existingEffect = effects.find(e => e.category === category && e.name === name);
    if (!existingEffect) {
      setEffects([...effects, { category, name, intensity: 3 }]);
    }
  };

  const updateEffectIntensity = (index: number, intensity: number) => {
    const updated = [...effects];
    updated[index].intensity = intensity;
    setEffects(updated);
  };

  const removeEffect = (index: number) => {
    setEffects(effects.filter((_, i) => i !== index));
  };

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = () => {
    if (form.strains.length === 0) {
      Alert.alert('Error', 'Please select at least one strain');
      return;
    }

    if (!form.dose || !form.duration) {
      Alert.alert('Error', 'Please enter dose and duration');
      return;
    }

    const session: Omit<Session, 'id'> = {
      date: form.date,
      strains: form.strains,
      method: form.method,
      dose: form.dose,
      duration: parseInt(form.duration),
      effects,
      flavor: selectedFlavors,
      aroma: selectedAromas,
      rating: form.rating,
      notes: form.notes.trim() || undefined,
      setting: form.setting,
      purpose: selectedPurposes,
      participants: form.participants.trim() ? form.participants.split(',').map(p => p.trim()) : undefined,
      spiritualNotes: showSpiritual && (spiritualForm.moonPhase || spiritualForm.ritualName || spiritualForm.intention || spiritualForm.messages) 
        ? spiritualForm 
        : undefined,
    };

    onSubmit(session);
  };

  const renderStarRating = (rating: number, onPress: (rating: number) => void) => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onPress(star)}>
          <Star
            size={24}
            color={star <= rating ? colors.warning : colors.border}
            fill={star <= rating ? colors.warning : 'transparent'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Session</Text>
        <TouchableOpacity onPress={onCancel}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Details</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Strains *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {availableStrains.map((strain) => (
                <TouchableOpacity
                  key={strain.id}
                  style={[
                    styles.strainChip,
                    form.strains.includes(strain.id) && styles.strainChipSelected
                  ]}
                  onPress={() => {
                    if (form.strains.includes(strain.id)) {
                      setForm(prev => ({ ...prev, strains: prev.strains.filter(s => s !== strain.id) }));
                    } else {
                      setForm(prev => ({ ...prev, strains: [...prev.strains, strain.id] }));
                    }
                  }}
                >
                  <Text style={[
                    styles.strainChipText,
                    form.strains.includes(strain.id) && styles.strainChipTextSelected
                  ]}>
                    {strain.strain}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Method</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {consumptionMethods.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodChip,
                      form.method === method && styles.methodChipSelected
                    ]}
                    onPress={() => setForm(prev => ({ ...prev, method }))}
                  >
                    <Text style={[
                      styles.methodChipText,
                      form.method === method && styles.methodChipTextSelected
                    ]}>
                      {method.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Dose *</Text>
              <TextInput
                style={styles.input}
                value={form.dose}
                onChangeText={(text) => setForm(prev => ({ ...prev, dose: text }))}
                placeholder="0.2g"
              />
            </View>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Duration (min) *</Text>
              <TextInput
                style={styles.input}
                value={form.duration}
                onChangeText={(text) => setForm(prev => ({ ...prev, duration: text }))}
                placeholder="120"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Setting</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(['solo', 'social', 'ritual', 'outdoor', 'bedtime', 'creative', 'medical'] as SessionSetting[]).map((setting) => (
                <TouchableOpacity
                  key={setting}
                  style={[
                    styles.settingChip,
                    form.setting === setting && styles.settingChipSelected
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, setting }))}
                >
                  <Text style={[
                    styles.settingChipText,
                    form.setting === setting && styles.settingChipTextSelected
                  ]}>
                    {setting}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Overall Rating</Text>
            {renderStarRating(form.rating, (rating) => setForm(prev => ({ ...prev, rating })))}
          </View>
        </View>

        {/* Effects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Effects</Text>
          
          {Object.entries(effectOptions).map(([category, categoryEffects]) => (
            <View key={category} style={styles.effectCategory}>
              <Text style={styles.effectCategoryTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categoryEffects.map((effect) => (
                  <TouchableOpacity
                    key={effect}
                    style={styles.effectChip}
                    onPress={() => addEffect(category as Effect['category'], effect)}
                  >
                    <Text style={styles.effectChipText}>{effect}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}

          {effects.length > 0 && (
            <View style={styles.selectedEffects}>
              <Text style={styles.selectedEffectsTitle}>Selected Effects</Text>
              {effects.map((effect, index) => (
                <View key={index} style={styles.selectedEffect}>
                  <Text style={styles.selectedEffectName}>{effect.name}</Text>
                  <View style={styles.intensitySelector}>
                    {[1, 2, 3, 4, 5].map((intensity) => (
                      <TouchableOpacity
                        key={intensity}
                        style={[
                          styles.intensityButton,
                          effect.intensity >= intensity && styles.intensityButtonActive
                        ]}
                        onPress={() => updateEffectIntensity(index, intensity)}
                      >
                        <Text style={[
                          styles.intensityButtonText,
                          effect.intensity >= intensity && styles.intensityButtonTextActive
                        ]}>
                          {intensity}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity onPress={() => removeEffect(index)} style={styles.removeEffectButton}>
                    <X size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Flavor & Aroma */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flavor</Text>
          <View style={styles.chipContainer}>
            {flavorOptions.slice(0, 20).map((flavor) => (
              <TouchableOpacity
                key={flavor}
                style={[
                  styles.chip,
                  selectedFlavors.includes(flavor) && styles.chipSelected
                ]}
                onPress={() => toggleSelection(flavor, selectedFlavors, setSelectedFlavors)}
              >
                <Text style={[
                  styles.chipText,
                  selectedFlavors.includes(flavor) && styles.chipTextSelected
                ]}>
                  {flavor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aroma</Text>
          <View style={styles.chipContainer}>
            {aromaOptions.slice(0, 20).map((aroma) => (
              <TouchableOpacity
                key={aroma}
                style={[
                  styles.chip,
                  selectedAromas.includes(aroma) && styles.chipSelected
                ]}
                onPress={() => toggleSelection(aroma, selectedAromas, setSelectedAromas)}
              >
                <Text style={[
                  styles.chipText,
                  selectedAromas.includes(aroma) && styles.chipTextSelected
                ]}>
                  {aroma}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Purpose */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purpose</Text>
          <View style={styles.chipContainer}>
            {purposeOptions.map((purpose) => (
              <TouchableOpacity
                key={purpose}
                style={[
                  styles.chip,
                  selectedPurposes.includes(purpose) && styles.chipSelected
                ]}
                onPress={() => toggleSelection(purpose, selectedPurposes, setSelectedPurposes)}
              >
                <Text style={[
                  styles.chipText,
                  selectedPurposes.includes(purpose) && styles.chipTextSelected
                ]}>
                  {purpose}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Spiritual Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.spiritualToggle}
            onPress={() => setShowSpiritual(!showSpiritual)}
          >
            <Text style={styles.sectionTitle}>Spiritual Notes (Optional)</Text>
            <Text style={styles.toggleText}>{showSpiritual ? '−' : '+'}</Text>
          </TouchableOpacity>
          
          {showSpiritual && (
            <>
              <View style={styles.row}>
                <View style={[styles.field, styles.halfField]}>
                  <Text style={styles.label}>Moon Phase</Text>
                  <TextInput
                    style={styles.input}
                    value={spiritualForm.moonPhase}
                    onChangeText={(text) => setSpiritualForm(prev => ({ ...prev, moonPhase: text }))}
                    placeholder="Waxing Crescent"
                  />
                </View>
                <View style={[styles.field, styles.halfField]}>
                  <Text style={styles.label}>Ritual Name</Text>
                  <TextInput
                    style={styles.input}
                    value={spiritualForm.ritualName}
                    onChangeText={(text) => setSpiritualForm(prev => ({ ...prev, ritualName: text }))}
                    placeholder="Creative Flow"
                  />
                </View>
              </View>
              
              <View style={styles.field}>
                <Text style={styles.label}>Intention</Text>
                <TextInput
                  style={styles.input}
                  value={spiritualForm.intention}
                  onChangeText={(text) => setSpiritualForm(prev => ({ ...prev, intention: text }))}
                  placeholder="Set your intention..."
                />
              </View>
              
              <View style={styles.field}>
                <Text style={styles.label}>Messages/Insights</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  value={spiritualForm.messages}
                  onChangeText={(text) => setSpiritualForm(prev => ({ ...prev, messages: text }))}
                  placeholder="Any messages or insights received..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </>
          )}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={form.notes}
            onChangeText={(text) => setForm(prev => ({ ...prev, notes: text }))}
            placeholder="Session notes, observations, thoughts..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participants (Optional)</Text>
          <TextInput
            style={styles.input}
            value={form.participants}
            onChangeText={(text) => setForm(prev => ({ ...prev, participants: text }))}
            placeholder="Separate names with commas"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Session</Text>
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
  strainChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  strainChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  strainChipText: {
    fontSize: 14,
    color: colors.text,
  },
  strainChipTextSelected: {
    color: 'white',
  },
  methodChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  methodChipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  methodChipText: {
    fontSize: 12,
    color: colors.text,
    textTransform: 'capitalize',
  },
  methodChipTextSelected: {
    color: 'white',
  },
  settingChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  settingChipSelected: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  settingChipText: {
    fontSize: 12,
    color: colors.text,
    textTransform: 'capitalize',
  },
  settingChipTextSelected: {
    color: 'white',
  },
  starContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  effectCategory: {
    marginBottom: 16,
  },
  effectCategoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  effectChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  effectChipText: {
    fontSize: 12,
    color: colors.text,
  },
  selectedEffects: {
    marginTop: 16,
  },
  selectedEffectsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  selectedEffect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  selectedEffectName: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  intensitySelector: {
    flexDirection: 'row',
    marginRight: 8,
  },
  intensityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
  intensityButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  intensityButtonText: {
    fontSize: 10,
    color: colors.textLight,
  },
  intensityButtonTextActive: {
    color: 'white',
  },
  removeEffectButton: {
    padding: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.primaryDark,
  },
  spiritualToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
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