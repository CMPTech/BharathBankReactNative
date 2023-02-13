import React, { useEffect, useContext, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity, Animated,
  Image,
  ScrollView

} from "react-native";
import { fontName, fontSize, FONTS, SIZES } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import ATMs from './ATMView';
import Branches from './BranchesView';
import Lockers from './LockersView';
import { BackIcon, GetStartedLocationIcon, MapIcon } from '../../../assets/svg'
import i18n from '../../../../i18n'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { pinIcon } from "../../../assets/icons";
const screens = {
  atm: i18n.t(AUTH_KEYS.LOCATE_US.ATMS),
  branch: i18n.t(AUTH_KEYS.LOCATE_US.BRANCHES),
  lockers: i18n.t(AUTH_KEYS.LOCATE_US.LOCKERS)
}
const tabs_list = [
  {
    id: 0,
    label: screens.atm,
    value: "ATM"
  },
  {
    id: 1,
    label: screens.branch,
    value: "BRANCH"
  },
  {
    id: 2,
    label: screens.lockers,
    value: "LOCKER"
  }
].map((tabs_list) => ({
  ...tabs_list,
  ref: React.createRef()
}))
export default function ATMBranchLockerScreen({ navigation, route }) {
  const { params } = route;

  const [showMapIcon, setShowMapIcon] = useState(false);

  const TabIndicator = ({ measureLayout, scrollX }) => {
    const inputRange = tabs_list.map((_, i) => i * SIZES.width)
    const tabIndicatorWidth = scrollX.interpolate({
      inputRange,
      outputRange: measureLayout.map(measure => measure.width)
    })
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: measureLayout.map(measure => measure.x)
    })



    return (<Animated.View
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: '10%',
        width: tabIndicatorWidth,
        backgroundColor: '#00ffce',
        transform: [{ translateX }]
      }}
    />)
  }
  const Tabs = ({ scrollX, onBottomTabPress }) => {
    const containerRef = React.useRef();
    const [measureLayout, setMeasureLayout] = React.useState([])

    React.useEffect(() => {
      let ml = []
      tabs_list.forEach(bottom_tab => {
        bottom_tab?.ref?.current?.measureLayout(containerRef.current, (x, y, width, height) => {
          ml.push({ x, y, width, height })
          if (ml.length === tabs_list.length) {
            setMeasureLayout(ml)
          }
        })
      })

    }, [containerRef.current, currentIndex])

    return (<View
      ref={containerRef}
      style={{
        flex: 1,
        flexDirection: 'row'
      }}>
      {/* Tab Indicator */}
      {measureLayout.length > 0 &&
        <TabIndicator
          measureLayout={measureLayout}
          scrollX={scrollX}
        />
      }

      {/* Tabs */}
      {tabs_list.map((item, index) => {
        return (<TouchableOpacity
          key={`Tab-${index}`}
          ref={item.ref}
          style={{ flex: 1, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => onBottomTabPress(index)}
        >
          <Text style={{ color: currentIndex === index ? '#00ffce' : "#FFF", ...FONTS.h3 }}>
            {item.label == screens.atm &&
              `${item.label} ${params?.atmList.filter(v => v.hasAtm).length > 0 ? (`(${params?.atmList.filter(v => v.hasAtm).length})`) : ''}`
            }
            {item.label == screens.branch &&
              `${item.label} ${params?.atmList.filter(v => v.hasBranch).length > 0 ? (`(${params?.atmList.filter(v => v.hasBranch).length})`) : ''}`
            }
            {item.label == screens.lockers &&
              `${item.label} ${params?.atmList.filter(v => v.hasLockerAvailability).length > 0 ? (`(${params?.atmList.filter(v => v.hasLockerAvailability).length})`) : ''}`
            }
          </Text>
        </TouchableOpacity>)
      })

      }
    </View>)
  }
  const top_tabs = [
    {
      id: 0,
      label: screens.atm,
    },
    {
      id: 1,
      label: screens.branch,
    },
    {
      id: 2,
      label: screens.lockers,
    }
  ]
  const { t, i18n } = useTranslation();
  const { theme, changeTheme } = useContext(AppContext);
  const flatListRef = useRef();
  const scrollX = React.useRef(new Animated.Value(0)).current
  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewChangeRef = useRef(({ viewableItems, changed }) => {
    setCurrentIndex(viewableItems[0].index)
  })
  const onBottomTabPress = React.useCallback(bottomTabIndex => {
    flatListRef?.current?.scrollToOffset({
      offset: bottomTabIndex * SIZES.width
    })
  })
  const renderContent = () => {
    return (<ScrollView style={{ flex: 1, marginTop: showMapIcon?0:10 }} >
      <Animated.FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        snapToAlignment={'center'}
        // scrollEnabled={false}
        snapToInterval={SIZES.width}
        decelerationRate='fast'
        scrollEventThrottle={16}
        disableIntervalMomentum={true}
        showsHorizontalScrollIndicator={false}
        data={top_tabs}
        onViewableItemsChanged={onViewChangeRef.current}
        keyExtractor={item => `Main-${item.id}`}
        onScroll={
          Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })
        }
        renderItem={({ item, index }) => {
          return (<ScrollView style={{ height: '100%', width: SIZES.width }}>
            {item.label == screens.atm && <ATMs atmList={params?.atmList.filter(v => v.hasAtm)} navigation={navigation} route={route} showMap={showMapIcon} />}
            {item.label == screens.branch && <Branches branchesList={params?.atmList.filter(v => v.hasBranch)} navigation={navigation} route={route} showMap={showMapIcon} />}
            {item.label == screens.lockers && <Lockers lockerList={params?.atmList.filter(v => v.hasLockerAvailability)} navigation={navigation} route={route} showMap={showMapIcon} />}
          </ScrollView>)
        }}
      />

    </ScrollView>)
  }

  const renderMapContent = () => {
    return (<ScrollView style={{ flex: 1, marginTop: 10 }} >
      <Animated.FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        snapToAlignment={'center'}
        // scrollEnabled={false}
        snapToInterval={SIZES.width}
        decelerationRate='fast'
        scrollEventThrottle={16}
        disableIntervalMomentum={true}
        showsHorizontalScrollIndicator={false}
        data={top_tabs}
        onViewableItemsChanged={onViewChangeRef.current}
        keyExtractor={item => `Main-${item.id}`}
        onScroll={
          Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })
        }
        renderItem={({ item, index }) => {
          return (<ScrollView style={{ height: '100%', width: SIZES.width }}>
            {/* {item.label == screens.atm && <ATMs atmList={params?.atmList.filter(v => v.hasAtm)} navigation={navigation} route={route} />}
            {item.label == screens.branch && <Branches branchesList={params?.atmList.filter(v => v.hasBranch)} navigation={navigation} route={route} />}
            {item.label == screens.lockers && <Lockers lockerList={params?.atmList.filter(v => v.hasLockerAvailability)} navigation={navigation} route={route} />} */}

            <MapView
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              showsMyLocationButton={true}
              userLocationPriority={'high'}
              style={{
                flex: 1,
                borderRadius: 10,

              }}
              region={params && params.atmList}
              ref={ref => {
                mapRef = ref
              }}>
              {params && params.atmList &&
                params.atmList.map((marker, index) => (
                  <Marker
                    coordinate={marker.latlng}
                    title={marker.title}
                    key={index.toString()}
                    image={pinIcon}
                  />
                ))}
            </MapView>

          </ScrollView>)
        }}
      />

    </ScrollView>)
  }
  const renderTab = () => {
    return (
      // <LinearGradient
      //   useAngle={true}
      //   angle={45}
      //   angleCenter={{ x: 0.5, y: 0.5 }}
      //   colors={["#4370e7", "#479ae8", "#4ad4e8"]} >

      <View style={{ height: 50, width: SIZES.width }}>
        <Tabs scrollX={scrollX}
          onBottomTabPress={onBottomTabPress}

        />
      </View>
      // </LinearGradient>
    )

  }
  const renderHeader = () => {
    return (<LinearGradient
      useAngle={true}
      angle={135}
      style={{ paddingTop: 10 }}
      angleCenter={{ x: 0.5, y: 0.5 }}
      colors={["#4370e7", "#4370e7", "#4370e7", "#4ad4e8"]}>
      <View style={{
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
      }}>


        <TouchableOpacity
          onPress={() => { navigation.goBack() }}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={FONTS.headerText}>{t(AUTH_KEYS.LOCATE_US.LOCATION_ACCESS)}</Text>


        {showMapIcon ?
          <TouchableOpacity
            style={{ position: 'absolute', right: 10 }}
            onPress={() => { setShowMapIcon(!showMapIcon) }}>
            <GetStartedLocationIcon />
          </TouchableOpacity>
          :
          <TouchableOpacity
            style={{ position: 'absolute', right: 10 }}
            onPress={() => { setShowMapIcon(!showMapIcon) }}>
            <MapIcon />
          </TouchableOpacity>
        }
      </View>
      {renderTab()}
    </LinearGradient>)
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bgColor
      }}>

      <View style={{ flex: 1 }}>
        {/* Header */}
        {renderHeader()}
        {/* Render Tabs */}

        {/* Reneder Content */}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}


