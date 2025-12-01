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
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AnimatedReanimated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { FONTS } from '../../Common/Constants/fonts';
import { COLORS } from '../../Common/Constants/colors';
import BoxCarousel from './BoxCarousel';
import FastImage from 'react-native-fast-image';
import { IMAGES } from '../../Common/Constants/images';
import { setUserFitnessDetails } from '../../api/profileApi';
import { localStorageHelper, StorageKeys } from '../../Common/localStorageHelper';

const AnimatedFlatList = AnimatedReanimated.createAnimatedComponent(FlatList<number>);

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
  /** Optional: screen name to navigate to after completion (default: 'Login') */
  navigateToAfterComplete?: string;
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
  let newState: FitnessOnboardingValues;
  switch (action.type) {
    case 'set_gender':
      newState = { ...state, gender: action.gender };
      console.log('Reducer - set_gender:', action.gender, '->', newState);
      return newState;
    case 'set_age':
      newState = { ...state, age: action.age };
      console.log('Reducer - set_age:', action.age, '->', newState);
      return newState;
    case 'set_current_weight':
      newState = { ...state, currentWeight: action.value };
      console.log('Reducer - set_current_weight:', action.value, '->', newState);
      return newState;
    case 'set_goal_weight':
      newState = { ...state, goalWeight: action.value };
      console.log('Reducer - set_goal_weight:', action.value, '->', newState);
      return newState;
    case 'set_unit':
      // Convert existing weight values from old unit to new unit
      const oldUnit = state.unit;
      const newUnit = action.unit;

      // Convert currentWeight if it exists
      let convertedCurrentWeight = state.currentWeight;
      if (convertedCurrentWeight !== null) {
        // First convert to kg, then to new unit
        const weightInKg = convert.toKg(convertedCurrentWeight, oldUnit);
        convertedCurrentWeight = convert.fromKg(weightInKg, newUnit);
        // Round to match the step size in the weight array (1 for kg, 0.5 for lbs/st)
        if (newUnit === 'kg') {
          convertedCurrentWeight = Math.round(convertedCurrentWeight);
        } else {
          // Round to nearest 0.5 for lbs and st
          convertedCurrentWeight = Math.round(convertedCurrentWeight * 2) / 2;
        }
      }

      // Convert goalWeight if it exists
      let convertedGoalWeight = state.goalWeight;
      if (convertedGoalWeight !== null) {
        // First convert to kg, then to new unit
        const weightInKg = convert.toKg(convertedGoalWeight, oldUnit);
        convertedGoalWeight = convert.fromKg(weightInKg, newUnit);
        // Round to match the step size in the weight array (1 for kg, 0.5 for lbs/st)
        if (newUnit === 'kg') {
          convertedGoalWeight = Math.round(convertedGoalWeight);
        } else {
          // Round to nearest 0.5 for lbs and st
          convertedGoalWeight = Math.round(convertedGoalWeight * 2) / 2;
        }
      }

      newState = {
        ...state,
        unit: newUnit,
        currentWeight: convertedCurrentWeight,
        goalWeight: convertedGoalWeight,
      };
      console.log('Reducer - set_unit:', {
        oldUnit,
        newUnit,
        oldCurrentWeight: state.currentWeight,
        newCurrentWeight: convertedCurrentWeight,
        oldGoalWeight: state.goalWeight,
        newGoalWeight: convertedGoalWeight,
        newState,
      });
      return newState;
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
  accentColor = COLORS.purple,
  onComplete,
  onClose,
  initialValues: init,
  nextLabel = 'Next',
  navigateToAfterComplete: navigateToProp = 'Login',
}: FitnessOnboardingWizardProps) {
  const navigation = useNavigation();
  const route = useRoute();
  // Get navigateToAfterComplete from route params or props (route params take precedence)
  const navigateToAfterComplete = (route.params as any)?.navigateToAfterComplete || navigateToProp;
  const [state, dispatch] = useReducer(reducer, { ...initialState, ...init });
  const steps: Array<'gender' | 'age' | 'currentWeight' | 'goalWeight'> = useMemo(
    () => ['gender', 'age', 'currentWeight', 'goalWeight'],
    []
  );

  // Simple step navigation without animations for better performance
  const [index, setIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goNext = useCallback(() => {
    if (index < steps.length - 1) {
      setIndex(index + 1);
    } else {
      // Finish - submit data to API
      if (isSubmitting) return; // Prevent multiple submissions

      setIsSubmitting(true);

      // Log all selected values when user finishes
      console.log('=== Fitness Onboarding Completed ===');
      console.log('Selected Values:', {
        gender: state.gender,
        age: state.age,
        currentWeight: state.currentWeight,
        goalWeight: state.goalWeight,
        unit: state.unit,
      });
      console.log('Full State:', state);
      console.log('===================================');

      // Get user_id from storage and call API
      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(userId => {
          if (!userId) {
            console.error('User ID not found');
            setIsSubmitting(false);
            // Navigate to specified screen even if user_id is not found
            if (navigateToAfterComplete === 'Home') {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                (navigation as any).navigate('DashboardBottomTab');
              }
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: navigateToAfterComplete }],
                })
              );
            }
            return;
          }

          // Call API to save user fitness details
          setUserFitnessDetails(
            userId,
            state.gender || '',
            state.age || 0,
            state.currentWeight || 0,
            state.unit || 'kg',
            state.goalWeight || 0,
            state.unit || 'kg'
          )
            .then(response => {
              console.log('User fitness details saved successfully:', response);
              setIsSubmitting(false);
              // Navigate to specified screen after successful API call
              if (navigateToAfterComplete === 'Home') {
                // Navigate back to DashboardBottomTab (which shows Home tab)
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  // Fallback: navigate to DashboardBottomTab
                  (navigation as any).navigate('DashboardBottomTab');
                }
              } else {
                // Otherwise, reset navigation stack to the specified screen
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: navigateToAfterComplete }],
                  })
                );
              }
            })
            .catch(error => {
              console.error('Error saving user fitness details:', error);
              setIsSubmitting(false);
              // Still navigate even if API fails
              if (navigateToAfterComplete === 'Home') {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  (navigation as any).navigate('DashboardBottomTab');
                }
              } else {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: navigateToAfterComplete }],
                  })
                );
              }
            });
        })
        .catch(error => {
          console.error('Error getting user ID:', error);
          setIsSubmitting(false);
          // Navigate to specified screen even if there's an error
          if (navigateToAfterComplete === 'Home') {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              (navigation as any).navigate('DashboardBottomTab');
            }
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: navigateToAfterComplete }],
              })
            );
          }
        });
    }
  }, [index, steps.length, state, isSubmitting, navigation, navigateToAfterComplete]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    } else onClose?.();
  }, [index, onClose]);

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
    }
  }, [state, index, steps]);

  // Render only the current step for better performance
  const renderCurrentStep = useCallback(() => {
    const currentStep = steps[index];
    return (
      <View key={index} style={{ flex: 1, }}>
        {/* <StepHeader step={currentStep} /> */}
        {currentStep === 'gender' && (
          <GenderStep
            accentColor={accentColor}
            value={state.gender}
            onChange={(g) => dispatch({ type: 'set_gender', gender: g })}
          />
        )}
        {currentStep === 'age' && (
          <AgeStep
            accentColor={accentColor}
            value={state.age}
            onChange={(n) => dispatch({ type: 'set_age', age: n })}
          />
        )}
        {currentStep === 'currentWeight' && (
          <WeightStep
            accentColor={accentColor}
            unit={state.unit}
            value={state.currentWeight}
            onChange={(v) => dispatch({ type: 'set_current_weight', value: v })}
            onUnitChange={(u) => dispatch({ type: 'set_unit', unit: u })}
            title="Your Current Weight?"
          />
        )}
        {currentStep === 'goalWeight' && (
          <WeightStep
            accentColor={accentColor}
            unit={state.unit}
            value={state.goalWeight}
            onChange={(v) => dispatch({ type: 'set_goal_weight', value: v })}
            onUnitChange={(u) => dispatch({ type: 'set_unit', unit: u })}
            title="Your Goal Weight?"
          />
        )}
      </View>
    );
  }, [index, steps, accentColor, state]);

  return (
    <SafeAreaView style={[styles.container]}>
      {/* Only show back button if not on first step (Gender) */}
      {index > 0 && (
        <View style={styles.backButtonContainer}>
          <Pressable onPress={goPrev} style={[styles.backBtn]}>
            <Text style={styles.backArrow}>{I18nManager.isRTL ? '→' : '←'}</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.header}>
        <StepHeader step={steps[index]} />
      </View>

      <View style={{ flex: 1, }}>
        {renderCurrentStep()}
      </View>

      <View style={styles.footer}>


        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!canProceed || isSubmitting}
          onPress={goNext}
          style={[
            styles.nextBtn,
            // { backgroundColor: accentColor },
            { backgroundColor: canProceed && !isSubmitting ? accentColor : '#3F3F46', },
          ]}
        >
          <Text style={styles.nextText}>
            {isSubmitting
              ? 'Saving...'
              : index === steps.length - 1
                ? 'Finish'
                : nextLabel}
          </Text>
          {/* <Text style={styles.nextArrow}>{I18nManager.isRTL ? '←' : '→'}</Text> */}
        </TouchableOpacity>
      </View>

      {/* <ProgressDots count={steps.length} current={index} accentColor={accentColor} /> */}
    </SafeAreaView>
  );
}

