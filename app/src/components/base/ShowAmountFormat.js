
import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Platform
} from 'react-native';
import { currencyValue, fontName, fontPixel, FONTS } from "../../../styles/global.config";
import { abbrNum, amountFormatWithoutCurrency, getWholeAndDecimal } from '../../utils/amount-util';

export default function ShowAmountFormat({ currency, amount, currencyFontSize, amountFontSize, color, amtStyle }) {


    return (
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: Platform.OS === 'ios' ? 10 : 0 }}>
            <Text style={{ ...FONTS.body1, color: color ? color : '#FFFF', fontSize: currencyFontSize ? currencyFontSize : 20, marginRight: 5, ...amtStyle }}>
                {currencyValue[currency]}
            </Text>
            <Text style={{ ...FONTS.body1, color: color ? color : '#FFFF', fontSize: amountFontSize ? amountFontSize : 35, ...amtStyle }}>
                {/* {amountFormatWithoutCurrency(item.availableBalance, item.acctCcy)} */}

                {amountFormatWithoutCurrency(getWholeAndDecimal(amount)[0])}
                {/* {abbrNum(getWholeAndDecimal(item.availableBalance)[0], 2)} */}
            </Text>


            <Text style={{ ...FONTS.body1, color: color ? color : '#FFFF', fontSize: currencyFontSize ? currencyFontSize : 20, ...amtStyle }}>
                {/* {amountFormatWithoutCurrency(item.availableBalance, item.acctCcy)} */}
                {"." + getWholeAndDecimal(parseFloat(amount).toFixed(2))[1]}
            </Text>
        </View>
    )

}