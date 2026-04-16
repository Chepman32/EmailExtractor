import {Platform} from 'react-native';

export type ThemeId = 'light' | 'dark' | 'solar' | 'mono';

export type AppTheme = {
  id: ThemeId;
  label: string;
  description: string;
  statusBarStyle: 'light-content' | 'dark-content';
  colors: {
    shadow: string;
    appBackground: string;
    surface: string;
    surfaceMuted: string;
    surfacePressed: string;
    border: string;
    borderSoft: string;
    primary: string;
    primaryPressed: string;
    primarySoft: string;
    primarySoftPressed: string;
    primarySoftText: string;
    primaryOn: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    heroBackground: string;
    heroGlowPrimary: string;
    heroGlowSecondary: string;
    heroSurface: string;
    heroSurfaceBorder: string;
    heroTextPrimary: string;
    heroTextSecondary: string;
    statusPillBackground: string;
    statusPillPressed: string;
    statusIcon: string;
    badgeBackground: string;
    badgeActiveBackground: string;
    badgeText: string;
    badgeActiveText: string;
    inputBackground: string;
    assetBackground: string;
    actionBackground: string;
    actionPressed: string;
    dangerBackground: string;
    dangerBorder: string;
    dangerText: string;
    warningBackground: string;
    warningBorder: string;
    warningText: string;
    successText: string;
    resultDot: string;
    tabBarBackground: string;
    tabActiveBackground: string;
    tabActiveShadow: string;
    tabInactiveBadgeBackground: string;
    tabInactiveIcon: string;
    tabLabel: string;
    tabLabelActive: string;
    pickerRing: string;
  };
};

