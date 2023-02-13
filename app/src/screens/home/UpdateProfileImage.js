import React, { useContext, useCallback } from "react";
import { ImageBackground, View, SafeAreaView, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import {
    avatarOne,
    avatarTwo,
    avatarThree,
    avatarFour,
    avatarFive,
    avatarSix,
    avatarSeven,
    avatarEight,
    avatarNine,
    uploadIcon
} from '../../../assets/icons';
import { imageBackground } from '../../../assets/images';
import { AppContext } from '../../../themes/AppContextProvider';
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import { BackIcon, CheckedIcon } from '../../../assets/svg';
import { setSelectedAvatar, setUserProfileImage } from '../../store/actions/app.action';
import { useDispatch, useSelector } from 'react-redux';
import { avatarSelector, userProfileSelector } from "../../store/selectors";
import ImagePicker from 'react-native-image-crop-picker'
import { t } from "i18next";
import { AUTH_KEYS } from "../../../assets/translations/constants";
export default function UpdateProfileImageScreen({ navigation, route }) {
    const { theme, changeTheme } = useContext(AppContext)
    const dispatch = useDispatch();
    const profileImg = useSelector(userProfileSelector);
    const avatarSelected = useSelector(avatarSelector);
    const profileImage = [{ icon: avatarOne, selected: false, name: "One" },
    { icon: avatarTwo, selected: false, name: "Two" },
    { icon: avatarThree, selected: false, name: "Three" },
    { icon: avatarFour, selected: false, name: "Four" },
    { icon: avatarFive, selected: false, name: "Five" },
    { icon: avatarSix, selected: false, name: "Six" },
    { icon: avatarSeven, selected: false, name: "Seven" },
    { icon: avatarEight, selected: true, name: "Eight" },
    { icon: avatarNine, selected: false, name: "Nine" },]
    const pickImage = useCallback(() => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            compressImageMaxWidth: 200,
            compressImageMaxHeight: 200,
            cropping: true,
            useFrontCamera: true,
            multiple: false,
            includeBase64: true,
        }).then(async imageData => {
            dispatch(setUserProfileImage(imageData.data))
            // dispatch(setSelectedAvatar("Profile"))
        })
    }, [])
    const renderItem = ({ item, index }) => {
        return (<TouchableOpacity style={{ padding: 10, alignItems: 'center' }}
            onPress={() => {
                dispatch(setSelectedAvatar(item.name))
                dispatch(setUserProfileImage(null))
                navigation.goBack()
            }}
        >
            <Image
                style={{ width: 60, height: 60 }}
                source={item.icon}
            />
            {profileImg === null && item.name === avatarSelected && <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
                <CheckedIcon color={theme.colors.buttonStrokeStartColor} />
            </View>}

        </TouchableOpacity>)
    }
    return (<SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
            style={{ flex: 1 }}
            source={imageBackground}
        >
            <View style={{
                flexDirection: 'row', alignItems: 'center', marginTop: 20,
                marginLeft: 10,
            }}>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {
                    navigation.goBack()
                }}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={{
                    color: theme.colors.white,
                    fontSize: fontSize.header2,
                    marginLeft: 20,
                    fontFamily: fontName.medium,
                }}>{t(AUTH_KEYS.PERSONAL_DETAILS.EDIT_PHOTO)}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: colors.dividerColor, marginTop: 10, opacity: 0.5, marginBottom: 30 }} />
            <FlatList
                data={profileImage}
                extraData={profileImage}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'space-around' }}
                renderItem={renderItem}
                ListFooterComponent={() => {
                    return (<TouchableOpacity style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center', padding: 10 }}
                        onPress={pickImage}
                    >
                        <Image
                            style={{ width: 60, height: 60 }}
                            source={uploadIcon}
                        />
                        {profileImg !== null && <View style={{ position: 'absolute', right: 20, bottom: 40 }}>
                            <CheckedIcon color={theme.colors.buttonStrokeStartColor} />
                        </View>}
                        <Text style={{ marginTop: 10, color: theme.colors.lightGreen, fontFamily: fontName.medium }}>{t(AUTH_KEYS.PERSONAL_DETAILS.UPLOAD_PHOTO)}</Text>
                    </TouchableOpacity>)
                }}
            />

        </ImageBackground>
    </SafeAreaView>)
}