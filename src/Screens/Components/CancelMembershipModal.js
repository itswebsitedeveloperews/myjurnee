import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

const { width, height } = Dimensions.get('window');

const CancelMembershipModal = ({ isVisible, onClose, onConfirmCancel, membershipName }) => {
    const handleConfirm = () => {
        onConfirmCancel();
        handleClose();
    };

    const handleClose = () => {
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
                    <Text style={styles.headerTitle}>Cancel Membership</Text>
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
                        Are you sure you want to cancel your {membershipName || 'membership'}? This action will cancel your subscription and you will lose access to premium features.
                    </Text>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleClose}
                        >
                            <Text style={styles.cancelButtonText}>No, Keep Membership</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.confirmButtonText}>
                                Cancel Membership
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
        justifyContent: 'center',
        backgroundColor: COLORS.textColor14,
    },
    cancelButtonText: {
        fontSize: 15,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.textColor,
        textAlign: 'center',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.red,
    },
    confirmButtonText: {
        fontSize: 15,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.white,
        textAlign: 'center',
    },
});

export default CancelMembershipModal;