export const themes: Record<ThemeId, AppTheme> = {
  light: {
    id: 'light',
    label: 'Light',
    description: 'Cool daylight blues and white surfaces.',
    statusBarStyle: 'dark-content',
    colors: {
      shadow: '#0C2340',
      appBackground: '#EAF0F7',
      surface: '#FFFFFF',
      surfaceMuted: '#F6F9FD',
      surfacePressed: '#F4F8FD',
      border: '#E1EAF4',
      borderSoft: '#D7E3F0',
      primary: '#1D73CC',
      primaryPressed: '#165FA9',
      primarySoft: '#E7F0FA',
      primarySoftPressed: '#DCE8F6',
      primarySoftText: '#1D5F9D',
      primaryOn: '#FFFFFF',
      textPrimary: '#132238',
      textSecondary: '#617388',
      textMuted: '#5F7896',
      heroBackground: '#0F2741',
      heroGlowPrimary: 'rgba(69, 147, 255, 0.28)',
      heroGlowSecondary: 'rgba(120, 205, 255, 0.16)',
      heroSurface: 'rgba(255, 255, 255, 0.96)',
      heroSurfaceBorder: 'rgba(255, 255, 255, 0.22)',
      heroTextPrimary: '#F8FBFF',
      heroTextSecondary: 'rgba(233, 242, 255, 0.82)',
      statusPillBackground: '#E3EEF9',
      statusPillPressed: '#D7E7F8',
      statusIcon: '#245F99',
      badgeBackground: '#DCE7F4',
      badgeActiveBackground: '#2C78D7',
      badgeText: '#35506E',
      badgeActiveText: '#FFFFFF',
      inputBackground: '#F6F9FD',
      assetBackground: '#FFFFFF',
      actionBackground: '#FFFFFF',
      actionPressed: '#F0F5FB',
      dangerBackground: '#FFF1F1',
      dangerBorder: '#F5CACA',
      dangerText: '#9A3F3F',
      warningBackground: '#FFF7E8',
      warningBorder: '#F2DEB2',
      warningText: '#8A5E2C',
      successText: '#1E7A4E',
      resultDot: '#2C78D7',
      tabBarBackground: '#FFFFFF',
      tabActiveBackground: '#0F2741',
      tabActiveShadow: '#0C2340',
      tabInactiveBadgeBackground: '#E7F0FA',
      tabInactiveIcon: '#1D5F9D',
      tabLabel: '#5F7896',
      tabLabelActive: '#FFFFFF',
      pickerRing: '#69A5E6',
    },
  },
  dark: {
    id: 'dark',
    label: 'Dark',
    description: 'Deep slate surfaces with luminous blue accents.',
    statusBarStyle: 'light-content',
    colors: {
      shadow: '#02070D',
      appBackground: '#09111A',
      surface: '#121B25',
      surfaceMuted: '#172331',
      surfacePressed: '#1D2A39',
      border: '#223244',
      borderSoft: '#2B3D50',
      primary: '#78AFFF',
      primaryPressed: '#6098EA',
      primarySoft: '#1A2C42',
      primarySoftPressed: '#20344D',
      primarySoftText: '#B9D7FF',
      primaryOn: '#08111A',
      textPrimary: '#F2F6FB',
      textSecondary: '#A9B7C7',
      textMuted: '#8A97A8',
      heroBackground: '#0D1722',
      heroGlowPrimary: 'rgba(95, 149, 255, 0.2)',
      heroGlowSecondary: 'rgba(126, 196, 255, 0.14)',
      heroSurface: 'rgba(255, 255, 255, 0.08)',
      heroSurfaceBorder: 'rgba(255, 255, 255, 0.08)',
      heroTextPrimary: '#F7FBFF',
      heroTextSecondary: 'rgba(219, 230, 244, 0.76)',
      statusPillBackground: '#1B2B3C',
      statusPillPressed: '#24384D',
      statusIcon: '#AFCBF8',
      badgeBackground: '#24384D',
      badgeActiveBackground: '#78AFFF',
      badgeText: '#B8CDE8',
      badgeActiveText: '#08111A',
      inputBackground: '#131D28',
      assetBackground: '#0F1822',
      actionBackground: '#121B25',
      actionPressed: '#1A2635',
      dangerBackground: '#351A20',
      dangerBorder: '#5B2B34',
      dangerText: '#F2A3AF',
      warningBackground: '#372B13',
      warningBorder: '#5A451E',
      warningText: '#F3D28C',
      successText: '#7BD5A5',
      resultDot: '#78AFFF',
      tabBarBackground: '#121B25',
      tabActiveBackground: '#78AFFF',
      tabActiveShadow: '#02070D',
      tabInactiveBadgeBackground: '#1A2C42',
      tabInactiveIcon: '#AFCBF8',
      tabLabel: '#9FB0C3',
      tabLabelActive: '#08111A',
      pickerRing: '#78AFFF',
    },
  },
  solar: {
    id: 'solar',
    label: 'Solar',
    description: 'Warm yellow paper tones with amber contrast.',
    statusBarStyle: 'dark-content',
    colors: {
      shadow: '#6A511B',
      appBackground: '#F7EFD5',
      surface: '#FFF9EA',
      surfaceMuted: '#FFF4D2',
      surfacePressed: '#FBECC1',
      border: '#E8D8AB',
      borderSoft: '#DDCA97',
      primary: '#C9891B',
      primaryPressed: '#B17511',
      primarySoft: '#F5E4AF',
      primarySoftPressed: '#EFD892',
      primarySoftText: '#8B6118',
      primaryOn: '#FFF8E8',
      textPrimary: '#5E4518',
      textSecondary: '#8A6B2B',
      textMuted: '#9A7A34',
      heroBackground: '#8C6412',
      heroGlowPrimary: 'rgba(255, 213, 123, 0.26)',
      heroGlowSecondary: 'rgba(255, 244, 193, 0.18)',
      heroSurface: 'rgba(255, 248, 224, 0.95)',
      heroSurfaceBorder: 'rgba(255, 244, 219, 0.35)',
      heroTextPrimary: '#FFF8E8',
      heroTextSecondary: 'rgba(255, 245, 220, 0.8)',
      statusPillBackground: '#F5E4AF',
      statusPillPressed: '#EFD892',
      statusIcon: '#8B6118',
      badgeBackground: '#EFDCA2',
      badgeActiveBackground: '#C9891B',
      badgeText: '#7A5A19',
      badgeActiveText: '#FFF8E8',
      inputBackground: '#FFF4D2',
      assetBackground: '#FFF9EA',
      actionBackground: '#FFF9EA',
      actionPressed: '#FAEFC9',
      dangerBackground: '#FFF0E1',
      dangerBorder: '#E8C3A0',
      dangerText: '#A5612A',
      warningBackground: '#FFF1C7',
      warningBorder: '#E4C57A',
      warningText: '#8B6118',
      successText: '#6D7A27',
      resultDot: '#C9891B',
      tabBarBackground: '#FFF9EA',
      tabActiveBackground: '#8C6412',
      tabActiveShadow: '#6A511B',
      tabInactiveBadgeBackground: '#F5E4AF',
      tabInactiveIcon: '#8B6118',
      tabLabel: '#8A6B2B',
      tabLabelActive: '#FFF8E8',
      pickerRing: '#D9A23C',
    },
  },
  mono: {
    id: 'mono',
    label: 'Mono',
    description: 'Neutral gray scale with graphite contrast.',
    statusBarStyle: 'dark-content',
    colors: {
      shadow: '#0E1014',
      appBackground: '#BEC4CC',
      surface: '#D8DCE2',
      surfaceMuted: '#CDD2D9',
      surfacePressed: '#C8CDD5',
      border: '#B2B9C2',
      borderSoft: '#A8B0BA',
      primary: '#2E333B',
      primaryPressed: '#21262D',
      primarySoft: '#C8CDD5',
      primarySoftPressed: '#BFC5CD',
      primarySoftText: '#252A30',
      primaryOn: '#F0F2F4',
      textPrimary: '#131619',
      textSecondary: '#4A5059',
      textMuted: '#636B75',
      heroBackground: '#1A1D22',
      heroGlowPrimary: 'rgba(255, 255, 255, 0.1)',
      heroGlowSecondary: 'rgba(190, 196, 204, 0.12)',
      heroSurface: 'rgba(216, 220, 226, 0.94)',
      heroSurfaceBorder: 'rgba(255, 255, 255, 0.18)',
      heroTextPrimary: '#ECEEF1',
      heroTextSecondary: 'rgba(220, 224, 230, 0.8)',
      statusPillBackground: '#C8CDD5',
      statusPillPressed: '#BFC5CD',
      statusIcon: '#2E333B',
      badgeBackground: '#BFC5CC',
      badgeActiveBackground: '#2E333B',
      badgeText: '#383E46',
      badgeActiveText: '#F0F2F4',
      inputBackground: '#CDD2D9',
      assetBackground: '#D8DCE2',
      actionBackground: '#D8DCE2',
      actionPressed: '#C8CDD5',
      dangerBackground: '#D9D0CF',
      dangerBorder: '#C0AFAD',
      dangerText: '#7A4F4F',
      warningBackground: '#D9D5CC',
      warningBorder: '#C2BAA9',
      warningText: '#6B6045',
      successText: '#3D5A51',
      resultDot: '#2E333B',
      tabBarBackground: '#CDD2D9',
      tabActiveBackground: '#1A1D22',
      tabActiveShadow: '#0E1014',
      tabInactiveBadgeBackground: '#BEC4CC',
      tabInactiveIcon: '#383E46',
      tabLabel: '#545B64',
      tabLabelActive: '#ECEEF1',
      pickerRing: '#737B85',
    },
  },
};

export const themeOptions = [
  themes.light,
  themes.dark,
  themes.solar,
  themes.mono,
];

export const defaultThemeId: ThemeId = 'light';

export function isThemeId(value: unknown): value is ThemeId {
  return value === 'light' || value === 'dark' || value === 'solar' || value === 'mono';
}

export function createShadow(
  color: string,
  opacity: number,
  radius: number,
  offsetY: number,
  elevation: number,
) {
  return (
    Platform.select({
      ios: {
        shadowColor: color,
        shadowOpacity: opacity,
        shadowRadius: radius,
        shadowOffset: {width: 0, height: offsetY},
      },
      android: {
        elevation,
      },
      default: {},
    }) ?? {}
  );
}