// Removed HeaderPager - using static header for better performance

// ---- Gender Step ---- (Optimized with React.memo)
const GenderStep = React.memo(({
  value,
  onChange,
  accentColor,
}: {
  value: Gender;
  onChange: (g: Gender) => void;
  accentColor: string;
}) => {
  return (
    <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 40 }}>
      <Pressable
        onPress={() => onChange('male')}
        style={{ marginVertical: 12, width: '100%' }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            height: 82,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: accentColor,
            backgroundColor: value === 'male' ? accentColor : 'transparent',
          }}
        >
          <Text style={{ color: value === 'male' ? COLORS.white : COLORS.black, fontSize: 16, fontFamily: FONTS.URBANIST_REGULAR }}>
            Male
          </Text>
          {/* <Text style={{ fontSize: 40 }}>👨</Text> */}
          <FastImage
            source={IMAGES.IC_MALE}
            style={{ width: 46, height: 46 }}
            resizeMode="contain"
          />
        </View>
      </Pressable>

      <Pressable
        onPress={() => onChange('female')}
        style={{ marginVertical: 12, width: '100%' }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            height: 82,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: accentColor,
            backgroundColor: value === 'female' ? accentColor : 'transparent',
          }}
        >
          <Text style={{ color: value === 'female' ? COLORS.white : COLORS.black, fontSize: 16, fontFamily: FONTS.URBANIST_REGULAR }}>
            Female
          </Text>
          <FastImage
            source={IMAGES.IC_FEMALE}
            style={{ width: 46, height: 46 }}
            resizeMode="contain"
          />
        </View>
      </Pressable>
    </View>
  );
});

