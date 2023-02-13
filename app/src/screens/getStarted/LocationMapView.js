import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    Platform,
    Image,
    ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fontName, fontSize, FONTS, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { AuthHeader } from '../../components';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import { AcceptTermsIcon, CrossIcon, RadioButtonUncheckedIcon } from '../../../assets/svg'
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import {
    pinIcon, takeMeHere,
} from '../../../assets/icons'
const LocationMapView = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const [viewHeight, setViewHeight] = useState(330)
    const [showAlert, setShowAlert] = useState(false)
    const { params } = route;
    let mapRef = null;
    const { theme, changeTheme } = useContext(AppContext)
    return (<SafeAreaView
        style={{
            flex: 1,
            backgroundColor: theme.colors.bgColor
        }}>


        <AuthHeader title={t(AUTH_KEYS.LOCATE_US.TITLE)}
            navigation={navigation} />
        <MapView
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            showsMyLocationButton={true}
            userLocationPriority={'high'}
            style={{
                flex: 1,
                borderRadius: 10,

            }}
            region={params && params.region}
            ref={ref => {
                mapRef = ref
            }}>
            {params && params.markers &&
                params.markers.map((marker, index) => (
                    <Marker
                        coordinate={marker.latlng}
                        title={marker.title}
                        key={index.toString()}
                        image={pinIcon}
                    />
                ))}
        </MapView>
        <Animated.View style={{ height: viewHeight }}>
            <ScrollView>
            <View style={{flex:1,paddingBottom:30}}>
                <Text style={{ ...FONTS.body4, textAlign: 'left', marginTop: '5%', marginHorizontal: 20, color: theme.colors.textColor }}>{params.label}</Text>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end' }}>
                    <Text style={{ ...FONTS.h3, textAlign: 'left', marginHorizontal: 20, color: theme.colors.textColor, marginTop: '5%', }}>{params.item.locationName}</Text>

                    <TouchableOpacity
                        disabled={showAlert}
                        style={{ marginRight: 20 }} onPress={() => {
                            setViewHeight(0)
                        }}>
                        <CrossIcon color={theme.colors.buttonColor} />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 0.5, marginTop: '5%', backgroundColor: theme.colors.grey, opacity: 0.2 }} />
                <Text style={{ ...FONTS.body4, textAlign: 'left', marginTop: '5%', marginHorizontal: 20, color: theme.colors.textColor }}>{t(AUTH_KEYS.LOCATE_US.ADDRESS)}</Text>
                <Text style={{ ...FONTS.h3, textAlign: 'left', marginHorizontal: 20, color: theme.colors.textColor, marginTop: 20, lineHeight: Platform.OS === 'android' ? 24 : 23 }}>{params.item.address}</Text>
                <View style={{ height: 0.5, marginTop: 5, backgroundColor: theme.colors.grey, opacity: 0.2 }} />
                <TouchableOpacity
                    disabled={showAlert}
                    onPress={() => {
                        // const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                        // const latLng = `${params.item.latitude},${params.item.longitude}`;
                        // const url = Platform.select({
                        //     ios: `${scheme}${params.item.address}@${latLng}`,
                        //     android: `${scheme}${latLng}(${params.item.address})`
                        // });

                        // Linking.openURL(url);
                        setShowAlert(true)
                    }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 20, alignItems: 'center', marginTop: '5%' }}>
                        <Image
                            source={takeMeHere}
                            style={{ width: 12, height: 12 }}
                        />
                        <Text style={{ ...FONTS.h3, color: theme.colors.buttonColor, marginLeft: 5 }}>{t(AUTH_KEYS.LOCATE_US.TEKE_ME_HERE)}</Text>

                    </View>
                </TouchableOpacity>


                <View style={{ flexDirection: 'row', marginTop: '5%', marginHorizontal: 20 }}>
                    {params.label === "Branch" ? null :
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: '10%' }}>
                            {params.item.hasBranch ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                            <Text style={{ ...FONTS.body4, textAlign: 'left', color: theme.colors.textColor, marginLeft: 5 }}>{"Branch"}</Text>
                        </View>
                    }

                    {params.label === "ATM" ? null :
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: '10%' }}>
                            {params.item.hasAtm ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                            <Text style={{ ...FONTS.body4, textAlign: 'left', color: theme.colors.textColor, marginLeft: 5 }}>{"ATM"}</Text>
                        </View>
                    }
                    {params.label === "Locker" ? null :
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: '10%' }}>
                            {params.item.hasLockerAvailability ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                            <Text style={{ ...FONTS.body4, textAlign: 'left', color: theme.colors.textColor, marginLeft: 5 }}>{"Locker facility"}</Text>
                        </View>
                    }
                </View>
            </View>
            </ScrollView>
        </Animated.View>
        {showAlert &&
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >

                <View
                    style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: 20,
                        right: 0,
                        width: SIZES.width * 0.9,
                        paddingVertical: 10,
                        paddingHorizontal: 30,
                        backgroundColor: "#FFFF"
                    }}
                >
                    <Text style={{ ...FONTS.h3, color: '#000', paddingVertical: 10 }}>{t(AUTH_KEYS.LOCATE_US.GET_DIRECTION)}</Text>
                    <Text style={{ ...FONTS.body4, color: '#000', paddingVertical: 10 }}>{t(AUTH_KEYS.LOCATE_US.GET_DIRECTION_MSG)}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: SIZES.padding * 2,
                            justifyContent: 'flex-end'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                height: 50,
                                flex: 1,
                                marginLeft: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => setShowAlert(false)}
                        >
                            <Text style={{ ...FONTS.h3, color: "#000" }}>{t(AUTH_KEYS.LOCATE_US.CANCEL)}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                height: 50,
                                alignItems: 'center',
                                marginLeft: 20,
                                justifyContent: 'center',
                            }}
                            onPress={() => {
                                const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                                const latLng = `${params.item.latitude},${params.item.longitude}`;
                                const url = Platform.select({
                                    ios: `${scheme}${params.item.address}@${latLng}`,
                                    android: `${scheme}${latLng}(${params.item.address})`
                                });
                                Linking.openURL(url);
                                setShowAlert(false)
                            }}
                        >


                            <Text style={{ ...FONTS.h3, color: "#588bf8" }}>{t(AUTH_KEYS.LOCATE_US.CONTINUE)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        }

    </SafeAreaView>)

}
export default LocationMapView;