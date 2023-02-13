import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Text, } from 'react-native';
import { Calendar, LocaleConfig, CalendarList } from 'react-native-calendars';
import { SIZES, FONTS, fontName } from '../../../styles/global.config';
import { AppContext } from "../../../themes/AppContextProvider";
import { BackIcon, CrossIcon, Logo } from "../../../assets/svg";
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import moment from 'moment/moment';
export default function CustomCallenderComponent({
    currentDate,
    onClose,
    onSetClick,
    maxValue,
    maxDate,
    minDate,
    futureScrollRange = 0,
    pastScrollRange=11
}) {
    const { theme, changeTheme } = useContext(AppContext);
    const [selectedDate, setSelectedDate] = useState('');
    const { t, i18n } = useTranslation();
    const [selectedDateTime, setSelectedDateTime] = useState('')
    const renderHeader = () => {
        return (<LinearGradient
            useAngle={true}
            angle={135}
            style={{ padding: 15 }}
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={["#4370e7", "#4370e7", "#479ae8", "#4ad4e8"]}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    style={{ alignItems: 'center', marginRight: 10 }}
                    onPress={onClose}
                >
                    <CrossIcon color={theme.colors.white} />
                </TouchableOpacity>
                <Text style={FONTS.headerText}>{t(AUTH_KEYS.MAIN_SCREEN.CHOOSE_DATE)}</Text>
                <View />
                <View />
            </View>
        </LinearGradient>)
    }
    return (
        <View style={{
            height: '100%',
            position: "absolute",
            left: 0,
            right: 0,
            //top: 0,
            bottom: 0,
            alignItems: "center",
            backgroundColor: '#FFFF'
        }}>

            <View style={{ width: SIZES.width, height: '10%', }}>
                {renderHeader()}
            </View>
            <CalendarList
                markedDates={{
                    [selectedDate]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedColor: '#16caa733',
                        selectedTextColor: "#16caa7",
                    },
                }}
                monthYearHeaderWrapperStyle={{ display: 'none' }}
                dayLabelsWrapper={{ border: 0 }}
                theme={{
                    dayTextColor: "#222222",
                    textDisabledColor: "#d9e1e8",
                    textMonthFontWeight: "bold",
                    textDayHeaderFontWeight: "500",
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    selectedDayBackgroundColor: 'transparent',
                    selectedDayTextColor: "#222222",
                    textDayHeaderFontSize: 8

                }}
                style={{ marginBottom: '20%' }}
                onDayPress={(day) => {
                    setSelectedDate(day.dateString)
                    setSelectedDateTime(day)
                }}
                futureScrollRange={futureScrollRange}
                initialDate={currentDate}
                maxValue={maxValue}
                enableSwipe={false}
                maxDate={maxDate}
                minDate={minDate}
                pastScrollRange={pastScrollRange}
                monthFormat={'MMM-yyyy'}
                stickyHeaderIndices={false}
                scrollEnabled={true}
            />
            <TouchableOpacity
                style={{ position: 'absolute', bottom: 0, width: SIZES.width, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFF' }}
                onPress={() => {
                    onSetClick(selectedDateTime)

                }}
            >
                <View style={{ flex: 1, backgroundColor: '#15c7a5', padding: 15, width: SIZES.width, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ ...FONTS.h3, color: '#FFF', fontFamily: fontName.medium }}>{t(AUTH_KEYS.MAIN_SCREEN.SET_DATE)}</Text>
                </View>
            </TouchableOpacity>

        </View>)
}