// ---- Step Header (Optimized with React.memo) ----
const StepHeader = React.memo(({ step }: { step: 'gender' | 'age' | 'currentWeight' | 'goalWeight' }) => {
  const title = (() => {
    switch (step) {
      case 'gender': return 'What Is Your';
      case 'age': return 'What Is Your';
      case 'currentWeight': return 'Your Current';
      case 'goalWeight': return 'Your Goal';
    }
  })();

  const titleQue = (() => {
    switch (step) {
      case 'gender': return 'Gender?';
      case 'age': return 'Age?';
      case 'currentWeight': return 'Weight?';
      case 'goalWeight': return 'Weight?';
    }
  })();

  const subtitle = (() => {
    switch (step) {
      case 'gender': return `Please Specify Your Gender For\nPersonalized Assistance.`;
      case 'age': return `Please Specify Your Age For\nPersonalized Assistance.`;
      case 'currentWeight': return `We'll Utilize This Data To Personalize\nA Diet Plan That Suits You Best.`;
      case 'goalWeight': return `We'll Utilize This Data To Personalize\nA Diet Plan That Suits You Best.`;
    }
  })();

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.h1}>{title} <Text style={{ color: COLORS.purple }}>{titleQue}</Text></Text>
      <Text style={styles.sub}>{subtitle}</Text>
    </View>
  );
});

// ---- Age Step (Horizontal Picker with Scaling) ----
function AgeStep({ value, onChange, accentColor }: { value: number | null; onChange: (n: number) => void; accentColor: string }) {
  const ages = useMemo(() => Array.from({ length: 83 }, (_, i) => ({ id: i + 13, text: String(i + 13) })), []);

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 40 }}>
      <BoxCarousel data={ages} onChange={onChange} value={value} />
    </View>
  );
}

