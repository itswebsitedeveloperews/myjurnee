// DropdownPicker.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    Pressable,
    StyleSheet,
    GestureResponderEvent,
    ImageSource,
} from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import FastImage from 'react-native-fast-image';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Option = { id: string | number; label: string; value: any };

type Props = {
    label?: string;                 // left label ("Male" in screenshot)
    valueLabel?: string;            // text to show as selected
    icon?: any;              // icon (MaterialCommunityIcons) at left
    options?: Option[];             // list of options for modal
    onSelect?: (option: Option) => void;
    placeholder?: string;
    disabled?: boolean;
    containerStyle?: object;
    borderColor?: string;
    backgroundColor?: string;
};

const DEFAULT_COLORS = {
    border: COLORS.textColor64, // COLORS.textColor64 equivalent
    white: COLORS.white,
    iconBg: '#F1F5F9',
    text: '#111827',
    muted: '#6B7280',
};

export default function DropdownPicker({
    label,
    valueLabel,
    icon,
    options = [],
    onSelect,
    placeholder = 'Select',
    disabled = false,
    containerStyle = {},
    borderColor = DEFAULT_COLORS.border,
    backgroundColor = DEFAULT_COLORS.white,
}: Props) {
    const [open, setOpen] = useState(false);

    function handlePress(e?: GestureResponderEvent) {
        if (disabled) return;
        setOpen(true);
    }

    function handleSelect(option: Option) {
        setOpen(false);
        onSelect?.(option);
    }

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePress}
                style={[
                    styles.container,
                    { borderColor, backgroundColor },
                    containerStyle,
                    disabled && styles.disabled,
                ]}
                accessibilityRole="button"
                accessibilityState={{ disabled }}
            >
                <View style={styles.left}>
                    <View style={styles.iconCircle}>
                        <FastImage source={icon} style={{ height: 24, width: 24 }} />
                    </View>
                    <Text style={styles.labelText}>{valueLabel ?? placeholder}</Text>
                </View>

                <View style={styles.right}>
                    {/* <Text
                        style={[styles.valueText, !valueLabel && styles.placeholderText]}
                        numberOfLines={1}
                    >
                        {valueLabel ?? placeholder}
                    </Text> */}

                    <FastImage source={IMAGES.IC_DOWN_CHEVRON} style={{ height: 12, width: 12 }} resizeMode='contain' />
                </View>
            </TouchableOpacity>

            {/* Simple modal for selection */}
            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => (
                                <Pressable
                                    android_ripple={{ color: '#eee' }}
                                    style={styles.optionRow}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </Pressable>
                            )}
                            ListEmptyComponent={
                                <View style={styles.optionRow}>
                                    <Text style={[styles.optionText, styles.placeholderText]}>
                                        No options
                                    </Text>
                                </View>
                            }
                        />
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 56,                 // matches your existing field
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        justifyContent: 'space-between',
        // shadow / elevation if desired:
        // elevation: 1,
        // shadowColor: '#00000010',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 32,
        height: 32,
        // borderRadius: 16,
        // backgroundColor: DEFAULT_COLORS.iconBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    labelText: {
        fontSize: 14,
        color: DEFAULT_COLORS.text,
        fontFamily: FONTS.BROTHER_1816_REGULAR
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '55%',
        justifyContent: 'flex-end',
    },
    valueText: {
        fontSize: 15,
        color: DEFAULT_COLORS.text,
        marginRight: 8,
        textAlign: 'right',
    },
    placeholderText: {
        color: DEFAULT_COLORS.muted,
    },
    chevron: {
        marginLeft: 2,
    },

    /* Modal styles */
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000055',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        maxHeight: '60%',
        overflow: 'hidden',
    },
    optionRow: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    optionText: {
        fontSize: 16,
        color: DEFAULT_COLORS.text,
    },

    disabled: {
        opacity: 0.6,
    },
});
