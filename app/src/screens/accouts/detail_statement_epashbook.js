import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { fontName, fontSize, FONTS, SIZES } from "../../../styles/global.config";
import {
    setting,
} from '../../../assets/icons';
import { BackIcon, Logo } from "../../../assets/svg";
import LinearGradient from 'react-native-linear-gradient';
import { t } from 'i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import {ACCOUNTS} from '../../routes'
export default function DetailedStatementEpassbookScreen({ navigation, route }) {
    const { params } = route;
    const [epassBookList, setEpassBookList] = useState([{ label: 'ePassbook view', route: ACCOUNTS.VIEW_E_PASS_BOOK}, { label: 'eStatement request',  route: ACCOUNTS.EPAS_BOOK_REQUEST }])
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
                <Text style={{ ...FONTS.h3, color: '#FFF', fontFamily: fontName.medium, textAlign: 'center' }}>Detailed statement</Text>
                <View />
            </View>
        </LinearGradient>)
    }
    const renderItem = ({ item, index }) => {
        return (<TouchableOpacity
            onPress={() => {
                navigation.navigate(item.route)
            }}
        >
            <Text style={{ padding: 20, ...FONTS.h4, color: '#000', opacity: 0.7 }}>{item.label}</Text>
            <View style={{ height: 1, marginTop: 5, backgroundColor: '#bdbdbd' }} />
        </TouchableOpacity>)
    }
    return (<View style={{ flex: 1, width: '100%' }}>

        {/* Header */}
        {renderHeader()}
        {/* Body  */}
        <View style={{ marginTop: 10 }} />
        <FlatList
            data={epassBookList}
            extraData={epassBookList}
            keyExtractor={(item, index) => `${index}`}
            renderItem={renderItem}
            ListEmptyComponent={() => {
                return (<View></View>)
            }}

        />

    </View>)
}
