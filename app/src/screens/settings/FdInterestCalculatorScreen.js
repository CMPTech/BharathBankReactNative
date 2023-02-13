import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { AcceptTermsIcon, DebitCardIcon, LogoIcon, PanCardIcon, RadioButtonUncheckedIcon, SplashScreenIcon } from "../../../assets/svg";
import TitleText from "../../components/base/TitleText";
import { GET_STARTED, SETTINGS } from "../../routes";
import { AuthHeader, BCBDropDownView, LoaderComponent, MainButton } from "../../components";
import StyleTextView from "../../components/input/StyleTextView";
import { Switch } from 'react-native-switch';
import PlainButton from "../../components/button/PlainButton";
import { Overlay } from 'react-native-elements'
import Slider from "react-native-slider";
import { useTranslation } from 'react-i18next';
import { currencyFormat } from "../../utils/amount-util";
import BCBSourceAccountDropDown from "../../components/dropdown/BCBSourceAccountDropDown";
import Home from "../../api/dashboard";
import { showMessage, hideMessage } from "react-native-flash-message";
import { useSelector } from "react-redux";
import { profileSelector } from "../../store/selectors";
import { AUTH_KEYS } from "../../../assets/translations/constants";

export default function FdInterestCalculatorScreen({ navigation, route }) {

  const { theme, changeTheme } = useContext(AppContext)
  const { t, i18n } = useTranslation();



  const [checked, setChecked] = useState(0);
  const buttons = [{ title: "Fixed", desc: t(AUTH_KEYS.REGISTER.PAN_DESCRIPTION), icon: <PanCardIcon /> }, { title: "Recurring", desc: t(AUTH_KEYS.REGISTER.DEBIT_CARD_DESCRIPTION), icon: <DebitCardIcon /> }]


  const [timeTypeVal, setTimeTypeVal] = useState("Days");

  const [minInvestment, setMinInvestment] = useState(10000);
  const [maxInvestment, setMaxInvestment] = useState(5000000);
  const [investmentVal, setInvestmentVal] = useState(100000);

  const [minROI, setMinROI] = useState(1);
  const [maxROI, setMaxROI] = useState(20);
  const [roiVal, setRoiVal] = useState(12);

  const [minTenure, setMinTenure] = useState(1);
  const [maxTenure, setMaxTenure] = useState(timeTypeVal === "Days" ? 30 : timeTypeVal === "Months" ? 12 : 25);
  const [tenure, setTenure] = useState(1);


  const [timeType, setTimeType] = useState(
    [{ label: "Days", value: "D", },
    { label: "Months", value: "M", },
    { label: "Years", value: "Y", }]
  );


  const [intType, setIntType] = useState(
    [{ label: "Simple Interest", value: "SI", },
    { label: "Compounding Interest", value: "CI" }]
  );

  const [intTypeVal, setIntTypeVal] = useState("Compounding Interest");


  const [isLoading, setLoading] = useState(false);

  const [totalIntVal, setTotalIntVal] = useState(0);
  const [totalPrincipalVal, setTotalPrincipalVal] = useState(0);


  const simpleInterest = () => {

    let interest = 0;

    duration = tenure
    amount = investmentVal
    rate = roiVal

    // Convert duration to months
    if (timeTypeVal === "Days") {
      duration = duration / 30;
    } else if (timeTypeVal === "Years") {
      duration = duration * 12;
    }

    console.log("checked")
    console.log(checked)
    // Calculate interest based on investment type
    if (checked === 1) {
      if (intTypeVal === "Simple Interest") {
        interest = amount * (rate / 100) * (duration / 12);
      } else if (intTypeVal === "Compounding Interest") {
        interest = amount * (1 + rate / 100 / 12) * (duration);
      }
    } else if (checked === 0) {
      let principal = amount;
      for (let i = 0; i < duration; i++) {
        if (intTypeVal === "Simple Interest") {
          interest += (principal * (rate / 100)) / 12;
        } else if (intTypeVal === "Compounding Interest") {
          interest += (principal * (rate / 100)) / 12;
          principal += interest;
        }
      }
    }
    setTotalIntVal(interest)
    setTotalPrincipalVal(investmentVal + interest)




    //System.out.println("Simple Interest: " + interest);
    //System.out.println("Total Value (Principal + Interest): " + (principal + simpleInterest));

  }


  var principal = 0;
  var interestRate = 0;
  var timesCompounded = 0;
  var termOfLoan = 0;
  var amount = 0;
  var duration = 0


  function calculateAmt(invest, roi, tenu, timeType,intType) {


    if (intType === "Simple Interest") {
      duration = tenu
      // Convert duration to months
      if (timeType === "Days") {
        duration = tenu / 30 / 12;
      } else if (timeType === "Months") {
        duration = tenu / 12;
      }


      var principal = parseFloat(invest);
      var interestRate = parseFloat(roi);
      interestRate = interestRate / 100;
      var termOfLoan = parseFloat(duration);
      var simpleInt = principal * interestRate * termOfLoan;
      var amount = (principal + simpleInt).toFixed(2);

      setTotalIntVal(simpleInt.toFixed(2))
      setTotalPrincipalVal(amount)
    }
    else {

      duration = tenu
      // Convert duration to months
      if (timeType === "Days") {
        duration = tenu / 30 / 12;
      } else if (timeType === "Months") {
        duration = tenu / 12;
      }


      var principal = parseFloat(invest);
      var interestRate = parseFloat(roi);

      interestRate = interestRate / 100;
      var timesCompounded = 4;
      var termOfLoan = parseFloat(duration);
      var a = interestRate / timesCompounded;
      var b = 1 + a;
      var c = timesCompounded * termOfLoan;
      var d = Math.pow(b, c);
      var amount = (principal * d).toFixed(2);

      setTotalIntVal((amount - principal).toFixed(2))
      setTotalPrincipalVal(amount)

    }
  }
  function compoundInterest(invest, roi, tenu, timeType) {


    //document.getElementById("ciOutput-01").innerHTML = "Interest: $" + (amount - principal).toFixed(2);
    //document.getElementById("ciOutput-02").innerHTML = "Total plus interest: $" + amount;
  }


  useEffect(() => {
    calculateAmt(investmentVal, roiVal, tenure, timeType,intTypeVal)
  }, [])

  return (

    <View style={{
      flex: 1,
      backgroundColor: theme.colors.white,
    }}>

      <AuthHeader title={"FD Interest calculator"}
        navigation={navigation}
      />


      <ScrollView>
        <View style={{
          //alignItems: 'center',
          margin: 20,
        }}>


          <StyleTextView value={"An FD calculator can be used to determine the interest and the amount that it will accrue at the time of maturity."} style={{
            fontSize: fontSize.header3,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            textAlign: 'center',
            marginLeft: 10,
            marginRight: 10,
            lineHeight: 20,
            opacity: 0.8
          }} />


        </View>

        <View style={{
          marginLeft: 20,
          marginRight: 20,
          flex: 1,
          flexDirection: 'column'
        }}>




          <StyleTextView value={"Total Investment"} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(investmentVal, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={minInvestment}
            maximumValue={maxInvestment}
            step={10000}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={investmentVal}
            onValueChange={(value) => {
              setInvestmentVal(value)
              calculateAmt(value, roiVal, tenure, timeType)
            }
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <StyleTextView value={currencyFormat(minInvestment)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />

            <StyleTextView value={currencyFormat(maxInvestment)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />
          </View>


          <StyleTextView value={"Rate of Interest (p.a)"} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(roiVal, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={minROI}
            maximumValue={maxROI}
            step={.25}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={roiVal}
            onValueChange={(value) => {
              setRoiVal(value)
              calculateAmt(investmentVal, value, tenure, timeType,intTypeVal)
            }
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <StyleTextView value={(minROI)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />

            <StyleTextView value={currencyFormat(maxROI)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />
          </View>


          <BCBDropDownView
            data={timeType}
            placeholder={"Time Period in"}
            dropDownlabel={"label"}
            dropDownValue={"label"}
            selectedValue={timeTypeVal}
            value={timeTypeVal}
            onChangeText={(text) => {
              setTimeTypeVal(text)
              setTenure(1)
              setMaxTenure(text === "Days" ? 30 : text === "Months" ? 12 : 25)
              calculateAmt(investmentVal, roiVal, tenure, text,intTypeVal)

            }}
          />

          <StyleTextView value={"Time period"} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(tenure, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={minTenure}
            maximumValue={maxTenure}
            step={1}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={tenure}
            onValueChange={(value) => {
              setTenure(value)
              calculateAmt(investmentVal, roiVal, value, timeType,intTypeVal)
            }
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <StyleTextView value={currencyFormat(minTenure)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />

            <StyleTextView value={currencyFormat(maxTenure)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />
          </View>




          <StyleTextView value={"Investment Type"} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <View style={{ flexDirection: 'row', margin: 10 }}>
            {buttons.map((data, key) => {
              if (checked == key) {
                return (

                  <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginTop: 10,
                    marginRight: 10,
                  }} onPress={() => {
                    setChecked(key)
                    setTimeout(() => {
                      calculateAmt()
                    }, 1000);
                  }}>
                    <AcceptTermsIcon />
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'column' }}>
                          <StyleTextView value={data.title} style={{
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.regular,
                            color: theme.colors.black,
                          }} />

                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>)
              }
              else {
                return (
                  <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginTop: 10,
                    marginRight: 10,
                  }} onPress={() => {
                    setChecked(key)
                    setTimeout(() => {
                      calculateAmt()
                    }, 1000);
                  }} >
                    <RadioButtonUncheckedIcon />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                      <View style={{ flexDirection: 'column' }}>
                        <StyleTextView value={data.title} style={{
                          fontSize: fontSize.textNormal,
                          fontFamily: fontName.regular,
                          color: theme.colors.black,
                        }} />

                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }
            })}
          </View>



          <BCBDropDownView
            data={intType}
            placeholder={"Interest Type"}
            dropDownlabel={"label"}
            dropDownValue={"value"}
            selectedValue={intTypeVal}
            value={intTypeVal}
            onChangeText={(text) => {
              setIntTypeVal(text)
              calculateAmt(investmentVal, roiVal, tenure, timeType,text)
            }}
          />
          <StyleTextView value={"Interest: " + currencyFormat(totalIntVal)} style={{
            fontSize: fontSize.header1,
            fontFamily: fontName.medium,
            color: theme.colors.buttonColor,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={"Total Value: " + currencyFormat(totalPrincipalVal)} style={{
            fontSize: fontSize.header1,
            fontFamily: fontName.medium,
            color: theme.colors.buttonColor,
            marginVertical: 10,
            marginHorizontal: 10
          }} />

        </View>



      </ScrollView>



      {isLoading && <LoaderComponent />}
    </View>

  );
}