// ---- Age Item Component ----
function AgeItem({ index, item, transX, accentColor, isSelected }: { index: number; item: number; transX: any; accentColor: string; isSelected: boolean }) {
  const ITEM_WIDTH = 80;
  const udv = useDerivedValue(() => {
    if (transX.value >= (index - 3) * ITEM_WIDTH && transX.value <= (index + 3) * ITEM_WIDTH) {
      return transX.value;
    } else if (transX.value < (index - 3) * ITEM_WIDTH) {
      return null;
    } else if (transX.value > (index + 3) * ITEM_WIDTH) {
      return null;
    }
    return null;
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityAnimation(udv, index, ITEM_WIDTH),
      transform: [
        {
          scale: scaleAnimation(udv, index, ITEM_WIDTH),
        },
      ],
    };
  });

  return (
    <AnimatedReanimated.View
      style={[
        {
          width: ITEM_WIDTH,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          backgroundColor: isSelected ? accentColor : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '600' }}>{item}</Text>
      </View>
    </AnimatedReanimated.View>
  );
}

const scaleAnimation = (udv: any, index: number, itemWidth: number) => {
  'worklet';
  return udv.value === null
    ? 0.7
    : interpolate(
      udv.value,
      [
        (index - 2) * itemWidth,
        (index - 1) * itemWidth,
        index * itemWidth,
        (index + 1) * itemWidth,
        (index + 2) * itemWidth,
      ],
      [0.7, 0.85, 1.0, 0.85, 0.7],
      Extrapolate.CLAMP,
    );
};

const opacityAnimation = (udv: any, index: number, itemWidth: number) => {
  'worklet';
  return udv.value === null
    ? 0.5
    : interpolate(
      udv.value,
      [
        (index - 3) * itemWidth,
        (index - 2) * itemWidth,
        (index - 1) * itemWidth,
        index * itemWidth,
        (index + 1) * itemWidth,
        (index + 2) * itemWidth,
        (index + 3) * itemWidth,
      ],
      [0, 0.5, 0.8, 1, 0.8, 0.5, 0],
      Extrapolate.CLAMP,
    );
};

// ---- Weight Step (with Unit Selector and Horizontal Picker) ----
function WeightStep({
  unit,
  value,
  onChange,
  onUnitChange,
  accentColor,
  title,
}: {
  unit: WeightUnit;
  value: number | null;
  onChange: (n: number) => void;
  onUnitChange: (u: WeightUnit) => void;
  accentColor: string;
  title: string;
}) {
  // Generate weight values based on unit - format to match age data structure
  const weights = useMemo(() => {
    const minKg = KG_MIN;
    const maxKg = KG_MAX;
    const min = convert.fromKg(minKg, unit);
    const max = convert.fromKg(maxKg, unit);
    const step = unit === 'kg' ? 1 : 0.5;
    const values: Array<{ id: number; text: string }> = [];
    for (let w = min; w <= max; w += step) {
      const roundedValue = Math.round(w * (unit === 'kg' ? 1 : 2)) / (unit === 'kg' ? 1 : 2);
      // Format text based on unit: kg shows whole numbers, lbs/st show decimals
      const text = unit === 'kg' ? String(Math.round(roundedValue)) : roundedValue.toFixed(1);
      values.push({ id: roundedValue, text });
    }
    return values;
  }, [unit]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
      {/* Unit Selector */}
      <View style={{ flexDirection: 'row', marginBottom: 40, backgroundColor: COLORS.bg_color, borderRadius: 10, borderColor: COLORS.purple, borderWidth: 1.5, padding: 6 }}>
        {(['kg', 'lbs'] as WeightUnit[]).map((u) => (
          <Pressable
            key={u}
            onPress={() => onUnitChange(u)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 22,
              borderRadius: 10,
              backgroundColor: unit === u ? accentColor : 'transparent',
              marginHorizontal: 4,
            }}
          >
            <Text style={{ fontSize: 16, fontFamily: FONTS.URBANIST_REGULAR, color: unit === u ? COLORS.white : COLORS.black }}>{u.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>

      <BoxCarousel data={weights} onChange={onChange} value={value} />
    </View>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg_color,
  },
  header: { alignItems: 'center', marginBottom: 12, marginTop: 50 },
  h1: { fontSize: 24, fontFamily: FONTS.URBANIST_BOLD, color: COLORS.black, textAlign: 'center' },
  sub: { color: COLORS.black, textAlign: 'center', fontFamily: FONTS.URBANIST_REGULAR, fontSize: 14, marginTop: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 18 },
  backButtonContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { color: COLORS.black, fontSize: 25 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 80,
    height: 60,
    borderRadius: 10,
  },
  nextText: { color: 'white', fontSize: 16, fontFamily: FONTS.URBANIST_MEDIUM, },
  nextArrow: { color: 'white', fontSize: 18 },
});

// ---- Usage (example):
// <FitnessOnboardingWizard
//   onComplete={(values) => {
//     // send to API
//     console.log(values);
//   }}
// />

