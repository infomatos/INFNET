import * as React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function FeedbackBanner({
  visivel,
  mensagem,
  onFim,
  bg = '#1f7a4c',
}) {
  const transY = React.useRef(new Animated.Value(-50)).current;
  const op = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visivel) {
      Animated.parallel([
        Animated.timing(transY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(op, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(transY, {
              toValue: -50,
              duration: 220,
              useNativeDriver: true,
            }),
            Animated.timing(op, {
              toValue: 0,
              duration: 220,
              useNativeDriver: true,
            }),
          ]).start(() => onFim && onFim());
        }, 1100);
      });
    }
  }, [visivel]);

  if (!visivel) return null;

  return (
    <Animated.View
      style={[
        estilos.wrap,
        { transform: [{ translateY: transY }], opacity: op },
      ]}>
      <View style={[estilos.balao, { backgroundColor: bg }]}>
        <Text style={estilos.txt}>{mensagem}</Text>
      </View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  balao: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  txt: { color: '#fff', fontWeight: '800' },
});
