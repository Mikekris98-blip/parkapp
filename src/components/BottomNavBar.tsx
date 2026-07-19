import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/theme';
import { HomeIcon, DiscoverIcon, ProfileIcon, PlusIcon } from './icons';

const TAB_ICONS: Record<string, (color: string) => React.ReactNode> = {
  Home: (color) => <HomeIcon color={color} />,
  Discover: (color) => <DiscoverIcon color={color} />,
  Profile: (color) => <ProfileIcon color={color} />,
};

export function BottomNavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const routes = state.routes;
  const homeAndDiscover = routes.slice(0, 2);
  const profileRoute = routes[2];

  function renderTab(route: (typeof routes)[number], index: number) {
    const { options } = descriptors[route.key];
    const label = (options.tabBarLabel as string) ?? route.name;
    const focused = state.index === index;
    const color = focused ? colors.rust : colors.mutedLight;

    return (
      <Pressable
        key={route.key}
        style={styles.navItem}
        onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        }}
      >
        {TAB_ICONS[route.name]?.(color)}
        <Text style={[styles.navLabel, { color }]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.bar}>
      {homeAndDiscover.map((route, i) => renderTab(route, i))}
      <Pressable style={styles.fab} onPress={() => navigation.getParent()?.navigate('AddPark')}>
        <PlusIcon color={colors.paper} />
      </Pressable>
      {profileRoute && renderTab(profileRoute, 2)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontFamily: fonts.display,
    fontSize: 9.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.rust,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    shadowColor: colors.rust,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
