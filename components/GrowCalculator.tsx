import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Calculator, DollarSign, Scale, Clock, Lightbulb } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface CalculatorResult {
  type: string;
  title: string;
  value: string;
  unit: string;
  details?: string[];
}

export const GrowCalculator = () => {
  const [activeCalculator, setActiveCalculator] = useState<'cost' | 'yield' | 'timeline' | 'light'>('cost');
  const [results, setResults] = useState<CalculatorResult[]>([]);

  // Cost Calculator
  const [costInputs, setCostInputs] = useState({
    electricity: '',
    nutrients: '',
    seeds: '',
    equipment: '',
    misc: '',
    yieldOz: '',
  });

  // Yield Calculator
  const [yieldInputs, setYieldInputs] = useState({
    plantCount: '',
    spaceSize: '',
    lightWatts: '',
    strainType: 'indica',
  });

  // Timeline Calculator
  const [timelineInputs, setTimelineInputs] = useState({
    strainType: 'photoperiod',
    vegWeeks: '',
    flowerWeeks: '',
  });

  // Light Calculator
  const [lightInputs, setLightInputs] = useState({
    spaceLength: '',
    spaceWidth: '',
    lightType: 'led',
  });

  const calculateCost = () => {
    const electricity = parseFloat(costInputs.electricity) || 0;
    const nutrients = parseFloat(costInputs.nutrients) || 0;
    const seeds = parseFloat(costInputs.seeds) || 0;
    const equipment = parseFloat(costInputs.equipment) || 0;
    const misc = parseFloat(costInputs.misc) || 0;
    const yieldOz = parseFloat(costInputs.yieldOz) || 1;

    const totalCost = electricity + nutrients + seeds + equipment + misc;
    const costPerOz = totalCost / yieldOz;
    const costPerGram = costPerOz / 28.35;

    setResults([
      {
        type: 'cost',
        title: 'Total Cost',
        value: totalCost.toFixed(2),
        unit: '$',
        details: [
          `Electricity: $${electricity}`,
          `Nutrients: $${nutrients}`,
          `Seeds: $${seeds}`,
          `Equipment: $${equipment}`,
          `Miscellaneous: $${misc}`,
        ],
      },
      {
        type: 'cost',
        title: 'Cost per Ounce',
        value: costPerOz.toFixed(2),
        unit: '$',
      },
      {
        type: 'cost',
        title: 'Cost per Gram',
        value: costPerGram.toFixed(2),
        unit: '$',
      },
    ]);
  };

  const calculateYield = () => {
    const plantCount = parseInt(yieldInputs.plantCount) || 1;
    const spaceSize = parseFloat(yieldInputs.spaceSize) || 16; // sq ft
    const lightWatts = parseFloat(yieldInputs.lightWatts) || 600;
    
    // Rough estimates based on common yields
    const yieldPerPlant = yieldInputs.strainType === 'indica' ? 2 : 1.5; // oz per plant
    const yieldPerSqFt = 1.5; // oz per sq ft
    const yieldPerWatt = 0.5; // grams per watt

    const totalYieldByPlant = plantCount * yieldPerPlant;
    const totalYieldBySpace = spaceSize * yieldPerSqFt;
    const totalYieldByLight = (lightWatts * yieldPerWatt) / 28.35; // convert to oz

    const estimatedYield = Math.min(totalYieldByPlant, totalYieldBySpace, totalYieldByLight);

    setResults([
      {
        type: 'yield',
        title: 'Estimated Yield',
        value: estimatedYield.toFixed(1),
        unit: 'oz',
        details: [
          `By plant count: ${totalYieldByPlant.toFixed(1)} oz`,
          `By space: ${totalYieldBySpace.toFixed(1)} oz`,
          `By light: ${totalYieldByLight.toFixed(1)} oz`,
          `Limiting factor determines final yield`,
        ],
      },
      {
        type: 'yield',
        title: 'Grams',
        value: (estimatedYield * 28.35).toFixed(0),
        unit: 'g',
      },
    ]);
  };

  const calculateTimeline = () => {
    const vegWeeks = parseInt(timelineInputs.vegWeeks) || 4;
    const flowerWeeks = parseInt(timelineInputs.flowerWeeks) || 8;
    
    let germWeeks = 1;
    let dryWeeks = 1;
    let cureWeeks = 4;

    if (timelineInputs.strainType === 'autoflower') {
      const totalWeeks = vegWeeks + flowerWeeks;
      setResults([
        {
          type: 'timeline',
          title: 'Total Time',
          value: (totalWeeks + germWeeks + dryWeeks + cureWeeks).toString(),
          unit: 'weeks',
          details: [
            `Germination: ${germWeeks} week`,
            `Auto cycle: ${totalWeeks} weeks`,
            `Drying: ${dryWeeks} week`,
            `Curing: ${cureWeeks} weeks`,
          ],
        },
        {
          type: 'timeline',
          title: 'Harvest Ready',
          value: totalWeeks.toString(),
          unit: 'weeks',
        },
      ]);
    } else {
      const totalWeeks = vegWeeks + flowerWeeks;
      setResults([
        {
          type: 'timeline',
          title: 'Total Time',
          value: (totalWeeks + germWeeks + dryWeeks + cureWeeks).toString(),
          unit: 'weeks',
          details: [
            `Germination: ${germWeeks} week`,
            `Vegetative: ${vegWeeks} weeks`,
            `Flowering: ${flowerWeeks} weeks`,
            `Drying: ${dryWeeks} week`,
            `Curing: ${cureWeeks} weeks`,
          ],
        },
        {
          type: 'timeline',
          title: 'Harvest Ready',
          value: totalWeeks.toString(),
          unit: 'weeks',
        },
      ]);
    }
  };

  const calculateLight = () => {
    const length = parseFloat(lightInputs.spaceLength) || 4;
    const width = parseFloat(lightInputs.spaceWidth) || 4;
    const area = length * width;

    let wattsPerSqFt = 35; // LED default
    if (lightInputs.lightType === 'hps') wattsPerSqFt = 50;
    if (lightInputs.lightType === 'cfl') wattsPerSqFt = 100;

    const recommendedWatts = area * wattsPerSqFt;
    const dailyKwh = (recommendedWatts * 18) / 1000; // 18 hours for veg
    const monthlyKwh = dailyKwh * 30;

    setResults([
      {
        type: 'light',
        title: 'Recommended Watts',
        value: recommendedWatts.toString(),
        unit: 'W',
        details: [
          `Space: ${length}' × ${width}' = ${area} sq ft`,
          `${wattsPerSqFt}W per sq ft for ${lightInputs.lightType.toUpperCase()}`,
        ],
      },
      {
        type: 'light',
        title: 'Daily Power Use',
        value: dailyKwh.toFixed(1),
        unit: 'kWh',
      },
      {
        type: 'light',
        title: 'Monthly Power Use',
        value: monthlyKwh.toFixed(0),
        unit: 'kWh',
      },
    ]);
  };

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'cost':
        return (
          <View style={styles.calculatorForm}>
            <Text style={styles.formTitle}>Cost per Gram Calculator</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Electricity Cost ($)</Text>
              <TextInput
                style={styles.input}
                value={costInputs.electricity}
                onChangeText={(text) => setCostInputs(prev => ({ ...prev, electricity: text }))}
                placeholder="150"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nutrients Cost ($)</Text>
              <TextInput
                style={styles.input}
                value={costInputs.nutrients}
                onChangeText={(text) => setCostInputs(prev => ({ ...prev, nutrients: text }))}
                placeholder="100"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Seeds Cost ($)</Text>
              <TextInput
                style={styles.input}
                value={costInputs.seeds}
                onChangeText={(text) => setCostInputs(prev => ({ ...prev, seeds: text }))}
                placeholder="50"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Equipment Cost ($)</Text>
              <TextInput
                style={styles.input}
                value={costInputs.equipment}
                onChangeText={(text) => setCostInputs(prev => ({ ...prev, equipment: text }))}
                placeholder="200"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Miscellaneous ($)</Text>
              <TextInput
                style={styles.input}
                value={costInputs.misc}
                onChangeText={(text) => setCostInputs(prev => ({ ...prev, misc: text }))}
                placeholder="50"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Expected Yield (oz)</Text>
              <TextInput
                style={styles.input}
                value={costInputs.yieldOz}
                onChangeText={(text) => setCostInputs(prev => ({ ...prev, yieldOz: text }))}
                placeholder="4"
                keyboardType="decimal-pad"
              />
            </View>

            <TouchableOpacity style={styles.calculateButton} onPress={calculateCost}>
              <Text style={styles.calculateButtonText}>Calculate Cost</Text>
            </TouchableOpacity>
          </View>
        );

      case 'yield':
        return (
          <View style={styles.calculatorForm}>
            <Text style={styles.formTitle}>Yield Estimator</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of Plants</Text>
              <TextInput
                style={styles.input}
                value={yieldInputs.plantCount}
                onChangeText={(text) => setYieldInputs(prev => ({ ...prev, plantCount: text }))}
                placeholder="4"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Space Size (sq ft)</Text>
              <TextInput
                style={styles.input}
                value={yieldInputs.spaceSize}
                onChangeText={(text) => setYieldInputs(prev => ({ ...prev, spaceSize: text }))}
                placeholder="16"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Light Watts</Text>
              <TextInput
                style={styles.input}
                value={yieldInputs.lightWatts}
                onChangeText={(text) => setYieldInputs(prev => ({ ...prev, lightWatts: text }))}
                placeholder="600"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Strain Type</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[styles.segment, yieldInputs.strainType === 'indica' && styles.segmentActive]}
                  onPress={() => setYieldInputs(prev => ({ ...prev, strainType: 'indica' }))}
                >
                  <Text style={[styles.segmentText, yieldInputs.strainType === 'indica' && styles.segmentTextActive]}>
                    Indica
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, yieldInputs.strainType === 'sativa' && styles.segmentActive]}
                  onPress={() => setYieldInputs(prev => ({ ...prev, strainType: 'sativa' }))}
                >
                  <Text style={[styles.segmentText, yieldInputs.strainType === 'sativa' && styles.segmentTextActive]}>
                    Sativa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.calculateButton} onPress={calculateYield}>
              <Text style={styles.calculateButtonText}>Estimate Yield</Text>
            </TouchableOpacity>
          </View>
        );

      case 'timeline':
        return (
          <View style={styles.calculatorForm}>
            <Text style={styles.formTitle}>Grow Timeline</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Strain Type</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[styles.segment, timelineInputs.strainType === 'photoperiod' && styles.segmentActive]}
                  onPress={() => setTimelineInputs(prev => ({ ...prev, strainType: 'photoperiod' }))}
                >
                  <Text style={[styles.segmentText, timelineInputs.strainType === 'photoperiod' && styles.segmentTextActive]}>
                    Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, timelineInputs.strainType === 'autoflower' && styles.segmentActive]}
                  onPress={() => setTimelineInputs(prev => ({ ...prev, strainType: 'autoflower' }))}
                >
                  <Text style={[styles.segmentText, timelineInputs.strainType === 'autoflower' && styles.segmentTextActive]}>
                    Auto
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {timelineInputs.strainType === 'autoflower' ? 'Vegetative Weeks' : 'Veg Weeks'}
              </Text>
              <TextInput
                style={styles.input}
                value={timelineInputs.vegWeeks}
                onChangeText={(text) => setTimelineInputs(prev => ({ ...prev, vegWeeks: text }))}
                placeholder={timelineInputs.strainType === 'autoflower' ? '3' : '4'}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Flowering Weeks</Text>
              <TextInput
                style={styles.input}
                value={timelineInputs.flowerWeeks}
                onChangeText={(text) => setTimelineInputs(prev => ({ ...prev, flowerWeeks: text }))}
                placeholder={timelineInputs.strainType === 'autoflower' ? '6' : '8'}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity style={styles.calculateButton} onPress={calculateTimeline}>
              <Text style={styles.calculateButtonText}>Calculate Timeline</Text>
            </TouchableOpacity>
          </View>
        );

      case 'light':
        return (
          <View style={styles.calculatorForm}>
            <Text style={styles.formTitle}>Light Calculator</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Space Length (ft)</Text>
              <TextInput
                style={styles.input}
                value={lightInputs.spaceLength}
                onChangeText={(text) => setLightInputs(prev => ({ ...prev, spaceLength: text }))}
                placeholder="4"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Space Width (ft)</Text>
              <TextInput
                style={styles.input}
                value={lightInputs.spaceWidth}
                onChangeText={(text) => setLightInputs(prev => ({ ...prev, spaceWidth: text }))}
                placeholder="4"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Light Type</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[styles.segment, lightInputs.lightType === 'led' && styles.segmentActive]}
                  onPress={() => setLightInputs(prev => ({ ...prev, lightType: 'led' }))}
                >
                  <Text style={[styles.segmentText, lightInputs.lightType === 'led' && styles.segmentTextActive]}>
                    LED
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, lightInputs.lightType === 'hps' && styles.segmentActive]}
                  onPress={() => setLightInputs(prev => ({ ...prev, lightType: 'hps' }))}
                >
                  <Text style={[styles.segmentText, lightInputs.lightType === 'hps' && styles.segmentTextActive]}>
                    HPS
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, lightInputs.lightType === 'cfl' && styles.segmentActive]}
                  onPress={() => setLightInputs(prev => ({ ...prev, lightType: 'cfl' }))}
                >
                  <Text style={[styles.segmentText, lightInputs.lightType === 'cfl' && styles.segmentTextActive]}>
                    CFL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.calculateButton} onPress={calculateLight}>
              <Text style={styles.calculateButtonText}>Calculate Light</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Calculator Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeCalculator === 'cost' && styles.tabActive]}
          onPress={() => setActiveCalculator('cost')}
        >
          <DollarSign size={20} color={activeCalculator === 'cost' ? 'white' : colors.textLight} />
          <Text style={[styles.tabText, activeCalculator === 'cost' && styles.tabTextActive]}>Cost</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeCalculator === 'yield' && styles.tabActive]}
          onPress={() => setActiveCalculator('yield')}
        >
          <Scale size={20} color={activeCalculator === 'yield' ? 'white' : colors.textLight} />
          <Text style={[styles.tabText, activeCalculator === 'yield' && styles.tabTextActive]}>Yield</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeCalculator === 'timeline' && styles.tabActive]}
          onPress={() => setActiveCalculator('timeline')}
        >
          <Clock size={20} color={activeCalculator === 'timeline' ? 'white' : colors.textLight} />
          <Text style={[styles.tabText, activeCalculator === 'timeline' && styles.tabTextActive]}>Timeline</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeCalculator === 'light' && styles.tabActive]}
          onPress={() => setActiveCalculator('light')}
        >
          <Lightbulb size={20} color={activeCalculator === 'light' ? 'white' : colors.textLight} />
          <Text style={[styles.tabText, activeCalculator === 'light' && styles.tabTextActive]}>Light</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCalculator()}

        {/* Results */}
        {results.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Results</Text>
            {results.map((result, index) => (
              <View key={index} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>{result.title}</Text>
                  <Text style={styles.resultValue}>
                    {result.unit === '$' && '$'}{result.value} {result.unit !== '$' && result.unit}
                  </Text>
                </View>
                {result.details && (
                  <View style={styles.resultDetails}>
                    {result.details.map((detail, detailIndex) => (
                      <Text key={detailIndex} style={styles.resultDetail}>• {detail}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  tabTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  calculatorForm: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
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
    backgroundColor: colors.background,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontSize: 14,
    color: colors.textLight,
  },
  segmentTextActive: {
    color: 'white',
  },
  calculateButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resultsSection: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  resultDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  resultDetail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
});