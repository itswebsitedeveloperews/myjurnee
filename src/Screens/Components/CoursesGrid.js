// CoursesGrid.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import FastImage from 'react-native-fast-image';

export default function CoursesGrid({ items = [], loading = false, onCardPress = () => { } }) {
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.black} size={'small'} />
      </View>
    )
  }

  return (

    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.9}
          onPress={() => onCardPress(item)}
          style={[styles.card, { backgroundColor: item.bgColor }]}
        >
          {/* Rank watermark */}
          <Text style={styles.rank}>{item.rank}</Text>

          {/* Game icon */}
          <View style={styles.iconWrap}>
            <FastImage source={item.icon} style={styles.icon} resizeMode="contain" />
          </View>

          {/* Texts */}
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>

          {/* CTA */}
          <View style={styles.ctaWrap}>
            <Text style={styles.ctaText}>{item.cta}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const CARD_RADIUS = 22;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    width: '48%',
    borderRadius: CARD_RADIUS,
    padding: 16,
    height: 240,
    marginBottom: 16,
    overflow: 'hidden',

    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  rank: {
    position: 'absolute',
    top: 10,
    left: 14,
    fontSize: 86,
    fontWeight: '800',
    color: 'rgba(216, 27, 27, 0.21)',
    letterSpacing: -3,
  },
  iconWrap: {
    width: 82,
    height: 82,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  icon: {
    width: '94%',
    height: '94%',
    borderRadius: 14,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  ctaWrap: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  ctaText: {
    color: '#111',
    fontWeight: '700',
    fontSize: 14,
  },
});
