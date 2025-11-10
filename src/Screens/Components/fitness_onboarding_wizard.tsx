import React, { useCallback, useEffect, useMemo, useRef, useReducer, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Animated,
  Easing,
  I18nManager,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';

// ---- Types ----
export type Gender = 'male' | 'female' | null;
export type WeightUnit = 'kg' | 'lbs' | 'st';

export type FitnessOnboardingValues = {
  gender: Gender;
  age: number | null;
  currentWeight: number | null; // in selected unit
  goalWeight: number | null; // in selected unit
  unit: WeightUnit;
};

export type FitnessOnboardingWizardProps = {
  accentColor?: string;
  onComplete?: (values: FitnessOnboardingValues) => void;
  onClose?: () => void;
  initialValues?: Partial<FitnessOnboardingValues>;
  /** Optional: label for the primary button */
  nextLabel?: string;
};

// ---- Reducer ----
const initialState: FitnessOnboardingValues = {
  gender: null,
  age: null,
  currentWeight: null,
  goalWeight: null,
  unit: 'kg',
};

type Action =
  | { type: 'set_gender'; gender: Gender }
  | { type: 'set_age'; age: number | null }
  | { type: 'set_current_weight'; value: number | null }
  | { type: 'set_goal_weight'; value: number | null }
  | { type: 'set_unit'; unit: WeightUnit }
  | { type: 'reset'; payload?: Partial<FitnessOnboardingValues> };

function reducer(state: FitnessOnboardingValues, action: Action): FitnessOnboardingValues {
  switch (action.type) {
    case 'set_gender':
      return { ...state, gender: action.gender };
    case 'set_age':
      return { ...state, age: action.age };
    case 'set_current_weight':
      return { ...state, currentWeight: action.value };
    case 'set_goal_weight':
      return { ...state, goalWeight: action.value };
    case 'set_unit':
      return { ...state, unit: action.unit };
    case 'reset':
      return { ...initialState, ...action.payload };
    default:
      return state;
  }
}

// ---- Helpers ----
const isRTL = I18nManager.isRTL;

function clamp(n: number, min: number, max: number) {
  'worklet';
  return Math.max(min, Math.min(max, n));
}

const KG_MIN = 30;
const KG_MAX = 200;

const convert = {
  toKg(value: number, unit: WeightUnit): number {
    if (unit === 'kg') return value;
    if (unit === 'lbs') return value * 0.45359237;
    // stones
    return value * 6.35029318;
  },
  fromKg(kg: number, unit: WeightUnit): number {
    if (unit === 'kg') return kg;
    if (unit === 'lbs') return kg / 0.45359237;
    return kg / 6.35029318;
  },
  format(value: number | null, unit: WeightUnit) {
    if (value == null) return '--';
    const rounded = unit === 'kg' ? Math.round(value) : Math.round(value * 10) / 10;
    return `${rounded}`;
  },
};

// ---- Main Component ----
export default function FitnessOnboardingWizard({
  accentColor = '#9B5CF6',
  onComplete,
  onClose,
  initialValues: init,
  nextLabel = 'Next',
}: FitnessOnboardingWizardProps) {
  const [state, dispatch] = useReducer(reducer, { ...initialState, ...init });
  const steps: Array<'gender' | 'age' | 'currentWeight' | 'goalWeight' | 'unit'> = useMemo(
    () => ['gender', 'age', 'currentWeight', 'goalWeight', 'unit'],
    []
  );

  // Smooth pager animation
  const progress = useRef(new Animated.Value(0)).current; // 0..steps-1
  const [index, setIndex] = useState(0);

  const animateTo = useCallback((to: number) => {
    Animated.timing(progress, {
      toValue: to,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const goNext = useCallback(() => {
    if (index < steps.length - 1) {
      const to = index + 1;
      setIndex(to);
      animateTo(to);
    } else onComplete?.(state);
  }, [index, steps.length, animateTo, onComplete, state]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      const to = index - 1;
      setIndex(to);
      animateTo(to);
    } else onClose?.();
  }, [index, animateTo, onClose]);

  const title = useMemo(() => {
    switch (steps[index]) {
      case 'gender':
        return 'Tell us about yourself!';
      case 'age':
        return 'How old are you?';
      case 'currentWeight':
        return "What's your weight?";
      case 'goalWeight':
        return "What's your goal weight?";
      case 'unit':
        return "What's your weight unit?";
    }
  }, [index, steps]);

  const subtitle = useMemo(() => {
    switch (steps[index]) {
      case 'gender':
        return 'To give you a better experience we need to know your gender';
      case 'age':
        return 'This helps us create your personalized plan';
      case 'currentWeight':
        return 'You can always change this later';
      case 'goalWeight':
        return 'We will tailor a plan to your goal';
      case 'unit':
        return 'Choose how you prefer to see your weight';
    }
  }, [index, steps]);

  const canProceed = useMemo(() => {
    const s = state;
    switch (steps[index]) {
      case 'gender':
        return s.gender !== null;
      case 'age':
        return !!s.age;
      case 'currentWeight':
        return !!s.currentWeight;
      case 'goalWeight':
        return !!s.goalWeight;
      case 'unit':
        return !!s.unit;
    }
  }, [state, index, steps]);

  // Render all steps and slide them based on progress for buttery transitions
  const renderStep = (stepIndex: number) => {
    const translate = Animated.subtract(Animated.multiply(progress, 1), stepIndex);
    const tx = translate.interpolate({ inputRange: [-1, 0, 1], outputRange: [60, 0, -60] });
    const opacity = translate.interpolate({ inputRange: [-1, -0.6, 0, 0.6, 1], outputRange: [0, 0.6, 1, 0.6, 0] });

    return (
      <Animated.View key={stepIndex} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, paddingHorizontal: 0, transform: [{ translateX: tx }], opacity }}>
        <StepHeader step={steps[stepIndex]} />
        {steps[stepIndex] === 'gender' && (
          <GenderStep
            accentColor={accentColor}
            value={state.gender}
            onChange={(g) => dispatch({ type: 'set_gender', gender: g })}
          />
        )}
        {steps[stepIndex] === 'age' && (
          <AgeStep
            accentColor={accentColor}
            value={state.age}
            onChange={(n) => dispatch({ type: 'set_age', age: n })}
          />
        )}
        {steps[stepIndex] === 'currentWeight' && (
          <WeightRuler
            accentColor={accentColor}
            unit={state.unit}
            value={state.currentWeight ?? 70}
            onChange={(v) => dispatch({ type: 'set_current_weight', value: v })}
          />
        )}
        {steps[stepIndex] === 'goalWeight' && (
          <WeightRuler
            accentColor={accentColor}
            unit={state.unit}
            value={state.goalWeight ?? 70}
            onChange={(v) => dispatch({ type: 'set_goal_weight', value: v })}
          />
        )}
        {steps[stepIndex] === 'unit' && (
          <UnitStep
            accentColor={accentColor}
            value={state.unit}
            onChange={(u) => dispatch({ type: 'set_unit', unit: u })}
          />
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <HeaderPager steps={steps} progress={progress} />
      </View>

      <View style={{ flex: 1, overflow: 'hidden' }}>
        {steps.map((_, i) => renderStep(i))}
      </View>

      <View style={styles.footer}>
        <Pressable onPress={goPrev} style={[styles.backBtn]}>
          <Text style={styles.backArrow}>{I18nManager.isRTL ? '→' : '←'}</Text>
        </Pressable>

        <Pressable
          disabled={!canProceed}
          onPress={goNext}
          style={({ pressed }) => [
            styles.nextBtn,
            { backgroundColor: canProceed ? accentColor : '#3F3F46', opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={styles.nextText}>{index === steps.length - 1 ? 'Finish' : nextLabel}</Text>
          <Text style={styles.nextArrow}>{I18nManager.isRTL ? '←' : '→'}</Text>
        </Pressable>
      </View>

      <ProgressDots count={steps.length} current={index} accentColor={accentColor} />
    </View>
  );
}

// ---- Header Pager (animates the question/title too) ----
function HeaderPager({ steps, progress }: { steps: Array<'gender' | 'age' | 'currentWeight' | 'goalWeight' | 'unit'>; progress: Animated.Value }) {
  const renderHeader = (i: number) => {
    const translate = Animated.subtract(Animated.multiply(progress, 1), i);
    const tx = translate.interpolate({ inputRange: [-1, 0, 1], outputRange: [20, 0, -20] });
    const opacity = translate.interpolate({ inputRange: [-1, -0.6, 0, 0.6, 1], outputRange: [0, 0.6, 1, 0.6, 0] });

    const title = (() => {
      switch (steps[i]) {
        case 'gender':
          return 'Tell us about yourself!';
        case 'age':
          return 'How old are you?';
        case 'currentWeight':
          return "What's your weight?";
        case 'goalWeight':
          return "What's your goal weight?";
        case 'unit':
          return "What's your weight unit?";
      }
    })();

    const subtitle = (() => {
      switch (steps[i]) {
        case 'gender':
          return 'To give you a better experience we need to know your gender';
        case 'age':
          return 'This helps us create your personalized plan';
        case 'currentWeight':
          return 'You can always change this later';
        case 'goalWeight':
          return 'We will tailor a plan to your goal';
        case 'unit':
          return 'Choose how you prefer to see your weight';
      }
    })();

    return (
      <Animated.View key={`h-${i}`} style={{ position: 'absolute', left: 0, right: 0, transform: [{ translateX: tx }], opacity }}>
        <Text style={styles.h1}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={{ height: 72, justifyContent: 'center' }}>
      {steps.map((_, i) => renderHeader(i))}
    </View>
  );
}

// ---- Gender Step ----
function GenderStep({
  value,
  onChange,
  accentColor,
}: {
  value: Gender;
  onChange: (g: Gender) => void;
  accentColor: string;
}) {
  const scaleMale = useRef(new Animated.Value(value === 'male' ? 1 : 0)).current;
  const scaleFemale = useRef(new Animated.Value(value === 'female' ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleMale, { toValue: value === 'male' ? 1 : 0, useNativeDriver: true }).start();
    Animated.spring(scaleFemale, { toValue: value === 'female' ? 1 : 0, useNativeDriver: true }).start();
  }, [value]);

  const Item = (
    { label, selected, onPress, symbol, scale }:
      { label: string; selected: boolean; onPress: () => void; symbol: string; scale: Animated.Value }
  ) => (
    <Pressable onPress={onPress} style={{ alignItems: 'center', marginVertical: 12 }}>
      <Animated.View
        style={{
          width: 160,
          height: 160,
          borderRadius: 160,
          backgroundColor: selected ? accentColor : '#2D2D2D',
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: scale.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }],
        }}
      >
        <Text style={{ fontSize: 56, color: 'white' }}>{symbol}</Text>
      </Animated.View>
      <Text style={{ color: '#E5E7EB', marginTop: 10, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ alignItems: 'center', marginTop: 8 }}>
      <Item
        label="Male"
        symbol="♂"
        selected={value === 'male'}
        onPress={() => onChange('male')}
        scale={scaleMale}
      />
      <Item
        label="Female"
        symbol="♀"
        selected={value === 'female'}
        onPress={() => onChange('female')}
        scale={scaleFemale}
      />
    </View>
  );
}

// ---- Step Header (always visible with each slide) ----
function StepHeader({ step }: { step: 'gender' | 'age' | 'currentWeight' | 'goalWeight' | 'unit' }) {
  const title = (() => {
    switch (step) {
      case 'gender': return 'Tell us about yourself!';
      case 'age': return 'How old are you?';
      case 'currentWeight': return "What's your weight?";
      case 'goalWeight': return "What's your goal weight?";
      case 'unit': return "What's your weight unit?";
    }
  })();

  const subtitle = (() => {
    switch (step) {
      case 'gender': return 'To give you a better experience we need to know your gender';
      case 'age': return 'This helps us create your personalized plan';
      case 'currentWeight': return 'You can always change this later';
      case 'goalWeight': return 'We will tailor a plan to your goal';
      case 'unit': return 'Choose how you prefer to see your weight';
    }
  })();

  return (
    <View style={{ alignItems: 'center', marginBottom: 20 }}>
      <Text style={styles.h1}>{title}</Text>
      <Text style={styles.sub}>{subtitle}</Text>
    </View>
  );
}

// ---- Age Step (Wheel) ----
function AgeStep({ value, onChange, accentColor }: { value: number | null; onChange: (n: number) => void; accentColor: string }) {
  const ages = useMemo(() => Array.from({ length: 83 }, (_, i) => i + 13), []); // 13..95
  const ITEM_H = 44;
  const listRef = useRef<FlatList<number>>(null);

  useEffect(() => {
    if (value != null) {
      const idx = ages.indexOf(value);
      if (idx >= 0) setTimeout(() => listRef.current?.scrollToIndex({ index: idx, animated: false }), 0);
    }
  }, []);

  const onMomentumEnd = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ITEM_H);
    const selected = ages[clamp(idx, 0, ages.length - 1)];
    onChange(selected);
  };

  const renderItem = ({ item }: { item: number }) => (
    <View style={{ height: ITEM_H, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#9CA3AF', fontSize: 18 }}>{item}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ height: 220, width: '100%' }}>
        <FlatList
          ref={listRef}
          data={ages}
          keyExtractor={(i) => String(i)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_H}
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumEnd}
          contentContainerStyle={{ paddingVertical: 88 }}
          getItemLayout={(_, i) => ({ index: i, length: ITEM_H, offset: ITEM_H * i })}
        />
        <View style={{ position: 'absolute', left: 24, right: 24, top: 88, height: ITEM_H, borderTopWidth: 2, borderBottomWidth: 2, borderColor: accentColor }} />
      </View>
      <Text style={{ color: 'white', fontSize: 24, marginTop: 16 }}>{value ?? '--'}</Text>
    </View>
  );
}

// ---- Weight Ruler (smooth, scroll-based with snapping) ----
function WeightRuler({
  unit,
  value,
  onChange,
  accentColor,
}: {
  unit: WeightUnit;
  value: number;
  onChange: (n: number) => void;
  accentColor: string;
}) {
  // unit precision & ranges
  const step = unit === 'kg' ? 1 : 0.5;
  const minKg = KG_MIN;
  const maxKg = KG_MAX;
  const min = convert.fromKg(minKg, unit);
  const max = convert.fromKg(maxKg, unit);

  const pxPerUnit = 14; // density of ticks
  const majorEvery = unit === 'kg' ? 10 : 5; // major label spacing in unit

  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<any>(null);

  // map value -> offset so the chosen value is centered
  const totalUnits = Math.round((max - min) / step);
  const snap = pxPerUnit * step;
  const startOffset = (value - min) * pxPerUnit;

  useEffect(() => {
    // jump to initial without flash
    setTimeout(() => listRef.current?.scrollTo({ x: startOffset, animated: false }), 0);
  }, []);

  const onEnd = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const snapped = Math.round(x / snap) * snap;
    listRef.current?.scrollTo({ x: snapped, animated: true });
    const next = min + snapped / pxPerUnit;
    const rounded = unit === 'kg' ? Math.round(next) : Math.round(next * 2) / 2; // 0.5 for lbs/st
    onChange(rounded);
  };

  // read current value for display
  const valueFromScroll = Animated.divide(scrollX, pxPerUnit);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Animated.Text style={{ color: 'white', fontSize: 56, marginTop: 8 }}>
        {/** we won't animate the Text with derived value here; display props value for stability */}
        {convert.format(value, unit)} <Text style={{ fontSize: 18, color: '#9CA3AF' }}>{unit}</Text>
      </Animated.Text>

      <View style={{ height: 160, width: '100%', justifyContent: 'flex-end' }}>
        <Animated.ScrollView
          ref={listRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={snap}
          onMomentumScrollEnd={onEnd}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {Array.from({ length: totalUnits + 1 }).map((_, i) => {
            const unitValue = min + i * step;
            const isMajor = Math.round(unitValue) % majorEvery === 0;
            const isMid = Math.round((unitValue * 10) % (majorEvery * 10 / 2)) === 0 && !isMajor; // halfway
            const h = isMajor ? 60 : isMid ? 40 : 24;
            return (
              <View key={i} style={{ width: pxPerUnit * step, alignItems: 'center' }}>
                <View style={{ width: 2, height: h, backgroundColor: isMajor ? accentColor : '#6B7280', borderRadius: 1 }} />
                {isMajor && (
                  <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 6 }}>{unit === 'kg' ? Math.round(unitValue) : unitValue.toFixed(1)}</Text>
                )}
              </View>
            );
          })}
        </Animated.ScrollView>
        {/* center marker */}
        <View style={{ position: 'absolute', left: '50%', marginLeft: -1, bottom: 0, width: 2, height: 80, backgroundColor: accentColor }} />
      </View>
      <Text style={{ color: '#9CA3AF', marginTop: 8 }}>Swipe the ruler to adjust</Text>
    </View>
  );
}

// ---- Unit Step ----
function UnitStep({ value, onChange, accentColor }: { value: WeightUnit; onChange: (u: WeightUnit) => void; accentColor: string }) {
  const items: WeightUnit[] = ['kg', 'lbs', 'st'];
  return (
    <View style={{ alignItems: 'center', marginTop: 24 }}>
      <View style={{ flexDirection: 'row', backgroundColor: '#2D2D2D', borderRadius: 999, padding: 6 }}>
        {items.map((u) => (
          <Pressable
            key={u}
            onPress={() => onChange(u)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 22,
              borderRadius: 999,
              backgroundColor: value === u ? accentColor : 'transparent',
              marginHorizontal: 4,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>{u.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ---- Progress Dots ----
function ProgressDots({ count, current, accentColor }: { count: number; current: number; accentColor: string }) {
  return (
    <View style={{ position: 'absolute', bottom: 24, alignSelf: 'center', flexDirection: 'row' }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 22 : 8,
            height: 8,
            marginHorizontal: 4,
            borderRadius: 8,
            backgroundColor: i === current ? accentColor : '#3F3F46',
          }}
        />
      ))}
    </View>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  header: { alignItems: 'center', marginBottom: 12 },
  h1: { color: 'white', fontSize: 28, fontWeight: '700', textAlign: 'center' },
  sub: { color: '#9CA3AF', textAlign: 'center', marginTop: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 18 },
  backBtn: {
    width: 56,
    height: 56,
    borderRadius: 40,
    backgroundColor: '#2D2D2D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { color: 'white', fontSize: 20 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    height: 56,
    borderRadius: 40,
  },
  nextText: { color: 'white', fontSize: 16, fontWeight: '600', marginRight: 8 },
  nextArrow: { color: 'white', fontSize: 18 },
});

// ---- Usage (example):
// <FitnessOnboardingWizard
//   onComplete={(values) => {
//     // send to API
//     console.log(values);
//   }}
// />
