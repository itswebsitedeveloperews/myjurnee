// MembershipCard.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Platform,
} from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

/**
 * Props:
 *  - title (string)
 *  - price (string | number) e.g. "2,000"
 *  - period (string) e.g. "/Year"
 *  - subtitle (string) small text under title
 *  - benefits (Array of { id, iconName, title, subtitle? }) (iconName from MaterialCommunityIcons)
 *  - onPress (function) optional press handler for whole card
 *  - style (object) additional style for container
 *  - backgroundColor (string) override card background
 */
export default function MembershipCard({
    title = 'Basic',
    price = '2,000',
    period = '/Year',
    subtitle = 'or Shop for ₹10,000 in a year & get for FREE',
    benefits = [
        { id: '1', icon: 'lock', title: 'Unlock Extra Discount', subtitle: ' & Low Prices' },
        { id: '2', icon: 'tag-percent', title: 'Instant Extra Discount', subtitle: 'In Flash Sales' },
        { id: '3', icon: 'cash', title: 'Earn Extra Cashback', subtitle: 'as uCoin Cash' },
    ],
    onPress,
    style,
    linearColor = ['rgba(0, 0, 0, 0.6)', 'transparent'],
    backgroundColor = COLORS.purple || '#6B46C1',
}) {
    const renderBenefit = ({ item }) => (
        <View style={styles.benefitItem}>
            <View style={styles.iconWrap}>
                <FastImage source={item.icon} style={{ width: 24, height: 24, }} />
            </View>
            <View style={styles.benefitText}>
                <Text style={styles.benefitTitle} numberOfLines={1}>
                    {item.title}
                    {/* {item.subtitle ? '' : ''} */}
                </Text>
                {item.subtitle ? (
                    <Text style={styles.benefitSubtitle} numberOfLines={1}>
                        {item.subtitle}
                    </Text>
                ) : null}
            </View>
        </View>
    );

    return (
        <TouchableOpacity
            disabled={true}
            // activeOpacity={onPress ? 0.85 : 1}
            // onPress={onPress}
            style={[styles.card, { backgroundColor }, style]}
            accessibilityRole={onPress ? 'button' : 'none'}
        >
            <LinearGradient
                colors={linearColor}
                style={{ borderRadius: 14, }}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
            >
                <View style={{ paddingHorizontal: 20, paddingTop: 15 }}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{title}</Text>

                        <View style={styles.priceWrap}>
                            {/* <Text style={styles.priceSymbol}>£</Text> */}
                            <Text style={styles.price}>£ {price}</Text>
                            <Text style={styles.period}>{period}</Text>
                        </View>
                    </View>

                    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

                    <View style={styles.divider} />

                    <FlatList
                        data={benefits}
                        keyExtractor={(i) => String(i.id)}
                        renderItem={renderBenefit}
                        scrollEnabled={false}
                        contentContainerStyle={styles.benefitsContainer}
                    />

                    <TouchableOpacity style={styles.buyButton} onPress={onPress} activeOpacity={0.85}>
                        <Text style={styles.buyButtonText}>Subscribe Now</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 14,
        marginVertical: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        color: '#fff',
        fontFamily: FONTS?.URBANIST_SEMIBOLD || undefined,
        fontSize: 20,
    },
    priceWrap: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    priceSymbol: {
        color: '#fff',
        fontSize: 14,
        marginRight: 4,
        fontFamily: FONTS?.URBANIST_REGULAR || undefined,
        opacity: 0.95,
    },
    price: {
        color: '#fff',
        fontSize: 20,
        fontFamily: FONTS?.URBANIST_BOLD || undefined,
    },
    period: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 6,
        alignSelf: 'flex-end',
        opacity: 0.95,
        fontFamily: FONTS?.URBANIST_REGULAR || undefined,
    },

    subtitle: {
        color: '#fff',
        marginTop: 10,
        marginBottom: 12,
        opacity: 0.95,
        fontSize: 13,
        fontFamily: FONTS?.URBANIST_REGULAR || undefined,
    },

    divider: {
        borderTopWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.25)',
        marginBottom: 0,
    },

    benefitsContainer: {
        // spacing at bottom
        // paddingBottoms: 2,
        marginVertical: 5
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    benefitItem: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        width: '100%', // two columns with space-between
    },
    iconWrap: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    benefitText: {
        flex: 1,
    },
    benefitTitle: {
        color: '#fff',
        fontFamily: FONTS?.URBANIST_SEMIBOLD || undefined,
        fontSize: 13,
    },
    benefitSubtitle: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.92,
        marginTop: 4,
        // textAlign: 'center',
        fontFamily: FONTS?.URBANIST_REGULAR || undefined,
    },
    buyButton: {
        backgroundColor: '#fff',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 15
    },
    buyButtonText: {
        color: '#000',
        fontFamily: FONTS.URBANIST_SEMIBOLD,
        fontSize: 14,
    },
});
