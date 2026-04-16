import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import splashData from '../../../splash_data.json';

// ─── Layout ───────────────────────────────────────────────────────────────────
const NUM_COLUMNS = 4;
const ITEM_H = 26;
const V_GAP = 4;
const COL_H_PAD = 3;
const FLOOR_PAD = 14;
const TOP_PAD = 20;

// ─── Timing ───────────────────────────────────────────────────────────────────
const SPAWN_INTERVAL_MS = 6;  // ms between consecutive item spawns
const SPLASH_MS = 800;        // total splash duration
const FADEOUT_MS = 130;       // crossfade out at the very end

// ─── Types ────────────────────────────────────────────────────────────────────
type ItemKind = 'email' | 'date' | 'link';

type FallingItem = {
  id: number;
  label: string;
  kind: ItemKind;
  column: number;
  restingY: number;
  delay: number;
  animY: Animated.Value;
  opacity: Animated.Value;
};

// ─── Data formatting ──────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmt(text: string, kind: ItemKind): string {
  if (kind === 'email') {
    const local = text.split('@')[0];
    return local.length > 16 ? local.slice(0, 15) + '…' : local;
  }
  if (kind === 'date') {
    const [y, m, d] = text.split('-');
    const mon = MONTHS[(parseInt(m, 10) - 1 + 12) % 12];
    return `${parseInt(d, 10)} ${mon} ${y}`;
  }
  // link — strip scheme and path
  return text
    .replace(/^https?:\/\/(www\.)?/, '')
    .split('/')[0]
    .split('?')[0];
}

// ─── Per-kind visuals ─────────────────────────────────────────────────────────
const KIND_BG: Record<ItemKind, string> = {
  email: '#1A5FAE',
  date:  '#1A6940',
  link:  '#5B3DAE',
};

const KIND_ICON: Record<ItemKind, string> = {
  email: '@',
  date:  '▸',
  link:  '↗',
};

// ─── Item builder (runs once on mount) ───────────────────────────────────────
function buildItems(screenW: number, screenH: number): FallingItem[] {
  // Interleave all three data types for even visual distribution
  const pool: Array<{text: string; kind: ItemKind}> = [];
  const cap = 220;
  for (let i = 0; i < cap; i++) {
    if (i < splashData.emails.length) { pool.push({text: splashData.emails[i], kind: 'email'}); }
    if (i < splashData.dates.length)  { pool.push({text: splashData.dates[i],  kind: 'date'});  }
    if (i < splashData.links.length)  { pool.push({text: splashData.links[i],  kind: 'link'});  }
  }

  // Fisher-Yates with Math.random() — safe since this runs once in useState initializer
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const slotH = ITEM_H + V_GAP;
  const slotsPerCol = Math.floor((screenH - FLOOR_PAD - TOP_PAD) / slotH);
  const total = NUM_COLUMNS * slotsPerCol;
  const columnCounts = new Array<number>(NUM_COLUMNS).fill(0);

  const items: FallingItem[] = [];

  for (let i = 0; i < Math.min(pool.length, total); i++) {
    const col = i % NUM_COLUMNS;
    const slotIndex = columnCounts[col]; // 0 = bottommost slot in this column
    columnCounts[col]++;

    // Final resting position (absolute `top`): build from bottom upward
    const restingY = screenH - FLOOR_PAD - ITEM_H - slotIndex * slotH;

    // translateY starts highly negative (item is above screen), animates to 0
    const startTranslateY = -(restingY + ITEM_H + 20);

    items.push({
      id: i,
      label: fmt(pool[i].text, pool[i].kind),
      kind: pool[i].kind,
      column: col,
      restingY,
      delay: i * SPAWN_INTERVAL_MS,
      animY: new Animated.Value(startTranslateY),
      opacity: new Animated.Value(0),
    });
  }

  return items;
}

// ─── Component ────────────────────────────────────────────────────────────────
type Props = {onComplete: () => void};

export function SplashScreen({onComplete}: Props) {
  const {width, height} = useWindowDimensions();
  const [items] = useState(() => buildItems(width, height));
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const colWidth = width / NUM_COLUMNS;

  useEffect(() => {
    // Launch every item's fall animation (staggered by delay)
    items.forEach(item => {
      // Slight per-item variation for organic feel
      const vJitter  = (item.id % 7) * 0.55;
      const fJitter  = (item.id % 5) * 0.10;

      Animated.sequence([
        Animated.delay(item.delay),
        Animated.parallel([
          // Quick fade-in as item enters screen
          Animated.timing(item.opacity, {
            toValue: 1,
            duration: 35,
            useNativeDriver: true,
          }),
          // Spring fall — high initial velocity + slight bounce at landing
          Animated.spring(item.animY, {
            toValue: 0,
            useNativeDriver: true,
            velocity: 22 + vJitter,
            tension: 36,
            friction: 7.5 + fJitter,
          }),
        ]),
      ]).start();
    });

    // Fade out the entire splash just before completing
    const fadeTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: FADEOUT_MS,
        useNativeDriver: true,
      }).start();
    }, SPLASH_MS - FADEOUT_MS);

    const doneTimer = setTimeout(onComplete, SPLASH_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.root, {opacity: screenOpacity}]}>
      {/* Ambient background glows */}
      <View style={[styles.glow, styles.glowBlue]} />
      <View style={[styles.glow, styles.glowPurple]} />
      <View style={[styles.glow, styles.glowGreen]} />

      {items.map(item => {
        const left = item.column * colWidth + COL_H_PAD;
        const itemWidth = colWidth - COL_H_PAD * 2;

        return (
          <Animated.View
            key={item.id}
            style={[
              styles.pill,
              {
                top: item.restingY,
                left,
                width: itemWidth,
                backgroundColor: KIND_BG[item.kind],
                opacity: item.opacity,
                transform: [{translateY: item.animY}],
              },
            ]}>
            <Text style={styles.icon}>{KIND_ICON[item.kind]}</Text>
            <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
              {item.label}
            </Text>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#08111A',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowBlue: {
    width: 360,
    height: 360,
    top: -80,
    left: -80,
    backgroundColor: 'rgba(40, 100, 255, 0.11)',
  },
  glowPurple: {
    width: 300,
    height: 300,
    bottom: -60,
    right: -50,
    backgroundColor: 'rgba(110, 60, 210, 0.11)',
  },
  glowGreen: {
    width: 200,
    height: 200,
    top: '40%',
    left: '30%',
    backgroundColor: 'rgba(20, 130, 70, 0.08)',
  },
  pill: {
    position: 'absolute',
    height: ITEM_H,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    gap: 3,
  },
  icon: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.50)',
    fontWeight: '700',
  },
  label: {
    flex: 1,
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.90)',
    lineHeight: 14,
  },
});
