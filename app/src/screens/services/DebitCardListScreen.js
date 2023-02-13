import React, { useContext, useEffect, useState, useCallback } from "react";
import { SafeAreaView, View, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import {
    settingMenu, rightArrow
} from '../../../assets/icons'
import { debitCardBg, cardIllustration } from '../../../assets/images'
import { LoaderComponent, AccountDropDownView, AuthHeader, MainButton } from '../../components';
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from '../../components/input/StyleTextView';
import { fontName, fontSize, SIZES } from "../../../styles/global.config";
import Services from '../../api/Services'
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { getAccountDetailsSelector } from '../../store/selectors';
import { SERVICES } from "../../routes";
import { Switch } from 'react-native-switch';
import DebitCardActivationComponent from './debit_card_activation'
const DebitCardList = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);
    const accDetailsData = useSelector(getAccountDetailsSelector);
    const accountTypes = ["CA", "SB", "OD"];
    const [accDetails, setAccDetails] = useState(accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1) || []);
    const [srcAccount, setSrcAccount] = useState('');
    const { theme } = useContext(AppContext);
    const [debitCardPin, setDebitCardPIN] = useState('')
    const [enableCardUsage, setEnableCardUsage] = useState(false)
    const [isVisible, setVisible] = useState(false)
    const [debitCardList, setDebitCardList] = useState([
    ]);
    useEffect(() => {
        loadDebitCardList(accDetailsData.find(v => v.primaryAccount === true))
    }, [])
    const loadDebitCardList = useCallback(async (accountDetail) => {
        try {

            let request = {
                "customerId": "000" + accountDetail.customerId,
                "accountNumber": accountDetail.acctNo
            };
            setLoading(true);
            const response = await Services.getDebitDetailApi(request);
            setDebitCardList(response.cardDetails);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            showMessage({
                message: "",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation, debitCardList, srcAccount]
    );

    const renderItem = ({ item, index }) => {
        function mask(input) {
            if (input === undefined || input === null || input === 'undefined' || input === 'null') {
                return ''
            }
            return input
                .slice(0, input.length - 4)
                .replace(/([a-zA-Z0-9])/g, ' * ') + input.slice(-4)
        }
        return (<View>
            <ImageBackground
                source={debitCardBg}
                style={{ width: SIZES.width * 0.9, opacity: item.cardStatus === "Blocked card" ? 0.5 : 1, height: 180, marginHorizontal: 20, marginBottom: 10, paddingHorizontal: 20, paddingTop: 10 }}
                imageStyle={{ borderRadius: 10 }}
            >
                <StyleTextView value={"Plantinum Debit Card"} style={{ fontSize: fontSize.textLarge, fontFamily: fontName.regular, marginTop: 20 }} />
                <StyleTextView value={mask(item.cardNumber)} style={{
                    fontSize: fontSize.textLarge, fontFamily: fontName.bold, marginTop: 10, textAlign: 'justify',
                    lineHeight: 30
                }} />
                <View style={{ position: 'absolute', bottom: 20, marginHorizontal: 20 }}>
                    <StyleTextView value={`${'Status'} : ${item.cardStatus}`} style={{
                        fontSize: fontSize.textLarge, fontFamily: fontName.medium, marginTop: 10, textAlign: 'justify',

                    }} />
                    <StyleTextView value={`${'Valid up to'} : ${item.cardExpiryDate}`} style={{
                        fontSize: fontSize.textSmall, fontFamily: fontName.regular, textAlign: 'justify',

                    }} />

                </View>
            </ImageBackground>
            <View style={{ marginHorizontal: 20, width: '100%', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 40, alignItems: 'center' }}>
                    <StyleTextView value={'Enable card usage'} style={{ marginRight: 20, fontFamily: fontName.medium, fontSize: fontSize.textLarge, color: theme.colors.textColor }} />
                    <Switch
                        value={enableCardUsage}
                        activeText={""}
                        renderInActiveText={false}
                        inactiveTextStyle={""}
                        barHeight={10}
                        circleSize={20}
                        circleActiveColor={theme.colors.lightGreen}
                        circleInActiveColor={theme.colors.disableButtonStrokeStartColor}
                        backgroundActive={theme.colors.buttonColor}
                        onValueChange={(val) => {
                            setVisible(true)
                            setEnableCardUsage(!enableCardUsage)
                        }
                        }
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingVertical: 5 }}>
                    <TouchableOpacity style={{ width: '50%' }}>
                        <StyleTextView value={'Black card'} style={{ marginRight: 20, fontFamily: fontName.medium, fontSize: fontSize.textSmall, color: theme.colors.red }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '50%' }}>
                        <StyleTextView value={'Change PIN'} style={{ marginRight: 20, fontFamily: fontName.medium, fontSize: fontSize.textSmall, color: theme.colors.buttonColor }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <TouchableOpacity style={{ width: '50%' }}>
                        <StyleTextView value={'Re-issue new card'} style={{ marginRight: 20, fontFamily: fontName.medium, fontSize: fontSize.textSmall, color: theme.colors.buttonColor }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '50%' }}>
                        <StyleTextView value={'Add-on card'} style={{ marginRight: 20, fontFamily: fontName.medium, fontSize: fontSize.textSmall, color: theme.colors.buttonColor }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <TouchableOpacity
                        style={{ width: '50%' }}
                        onPress={() => {
                            navigation.navigate(SERVICES.DEBIT_CARD_LIMIT, { selectedDebit: item })
                        }}
                    >
                        <StyleTextView value={'Debit card limit'} style={{ marginRight: 20, fontFamily: fontName.medium, fontSize: fontSize.textSmall, color: theme.colors.buttonColor }} />
                    </TouchableOpacity>

                </View>

            </View>
        </View>
        )
    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 90; //Distance from the bottom you want it to trigger.
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    return (<SafeAreaView
        style={{
            flex: 1,
        }}
    >

        <AuthHeader
            title={"Debit card"}
            navigation={navigation}
        />
        <DebitCardActivationComponent
            isVisible={isVisible}
            setVisible={setVisible}
            title={"Activate Card"}
            subtitle={"Inorder to activate your card, please enter the last 4 digits of the new card that you have entered"}
            cancelTitle="Cancel"
            approveTitle="Activate"
            debitCardPin={debitCardPin}
            setDebitCardPIN={setDebitCardPIN}
            onCancel={() => {
                setVisible(false)
                setDebitCardPIN('')
            }}
            onApprove={() => {
                setVisible(false)
            }}
        />
        <FlatList
            data={debitCardList}
            extraData={debitCardList}
            ListHeaderComponent={() => {
                if (debitCardList.length > 0) {
                    return (
                        <View style={{marginBottom:20}}>
                            <StyleTextView value={debitCardList.length > 0 ? `Managing your Debit Card has never been so easy` : ``}
                                style={{
                                    fontSize: fontSize.textLarge,
                                    fontFamily: fontName.bold,
                                    textAlign: 'center',
                                    margin: 20,
                                    marginHorizontal: 50,
                                    color: theme.colors.headingTextColor,

                                }} />
                            <AccountDropDownView
                                data={accDetails}
                                placeholder={"For account"}
                                dropDownlabel={'acctNo'}
                                dropDownValue={"acctNo"}
                                value={srcAccount}
                                editable={false}
                                // touched={sendViaError}
                                returnKeyType='done'
                                keyboardType='phone-pad'
                                // errors={sendViaError}
                                onChangeText={(text) => {
                                    setSrcAccount(text)
                                    loadDebitCardList(accDetailsData.find(v => v.acctNo === text))
                                    

                                }} />
                        </View>)
                }
                return null

            }}
            ListEmptyComponent={() => {
                return (<View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 60 }}>
                    <Image
                        source={cardIllustration}
                        resizeMode='contain'
                        style={{ width: 150, height: 75, margin: 10 }}
                    />
                    <StyleTextView value={"Debit Cards are a convenient Way to shop in store and online"}
                        style={{
                            fontSize: fontSize.textLarge,
                            fontFamily: fontName.medium,
                            textAlign: 'center',
                            marginHorizontal: 30,
                            marginTop: 10,
                            color: theme.colors.headingTextColor,

                        }} />
                    <StyleTextView value={"And, for your security, you can manage the transaction limits or even block the card on the go"}
                        style={{
                            fontSize: fontSize.medium,
                            fontFamily: fontName.regular,
                            textAlign: 'center',
                            marginHorizontal: 30,
                            marginTop: 10,
                            color: theme.colors.headingTextColor,
                            marginBottom: 20,

                        }} />
                    <MainButton
                        title={'Order new card'}
                        onPress={() => {

                        }}
                    />
                </View>)
            }}
            renderItem={renderItem}
            onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {

                }
            }}
            scrollEventThrottle={1000}
        />
        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
export default DebitCardList;