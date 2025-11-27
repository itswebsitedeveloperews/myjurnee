import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { COLORS } from '../../Common/Constants/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import INavBar from '../Components/INavBar'
import FastImage from 'react-native-fast-image'
import { IMAGES } from '../../Common/Constants/images'
import { windowHeight, windowWidth } from '../../Utils/Dimentions'
import SectionHeader from '../Components/SectionHeader'
import ITextField from '../Components/ITextField'
import ITextFieldWithUnit from '../Components/ITextFieldWithUnit'
import DropdownPicker from '../Components/DropdownPicker'
import IButton from '../Components/IButton'

const options = [
    { id: 'm', label: 'Male', value: 'male' },
    { id: 'f', label: 'Female', value: 'female' },
    { id: 'o', label: 'Other', value: 'other' },
];

const EditProfile = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('lbs');
    const [selected, setSelected] = useState(options[0]);
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <INavBar title="Edit Profile" onBackPress={() => props.navigation.goBack()} />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Profile Image */}
                <View style={styles.profileContainer}>
                    <FastImage source={IMAGES.IC_PROFILE} style={styles.profile} />
                </View>

                <SectionHeader title="Full Name" />
                <ITextField
                    placeholder="Enter Full Name"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    // backgroundColor={COLORS.darkGray}
                    placeholderTextColor={COLORS.textColor64}
                    mainViewStyle={styles.inputField}
                />
                <SectionHeader title="Phone" />
                <ITextField
                    placeholder="Enter Phone"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    // backgroundColor={COLORS.darkGray} 
                    placeholderTextColor={COLORS.textColor64}
                    mainViewStyle={styles.inputField}
                />
                <SectionHeader title="Email address" />
                <ITextField
                    placeholder="Enter Email address"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    // backgroundColor={COLORS.darkGray}
                    placeholderTextColor={COLORS.textColor64}
                    mainViewStyle={styles.inputField}
                />
                <SectionHeader title="Weight" />
                <ITextFieldWithUnit
                    value={username}
                    onChangeText={setUsername}
                    showUnitToggle
                    unit={selectedUnit}            // 'kg' or 'lbs'
                    onUnitChange={(u) => setSelectedUnit(u)}
                    placeholder="Enter weight"
                    placeholderTextColor={COLORS.textColor64}
                    mainViewStyle={styles.inputField}
                />

                <SectionHeader title="Gender" />
                <View style={{ paddingHorizontal: 20 }}>
                    <DropdownPicker
                        // label="Gender"
                        valueLabel={selected.label}
                        icon={IMAGES.IC_MALE_BLACK}
                        options={options}
                        onSelect={(opt) => setSelected(opt)}
                    />
                </View>
                <SectionHeader title="Age" />
                <ITextField
                    placeholder="Enter Age"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    // backgroundColor={COLORS.darkGray}
                    placeholderTextColor={COLORS.textColor64}
                    mainViewStyle={styles.inputField}
                />
                <View style={styles.buttonContainer}>
                    <IButton
                        title="Submit"
                        // onPress={onSignupClick}
                        // loading={loading}
                        mainViewStyle={styles.loginButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.bg_color,
    },
    profileContainer: {
        height: 120,
        width: 120,
        borderRadius: 50,
        marginTop: 30,
        alignSelf: 'center'
    },
    profile: {
        height: 120,
        width: 120,
        borderRadius: 100,
    },
    inputField: {
        marginHorizontal: 20,
        borderColor: COLORS.borderGray,
        borderRadius: 8,
    },
    buttonContainer: {
        marginTop: 30,
        marginHorizontal: 90
    }
})