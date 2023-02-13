import React, { useContext, useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from "../input/StyleTextView";
import { fontName, fontSize } from "../../../styles/global.config";
import { SelectDownArrowIcon, TickIcon } from "../../../assets/svg";
import StyleInputView from "../input/StyleInputView";
import PlainButton from "../button/PlainButton";
import { Overlay } from 'react-native-elements'
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from "../../../assets/translations/constants";

export default function AccountDropDownView({
    placeholder,
    data,
    onChangeText,
    onSubmitEditing,
    errors,
    value,
    touched,
    dropDownlabel,
    disabled,
    selectedValue,
    textInputConatinerStyle,
    arrowStyle,
    hintStyle,
    inputViewStyle
}) {

    const scrollElementHeightPercent = 30;

    const [contentOffset, setContentOffset] = React.useState({ x: 0, y: 0 });
    const [contentSize, setContentSize] = React.useState(0);

    const [scrollViewHeight, setScrollViewHeight] = React.useState(0);

    const scrollPerc = (contentOffset.y / (contentSize - scrollViewHeight))
        * (100 - scrollElementHeightPercent);
    const { t, i18n } = useTranslation();
    const { theme, changeTheme } = useContext(AppContext)
    const [dropDownData, setDropDownData] = useState(data);
    const [showDropdownDialog, setShowDropdownDialog] = useState(false);
    useEffect(() => {
        setDropDownData(data)
        if (value === "") {
            if (data.length > 0) {
                if (selectedValue) {
                    onChangeText(data.find(v => v[dropDownlabel] === selectedValue)[dropDownlabel])
                }
                else {
                    onChangeText(data.find(v => v.primaryAccount === true)[dropDownlabel])
                }
            }


        }
    }, [data]);
    const showDropDownUI = (values) => {
        return (
            <Overlay
                isVisible={showDropdownDialog}
                onBackdropPress={() => setShowDropdownDialog(!showDropdownDialog)}
                height='auto'
                overlayStyle={{
                    color: theme.colors.mainBackground1,
                    width: '90%',
                }}>
                <View style={{ padding: 15, marginTop: 10 ,overflow:'hidden'}}>
                    <StyleTextView value={placeholder} style={{
                        fontSize: fontSize.textLarge,
                        fontFamily: fontName.medium,
                        color: theme.colors.headingTextColor,

                    }} />


                    <View
                        style={{
                            borderWidth: 1,
                            borderColor:theme.colors.grey,
                            position: "absolute",
                            top: `${Number(scrollPerc || 0).toFixed(0)}%`,
                            height: `${scrollElementHeightPercent}%`,
                            right: 5,
                            overflow:'scroll',
                            maxHeight: 200,
                            flex: 1,
                            flexWrap:'wrap', 
                            overflow:'hidden'
                        }}
                    />

                    <FlatList
                        data={dropDownData}
                        extraData={dropDownData}
                        numColumns={1}
                        persistentScrollbar={false}
                        showsVerticalScrollIndicator={false}
                        onLayout={e => {
                            setScrollViewHeight(e.nativeEvent.layout.height);
                        }}
                        onScroll={e => {
                            setContentOffset(e.nativeEvent.contentOffset);
                        }}
                        onContentSizeChange={(_, height) => {
                            setContentSize(height);
                        }}
                        style={{ width: '100%', height: 'auto', marginBottom: 50, maxHeight: 200, paddingRight: 10 }}
                        key={({ index }) => index.toString()}
                        ListEmptyComponent={() => {
                            return (<StyleTextView value={`${t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SORRY_NO_RECORDS_NOT_FOUND)}`} style={{
                                fontSize: fontSize.textNormal,
                                fontFamily: fontName.regular,
                                color: theme.colors.black,
                                textAlign: 'left',
                                paddingTop: 10
                            }} />)
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowDropdownDialog(!showDropdownDialog)
                                            const dummyData = data
                                            let arr = dummyData.map((items, ind) => {
                                                if (ind == index) {
                                                    items.isSelected = true
                                                    // selectedValue = (items[dropDownlabel])
                                                }
                                                else {
                                                    items.isSelected = false
                                                }

                                                return { ...items }
                                            })
                                            setDropDownData(arr);
                                            onChangeText(item[dropDownlabel])

                                        }}
                                        style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}>

                                        <View style={{ width: '90%' }}>
                                            <StyleTextView value={item.acctShortName !== null ? item.acctShortName : item.acctName} style={{
                                                fontSize: fontSize.textNormal,
                                                fontFamily: fontName.regular,
                                                color: theme.colors.black,
                                                textAlign: 'left',
                                                paddingTop: 5,
                                                opacity: .8,
                                            }} />
                                            <StyleTextView value={item.acctNo} style={{
                                                fontSize: fontSize.textNormal,
                                                fontFamily: fontName.regular,
                                                color: theme.colors.grey,
                                                textAlign: 'left',
                                                paddingTop: 5
                                            }} />
                                            <StyleTextView value={item.acctBranchDesc} style={{
                                                fontSize: fontSize.textNormal,
                                                fontFamily: fontName.regular,
                                                color: theme.colors.grey,
                                                textAlign: 'left',
                                                paddingTop: 5
                                            }} />

                                        </View>
                                        <View style={{ width: '10%', alignSelf: 'flex-end' }}>
                                            {item[dropDownlabel] === value ? <TickIcon /> :
                                                null
                                            }
                                        </View>


                                    </TouchableOpacity>
                                    {index + 1 < dropDownData.length
                                        ?
                                        <View style={{
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            borderColor: theme.colors.dividerColor,
                                            opacity: .2
                                        }} />
                                        :
                                        null}
                                </View>
                            )
                        }}
                    />
                    {dropDownData.length > 0 ?

                        <View style={{ position: 'absolute', bottom: 10, right: 10, flexDirection: 'row' }}>
                            <PlainButton
                                style={{ marginRight: 20, color: theme.colors.black }}
                                title={t(AUTH_KEYS.LOCATE_US.CANCEL)} onPress={() => {
                                    setShowDropdownDialog(!showDropdownDialog)
                                }
                                } />
                        </View>
                        :
                        null}
                </View>
            </Overlay>
        );
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>

            {showDropDownUI()}
            <TouchableOpacity
                activeOpacity={1.0}
                onPress={() => {
                    if (disabled) {
                        setShowDropdownDialog(false)
                    }
                    else {
                        setShowDropdownDialog(true)
                    }

                }}>
                <View>
                    <StyleInputView
                        containerStyle={{}}
                        placeholder={placeholder}
                        editable={false}
                        value={value}
                        touched={touched}
                        hintStyle={hintStyle}
                        returnKeyType='done'
                        keyboardType='phone-pad'
                        errors={errors}
                        onChangeText={onChangeText}
                        inputViewStyle={inputViewStyle}
                        textInputConatinerStyle={textInputConatinerStyle}
                        onSubmitEditing={onSubmitEditing}
                    />
                    <View
                        style={{ flex: 1, position: 'absolute', right: 0, bottom: 10, flexDirection: 'column' ,...arrowStyle}}
                        onPress={() => {
                            setShowDropdownDialog(true)
                        }}>
                        <SelectDownArrowIcon color={theme.colors.buttonColor} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}