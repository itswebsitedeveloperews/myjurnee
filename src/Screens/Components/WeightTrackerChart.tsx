import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../Common/Constants/colors';
import { getCurrentWeekDates } from '../../Utils/Utils';

interface WeightTrackerChartProps {
  data: (number | null)[];
  goalWeight?: number;
  selectedIndex?: number;
  onDataPointPress?: (data: any) => void;
}

const WeightTrackerChart: React.FC<WeightTrackerChartProps> = ({
  data,
  goalWeight = 75,
  selectedIndex = 1,
  onDataPointPress,
}) => {
  const [selectedDataPoint, setSelectedDataPoint] = useState(selectedIndex);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Default data matching the image
  const defaultData = {
    labels: getCurrentWeekDates(),
    datasets: [
      {
        data: data || [90, 95, 80, 75, 32, 25, 67],
        color: (opacity = 1) => COLORS.pr_lavender,
        strokeWidth: 3,
      },
    ],
  };

  const chartData = defaultData;

  // console.log('chartData', chartData)

  useEffect(() => {
    const updateDimensions = () => {
      const { width } = Dimensions.get('window');
      setDimensions({ width: width - 80, height: 220 }); // Account for padding
    };

    updateDimensions();
    const subscription = Dimensions.addEventListener('change', updateDimensions);

    return () => subscription?.remove();
  }, []);

  const handleDataPointPress = (data: any) => {
    setSelectedDataPoint(data.index);
    if (onDataPointPress) {
      onDataPointPress(data);
    }
  };

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => COLORS.pr_lavender,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.pr_lavender,
      fill: '#FFFFFF',
    },
    propsForBackgroundLines: {
      strokeDasharray: '5,5',
      stroke: COLORS.pr_lavender,
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500',
    },
    fillShadowGradient: COLORS.pr_lavender,
    fillShadowGradientOpacity: 0.1,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Tracker</Text>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.pr_lavender }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDashedLine} />
          <Text style={styles.legendText}>Weight Goal</Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {dimensions.width > 0 && (
          <LineChart
            data={chartData}
            width={dimensions.width}
            height={dimensions.height}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={true}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            onDataPointClick={handleDataPointPress}
          />
        )}

        {/* Goal Weight Line */}
        {dimensions.height > 0 && (
          <View style={[styles.goalLine, { bottom: (dimensions.height - (goalWeight / 100) * (dimensions.height - 40)) + 20 }]}>
            <View style={styles.goalLineDashed} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16, // More pronounced curve for top-right
    padding: 20,
    marginTop: 20,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendDashedLine: {
    width: 20,
    height: 2,
    backgroundColor: '#6B7280',
    marginRight: 6,
    opacity: 0.7,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  chartContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12, // More pronounced curve for top-right
    padding: 6,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 12,
  },
  selectedDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.pr_lavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callout: {
    position: 'absolute',
    bottom: 25,
    backgroundColor: COLORS.pr_lavender,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  calloutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  calloutUnit: {
    fontSize: 10,
  },
  goalLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 1,
  },
  goalLineDashed: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#6B7280',
    borderStyle: 'dashed',
  },
});

export default WeightTrackerChart;
