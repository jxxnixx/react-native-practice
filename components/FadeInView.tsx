import React, { PropsWithChildren, useEffect, useRef } from 'react';
import {
  Animated,
  View,
  ViewStyle,
  Text,
  Easing,
  PanResponder,
} from 'react-native';

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
  // 스케일
  const scale = useRef(new Animated.Value(1)).current;
  // xPosition과 position의 x, y 값에 따라 텍스트 크기 조절
  const textScale = Animated.add(
    xPosition.interpolate({
      inputRange: [-50, 100],
      outputRange: [1, 0.5],
    }),
    Animated.add(
      position.x.interpolate({
        inputRange: [-100, 100],
        outputRange: [0.5, 0],
      }),
      position.y.interpolate({
        inputRange: [-100, 100],
        outputRange: [0.5, 0],
      })
    )
  );

  // PanResponder 추가
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
        // 드래그 할 때 회전 효과
        twirl.setValue(gestureState.dx);
        // 드래그 거리에 따른 스케일 효과
        const dragDistance = Math.sqrt(
          gestureState.dx ** 2 + gestureState.dy ** 2
        );
        scale.setValue(1 + dragDistance * 0.003);
      },
      onPanResponderRelease: () => {
        // 드래그 끝나면 원위치로
        Animated.parallel([
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.spring(twirl, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

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
        // 스케일 애니메이션 추가
        Animated.timing(scale, {
          toValue: 2,
          duration: 2000,
          useNativeDriver: true,
        }),
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
      {...panResponder.panHandlers}
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { scale },
            {
              rotate: twirl.interpolate({
                inputRange: [-200, 0, 200],
                outputRange: ['-45deg', '0deg', '45deg'],
              }),
            },
          ],
        },
      ]}
    >
      <Animated.Text
        style={{
          fontSize: 20,
          padding: 10,
          color: 'mediumblue',
          transform: [{ scale: textScale }],
        }}
      >
        FadeInView
      </Animated.Text>
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
        {/* <Text style={{ fontSize: 20, padding: 10, color: 'mediumblue' }}>
          FadeInView
        </Text> */}
      </FadeInAnimation>
    </View>
  );
};

export default FadeInView;
