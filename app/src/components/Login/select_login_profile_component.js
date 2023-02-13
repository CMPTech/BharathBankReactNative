import React, { useContext, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from "../../../assets/translations/constants";
import { Overlay } from 'react-native-elements';
import { fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import MainButton from "../../components/button/MainButton";
import { CheckedIcon, UnCheckIcon } from '../../../assets/svg'
import PlainButton from "../button/PlainButton";
import { avatarOne, ProfileImgSelection } from "../../../assets/icons";
export default function SelectProfilePopup({
    showProfilePopUp,
    setShowProfilePopUp,
    profileList,
    setProfileList,
    onPress
}) {
    const { theme, changeTheme } = useContext(AppContext)
    const { t, i18n } = useTranslation();
    return (
        <Overlay
            isVisible={showProfilePopUp}
            overlayStyle={{
                shadowColor: 'rgba(69,85,117,0.0)',
                backgroundColor: 'white',
                margin: 20,
                borderRadius: 5
            }}>
            <TouchableOpacity
                activeOpacity={1}
                // onPress={() => {
                //     setShowProfilePopUp(false)
                // }}
                >
                <View style={{
                    width: '100%',
                    //position: 'absolute',
                    padding: 10,
                    //height: '80%',
                    //flex: 1,
                    flexDirection: 'column',
                    backgroundColor: 'white'
                }}>

                    <Image
                        source={ProfileImgSelection}
                        style={{
                            width: 60, height: 60,
                        }}
                    />



                    <Text
                        style={{
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.regular,
                            color: theme.colors.textColor,
                            textAlign: 'left',
                            marginBottom: 20,
                            marginTop:20

                        }}>{"Please choose the profile to proceed with the dashbaord"}</Text>
                    <FlatList
                        data={profileList}
                        extraData={profileList}
                        numColumns={1}
                        style={{ width: '100%',maxHeight:400 }}
                        key={({ index }) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        const dummyData = profileList
                                        let arr = dummyData.map((items, ind) => {
                                            if (ind == index) {
                                                items.isSelected = true
                                            }
                                            else {
                                                items.isSelected = false
                                            }
                                            return { ...items }
                                        })
                                        setProfileList(arr)
                                    }}

                                    style={{ padding: 5, flexDirection: 'row', width: '100%', marginVertical: 6, alignItems: 'center' }}>
                                    <Text style={{
                                        fontSize: fontSize.textLarge,
                                        fontFamily: fontName.bold,
                                        color: theme.colors.textColor,
                                        textAlign: 'left',
                                        width: '90%'


                                    }}>{item.profileName}</Text>

                                    <View style={{ width: '10%', alignSelf: 'flex-end' }}>
                                        {item.isSelected ? <CheckedIcon /> :
                                            <UnCheckIcon />}
                                    </View>
                                </TouchableOpacity>
                            )
                        }}

                    />

                </View>
                <View style={{
                    //position: 'absolute', bottom: 10,
                    //left: 5,
                    //width: '100%',
                    marginHorizontal: -10,
                    borderTopWidth: 0.5,
                    paddingTop: 25,
                    borderTopColor: theme.colors.grey,
                    paddingBottom:15
                }}>
                    <PlainButton title={"Proceed"} onPress={onPress} />
                </View>


            </TouchableOpacity>
        </Overlay>
    )

}
