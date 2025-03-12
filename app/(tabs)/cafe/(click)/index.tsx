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
  Platform,
  Pressable,
  FlatList,
  Easing,
} from 'react-native';
import cafeIngredientsData from '@/assets/json/cafe_ingredients.json';
import { Image } from 'expo-image';

/**
 * 카페 재료 화면 컴포넌트
 *
 * 이 컴포넌트는 카페 재료들을 그리드 형태로 표시하고,
 * 사용자가 재료를 드래그하여 bowl에 담을 수 있는 기능을 제공합니다.
 * 웹에서는 hover 효과, 모바일에서는 탭 효과를 지원합니다.
 */
const index = () => {
  // JSON 데이터에서 카페 재료 목록 추출
  const { cafe_ingredients } = cafeIngredientsData;

  // 화면 크기 상태 관리 (반응형 디자인을 위함)
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  // bowl에 선택된 재료들을 관리하는 상태
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);

  // bowl 요소에 대한 참조 (위치 측정을 위함)
  const bowlRef = useRef<View>(null);

  // 컴포넌트 최상단에 상태 추가
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [completedRecipes, setCompletedRecipes] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [recipeHovered, setRecipeHovered] = useState<string | null>(null);

  // cafe.json 데이터 가져오기
  const cafeRecipesData = require('@/assets/json/cafe.json');

  // 아이템 애니메이션 상태 추가
  const [animatedItems, setAnimatedItems] = useState<{
    [key: string]: boolean;
  }>({});

  // 아이템 애니메이션 값 관리를 위한 ref 추가
  const fadeAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  /**
   * 화면 크기 변경 감지 이벤트 리스너
   *
   * 화면 크기가 변경될 때마다 dimensions 상태를 업데이트하여
   * 반응형 레이아웃을 유지합니다.
   */
  useEffect(() => {
    // Dimensions 변경 이벤트 구독
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => subscription?.remove();
  }, []);

  /**
   * 이미지 매핑 객체
   *
   * JSON 데이터의 이미지 이름을 실제 이미지 파일 경로로 매핑합니다.
   * React Native에서는 require()가 정적 문자열만 허용하므로
   * 동적으로 이미지를 불러오기 위해 객체 매핑 방식을 사용합니다.
   */
  const imageMapping: { [key: string]: any } = {
    almond: require('@/assets/images/cafe/almond.webp'),
    apple: require('@/assets/images/cafe/apple.webp'),
    banana: require('@/assets/images/cafe/banana.webp'),
    blueberries: require('@/assets/images/cafe/blueberries.webp'),
    caramelsyrup: require('@/assets/images/cafe/caramelsyrup.webp'),
    chamomile: require('@/assets/images/cafe/chamomile.webp'),
    cheesecakesyrup: require('@/assets/images/cafe/cheesecakesyrup.webp'),
    chocolate: require('@/assets/images/cafe/chocolate.webp'),
    cinnamon: require('@/assets/images/cafe/cinnamon.webp'),
    coconut: require('@/assets/images/cafe/coconut.webp'),
    darkchocolate: require('@/assets/images/cafe/darkchocolate.webp'),
    earlgrey: require('@/assets/images/cafe/earlgrey.webp'),
    espresso: require('@/assets/images/cafe/espresso.webp'),
    flowersyrup: require('@/assets/images/cafe/flowersyrup.webp'),
    ginger: require('@/assets/images/cafe/ginger.webp'),
    grapefruit: require('@/assets/images/cafe/grapefruit.webp'),
    greentea: require('@/assets/images/cafe/greentea.webp'),
    hazelnutsyrup: require('@/assets/images/cafe/hazelnutsyrup.webp'),
    honey: require('@/assets/images/cafe/honey.webp'),
    ice: require('@/assets/images/cafe/ice.webp'),
    kiwi: require('@/assets/images/cafe/kiwi.webp'),
    lavender: require('@/assets/images/cafe/lavender.webp'),
    lemon: require('@/assets/images/cafe/lemon.webp'),
    mango: require('@/assets/images/cafe/mango.webp'),
    mascarponecheese: require('@/assets/images/cafe/mascarponecheese.webp'),
    milk: require('@/assets/images/cafe/milk.webp'),
    mint: require('@/assets/images/cafe/mint.webp'),
    orange: require('@/assets/images/cafe/orange.webp'),
    peach: require('@/assets/images/cafe/peach.webp'),
    pineapple: require('@/assets/images/cafe/pineapple.webp'),
    pistachio: require('@/assets/images/cafe/pistachio.webp'),
    raspberry: require('@/assets/images/cafe/raspberries.webp'),
    rosemary: require('@/assets/images/cafe/rosemary.webp'),
    sparklingwater: require('@/assets/images/cafe/sparklingwater.webp'),
    strawberry: require('@/assets/images/cafe/strawberry.webp'),
    toffeenut: require('@/assets/images/cafe/toffeenut.webp'),
    vanillasyrup: require('@/assets/images/cafe/vanillasyrup.webp'),
    walnut: require('@/assets/images/cafe/walnut.webp'),
    water: require('@/assets/images/cafe/water.webp'),
    yogurt: require('@/assets/images/cafe/yogurt.webp'),
  };

  /**
   * 항상 3줄로 표시하기 위한 계산
   *
   * 전체 아이템 수를 3로 나누어 각 줄에 표시할 아이템 수를 계산합니다.
   * 이렇게 하면 화면 크기에 관계없이 항상 3줄로 표시됩니다.
   */
  const totalItems = cafe_ingredients.length;
  const itemsPerRow = Math.ceil(totalItems / 3);

  /**
   * 화면 너비에 맞게 아이템 크기 계산
   *
   * 화면 너비, 컨테이너 패딩, 아이템 간 여백을 고려하여
   * 각 아이템의 크기를 계산합니다. 이를 통해 반응형 레이아웃을 구현합니다.
   */
  const containerPadding = 10;
  const itemMargin = 2;
  const availableWidth = dimensions.width - containerPadding * 2;
  // 아이템 최대 크기를 60으로 제한
  const maxItemSize = 60;
  const calculatedItemWidth = availableWidth / itemsPerRow - itemMargin * 2;
  const itemWidth = Math.min(calculatedItemWidth, maxItemSize);

  /**
   * 첫 번째 줄과 두 번째 줄로 데이터 분할
   *
   * 전체 재료 목록을 두 줄로 나누어 각각 배열에 저장합니다.
   */
  const firstRow = cafe_ingredients.slice(0, itemsPerRow);
  const secondRow = cafe_ingredients.slice(itemsPerRow, itemsPerRow * 2);
  const thirdRow = cafe_ingredients.slice(itemsPerRow * 2);

  /**
   * 각 아이템의 애니메이션 값 생성 함수
   *
   * 각 아이템에 대한 애니메이션 값(scale, position, zIndex)을 생성합니다.
   * useRef를 사용하여 리렌더링 시에도 값이 유지되도록 합니다.
   *
   * @param items 애니메이션 값을 생성할 아이템 배열
   * @returns 각 아이템에 대한 애니메이션 값 배열
   */
  const createAnimatedItems = (items: any) => {
    return items.map(() => ({
      scale: new Animated.Value(1), // 크기 애니메이션 값 (1 = 원래 크기)
      position: new Animated.ValueXY({ x: 0, y: 0 }), // 위치 애니메이션 값
      isDragging: false, // 현재 드래그 중인지 여부
      zIndex: new Animated.Value(1), // z-index 애니메이션 값 (겹침 순서)
    }));
  };

  // 첫 번째 줄과 두 번째 줄 아이템들의 애니메이션 값
  const firstRowAnimations = useRef(createAnimatedItems(firstRow)).current;
  const secondRowAnimations = useRef(createAnimatedItems(secondRow)).current;
  const thirdRowAnimations = useRef(createAnimatedItems(thirdRow)).current;

  // 아이템 순차 애니메이션 효과 구현 (개선된 버전)
  useEffect(() => {
    // 모든 행의 아이템을 하나의 배열로 합치기
    const allItems = [...firstRow, ...secondRow, ...thirdRow];

    // 각 아이템에 대한 애니메이션 값 초기화
    allItems.forEach((_, index) => {
      fadeAnimations[`item-${index}`] = new Animated.Value(0);
    });

    // 각 아이템을 순차적으로 나타나게 하는 함수
    const animateItemsSequentially = () => {
      // 모든 아이템의 애니메이션을 배열로 생성
      const animations = allItems.map((_, index) => {
        // 각 아이템마다 지연 시간을 다르게 설정
        return Animated.timing(fadeAnimations[`item-${index}`], {
          toValue: 1,
          duration: 600, // 더 긴 지속 시간으로 부드러운 효과
          delay: index * 80, // 약간 더 빠른 간격
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1), // 부드러운 이징 함수 적용
        });
      });

      // 애니메이션 순차 실행
      Animated.stagger(50, animations).start();
    };

    // 컴포넌트 마운트 후 애니메이션 시작
    setTimeout(animateItemsSequentially, 100);
  }, []);

  /**
   * 드래그 가능한 아이템 생성 함수
   */
  const createClickableItem = (
    ingredient: any,
    idx: number,
    rowIndex: number
  ) => {
    // 현재 아이템의 애니메이션 객체 가져오기
    let animation;
    if (rowIndex === 0) {
      animation = firstRowAnimations[idx];
    } else if (rowIndex === 1) {
      animation = secondRowAnimations[idx];
    } else {
      animation = thirdRowAnimations[idx];
    }

    // 호버 상태 추적 (웹용)
    const [isHovered, setIsHovered] = useState(false);

    // 아이템 ID 생성
    const itemId = `row${rowIndex}-${idx}`;

    // 전체 아이템 인덱스 계산 (행과 열 기반)
    const globalIndex = rowIndex * itemsPerRow + idx;
    const itemAnimationKey = `item-${globalIndex}`;

    // 아이템의 페이드 애니메이션 값 가져오기
    const fadeAnim = fadeAnimations[itemAnimationKey] || new Animated.Value(0);

    // 아이템이 애니메이션 되었는지 확인
    const isAnimated = animatedItems[itemAnimationKey] || false;

    // 호버 효과 처리 함수 (웹용)
    const handleItemHover = (hovered: boolean) => {
      setIsHovered(hovered);
    };

    // 클릭/탭 효과 처리 함수 (웹/모바일 공통) - 수정된 부분
    const handleItemPress = () => {
      // 이미 Bowl에 같은 재료가 있는지 확인
      const isDuplicate = selectedIngredients.some(
        (item) => item.name === ingredient.name
      );

      // 중복이 아닌 경우에만 추가
      if (!isDuplicate) {
        // Bowl에 재료 추가
        setSelectedIngredients((prev) => [...prev, ingredient]);
        console.log('Added to bowl:', ingredient.name);

        // 추가 애니메이션 (축소 후 원래 크기로)
        Animated.sequence([
          Animated.timing(animation.scale, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animation.scale, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animation.scale, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        console.log('Ingredient already in bowl:', ingredient.name);

        // 이미 추가된 재료임을 알리는 애니메이션 (흔들림 효과)
        Animated.sequence([
          Animated.timing(animation.scale, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animation.scale, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animation.scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    // 웹에서 호버 효과를 위한 스타일
    const webHoverStyle =
      Platform.OS === 'web'
        ? {
            opacity: isHovered ? 0.8 : 1,
          }
        : {};

    return (
      <Animated.View
        key={itemId}
        style={[
          styles.circleItem,
          {
            width: itemWidth,
            marginHorizontal: itemMargin,
            // 개선된 애니메이션 스타일
            opacity: fadeAnim,
            transform: [
              { scale: animation.scale },
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [15, 0], // 위로 살짝 올라오는 효과
                }),
              },
            ],
            zIndex: 1,
          },
        ]}
      >
        {Platform.OS === 'web' ? (
          // 웹 환경에서는 호버 효과 추가 (Pressable 사용)
          <Pressable
            onHoverIn={() => handleItemHover(true)}
            onHoverOut={() => handleItemHover(false)}
            onPress={handleItemPress}
            style={{ ...webHoverStyle }}
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
          </Pressable>
        ) : (
          // 모바일 환경에서는 Pressable 사용
          <Pressable onPress={handleItemPress}>
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
          </Pressable>
        )}
      </Animated.View>
    );
  };

  /**
   * 선택된 재료로 만들 수 있는 메뉴 찾기
   */
  const findRecipe = () => {
    const selectedIngredientNames = selectedIngredients.map((i) => i.name);

    // 정확히 일치하는 레시피 찾기
    const exactMatch = cafeRecipesData.cafe.find((recipe: any) => {
      const recipeIngredients = recipe.ingredients;
      // 재료 수가 같고, 모든 재료가 일치하는지 확인
      return (
        recipeIngredients.length === selectedIngredientNames.length &&
        recipeIngredients.every((ingredient: any) =>
          selectedIngredientNames.includes(ingredient)
        )
      );
    });

    if (exactMatch) {
      // 이미 만든 레시피인지 확인 (중복 방지)
      const isDuplicate = completedRecipes.some(
        (recipe) => recipe.result === exactMatch.result
      );

      if (!isDuplicate) {
        // 새 레시피를 배열에 추가
        setCompletedRecipes((prev) => [...prev, exactMatch]);
      }

      // 팝업 표시
      setShowPopup(true);

      // 선택된 재료 초기화
      setSelectedIngredients([]);

      // 선택된 아이템 ID 초기화
      setSelectedItemId(null);

      // 3초 후 팝업 자동 닫기
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return true;
    }

    // 일치하는 레시피가 없을 경우
    alert('선택한 재료로 만들 수 있는 메뉴가 없습니다.');
    return false;
  };

  // 컴포넌트 렌더링
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.debugText}>
          선택된 재료 수: {selectedIngredients.length}/8
        </Text>

        {/* 첫 번째 줄 재료 */}
        <View style={styles.rowContainer}>
          {firstRow.map((ingredient, idx) =>
            createClickableItem(ingredient, idx, 0)
          )}
        </View>

        {/* 두 번째 줄 재료 */}
        <View style={styles.rowContainer}>
          {secondRow.map((ingredient, idx) =>
            createClickableItem(ingredient, idx, 1)
          )}
        </View>

        {/* 세 번째 줄 재료 */}
        <View style={styles.rowContainer}>
          {thirdRow.map((ingredient, idx) =>
            createClickableItem(ingredient, idx, 2)
          )}
        </View>

        {/* Bowl 컨테이너 */}
        <View style={styles.bowlContainer}>
          {/* Bowl (재료를 넣을 영역) */}
          <View ref={bowlRef} style={styles.bowl}>
            <Text style={styles.bowlText}>Bowl</Text>

            {/* 선택된 재료 표시 영역 */}
            <View style={styles.selectedIngredientsContainer}>
              {selectedIngredients.map((ingredient, idx) => (
                <View key={`selected-${idx}`} style={styles.selectedIngredient}>
                  <Image
                    source={imageMapping[ingredient.image]}
                    style={styles.selectedIngredientImage}
                    contentFit="cover"
                  />
                </View>
              ))}
            </View>
          </View>

          {/* 선택된 재료 목록 텍스트 (있을 경우에만 표시) */}
          {/* <Text style={styles.selectedIngredientsText}>
            선택된 재료: {selectedIngredients.map((i) => i.name).join(', ')}
          </Text> */}

          {/* 버튼 컨테이너 */}
          <View style={styles.buttonContainer}>
            {/* 초기화 버튼 */}
            <TouchableWithoutFeedback
              onPress={() => {
                setSelectedIngredients([]);
                // setCompletedRecipe(null);
              }}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>초기화</Text>
              </View>
            </TouchableWithoutFeedback>

            {/* 만들기 버튼 */}
            <TouchableWithoutFeedback onPress={findRecipe}>
              <View style={[styles.button, styles.makeButton]}>
                <Text style={styles.buttonText}>만들기</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* 완성된 레시피 목록 - FlatList 사용 */}
          {completedRecipes.length > 0 && (
            <View style={styles.completedRecipesListContainer}>
              <Text style={styles.completedRecipesTitle}>완성한 레시피</Text>

              <FlatList
                data={completedRecipes}
                keyExtractor={(item, index) => `recipe-${index}`}
                renderItem={({ item, index }) => (
                  <Pressable
                    style={styles.completedRecipeItem}
                    onHoverIn={() => setRecipeHovered(`recipe-${index}`)}
                    onHoverOut={() => setRecipeHovered(null)}
                    onPress={() =>
                      setRecipeHovered(
                        recipeHovered === `recipe-${index}`
                          ? null
                          : `recipe-${index}`
                      )
                    }
                  >
                    <View style={styles.recipeItemContainer}>
                      {/* 왼쪽: 레시피 이름 */}
                      <View style={styles.recipeNameContainer}>
                        <Text style={styles.completedRecipeTitle}>
                          {item.result}
                        </Text>
                      </View>

                      {/* 오른쪽: 호버/탭 시 표시되는 말풍선 */}
                      {recipeHovered === `recipe-${index}` && (
                        <View style={styles.recipeBubble}>
                          <View style={styles.recipeBubbleArrow} />
                          <Text style={styles.recipeDescription}>
                            {item.description}
                          </Text>
                          <Text style={styles.recipeIngredients}>
                            재료: {item.ingredients.join(', ')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                )}
                style={styles.recipesList}
                contentContainerStyle={styles.recipesListContent}
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                scrollEventThrottle={16}
                initialNumToRender={4}
                windowSize={5}
                removeClippedSubviews={Platform.OS !== 'web'}
              />
            </View>
          )}
        </View>
      </View>

      {/* 팝업 */}
      {showPopup && completedRecipes.length > 0 && (
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>
              {completedRecipes[completedRecipes.length - 1].result}
            </Text>
            <Text style={styles.popupDescription}>
              {completedRecipes[completedRecipes.length - 1].description}
            </Text>
            <TouchableWithoutFeedback onPress={() => setShowPopup(false)}>
              <View style={styles.popupCloseButton}>
                <Text style={styles.popupCloseButtonText}>닫기</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )}
    </View>
  );
};

/**
 * 스타일 정의
 *
 * 컴포넌트의 모든 스타일을 한 곳에서 관리합니다.
 * 각 스타일은 해당 요소의 레이아웃, 색상, 크기 등을 정의합니다.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  mainContent: {
    flex: 1,
  },
  rowWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  /**
   * 행 컨테이너 스타일
   *
   * 재료 아이템들을 가로로 배치하는 컨테이너입니다.
   * flexDirection: 'row'로 아이템을 가로로 배치합니다.
   */
  rowContainer: {
    flexDirection: 'row', // 가로 방향으로 아이템 배치
    justifyContent: 'flex-start', // 왼쪽부터 아이템 배치
    alignItems: 'center', // 세로 방향 중앙 정렬
    marginBottom: 10, // 아래쪽 여백
    flexWrap: 'nowrap', // 줄바꿈 방지 (항상 한 줄에 모든 아이템 표시)
    height: 60, // 고정 높이 60으로 설정
  },
  /**
   * 원형 아이템 스타일
   *
   * 각 재료 아이템의 컨테이너 스타일입니다.
   * 중앙 정렬된 내용을 가집니다.
   */
  circleItem: {
    alignItems: 'center', // 가로 방향 중앙 정렬
    marginBottom: 5, // 아래쪽 여백
    maxWidth: 60, // 최대 너비 60으로 제한
    maxHeight: 60, // 최대 높이 60으로 제한
    userSelect: 'none',
  },
  /**
   * 원형 이미지 스타일
   *
   * 재료 이미지를 원형으로 표시합니다.
   * 배경색은 연한 회색입니다.
   */
  circleImage: {
    backgroundColor: '#f0f0f0', // 연한 회색 배경 (이미지 로딩 전 표시)
    // width, height, borderRadius는 동적으로 설정됨
    userSelect: 'none',
  },
  /**
   * 재료 이름 텍스트 스타일
   *
   * 재료 이름을 작은 글씨로 표시합니다.
   * 중앙 정렬되며 한 줄로 표시됩니다.
   */
  name: {
    fontSize: 8, // 작은 글씨 크기
    marginTop: 2, // 위쪽 여백 (이미지와의 간격)
    textAlign: 'center', // 텍스트 중앙 정렬
    // width는 동적으로 설정됨
    userSelect: 'none',
  },
  /**
   * Bowl 컨테이너 스타일
   *
   * Bowl과 관련 요소들을 감싸는 컨테이너입니다.
   * 중앙 정렬되며 위아래 여백을 가집니다.
   */
  bowlContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    position: 'relative',
    zIndex: 1, // 낮은 z-index 설정
  },
  /**
   * Bowl 스타일
   *
   * 재료를 드롭할 수 있는 Bowl 영역입니다.
   * 둥근 모양과 그림자 효과를 가집니다.
   */
  bowl: {
    width: 200,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 3,
    borderColor: '#ddd',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1, // 낮은 z-index 설정
  },
  /**
   * Bowl 텍스트 스타일
   *
   * Bowl 내부에 표시되는 "Bowl" 텍스트 스타일입니다.
   */
  bowlText: {
    fontSize: 16, // 글씨 크기
    fontWeight: 'bold', // 굵은 글씨
    color: '#888', // 회색 텍스트
  },
  /**
   * 선택된 재료 컨테이너 스타일
   *
   * Bowl 내부에 선택된 재료들을 표시하는 영역입니다.
   * 여러 재료를 가로, 세로로 배치합니다.
   */
  selectedIngredientsContainer: {
    width: '80%', // Bowl 너비의 80%
    height: '60%', // Bowl 높이의 60%
    flexDirection: 'row', // 가로 방향으로 아이템 배치
    flexWrap: 'wrap', // 공간이 부족하면 다음 줄로 넘김
    justifyContent: 'center', // 가로 방향 중앙 정렬
    alignItems: 'center', // 세로 방향 중앙 정렬
  },
  /**
   * 선택된 개별 재료 스타일
   *
   * Bowl 내부에 표시되는 각 재료 아이템의 스타일입니다.
   */
  selectedIngredient: {
    width: 30, // 너비
    height: 30, // 높이
    margin: 2, // 모든 방향 여백
  },
  /**
   * 선택된 재료 이미지 스타일
   *
   * Bowl 내부에 표시되는 재료 이미지의 스타일입니다.
   * 작은 원형으로 표시됩니다.
   */
  selectedIngredientImage: {
    width: '100%', // 부모 컨테이너 너비 전체
    height: '100%', // 부모 컨테이너 높이 전체
    borderRadius: 15, // 둥근 모서리 (원형)
  },
  /**
   * 선택된 재료 텍스트 컨테이너 스타일
   *
   * Bowl 아래에 선택된 재료 목록과 초기화 버튼을 감싸는 컨테이너입니다.
   */
  selectedIngredientsTextContainer: {
    marginTop: 10, // 위쪽 여백
    alignItems: 'center', // 가로 방향 중앙 정렬
  },
  /**
   * 선택된 재료 텍스트 스타일
   *
   * Bowl 아래에 표시되는 선택된 재료 목록 텍스트의 스타일입니다.
   */
  selectedIngredientsText: {
    fontSize: 12, // 글씨 크기
    textAlign: 'center', // 텍스트 중앙 정렬
    marginBottom: 5, // 아래쪽 여백
    marginTop: 15,
  },
  /**
   * 버튼 컨테이너 스타일
   *
   * 선택된 재료를 초기화하는 버튼을 감싸는 컨테이너입니다.
   */
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  /**
   * 버튼 공통 스타일
   *
   * 모든 버튼에 공통되는 스타일입니다.
   */
  button: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  /**
   * 만들기 버튼 스타일
   *
   * 만들기 버튼에 특정되는 스타일입니다.
   */
  makeButton: {
    backgroundColor: '#4CAF50',
  },
  /**
   * 버튼 텍스트 스타일
   *
   * 버튼 내부에 표시되는 텍스트의 스타일입니다.
   */
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  /**
   * 완성된 레시피 컨테이너 스타일
   */
  completedRecipesListContainer: {
    marginTop: 15,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    // 재료 3줄을 기준으로 최대 높이 설정
    maxHeight: 300, // 픽셀 단위로 변경
  },
  /**
   * 완성된 레시피 목록 제목 스타일
   */
  completedRecipesTitle: {
    fontSize: 18, // 약간 작게 조정
    fontWeight: 'bold',
    marginBottom: 10, // 마진 줄임
    color: '#333',
    textAlign: 'center',
  },
  /**
   * 레시피 FlatList 스타일
   */
  recipesList: {
    width: '100%',
    maxHeight: 250,
  },
  /**
   * 레시피 FlatList 내부 컨텐츠 스타일
   */
  recipesListContent: {
    paddingVertical: 8,
  },
  /**
   * 완성된 레시피 아이템 스타일
   */
  completedRecipeItem: {
    width: '100%',
    padding: 10, // 패딩 약간 줄임
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8, // 마진 약간 줄임
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  /**
   * 레시피 아이템 컨테이너 스타일
   */
  recipeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  /**
   * 레시피 이름 컨테이너 스타일
   */
  recipeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /**
   * 완성된 레시피 제목 스타일
   */
  completedRecipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  /**
   * 레시피 말풍선 스타일
   */
  recipeBubble: {
    position: 'absolute',
    left: '45%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  /**
   * 말풍선 화살표 스타일
   */
  recipeBubbleArrow: {
    position: 'absolute',
    left: -10,
    top: '50%',
    marginTop: -5,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderTopColor: 'transparent',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: '#ddd',
  },
  /**
   * 레시피 설명 스타일
   */
  recipeDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    lineHeight: 18,
  },
  /**
   * 레시피 재료 스타일
   */
  recipeIngredients: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
  /**
   * 팝업 오버레이 스타일
   *
   * 팝업을 감싸는 오버레이의 스타일입니다.
   */
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
  /**
   * 팝업 스타일
   *
   * 팝업의 스타일입니다.
   */
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
  /**
   * 팝업 제목 스타일
   *
   * 팝업의 제목을 표시하는 텍스트의 스타일입니다.
   */
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  /**
   * 팝업 설명 스타일
   *
   * 팝업의 설명을 표시하는 텍스트의 스타일입니다.
   */
  popupDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  /**
   * 팝업 닫기 버튼 스타일
   *
   * 팝업의 닫기 버튼의 스타일입니다.
   */
  popupCloseButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  /**
   * 팝업 닫기 버튼 텍스트 스타일
   *
   * 팝업의 닫기 버튼 내부에 표시되는 텍스트의 스타일입니다.
   */
  popupCloseButtonText: {
    fontSize: 14,
    color: '#333',
  },
  debugText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
});

/**
 * 컴포넌트 내보내기
 *
 * 이 컴포넌트를 다른 파일에서 import하여 사용할 수 있도록 내보냅니다.
 */
export default index;
