import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, View, ViewStyle, Text, Easing } from 'react-native';

type FeadeInViewProps = PropsWithChildren<{ style: ViewStyle }>;

const FadeInAnimation = ({ children, style }: FeadeInViewProps) => {
  // 페이드인
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // 초기 이동
  const xPosition = useRef(new Animated.Value(-50)).current;
  // 이동
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  // 회전
  const twirl = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // sequence: 배열 안의 애니메이션을 순차적으로 실행. 동기적.
    Animated.sequence([
      // parallel: 배열 안의 애니메이션을 동시에 실행. 서로 다른 속성을 동시에 애니메이션화 할 때 유용
      Animated.parallel([
        // timing: 초기 값에서 목표 값으로 이동하면서 애니메이션 실행
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(xPosition, {
            toValue: 100,
            duration: 1000,
            easing: Easing.elastic(1),
            useNativeDriver: true,
          }),
          Animated.timing(xPosition, {
            toValue: 0,
            duration: 1000,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // decay: 속도를 감소시키면서 애니메이션 실행
      Animated.decay(position, {
        velocity: { x: 0.5, y: 0.5 },
        deceleration: 0.997,
        useNativeDriver: true,
      }),
      Animated.parallel([
        // spring: 초기 위치에서 목표 위치로 이동하면서 애니메이션 실행
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }),

        Animated.timing(twirl, {
          toValue: 360,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: xPosition },
            { translateX: position.x },
            { translateY: position.y },
            {
              rotate: twirl.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const FadeInView = () => {
  return (
    <View
      style={{
        display: 'flex',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FadeInAnimation
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 200,
          height: 200,
          backgroundColor: 'lavender',
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 20, padding: 10, color: 'mediumblue' }}>
          FadeInView
        </Text>
      </FadeInAnimation>
    </View>
  );
};

export default FadeInView;
