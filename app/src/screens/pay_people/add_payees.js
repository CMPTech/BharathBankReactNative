import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
    SafeAreaView,
    Animated,
    Keyboard,
} from 'react-native';
import { colors, fontName, FONTS, SIZES, fontSize } from "../../../styles/global.config";
import { BackIcon } from '../../../assets/svg';
import LinearGradient from 'react-native-linear-gradient';
import StyleInputView from "../../components/input/StyleInputView";
import { AppContext } from "../../../themes/AppContextProvider";
import { BottomButton, } from '../../components'
import { PAY_PEOPLE, } from '../../routes';
import GetIFSCTab from './Get_IFSC_details';
import ReAnimated, {
    useSharedValue, withDelay,
    withTiming,
} from "react-native-reanimated";
import { ValidationUtils, validateAccountNumber } from '../../utils';
import { LoaderComponent, MainButton } from '../../components';
import Home from '../../api/dashboard';
import { showMessage } from "react-native-flash-message";
import { profileSelector } from '../../store/selectors';
import { useSelector } from 'react-redux';
import { AUTH_KEYS, VALIDATION_MESSAGES } from '../../../assets/translations/constants';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import StyleTextView from "../../components/input/StyleTextView";
import { Formik } from 'formik';
import { getAlphabetsAndNumbersOnly, getAlphabetsOnly, getAlphabetsWithSpacesOnly, getNumbersOnly } from '../../utils/amount-util';
const AddPayeeScreen = ({ navigation, route }) => {
    const { params } = route;
    const selectedProfileDetails = useSelector(profileSelector);
    const [screen, setScreen] = useState([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    const [payeeName, setPayeeName] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [disabledButton, setDisableButton] = useState(true)
    const { theme, changeTheme } = useContext(AppContext)
    const [accountNumber, setAccountNumber] = useState('')
    const [confirmAccNumber, setConfirmAccNumber] = useState('');
    const [bankName, setBankName] = useState('')
    const [ifscNumber, setIFSCNumber] = useState("");
    const [ifscNumberError, setIFSCNumberError] = useState("");
    const [bankDetails, setBankdetails] = useState({});
    const ifscModelSharedValue1 = useSharedValue(SIZES.height);
    const ifscModelSharedValue2 = useSharedValue(SIZES.height);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef();
    const { t, i18n } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [payeeError, setPayeeError] = useState("");
    const [accountError, setAccountNoError] = useState("");
    const [confirmAccountError, setConfirmAccountNoError] = useState("");
    const onViewChangeRef = useRef(({ viewableItems, changed }) => {
        if (viewableItems.length > 0) {
            const { index, item } = viewableItems[0];
            setCurrentIndex(index);
        }
    })
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
    const Dots = () => {
        const dotPosition = Animated.divide(scrollX, SIZES.width)
        return (<View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            justifyContent: 'center'
        }}>
            {screen.map((item, index) => {
                const dotOpacity = dotPosition.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0.5, 1, 0.5],
                    extrapolate: 'clamp'
                })
                const dotcolor = dotPosition.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [theme.colors.grey, theme.colors.buttonColor, theme.colors.grey],
                    extrapolate: 'clamp'
                })
                return (
                    <Animated.View
                        key={`dot-${index}`}
                        style={{
                            borderRadius: 5,
                            marginHorizontal: 6,
                            width: 8,
                            height: 8,
                            opacity: dotOpacity,
                            backgroundColor: dotcolor,
                        }}
                    />
                )
            })

            }
        </View>)
    }
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
                marginBottom: 10
            }}>
                <TouchableOpacity
                    style={{ alignItems: 'center', marginLeft: 10 }}
                    onPress={() => {
                        navigation.goBack()

                    }}
                >
                    <BackIcon />
                </TouchableOpacity>
                <Text style={FONTS.headerText}>{t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE)}</Text>

            </View>
        </LinearGradient>)
    }
    const getBankDetails = useCallback(async (data) => {
        try {
            setLoading(true)
            let request = {
                "ifscCode": data.ifscNumber,
            }
            const response = await Home.getBankDetailsByIFSC(request);
            addPayeeVerify({ branchName: response.branchName, bankName: response.bankName, ifsc: data.ifscNumber, data });
            setLoading(false)
        }
        catch (error) {
            setLoading(false);
            showMessage({
                message: "",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                autoHide: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }

    }, [navigation, bankDetails, accountNumber, payeeName, ifscNumber])
    const addPayeeVerify = useCallback(async ({ branchName, bankName, ifsc, data }) => {
        try {

            // if (data.ifscNumber.length < 11) {
            //     showMessage({
            //         message: t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_IFSC_CODE),
            //         description: t(AUTH_KEYS.PAY_PEOPLE.IFSC_CODE_SHOULD_BE),
            //         type: "danger",
            //         hideStatusBar: true,
            //         autoHide: true,
            //         backgroundColor: "black", // background color
            //         color: "white", // text color
            //     });
            // }
            // else {
            setLoading(true)
            let request = {
                "payeeNickName": data.payeeName,
                "payeeAccountNo": data.accountNumber,
                "active": "Y",
                "ifscCode": data.ifscNumber,
                "branchName": branchName,
                "bankName": bankName,
                "favorites": "N",
                "profileId": selectedProfileDetails.profileId,
            }
            const response = await Home.verifyAddPayee(request);
            navigation.navigate(PAY_PEOPLE.CONFIRM_ADD_PAYEE, { accountNumber: data.accountNumber, payeeName: data.payeeName, ifscNumber: data.ifscNumber, item: { branchName, bankName, ifsc }, response })
            setLoading(false)
            //}

        }
        catch (error) {
            setLoading(false);
            showMessage({
                message: "",
                description: error.message,
                type: "danger",
                hideStatusBar: true,
                autoHide: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }

    }, [navigation, bankDetails, accountNumber, payeeName, ifscNumber])
    function isEnabled() {
        switch (currentIndex) {

            case 0: return payeeName != "" && payeeError === "";
            case 1: return payeeName != "" && payeeError === "" && accountNumber !== "" && accountError === "";
            case 2: return payeeName != "" && payeeError === "" && accountNumber !== "" && accountError === "" && accountNumber === confirmAccNumber;
            case 3: return payeeName != "" && payeeError === "" && accountNumber !== "" && accountError === "" && accountNumber === confirmAccNumber && ifscNumber !== "" && ifscNumberError === "";


        }
    }
    const inputRefs = []
    const focus = useCallback(
        (index) => {
            inputRefs[index].focus()
        },
        [inputRefs]
    )
    const renderItem = ({ item, index }) => {
        return (<View style={{ width: SIZES.width, height: 250, marginTop: 20 }}>
            {item.id == 1 &&
                <>
                    <Text style={{ fontSize: fontSize.header2, fontFamily: fontName.medium, textAlign: 'center', color: colors.blackColor, marginHorizontal: 30, opacity: 0.8 }}>{t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_DESCRIPTION_MSG)}</Text>
                    <StyleInputView
                        placeholder={t(AUTH_KEYS.PAY_PEOPLE.PAYEE_NAME)}
                        value={payeeName}
                        containerStyle={{ width: SIZES.width * 0.8, marginHorizontal: 30, marginTop: 40 }}
                        hintStyle={{ fontFamily: fontName.regular }}
                        inputViewStyle={{ fontFamily: fontName.regular }}
                        touched={payeeError}
                        maxLength={30}
                        errors={payeeError}
                        onChangeText={(text) => {
                            setPayeeName(getAlphabetsWithSpacesOnly(text))
                            ValidationUtils.validatePayeeName(text, setPayeeError);
                        }}

                    />
                </>
            }
            {item.id == 2 &&
                <>
                    <Text style={{ fontSize: fontSize.header2, fontFamily: fontName.medium, textAlign: 'center', color: colors.blackColor, marginHorizontal: 20, opacity: 0.8 }}>{`${t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_PLEASE_PROVIDE)}${" " + payeeName + "'s"} ${t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_PLEASE_PROVIDE_AC_NO)}`}</Text>
                    <StyleInputView
                        placeholder={t(AUTH_KEYS.PAY_PEOPLE.ENTER_ACC_NO)}
                        value={accountNumber}
                        maxLength={18}
                        autoCapitalize='characters'
                        containerStyle={{ width: SIZES.width * 0.8, marginHorizontal: 30, marginTop: 40 }}
                        hintStyle={{ fontFamily: fontName.regular }}
                        inputViewStyle={{ fontFamily: fontName.regular }}
                        errors={accountError}
                        touched={accountError}
                        onChangeText={(text) => {
                            setAccountNumber(getAlphabetsAndNumbersOnly(text));
                            setConfirmAccNumber("")
                            ValidationUtils.validateAccountNumber(text, setAccountNoError)
                        }}

                    />
                </>
            }
            {item.id == 3 &&
                <>
                    <Text style={{ fontSize: fontSize.header2, fontFamily: fontName.medium, textAlign: 'center', color: colors.blackColor, marginHorizontal: 20, opacity: 0.8 }}>{`${t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_PLEASE_CONFIRM)}${" " + payeeName + "'s"} ${t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_PLEASE_PROVIDE_AC_NO)}`}</Text>
                    <StyleInputView
                        placeholder={t(AUTH_KEYS.PAY_PEOPLE.ENTER_CONFIRM_ACC_No)}
                        value={confirmAccNumber}
                        containerStyle={{ width: SIZES.width * 0.8, marginHorizontal: 30, marginTop: 40 }}
                        hintStyle={{ fontFamily: fontName.regular }}
                        inputViewStyle={{ fontFamily: fontName.regular }}
                        errors={confirmAccountError}
                        touched={confirmAccountError}
                        maxLength={18}
                        autoCapitalize='characters'
                        onChangeText={(text) => {
                            setConfirmAccNumber(getAlphabetsAndNumbersOnly(text))
                            ValidationUtils.validateConfirmAccountNumber(text, accountNumber, setConfirmAccountNoError);
                        }}

                    />
                </>
            }
            {item.id == 4 &&
                <>
                    <Text style={{ fontSize: fontSize.header2, fontFamily: fontName.medium, textAlign: 'center', color: colors.blackColor, marginHorizontal: 20, opacity: 0.8 }}>{`${t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_PLEASE_CONFIRM_IFSC)}`}</Text>
                    <StyleInputView
                        placeholder={t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_ENTER_IFSC)}
                        value={ifscNumber}
                        maxLength={11}
                        autoCapitalize='characters'
                        containerStyle={{ width: SIZES.width * 0.8, marginHorizontal: 30, marginTop: 40 }}
                        hintStyle={{ fontFamily: fontName.regular }}
                        errors={ifscNumberError}
                        touched={ifscNumberError}
                        inputViewStyle={{ fontFamily: fontName.regular }}
                        rightIcon={<TouchableOpacity
                            onPress={() => {
                                ifscModelSharedValue1.value = withTiming(
                                    0, { duration: 100 }
                                )
                                ifscModelSharedValue2.value = withDelay(100, withTiming(0, { duration: 500 }))

                            }}
                        >
                            <Text style={{ fontFamily: fontName.medium, color: theme.colors.buttonColor }}>{t(AUTH_KEYS.PAY_PEOPLE.GET_IFSC)}</Text>
                        </TouchableOpacity>}
                        onChangeText={(text) => {
                            setIFSCNumber(getAlphabetsAndNumbersOnly(text));
                            //ValidationUtils.validateIFSCCode(ifscNumber, setIFSCNumberError)
                        }}

                    />
                </>
            }
        </View>)
    }
    const addPayeeSchema = Yup.object().shape({
        payeeName: Yup.string()
            .required(t(VALIDATION_MESSAGES.PLEASE_ENTER_PAYEE_NAME)).matches(
                /^[a-zA-Z ]+$/,
                t(VALIDATION_MESSAGES.PLEASE_ENTER_PAYEE_NAME)
            ),
        accountNumber: Yup.string()
            .required(t(VALIDATION_MESSAGES.PLEASE_ENTER_VALID_ACC_NO)).matches(
                /[a-zA-Z0-9]{9,30}$/,
                t(VALIDATION_MESSAGES.PLEASE_ENTER_VALID_ACC_NO)
            ),
        confirmAccNumber: Yup.string()
            .required(t(VALIDATION_MESSAGES.PLEASE_ENTER_VALID_ACC_NO)).matches(
                /[a-zA-Z0-9]{9,30}$/,
                t(VALIDATION_MESSAGES.PLEASE_ENTER_VALID_ACC_NO)
            ).oneOf(
                [Yup.ref('accountNumber'), null],
                t((VALIDATION_MESSAGES.ACC_NO_DOESNT_MATCH)
            )),
        ifscNumber: Yup.string()
            .required(t(VALIDATION_MESSAGES.PLEASE_ENTER_IFSC)).matches(
                /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/,
                t(VALIDATION_MESSAGES.PLEASE_ENTER_IFSC)
            ),
    })
    return (<SafeAreaView
        style={{ backgroundColor: colors.textColorWhite, flex: 1 }}

    >
        {/* Header */}
        {renderHeader()}
        <Formik
            initialValues={{
                payeeName: '',
                accountNumber: '',
                confirmAccNumber: '',
                ifscNumber: ''
            }}
            validateOnChange
            onSubmit={getBankDetails}
            validationSchema={addPayeeSchema}
        >
            {({
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                errors,
                touched,
                setFieldValue,
            }) => (
                <View style={{ backgroundColor: theme.colors.bgColor, flex: 1, paddingHorizontal: 15, paddingTop: 20, paddingBottom: 100 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}>
                        <StyleTextView value={"Please enter the payee details"} style={{
                            fontFamily: fontName.medium,
                            color: theme.colors.textColor,
                            fontSize: fontSize.textLarge,
                            textAlign: 'center',
                            lineHeight: 25,
                            marginTop: 20,
                            marginBottom: 20
                        }} />

                        <StyleInputView
                            placeholder={t(AUTH_KEYS.PAY_PEOPLE.PAYEE_NAME)}
                            value={values.payeeName}
                            errors={errors.payeeName}
                            touched={touched.payeeName}
                            containerStyle={{ width: SIZES.width * 0.8, marginHorizontal: 10, marginTop: 30 }}
                            hintStyle={{ fontFamily: fontName.regular }}
                            inputViewStyle={{ fontFamily: fontName.regular }}
                            maxLength={30}
                            setRef={(ref) => {
                                inputRefs[0] = ref
                            }}
                            onSubmitEditing={() => focus(1)}
                            onChangeText={(text) => {
                                setFieldValue('payeeName', getAlphabetsWithSpacesOnly(text))
                                setPayeeName(getAlphabetsWithSpacesOnly(text))
                                //ValidationUtils.validatePayeeName(text, setPayeeError);
                            }}

                        />
                        <StyleInputView
                            placeholder={t(AUTH_KEYS.PAY_PEOPLE.ENTER_ACC_NO)}
                            value={values.accountNumber}
                            maxLength={18}
                            autoCapitalize='characters'
                            containerStyle={{ width: SIZES.width * 0.8, marginHorizontal: 10, marginTop: 10 }}
                            hintStyle={{ fontFamily: fontName.regular }}
                            inputViewStyle={{ fontFamily: fontName.regular }}
                            errors={errors.accountNumber}
                            touched={touched.accountNumber}
                            secureTextEntry={false}
                            setRef={(ref) => {
                                inputRefs[1] = ref
                            }}
                            onSubmitEditing={() => focus(2)}
                            onChangeText={(text) => {
                                setFieldValue('accountNumber', getAlphabetsAndNumbersOnly(text))
                                // setAccountNumber(getAlphabetsAndNumbersOnly(text));
                                // setConfirmAccNumber("")
                                // ValidationUtils.validateAccountNumber(text, setAccountNoError)
                            }}

                        />
                        <StyleInputView
                            placeholder={t(AUTH_KEYS.PAY_PEOPLE.ENTER_CONFIRM_ACC_No)}
                            value={values.confirmAccNumber}
                            containerStyle={{ width: SIZES.width * 0.8, marginHorizontal: 10, marginTop: 10 }}
                            hintStyle={{ fontFamily: fontName.regular }}
                            inputViewStyle={{ fontFamily: fontName.regular }}
                            errors={errors.confirmAccNumber}
                            touched={touched.confirmAccNumber}
                            maxLength={18}
                            setRef={(ref) => {
                                inputRefs[2] = ref
                            }}
                            autoCapitalize='characters'
                            onSubmitEditing={() => focus(3)}
                            onChangeText={(text) => {
                                setFieldValue('confirmAccNumber', getAlphabetsAndNumbersOnly(text))
                                setConfirmAccNumber(getAlphabetsAndNumbersOnly(text))
                                //ValidationUtils.validateConfirmAccountNumber(text, accountNumber, setConfirmAccountNoError);
                            }}

                        />
                        <StyleInputView
                            placeholder={t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_ENTER_IFSC)}
                            value={values.ifscNumber}
                            maxLength={11}
                            errors={errors.ifscNumber}
                            autoCapitalize='characters'
                            containerStyle={{ width: SIZES.width * 0.8, marginHorizontal: 10, marginTop: 10 }}
                            hintStyle={{ fontFamily: fontName.regular }}
                            touched={touched.ifscNumber}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            setRef={(ref) => {
                                inputRefs[3] = ref
                            }}
                            inputViewStyle={{ fontFamily: fontName.regular }}
                            rightIcon={<TouchableOpacity
                                onPress={() => {
                                    setBankName('')
                                    setBankdetails({})
                                    ifscModelSharedValue1.value = withTiming(
                                        0, { duration: 100 }
                                    )
                                    ifscModelSharedValue2.value = withDelay(100, withTiming(0, { duration: 500 }))

                                }}
                            >
                                <Text style={{ fontFamily: fontName.medium, color: theme.colors.buttonColor }}>{t(AUTH_KEYS.PAY_PEOPLE.GET_IFSC)}</Text>
                            </TouchableOpacity>}
                            onChangeText={(text) => {
                                setFieldValue('ifscNumber', getAlphabetsAndNumbersOnly(text))
                                // setIFSCNumber(getAlphabetsAndNumbersOnly(text));
                                //ValidationUtils.validateIFSCCode(ifscNumber, setIFSCNumberError)
                            }}

                        />
                        <View style={{height:30}}/>
                    </ScrollView>
                    <MainButton
                        disabled={false}
                        title={t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_NEXT)}
                        noBorder
                        btnContainerStyle={{ width: SIZES.width, position: 'absolute', bottom: 0 }}
                        onPress={handleSubmit}


                    />
                    <GetIFSCTab
                        ifscModelSharedValue1={ifscModelSharedValue1}
                        ifscModelSharedValue2={ifscModelSharedValue2}
                        bankName={bankName}
                        branchName={params.branchName || ''}
                        onBranchClick={() => {
                            if (bankName === "") {
                                showMessage({
                                    message: "",
                                    description: t(AUTH_KEYS.PAY_PEOPLE.PLEASE_SELECT_PAYEE_BANK),
                                    type: "danger",
                                    hideStatusBar: true,
                                    autoHide: true,
                                    backgroundColor: "black", // background color
                                    color: "white", // text color
                                });
                                return;
                            }
                            ifscModelSharedValue2.value = withTiming(SIZES.height, { duration: 500 })
                            ifscModelSharedValue1.value = withDelay(500, withTiming(SIZES.height, { duration: 100 }))
                            navigation.navigate(PAY_PEOPLE.BRANCH_SELECT, { bankName, setIFSCNumber, setBankdetails, setDisableButton, setFieldValue })
                        }}
                        onBankClick={() => {
                            navigation.navigate(PAY_PEOPLE.BANK_SELECT, { setBankName })
                        }}
                    />
                </View>)}
        </Formik>
        {/* <View>
            <Animated.FlatList
                ref={flatListRef}
                data={screen}
                extraData={screen}
                pagingEnabled
                horizontal
                scrollEnabled={isEnabled()}
                snapToAlignment='center'
                snapToInterval={SIZES.width}
                decelerationRate='fast'
                scrollEventThrottle={16}
                disableIntervalMomentum={true}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: { x: scrollX }
                        }
                    }
                ], {
                    useNativeDriver: false
                })}
                onViewableItemsChanged={onViewChangeRef.current}
                viewabilityConfig={viewConfigRef.current}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${index}`}
            />
            <Dots />
        </View> */}
        {/* <BottomButton
            disabled={isEnabled() ? false : true}
            title={t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_NEXT)}
            containerStyle={{ backgroundColor: isEnabled() ? theme.colors.buttonStrokeStartColor : theme.colors.grey, }}
            onPress={() => {

                if (currentIndex < screen.length - 1) {
                    flatListRef?.current?.scrollToIndex(
                        {
                            index: currentIndex + 1,
                            animated: true
                        })
                }
                if (currentIndex == screen.length - 1) {
                    if (bankName === '') {
                        getBankDetails();
                    }
                    else {
                        addPayeeVerify(bankDetails)
                    }

                }

            }}

        /> */}

        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
export default AddPayeeScreen;