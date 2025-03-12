import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  TouchableWithoutFeedback,
  FlatList,
  Easing,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import cafeIngredientsData from '@/assets/json/cafe_ingredients.json';
import { Image } from 'expo-image';

const index = () => {
  const { cafe_ingredients, categories } = cafeIngredientsData;
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);
  const bowlRef = useRef<View>(null);

  // 기존의 클릭/탭 관련 상태는 제거(예: selectedItemId, recipeHovered 등)
  const [completedRecipes, setCompletedRecipes] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0].name);

  const cafeRecipesData = require('@/assets/json/cafe.json');

  // 아이템 페이드 애니메이션 값 관리
  const fadeAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  // 드래그 상태 추적
  const isDragging = useRef(false);
  const dragDistance = useRef(0);

  // 상태 메시지를 관리하기 위한 상태 추가
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatus, setShowStatus] = useState(false);

  // 현재 드래그 중인 아이템 정보를 저장할 ref
  const draggedItemRef = useRef<any>(null);

  const [showRecipeList, setShowRecipeList] = useState(false);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const imageMapping: { [key: string]: any } = {
    almond: require('@/assets/images/cafe/almond.webp'),
    apple: require('@/assets/images/cafe/apple.webp'),
    banana: require('@/assets/images/cafe/banana.webp'),
    blacktea: require('@/assets/images/cafe/blacktea.webp'),
    blueberries: require('@/assets/images/cafe/blueberries.webp'),
    caramelsyrup: require('@/assets/images/cafe/caramelsyrup.webp'),
    chamomile: require('@/assets/images/cafe/chamomile.webp'),
    cherry: require('@/assets/images/cafe/cherry.webp'),
    cheesecake: require('@/assets/images/cafe/cheesecake.webp'),
    cheesecakesyrup: require('@/assets/images/cafe/cheesecakesyrup.webp'),
    chocolate: require('@/assets/images/cafe/chocolate.webp'),
    cinnamon: require('@/assets/images/cafe/cinnamon.webp'),
    coconut: require('@/assets/images/cafe/coconut.webp'),
    coffee: require('@/assets/images/cafe/coffee.webp'),
    cookieandcream: require('@/assets/images/cafe/cookieandcream.webp'),
    darkchocolate: require('@/assets/images/cafe/darkchocolate.webp'),
    earlgrey: require('@/assets/images/cafe/earlgrey.webp'),
    espresso: require('@/assets/images/cafe/espresso.webp'),
    flowersyrup: require('@/assets/images/cafe/flowersyrup.webp'),
    ginger: require('@/assets/images/cafe/ginger.webp'),
    grapefruit: require('@/assets/images/cafe/grapefruit.webp'),
    greengrapes: require('@/assets/images/cafe/greengrapes.webp'),
    greentea: require('@/assets/images/cafe/greentea.webp'),
    hazelnutsyrup: require('@/assets/images/cafe/hazelnutsyrup.webp'),
    honey: require('@/assets/images/cafe/honey.webp'),
    ice: require('@/assets/images/cafe/ice.webp'),
    kiwi: require('@/assets/images/cafe/kiwi.webp'),
    lavender: require('@/assets/images/cafe/lavender.webp'),
    lemon: require('@/assets/images/cafe/lemon.webp'),
    lime: require('@/assets/images/cafe/lime.webp'),
    mango: require('@/assets/images/cafe/mango.webp'),
    mascarponecheese: require('@/assets/images/cafe/mascarponecheese.webp'),
    milk: require('@/assets/images/cafe/milk.webp'),
    mint: require('@/assets/images/cafe/mint.webp'),
    oreo: require('@/assets/images/cafe/oreo.webp'),
    orange: require('@/assets/images/cafe/orange.webp'),
    peach: require('@/assets/images/cafe/peach.webp'),
    pineapple: require('@/assets/images/cafe/pineapple.webp'),
    pistachio: require('@/assets/images/cafe/pistachio.webp'),
    raspberries: require('@/assets/images/cafe/raspberries.webp'),
    rosemary: require('@/assets/images/cafe/rosemary.webp'),
    sparklingwater: require('@/assets/images/cafe/sparklingwater.webp'),
    strawberry: require('@/assets/images/cafe/strawberry.webp'),
    sweetpotato: require('@/assets/images/cafe/sweetpotato.webp'),
    syrup: require('@/assets/images/cafe/syrup.webp'),
    toffeenut: require('@/assets/images/cafe/toffeenut.webp'),
    vanillasyrup: require('@/assets/images/cafe/vanillasyrup.webp'),
    walnut: require('@/assets/images/cafe/walnut.webp'),
    watermelon: require('@/assets/images/cafe/watermelon.webp'),
    water: require('@/assets/images/cafe/water.webp'),
    whippedcream: require('@/assets/images/cafe/whippedcream.webp'),
    yogurt: require('@/assets/images/cafe/yogurt.webp'),
    yuzu: require('@/assets/images/cafe/yuzu.webp'),
    yogurtpowder: require('@/assets/images/cafe/yogurtpowder.webp'),
  };

  // 카테고리별 애니메이션 관리를 위한 객체
  const categoryAnimations = useRef<{ [key: string]: any[] }>({}).current;

  // 각 카테고리별 애니메이션 초기화
  useEffect(() => {
    categories.forEach((category) => {
      categoryAnimations[category.name] = category.ingredients.map(() => ({
        scale: new Animated.Value(1),
        position: new Animated.ValueXY({ x: 0, y: 0 }),
        zIndex: new Animated.Value(1),
      }));
    });
  }, []);

  // bowl 영역 측정을 위한 함수 개선
  const measureBowl = () => {
    if (bowlRef.current) {
      bowlRef.current.measure((x, y, width, height, pageX, pageY) => {
        // 콘솔에 측정값 출력
        console.log('Raw bowl measurements:', {
          x,
          y,
          width,
          height,
          pageX,
          pageY,
        });
      });
    }
  };

  // 컴포넌트 마운트 및 레이아웃 변경 시 Bowl 위치 측정
  useEffect(() => {
    const measureTimer = setTimeout(measureBowl, 500);

    // 윈도우 크기 변경 시에도 다시 측정
    const dimensionsSubscription = Dimensions.addEventListener('change', () => {
      setTimeout(measureBowl, 100);
    });

    return () => {
      clearTimeout(measureTimer);
      dimensionsSubscription.remove();
    };
  }, []);

  // 주기적으로 Bowl 위치 업데이트 (안정성을 위해)
  useEffect(() => {
    const interval = setInterval(measureBowl, 2000);
    return () => clearInterval(interval);
  }, []);

  // 드롭 감지 로직을 완전히 새로 작성
  const checkIfInsideBowl = (x: number, y: number) => {
    // 화면 중앙 근처에 있으면 bowl로 간주 (임시 해결책)
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const centerX = screenWidth / 2;
    const centerY = screenHeight * 0.7; // 화면 높이의 75% 위치로 변경

    // 화면 중앙에서 150px 반경 내에 있으면 bowl 안으로 간주
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );

    const isInBowl = distanceFromCenter < 150;

    console.log('Drop position:', { x, y });
    console.log('Screen center:', { centerX, centerY });
    console.log('Distance from center:', distanceFromCenter);
    console.log('Is inside bowl:', isInBowl);

    return isInBowl;
  };

  // 상태 메시지 표시 함수
  const showStatusMessage = (message: string) => {
    setStatusMessage(message);
    setShowStatus(true);

    // 3초 후 메시지 숨기기
    setTimeout(() => {
      setShowStatus(false);
    }, 3000);
  };

  // selectedIngredients 최신 상태 관리용 ref 추가
  const selectedIngredientsRef = useRef(selectedIngredients);
  useEffect(() => {
    selectedIngredientsRef.current = selectedIngredients;
  }, [selectedIngredients]);

  // 하나의 PanResponder 생성 (컴포넌트 최상위 레벨)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: () => {
        if (!draggedItemRef.current) return;

        const { animation } = draggedItemRef.current;

        // 드래그 시작 시 Bowl 위치 다시 측정
        measureBowl();

        // 드래그 상태 설정
        isDragging.current = true;
        dragDistance.current = 0;

        // 드래그 시작 시 애니메이션 설정
        animation.position.stopAnimation();
        animation.scale.stopAnimation();
        animation.position.setOffset({
          x: animation.position.x._value,
          y: animation.position.y._value,
        });
        animation.position.setValue({ x: 0, y: 0 });
        animation.scale.setValue(1.1);
        animation.zIndex.setValue(999);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!draggedItemRef.current) return;

        const { animation } = draggedItemRef.current;

        // 드래그 거리 누적
        dragDistance.current = Math.sqrt(
          Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)
        );

        // 드래그 중 위치 업데이트
        animation.position.x.setValue(gestureState.dx);
        animation.position.y.setValue(gestureState.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        if (!draggedItemRef.current) return;

        const { animation, ingredient, fadeAnim } = draggedItemRef.current;

        // 드래그 종료 시 처리
        animation.position.flattenOffset();

        // 현재 손가락 위치
        const dropX = gesture.moveX;
        const dropY = gesture.moveY;

        // 드래그 거리 확인
        if (dragDistance.current < 10) {
          // 원위치로 복귀
          Animated.parallel([
            Animated.spring(animation.position, {
              toValue: { x: 0, y: 0 },
              friction: 5,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(animation.scale, {
              toValue: 1,
              friction: 5,
              useNativeDriver: true,
            }),
          ]).start(() => {
            animation.zIndex.setValue(1);
            isDragging.current = false;
          });
          return;
        }

        // Bowl 영역 내부인지 확인
        const isInBowl = checkIfInsideBowl(dropX, dropY);

        if (isInBowl) {
          // 중복 체크
          const isDuplicate = selectedIngredientsRef.current.some(
            (item) => item.name === ingredient.name
          );

          if (isDuplicate) {
            showStatusMessage(`${ingredient.name}은(는) 이미 추가되었습니다`);
            // 원위치로 복귀
            Animated.parallel([
              Animated.spring(animation.position, {
                toValue: { x: 0, y: 0 },
                friction: 5,
                tension: 40,
                useNativeDriver: true,
              }),
              Animated.spring(animation.scale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
              }),
            ]).start(() => {
              animation.zIndex.setValue(1);
              isDragging.current = false;
            });
          } else if (selectedIngredients.length >= 8) {
            showStatusMessage('최대 8개까지만 추가할 수 있습니다');
            // 원위치로 복귀
            Animated.parallel([
              Animated.spring(animation.position, {
                toValue: { x: 0, y: 0 },
                friction: 5,
                tension: 40,
                useNativeDriver: true,
              }),
              Animated.spring(animation.scale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
              }),
            ]).start(() => {
              animation.zIndex.setValue(1);
              isDragging.current = false;
            });
          } else {
            // 재료 추가
            setSelectedIngredients((prev) => {
              showStatusMessage(`${ingredient.name}을(를) 추가했습니다`);
              return [...prev, ingredient];
            });

            // 성공적으로 추가된 경우 - 사라지는 애니메이션
            Animated.parallel([
              Animated.timing(animation.scale, {
                toValue: 0.5,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
            ]).start(() => {
              // 애니메이션 값 리셋
              animation.position.setValue({ x: 0, y: 0 });
              fadeAnim.setValue(1);
              animation.zIndex.setValue(1);
              animation.scale.setValue(1);
              isDragging.current = false;
            });
          }
        } else {
          // 원위치로 복귀
          Animated.parallel([
            Animated.spring(animation.position, {
              toValue: { x: 0, y: 0 },
              friction: 5,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(animation.scale, {
              toValue: 1,
              friction: 5,
              useNativeDriver: true,
            }),
          ]).start(() => {
            animation.zIndex.setValue(1);
            isDragging.current = false;
          });
        }
      },
      onPanResponderTerminate: () => {
        if (!draggedItemRef.current) return;

        const { animation } = draggedItemRef.current;

        // 드래그가 취소된 경우
        animation.position.flattenOffset();
        Animated.parallel([
          Animated.spring(animation.position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(animation.scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start(() => {
          animation.zIndex.setValue(1);
          isDragging.current = false;
        });
      },
    })
  ).current;

  // 그리드 레이아웃 계산을 위한 유틸리티 함수
  const calculateGridLayout = (dimensions: any) => {
    const containerPadding = 10;
    const itemMargin = 3.5;
    const itemsPerRow = 8;
    const availableWidth = dimensions.width - containerPadding * 2;
    const itemWidth = availableWidth / itemsPerRow - itemMargin * 2;

    return {
      containerPadding,
      itemMargin,
      itemsPerRow,
      availableWidth,
      itemWidth,
    };
  };

  // 카테고리 그룹 정의
  const categoryGroups = [
    ['과일'],
    ['시럽', '베이스', '유제품'],
    ['디저트', '견과류', '향신료'],
  ];

  // 현재 활성화된 그룹 찾기
  const getActiveGroup = () => {
    return (
      categoryGroups.find((group) => group.includes(activeCategory)) || [
        activeCategory,
      ]
    );
  };

  // 그룹 내 카테고리 찾기
  const getGroupCategories = () => {
    const activeGroup = getActiveGroup();
    return categories.filter((cat) => activeGroup.includes(cat.name));
  };

  // 드래그 가능한 아이템 생성 함수 수정
  const createDraggableItem = (
    ingredient: any,
    idx: number,
    categoryName: string
  ) => {
    // 카테고리별 애니메이션 가져오기
    const animation = categoryAnimations[categoryName]?.[idx] || {
      scale: new Animated.Value(1),
      position: new Animated.ValueXY({ x: 0, y: 0 }),
      zIndex: new Animated.Value(1),
    };

    // 애니메이션 키 생성
    const itemAnimationKey = `item-${categoryName}-${idx}`;

    // 애니메이션 값이 없으면 기본값 1로 생성
    if (!fadeAnimations[itemAnimationKey]) {
      fadeAnimations[itemAnimationKey] = new Animated.Value(1);
    }

    const fadeAnim = fadeAnimations[itemAnimationKey];

    // 공통 함수 사용
    const { itemMargin, itemWidth } = calculateGridLayout(dimensions);

    // 이 아이템에 대한 onResponderGrant 핸들러
    const handleResponderGrant = () => {
      draggedItemRef.current = {
        ingredient,
        animation,
        fadeAnim,
        categoryName,
        idx,
      };
    };

    return (
      <Animated.View
        key={`ingredient-${ingredient.name}`}
        {...panResponder.panHandlers}
        onResponderGrant={handleResponderGrant}
        style={[
          styles.circleItem,
          {
            width: itemWidth,
            margin: itemMargin,
            opacity: fadeAnim,
            transform: [
              { translateX: animation.position.x },
              { translateY: animation.position.y },
              { scale: animation.scale },
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [15, 0],
                }),
              },
            ],
            zIndex: animation.zIndex,
            elevation: animation.zIndex,
          },
        ]}
      >
        <Image
          source={
            imageMapping[ingredient.image] ||
            require('@/assets/images/cafe/coffee.webp')
          }
          style={[
            styles.circleImage,
            {
              width: itemWidth,
              height: itemWidth,
              borderRadius: itemWidth / 2,
            },
          ]}
          contentFit="cover"
        />
        <Text style={[styles.name, { width: itemWidth }]} numberOfLines={1}>
          {ingredient.name}
        </Text>
      </Animated.View>
    );
  };

  /**
   * 선택된 재료로 만들 수 있는 메뉴 찾기
   */
  const findRecipe = () => {
    const selectedIngredientNames = selectedIngredients.map((i) => i.name);
    const exactMatch = cafeRecipesData.cafe.find((recipe: any) => {
      const recipeIngredients = recipe.ingredients;
      return (
        recipeIngredients.length === selectedIngredientNames.length &&
        recipeIngredients.every((ingredient: any) =>
          selectedIngredientNames.includes(ingredient)
        )
      );
    });

    if (exactMatch) {
      // 이름으로 중복 확인
      const isDuplicate = completedRecipes.some(
        (recipe) => recipe.result === exactMatch.result
      );
      if (!isDuplicate) {
        setCompletedRecipes((prev) => [...prev, exactMatch]);
      }
      setShowPopup(true);
      setSelectedIngredients([]);
      // 3초 후 팝업 자동 닫기
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return true;
    }

    setStatusMessage('선택한 재료로 만들 수 있는 메뉴가 없습니다.');
    setShowStatus(true);
    setTimeout(() => {
      setShowStatus(false);
    }, 3000);
    return false;
  };

  // 현재 선택된 카테고리의 재료만 표시
  const renderActiveCategory = () => {
    const groupCategories = getGroupCategories();

    // 공통 함수 사용
    const { itemMargin, itemWidth } = calculateGridLayout(dimensions);

    return (
      <View style={styles.ingredientsWrapper}>
        {groupCategories.map((category) => (
          <View
            key={`category-${category.name}`}
            style={styles.categorySection}
          >
            <Text style={styles.categoryLabel}>{category.name}</Text>
            <View style={styles.categoryItems}>
              {category.ingredients.map((item, index) =>
                createDraggableItem(item, index, category.name)
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {/* 카테고리 탭 네비게이션 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {categoryGroups.map((group, index) => (
            <Pressable
              key={`group-${index}`}
              style={[
                styles.categoryTab,
                getActiveGroup().includes(group[0]) && styles.activeTab,
              ]}
              onPress={() => setActiveCategory(group[0])}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  getActiveGroup().includes(group[0]) && styles.activeTabText,
                ]}
              >
                {group.join('/')}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* 재료와 Bowl을 포함하는 통합 컨테이너 */}
        <View style={styles.dragDropContainer}>
          {/* 현재 선택된 카테고리의 재료들 */}
          {renderActiveCategory()}

          {/* 상태 메시지 표시 영역 */}
          <View style={styles.statusContainer}>
            <Animated.Text
              style={[styles.statusText, { opacity: showStatus ? 1 : 0 }]}
            >
              {statusMessage}
            </Animated.Text>
          </View>

          {/* Bowl 영역 */}
          <View style={styles.bowlContainer}>
            <View ref={bowlRef} style={styles.bowl} onLayout={measureBowl}>
              <Text style={styles.bowlText}>Bowl</Text>
              <View style={styles.selectedIngredientsContainer}>
                {selectedIngredients.map((ingredient, idx) => (
                  <View
                    key={`selected-${ingredient.name}`}
                    style={styles.selectedIngredient}
                  >
                    <Image
                      source={imageMapping[ingredient.image]}
                      style={styles.selectedIngredientImage}
                      contentFit="cover"
                    />
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.selectedIngredientsText}>
              선택된 재료: {selectedIngredients.map((i) => i.name).join(', ')}
            </Text>

            <View style={styles.buttonContainer}>
              <Pressable
                onPress={() => setSelectedIngredients([])}
                style={({ pressed }) => [
                  styles.button,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.buttonText}>초기화</Text>
              </Pressable>

              <Pressable
                onPress={findRecipe}
                style={({ pressed }) => [
                  styles.button,
                  styles.makeButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[styles.buttonText, styles.makeButtonText]}>
                  만들기
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 완성한 레시피 목록 - 간소화 */}
        {completedRecipes.length > 0 && (
          <View style={styles.completedRecipesContainer}>
            <Text style={styles.completedRecipesTitle}>
              완성한 레시피: {completedRecipes.length}개
            </Text>
            <Pressable
              style={styles.viewRecipesButton}
              onPress={() => setShowRecipeList(true)}
            >
              <Text style={styles.viewRecipesText}>목록 보기</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* 팝업 유지 */}
      {showPopup && completedRecipes.length > 0 && (
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>
              {completedRecipes[completedRecipes.length - 1].result}
            </Text>
            <Text style={styles.popupDescription}>
              {completedRecipes[completedRecipes.length - 1].description}
            </Text>
            <Pressable
              onPress={() => setShowPopup(false)}
              style={({ pressed }) => [
                styles.popupCloseButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.popupCloseButtonText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* 완성된 레시피 목록 팝업 */}
      {showRecipeList && (
        <View style={styles.popupOverlay}>
          <View style={[styles.popup, styles.recipeListPopup]}>
            <Text style={styles.popupTitle}>완성한 레시피 목록</Text>
            <ScrollView style={styles.recipeListScroll}>
              {completedRecipes.map((recipe, index) => (
                <View key={`recipe-${index}`} style={styles.recipeItem}>
                  <Text style={styles.recipeItemTitle}>{recipe.result}</Text>
                  <Text style={styles.recipeItemDesc}>
                    {recipe.description}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <Pressable
              onPress={() => setShowRecipeList(false)}
              style={({ pressed }) => [
                styles.popupCloseButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.popupCloseButtonText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
    padding: 10,
  },
  // 카테고리 탭 스타일
  categoryTabs: {
    flexGrow: 0,
    height: 40,
    marginBottom: 5,
  },
  categoryTabsContent: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  categoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 3,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  categoryTabText: {
    fontSize: 12,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // 드래그 앤 드롭을 위한 통합 컨테이너
  dragDropContainer: {
    flex: 1,
    position: 'relative',
  },

  // 재료 영역 스타일 추가 - 스크롤 없이 감싸는 형태
  ingredientsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    zIndex: 5, // 재료 영역의 zIndex 설정
  },

  // 재료 아이템 스타일
  circleItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  circleImage: {
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },

  // Bowl 영역 스타일 수정
  bowlContainer: {
    position: 'absolute',
    top: '70%', // 50%에서 70%로 변경
    left: '50%',
    width: 200,
    transform: [{ translateX: -100 }, { translateY: -100 }],
    alignItems: 'center',
    zIndex: 1, // Bowl의 zIndex를 낮게 설정
  },

  // Bowl 영역
  bowl: {
    width: 160,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  bowlText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  selectedIngredientsContainer: {
    width: '80%',
    height: '60%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIngredient: {
    width: 20,
    height: 20,
    margin: 1,
  },
  selectedIngredientImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  selectedIngredientsText: {
    fontSize: 11,
    textAlign: 'center',
    marginVertical: 5,
  },
  // 버튼 영역
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#f0f0f0',
  },
  makeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  makeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // 완성 레시피 간소화
  completedRecipesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 10,
  },
  completedRecipesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  viewRecipesButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  viewRecipesText: {
    fontSize: 12,
    color: '#333',
  },
  // 팝업 스타일
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  popupDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  popupCloseButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  popupCloseButtonText: {
    fontSize: 14,
    color: '#333',
  },
  // 상태 메시지
  statusContainer: {
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  // 카테고리 섹션 스타일 추가
  categorySection: {
    width: '100%',
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
    paddingLeft: 5,
  },
  categoryItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 280,
    alignSelf: 'center',
  },
  // 완성된 레시피 목록 팝업
  recipeListPopup: {
    maxHeight: '70%',
    width: '90%',
  },
  recipeListScroll: {
    width: '100%',
    maxHeight: 300,
  },
  recipeItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
    width: '100%',
  },
  recipeItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recipeItemDesc: {
    fontSize: 12,
    color: '#666',
  },
});

export default index;
