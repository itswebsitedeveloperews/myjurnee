import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { windowHeight, windowWidth } from '../../Utils/Dimentions'
import { FONTS } from '../../Common/Constants/fonts'
import { COLORS } from '../../Common/Constants/colors'
const data = [
    {
        image: 'https://myjurnee.wordpressplanet.org/assets/images/history-of-obesity.jpg',
        title: 'History of obesity',
        subTitle: 'Lorem ipsum do onsectelor sit amet, consectetuer adipiscing elit, sed diam nod tincidunt ut laoret dolore magna aliquam erat volutpat.'
    },
    {
        image: 'https://myjurnee.wordpressplanet.org/assets/images/change-your-habits.jpg',
        title: 'Change your habits',
        subTitle: 'Lorem ipsum do onsectelor sit amet, consectetuer adipiscing elit, sed diam nnt ut laoret dolore magna aliquam erat volutpat.'
    },
    {
        image: 'https://myjurnee.wordpressplanet.org/assets/images/recipes-and-calories.jpg',
        title: 'Recipes & calories',
        subTitle: 'Lorem ipsum do onsectelor sit amet, consectetuer adipiscing elit, sed diam nod tincidunt ut laoret dolore magna aliquam erat volutpat.'
    }
]

const LastingWeightsComponent = () => {
    return (
        <View style={styles.container}>
            {data.map((item, index) => {
                return (
                    <View key={index.toString()} style={{ marginTop: 30 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <FastImage source={{ uri: item.image }} style={styles.image} resizeMode='cover' />
                        </View>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subTitle}>{item.subTitle}</Text>
                    </View>
                )
            })}

        </View>
    )
}

export default LastingWeightsComponent

const styles = StyleSheet.create({
    container: {

    },
    image: {
        height: windowHeight / 3.3,
        width: windowWidth / 1.1,
        borderRadius: 10
    },
    title: {
        marginTop: 20,
        textAlign: 'left',
        paddingHorizontal: 20,
        fontSize: 28,
        fontFamily: FONTS.URBANIST_MEDIUM,
        color: COLORS.black
    },
    subTitle: {
        marginTop: 10,
        textAlign: 'left',
        paddingHorizontal: 20,
        fontSize: 18,
        fontFamily: FONTS.URBANIST_REGULAR,
        color: COLORS.black
    }

})