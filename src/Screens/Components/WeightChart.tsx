// WeightChart.js
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Circle,
  Line,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import * as d3 from "d3-shape";
import { COLORS } from "../../Common/Constants/colors";
import { FONTS } from "../../Common/Constants/fonts";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = Math.min(SCREEN_WIDTH - 32, 360);
const CHART_HEIGHT = 260;
const PADDING = { left: 48, right: 16, top: 24, bottom: 40 }; // bottom increased a bit for inside x-labels

const sampleData = [
  { xLabel: "16", value: 100 },
  { xLabel: "17", value: 92.5 },
  { xLabel: "18", value: '94' },
  { xLabel: "19", value: 91 },
  { xLabel: "20", value: 95 },
  { xLabel: "21", value: 93.5 },
  { xLabel: "22", value: 88 },
];

export default function WeightChart({ data = sampleData, weightGoal = 75, weightType = 'lbs' }) {
  const [selectedIndex, setSelectedIndex] = useState();

  const xScale = (i) =>
    PADDING.left + (i * (CHART_WIDTH - PADDING.left - PADDING.right)) / (data.length - 1);

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, weightGoal) + 8;
  const minVal = 0;

  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const yScale = (val) =>
    PADDING.top + ((maxVal - val) * innerHeight) / (maxVal - minVal);

  const linePath = useMemo(() => {
    const lineGenerator = d3
      .line()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);
    return lineGenerator(data) || "";
  }, [data]);

  const areaPath = useMemo(() => {
    const area = d3
      .area()
      .x((_, i) => xScale(i))
      .y0(CHART_HEIGHT - PADDING.bottom)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);
    return area(data) || "";
  }, [data]);

  const getFormatedValue = (value: string) => {
    if (!value) return '0';
    return value.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
  };

  // Generate dynamic Y tick values based on data - always returns exactly 6 items
  const generateYTicks = (maxValue: number) => {
    // Calculate minimum step size for exactly 6 ticks (5 intervals from 0 to max)
    const rawStep = maxValue / 5;

    // Round step UP to a nice number to ensure we cover maxValue
    let step;
    if (rawStep <= 5) {
      step = 5;
    } else if (rawStep <= 10) {
      step = 10;
    } else if (rawStep <= 20) {
      step = 20;
    } else if (rawStep <= 25) {
      step = 25;
    } else if (rawStep <= 30) {
      step = 30;
    } else if (rawStep <= 40) {
      step = 40;
    } else if (rawStep <= 50) {
      step = 50;
    } else {
      // For larger values, round up to nearest 50
      step = Math.ceil(rawStep / 50) * 50;
    }

    // actualMax is always step * 5 to ensure exactly 6 ticks (0, step, 2*step, 3*step, 4*step, 5*step)
    const actualMax = step * 5;

    // Generate exactly 6 ticks from actualMax down to 0
    const ticks = [];
    for (let i = 5; i >= 0; i--) {
      ticks.push(step * i);
    }

    return ticks;
  };

  // Y tick values (dynamic based on data) - always exactly 6 items
  const yTicks = useMemo(() => generateYTicks(maxVal), [maxVal]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Weight Tracker (${weightType})`}</Text>
      <View style={styles.divider} />
      <View style={styles.legendRow}>

        <View style={styles.bullet} />
        <Text style={styles.legendText}>Selected</Text>
        <View style={{ width: 16 }} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.dashedPreview} />
          <Text style={[styles.legendText, { marginLeft: 6 }]}>Weight Goal</Text>
        </View>
      </View>

      <View style={{ marginTop: 48 }}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Defs>
            <LinearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="30%" stopColor="#e9e9ff" stopOpacity="0.9" />
              <Stop offset="80%" stopColor="#ffffff" stopOpacity="0.15" />
            </LinearGradient>

            <LinearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#bdb8ff" stopOpacity="1" />
              <Stop offset="100%" stopColor="#cfcfff" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* background rounded card */}
          {/* <Rect x={0} y={0} rx={12} width={CHART_WIDTH} height={CHART_HEIGHT} fill="#fff" stroke="#f0f0f5" /> */}

          {/* area fill */}
          <Path d={areaPath} fill="url(#fillGrad)" opacity={0.95} />

          {/* dashed goal line */}
          <Line
            x1={PADDING.left}
            x2={CHART_WIDTH - PADDING.right}
            y1={yScale(weightGoal)}
            y2={yScale(weightGoal)}
            stroke="#000"
            strokeDasharray={[8, 6]}
            strokeWidth={2}
            opacity={0.45}
          />

          {/* line path */}
          <Path
            d={linePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.95}
          />

          {/* points */}
          <G>
            {data.map((d, i) => {
              const cx = xScale(i);
              const cy = yScale(d.value);
              const isSelected = i === selectedIndex;

              return (
                <G key={`pt-${i}`}>
                  <Circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill={isSelected ? "#e8e7ff" : "#fff"}
                    stroke="#cfcfff"
                    strokeWidth={isSelected ? 4 : 3}
                    opacity={isSelected ? 0.95 : 0.95}
                  />
                  <Circle cx={cx} cy={cy} r={isSelected ? 8 : 2} fill={isSelected ? '#cfcfff' : '#fff'} />
                </G>
              );
            })}
          </G>

          {/* Y labels (inside SVG so they align perfectly) */}
          {yTicks.map((v) => (
            <SvgText
              key={`ylabel-${v}`}
              x={12} // left padding inside svg
              y={yScale(v)}
              fontSize={14}
              fill="#777"
              textAnchor="start"
            >
              {String(v)}
            </SvgText>
          ))}

          {/* X labels (inside SVG) */}
          {data.map((d, i) => {
            const cx = xScale(i);
            return (
              <SvgText
                key={`xlabel-${i}`}
                x={cx}
                y={CHART_HEIGHT - 8}
                fontSize={14}
                fill="#666"
                textAnchor="middle"
              >
                {d.xLabel}
              </SvgText>
            );
          })}
        </Svg>

        {/* overlay touchable markers on top of same SVG area */}
        <View
          pointerEvents="box-none"
          style={[StyleSheet.absoluteFill, { width: CHART_WIDTH, height: CHART_HEIGHT }]}
        >
          {data.map((d, i) => {
            const left = xScale(i) - 24; // center the 48px touch box on the marker
            const top = yScale(d.value) - 4; // keep touches aligned with marker
            const isSelected = i === selectedIndex;

            return (
              <TouchableOpacity
                key={`touch-${i}`}
                activeOpacity={0.8}
                onPress={() => setSelectedIndex(i)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={`Weight ${d.value} kilograms on ${d.xLabel}`}
                style={{
                  position: "absolute",
                  left,
                  top,
                  width: 48,
                  height: 48,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
              >
                {/* When selected, render the rounded tooltip box (native View) */}
                {isSelected && (
                  <View style={[styles.roundedTooltip, { transform: [{ translateY: -72 }] }]}>
                    <View style={styles.roundedTooltipBubble}>
                      <Text style={styles.tooltipValue}>{getFormatedValue(d.value)}</Text>
                      {/* <Text style={styles.tooltipUnit}>kg</Text> */}
                    </View>
                  </View>
                )}

                {/* optional tiny press feedback dot inside touch area (keeps visual locality) */}
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "transparent" }} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Removed external axesRow to avoid duplicate spacing */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // margin: 16,
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    // subtle card shadow
    // shadowColor: "#000",
    // shadowOpacity: 0.04,
    // shadowRadius: 8,
    // elevation: 2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.BROTHER_1816_BOLD,
    color: COLORS.black,
    marginBottom: 12,
    marginTop: 10,
    paddingLeft: 10
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.textColor14,
    marginBottom: 12,
    marginHorizontal: 10
  },
  bullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#e8e7ff",
    borderWidth: 2,
    borderColor: "#f7f3ff",
  },
  legendText: {
    color: "#333",
    fontSize: 14,
    marginLeft: 8,
  },
  dashedPreview: {
    width: 36,
    height: 2,
    borderStyle: "dashed",
    borderWidth: 1.6,
    borderColor: "#000",
    opacity: 0.5,
  },
  tooltip: {
    position: "absolute",
    alignItems: "center",
  },
  tooltipBubble: {
    minWidth: 64,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: "#e2defc",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tooltipValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    lineHeight: 20,
  },

  tooltipUnit: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  roundedPointerWrap: {
    width: 40,
    height: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: -2,
    position: "relative",
    // make sure pointer sits above other elements visually
    zIndex: 11,
  },
  tooltipPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
    marginTop: -2,
    transform: [{ rotate: "180deg" }],
  },
  roundedTooltip: {
    position: "absolute",
    alignItems: "center",
    overflow: "visible",        // CRUCIAL: let pointer render outside bubble bounds
    zIndex: 10,
  },
  roundedTooltipBubble: {
    minWidth: 66,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: "#e6defa",    // use same color for pointerOuter border
  },
  pointerOuter: {
    position: "absolute",
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#e6defa",   // same as bubble border color
    alignSelf: "center",
  },

  pointerInner: {
    position: "absolute",
    top: 1.8,                     // tweak slightly for perfect centering
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",       // bubble fill color
    alignSelf: "center",
  },

});
