
import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { fontName, FONTS } from "../../../styles/global.config";
import {
    noSearchIcon,
    rightArrow,
} from '../../../assets/icons'
export default function EmptyListItem() {
    return (<View>
        <Image
            source={noSearchIcon}
            style={{ width: 80, height: 80, alignItems: 'center', alignSelf: 'center', margin: 20 }}
        />
        <Text style={{ ...FONTS.h1, textAlign: 'center', alignSelf: 'center', color: '#121212', marginBottom: 30, fontFamily: fontName.medium, opacity: 0.8 }}>{`${"No payees found "}`}</Text>
    </View>)

}