import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Dimensions,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

const { width, height } = Dimensions.get('window');

const SetGoalWeightModal = ({ isVisible, onClose, onSubmit, weightType = 'lbs' }) => {
    const [goalWeight, setGoalWeight] = useState('');

    const handleSubmit = () => {
        // Check if user has entered weight
        const hasWeight = goalWeight.trim() && !isNaN(parseFloat(goalWeight)) && parseFloat(goalWeight) > 0;

        if (!hasWeight) {
            Alert.alert('Error', 'Please enter your goal weight');
            return;
        }

        // Validate weight if provided
        if (hasWeight) {
            const weightValue = parseFloat(goalWeight);
            if (weightValue < 20 || weightValue > 500) {
                Alert.alert('Error', 'Please enter a weight between 20 and 500 kg');
                return;
            }
        }

        const data = {
            weight: hasWeight ? parseFloat(goalWeight) : null,
        };

        onSubmit(data);
        handleClose();
    };

    const handleClose = () => {
        setGoalWeight('');
        onClose();
    };


    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={handleClose}
            onBackButtonPress={handleClose}
            style={styles.modal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
        >
            <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.header}>

                    <Text style={styles.headerTitle}>Set Goal Weight</Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Weight and Date Input Section */}
                    <View style={styles.inputSection}>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputLabel}>Weight</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={goalWeight}
                                    onChangeText={setGoalWeight}
                                    placeholder={`0.0 ${weightType}`}
                                    placeholderTextColor={COLORS.textColor44}
                                    keyboardType="numeric"
                                />
                                <View style={styles.inputUnderline} />
                            </View>
                        </View>

                    </View>


                    {/* Update Button */}
                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            (goalWeight.trim()) ? styles.updateButtonEnabled : styles.updateButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!goalWeight.trim()}
                    >
                        <Text style={[
                            styles.updateButtonText,
                            (goalWeight.trim()) ? styles.updateButtonTextEnabled : styles.updateButtonTextDisabled
                        ]}>Set Goal Weight</Text>
                    </TouchableOpacity>
                </ScrollView>

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 0,
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        height: height * 0.4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.pr_background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.textColor,
        marginLeft: 40,
        textAlign: 'center',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.textColor14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: COLORS.textColor,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    inputSection: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputRow: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.textColor,
        marginBottom: 8,
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor,
        paddingVertical: 12,
        paddingHorizontal: 0,
    },
    dateInput: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor,
        paddingVertical: 12,
        paddingHorizontal: 0,
    },
    inputUnderline: {
        height: 1,
        backgroundColor: COLORS.textColor14,
        marginTop: 4,
    },
    updateButton: {
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    updateButtonEnabled: {
        backgroundColor: COLORS.purple,
    },
    updateButtonDisabled: {
        backgroundColor: COLORS.textColor14,
    },
    updateButtonText: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_BOLD,
    },
    updateButtonTextEnabled: {
        color: COLORS.white,
    },
    updateButtonTextDisabled: {
        color: COLORS.textColor44,
    },

});

export default SetGoalWeightModal;
