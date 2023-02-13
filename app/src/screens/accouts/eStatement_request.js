import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { fontName, fontSize, FONTS, SIZES } from "../../../styles/global.config";
import {
    radioSelected, radioNotSelected
} from '../../../assets/icons';
import { BackIcon, Logo } from "../../../assets/svg";
import LinearGradient from 'react-native-linear-gradient';
import { ACCOUNTS } from '../../routes';
import { CheckedIcon, UnCheckIcon } from '../../../assets/svg'
import { ScrollView } from 'react-native-gesture-handler';
export default function EStatementRequestScreen({ navigation, route }) {
    const { params } = route;
    const [showAdvanced, setShowAvanced] = useState(false)
    const [epassBookList, setEpassBookList] = useState([{ label: 'Every week' }, { label: 'Every month' }, { label: 'Every quarter' }])
    const [comulativeList, setComulativeList] = useState([{ label: 'Every day- Comulative', instruction: 'On selecting this, you will receive incremental records in your statements every day starting from 1st of month' }, { label: 'Every week- Comulative', instruction: 'On selecting this, you will receive incremental records in your statements every week starting from 1st of month' }])
    const renderHeader = () => {
        return (<LinearGradient
            useAngle={true}
            angle={170}
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={["#4370e7", "#4370e7", "#479ae8", "#4ad4e8"]}>
            <View style={{
                flexDirection: 'row',
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10
            }}>
                <TouchableOpacity
                    style={{ alignItems: 'center', marginLeft: 10, width: '10%' }}
                    onPress={() => {
                        navigation.goBack()

                    }}
                >
                    <BackIcon />
                </TouchableOpacity>
                <Text style={{ ...FONTS.h3, color: '#FFF', fontFamily: fontName.medium, textAlign: 'center' }}>eStatement request</Text>
                <View />
            </View>
        </LinearGradient>)
    }
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', padding: 5, marginLeft: 20 }}
                onPress={() => {
                    const dummyarray = epassBookList;
                    let arr = dummyarray.map((item, ind) => {
                        if (index === ind) {
                            item.isSelected = true
                        }
                        else {
                            item.isSelected = false
                        }

                        return { ...item }
                    })
                    setEpassBookList(arr)
                }}
            >

                {/* {item.isSelected ?
                    <CheckedIcon color='#16caa7' /> : <UnCheckIcon color={'#252525'} />
                } */}
                <Image
                    source={item.isSelected ? radioSelected : radioNotSelected}
                    style={{ width: 25, height: 25, tintColor: item.isSelected ? '#16caa7' : '#000' }}
                />
                <Text style={{ ...FONTS.body4, color: '#252525', opacity: 0.7, marginLeft: 10, fontFamily: fontName.medium }}>{item.label}</Text>
            </TouchableOpacity>)
    }
    const renderComulativeItem = ({ item, index }) => {
        return (
            <TouchableOpacity

                onPress={() => {
                    const dummyarray = comulativeList;
                    let arr = dummyarray.map((item, ind) => {
                        if (index === ind) {
                            item.isSelected = true
                        }
                        else {
                            item.isSelected = false
                        }

                        return { ...item }
                    })
                    setComulativeList(arr)
                }}
            >
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}
                >
                    {/* {item.isSelected ?
                    <CheckedIcon color='#16caa7' /> : <UnCheckIcon color={'#252525'} />
                } */}
                    <Image
                        source={item.isSelected ? radioSelected : radioNotSelected}
                        style={{ width: 25, height: 25, tintColor: item.isSelected ? '#16caa7' : '#000' }}
                    />
                    <Text style={{ ...FONTS.body4, color: '#252525', opacity: 0.7, marginLeft: 10, fontFamily: fontName.medium }}>{item.label}</Text>
                </View>
                <Text style={{ marginLeft: 60, ...FONTS.body5, color: '#9c9c9c', alignSelf: 'baseline' }}>{item.instruction}</Text>
            </TouchableOpacity>)
    }
    return (<View style={{ flex: 1, width: '100%' }}>
        <ScrollView
            showsVerticalScrollIndicator={false}
        >

            {/* Header */}
            {renderHeader()}
            {/* Body  */}
            <Text style={{ ...FONTS.h3, color: '#252525', textAlign: 'center', opacity: 0.7, fontFamily: fontName.medium }}>Please select a frequency to start receiving your eStatement</Text>
            <View style={{ height: 120 }}>
                <FlatList
                    data={epassBookList}
                    extraData={epassBookList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={renderItem}
                />
            </View>
            {!showAdvanced && (<TouchableOpacity
                onPress={() => {
                    setShowAvanced(true)
                }}
            >
                <Text style={{ ...FONTS.h5, color: '#2196f3', textAlign: 'center' }}>View advanced option</Text>
            </TouchableOpacity>
            )}
            {showAdvanced && <>
                <View style={{ height: 1, marginTop: 10, backgroundColor: '#bdbdbd' }} />
                <View style={{ height: 200 ,marginTop:10}}>
                    <FlatList
                        data={comulativeList}
                        extraData={comulativeList}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={renderComulativeItem}
                    />
                </View>
            </>

            }
        </ScrollView>
    </View>)
}
