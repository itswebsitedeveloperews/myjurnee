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
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

const { width, height } = Dimensions.get('window');

const DeleteAccountModal = ({ isVisible, onClose, onConfirmDelete }) => {
    const [deleteText, setDeleteText] = useState('');

    const handleConfirm = () => {
        if (deleteText.trim().toUpperCase() === 'DELETE') {
            onConfirmDelete();
            handleClose();
        } else {
            Alert.alert(
                'Invalid Input',
                'Please type DELETE to delete your account',
                [{ text: 'OK' }]
            );
        }
    };

    const handleClose = () => {
        setDeleteText('');
        onClose();
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={handleClose}
            onBackButtonPress={handleClose}
            style={styles.modal}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropOpacity={0.5}
            avoidKeyboard={true}
        >
            <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Delete Account</Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.warningText}>
                        This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
                    </Text>

                    <Text style={styles.instructionText}>
                        To confirm, please type <Text style={styles.deleteText}>DELETE</Text> in the box below:
                    </Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={deleteText}
                            onChangeText={setDeleteText}
                            placeholder="Type DELETE here"
                            placeholderTextColor={COLORS.textColor44}
                            autoCapitalize="characters"
                            autoCorrect={false}
                        />
                        <View style={styles.inputUnderline} />
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.deleteButton,
                                deleteText.trim().toUpperCase() === 'DELETE'
                                    ? styles.deleteButtonEnabled
                                    : styles.deleteButtonDisabled
                            ]}
                            onPress={handleConfirm}
                            disabled={deleteText.trim().toUpperCase() !== 'DELETE'}
                        >
                            <Text style={[
                                styles.deleteButtonText,
                                deleteText.trim().toUpperCase() === 'DELETE'
                                    ? styles.deleteButtonTextEnabled
                                    : styles.deleteButtonTextDisabled
                            ]}>
                                Delete Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        maxHeight: height * 0.6,
        width: '100%',
    },
    scrollView: {
        maxHeight: height * 0.5,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
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
        color: COLORS.red,
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
    warningText: {
        fontSize: 14,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor,
        marginBottom: 16,
        lineHeight: 20,
    },
    instructionText: {
        fontSize: 14,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor,
        marginBottom: 12,
        lineHeight: 20,
    },
    deleteText: {
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.red,
    },
    inputContainer: {
        marginBottom: 20,
        marginTop: 8,
    },
    input: {
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: COLORS.textColor14,
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.textColor,
    },
    deleteButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    deleteButtonEnabled: {
        backgroundColor: COLORS.red,
    },
    deleteButtonDisabled: {
        backgroundColor: COLORS.textColor14,
    },
    deleteButtonText: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_BOLD,
    },
    deleteButtonTextEnabled: {
        color: COLORS.white,
    },
    deleteButtonTextDisabled: {
        color: COLORS.textColor44,
    },
});

export default DeleteAccountModal;

