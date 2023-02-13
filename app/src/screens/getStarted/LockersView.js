import React, { useContext } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { FONTS, SIZES } from "../../../styles/global.config";
import { LOCATION } from "../../routes";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import {
    locker,
    noSearchIcon,
    rightArrow
} from '../../../assets/icons'
import { AppContext } from '../../../themes/AppContextProvider';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
    pinIcon, takeMeHere,
} from '../../../assets/icons'

const Lockers = ({ lockerList = [], navigation ,showMap=false}) => {
    const { t, i18n } = useTranslation();
    const { theme, changeTheme } = useContext(AppContext);
    let mapRef = null;
    return (
    
        <View style={{
            marginTop: showMap ? 0 : 40,
            marginBottom: 10,
            marginHorizontal: showMap ? 0 : 10
        }}>
    
    
            {showMap &&  lockerList.length>0 &&
                <MapView
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    userLocationPriority={'high'}
                    style={{
                        height: SIZES.height
                    }}
                    region={{
                        latitude: lockerList.length > 0 ? parseFloat(lockerList[0].latitude) : "",
                        longitude: lockerList.length > 0 ? parseFloat(lockerList[0].longitude) : "",
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    ref={ref => {
                        mapRef = ref
                    }}>
                    {lockerList && lockerList.length>0 &&
                        lockerList.map((marker, index) => (
                            <Marker
                                coordinate={{ 
                                    latitude: marker.latitude ? parseFloat(marker.latitude) : 0,
                                longitude: marker.longitude ? parseFloat(marker.longitude) : 0,
                                      }}
                                      title={marker.locationName?marker.locationName:""}
                                key={index.toString()}
                                image={pinIcon}
                                onPress={() => {
                                    navigation.navigate(LOCATION.LOCATION_MAP_VIEW, {
                                        label: "Locker", item: marker, region: {
                                            latitude: parseFloat(marker.latitude),
                                            longitude: parseFloat(marker.longitude),
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        },
                                        markers: [
                                            {
                                                title: marker.locationName,
                                                latlng: {
                                                    latitude: parseFloat(marker.latitude),
                                                    longitude: parseFloat(marker.longitude),
                                                },
                                            },
                                        ]
                                    })
                                }
    
                                }
                            />
    
    
    
    
                        ))}
    
    
                </MapView>
            }
        {lockerList.length > 0 ?

            <Image
                source={locker}
                style={{ width: 80, height: 80, alignItems: 'center', alignSelf: 'center', margin: 20 }}
            />
            :

            <Image
                source={noSearchIcon}
                style={{ width: 80, height: 85, alignItems: 'center', alignSelf: 'center', margin: 20 }}
            />


        }

        <Text style={{ ...FONTS.h1, textAlign: 'center', alignSelf: 'center', color: theme.colors.textColor, marginBottom: 30 }}>{lockerList.length > 0 ? `${t(AUTH_KEYS.LOCATE_US.WE_FOUND)} ${lockerList.length} ${t(AUTH_KEYS.LOCATE_US.WE_FOUND_LOKERS)}` : `${t(AUTH_KEYS.LOCATE_US.WE_NOT_FOUND_LOKERS)} `}</Text>
        <FlatList
            data={lockerList}
            extraData={lockerList}
            renderItem={({ item }) => {
                return (<TouchableOpacity
                    onPress={() => {
                        navigation.navigate(LOCATION.LOCATION_MAP_VIEW, {
                            label: "Locker", item, region: {
                                latitude: parseFloat(item.latitude),
                                longitude: parseFloat(item.longitude),
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            },
                            markers: [
                                {
                                    title: item.locationName,
                                    latlng: {
                                        latitude: parseFloat(item.latitude),
                                        longitude: parseFloat(item.longitude),
                                    },
                                },]
                        })
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...FONTS.body4, padding: 10, color: '#6c6c6c', width: '95%' }} numberOfLines={1}>{`${item.locationName} ,${item.address}`}</Text>
                        <Image
                            source={rightArrow}
                            style={{ width: 10, height: 15, tintColor: '#588bf8', alignSelf: 'center', }}
                        />
                    </View>
                    <View style={{ height: 1, marginTop: 5, backgroundColor: '#F3F4F6' }} />
                </TouchableOpacity>)
            }}
        />
    </View>)

}
export default Lockers;