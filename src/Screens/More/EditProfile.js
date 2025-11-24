import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { COLORS } from '../../Common/Constants/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import INavBar from '../Components/INavBar'

const EditProfile = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <INavBar title="Edit Profile" />
            <ScrollView>
                <View>
                    <Text>Edit Profile</Text>
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
    }
})