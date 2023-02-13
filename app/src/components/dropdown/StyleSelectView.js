import React, { useContext } from "react";
import {
    View,
    Text
} from "react-native";
import { AppContext } from "../../../themes/AppContextProvider";
import { Dropdown } from 'react-native-element-dropdown';
import StyleTextView from "../input/StyleTextView";
import { fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';

export default function StyleSelectView({
    text,
    placeholder,
    data,
    value,
    onChangeText,
    keyboardType,
    secureTextEntry,
    forgotText,
    onSubmitEditing,
    maxLength,
    onPress,
    required,
    touched,
    errors,
    setRef,
    setValue,
    selectedText
}) {

    const { theme, changeTheme } = useContext(AppContext)


    const renderItem = (item) => {
        return (
            <View style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.colors.mainBackground1
            }}>
                <StyleTextView value={item.name} />
                {/* {item.value === value && (
              <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )} */}
            </View>
        );
    };

    return (
        <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <StyleTextView value={text} required={required} />
            </View>
            <LinearGradient
                colors={[theme.colors.buttonStrokeStartColor, theme.colors.buttonStrokeEndColor]}
                style={{ marginTop: 5, borderRadius: 10 }}
                useAngle={true}
                angle={179}>
                <Dropdown
                    style={{
                        borderRadius: 10,
                        fontSize: fontSize.textNormal,
                        paddingTop: 5,
                        paddingBottom:5,
                        paddingLeft:10,
                        borderWidth: theme.paddings.boderWidth,
                        borderColor: theme.colors.borderColor,
                        fontFamily: fontName.regular,
                        backgroundColor: theme.colors.white,
                        color: theme.colors.textColor,
                        marginTop: theme.paddings.marginTop,
                        marginLeft: theme.paddings.marginTop,
                        width: theme.paddings.width
                    }}
                    placeholderStyle={{
                        fontSize: fontSize.textNormal,
                        color: theme.colors.textColor,
                    }}
                    selectedTextStyle={{
                        fontSize: fontSize.textNormal,
                        color: theme.colors.textColor,
                    }}
                    inputSearchStyle={{
                        fontSize: fontSize.textNormal,
                        color: theme.colors.textColor,
                        backgroundColor: theme.colors.mainBackground1,
                    }}
                    iconStyle={{
                        width: 20,
                        height: 20,
                    }}
                    data={data}
                    search={false}
                    maxHeight={'50%'}
                    labelField="name"
                    valueField="id"
                    placeholder={placeholder || "Select item"}
                    searchPlaceholder="Search..."
                    name={value}
                    onChange={onChangeText}
                    // renderLeftIcon={() => (
                    //   <DropDownArrowIcon/>
                    // )}
                    renderItem={renderItem}
                    setRef={setRef}
                    onSubmitEditing={onSubmitEditing}
                    value={selectedText}
                />
            </LinearGradient>
            {errors &&
                <StyleTextView value={errors} style={{
                    color: theme.colors.red,
                    fontSize: 12,
                    fontFamily:fontName.regular
                }} />
            }

        </View>
    );
}

