import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import {
    rightArrow, closeIcon
} from '../../../assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon } from '../../../assets/svg';
import { AppContext } from "../../../themes/AppContextProvider";
import { SafeAreaView } from 'react-navigation';
import { LoaderComponent, SearchComponent } from '../../components'
import { PAY_PEOPLE } from '../../routes';
import Home from '../../api/dashboard';
import { useCallback } from 'react';
import { showMessage } from "react-native-flash-message";
const SearchBankList = ({ navigation, route, }) => {
    const { params } = route;
    const [isLoading, setLoading] = useState(false);
    const [bankListFilter, setBankListFilter] = useState([
        "DBS Bank", "DENA BANK", "KOTAK MAHINDRA BANK", "STATE BANK OF INDIA"
    ])
    const [bankList, setBankList] = useState([
        "DBS Bank", "DENA BANK", "KOTAK MAHINDRA BANK", "STATE BANK OF INDIA"
    ]
    )
    const [searchText, setSearchText] = useState([]);
    const { theme, changeTheme } = useContext(AppContext);
    const [bankName, setBankName] = useState('');
    const [branchName, setBranchName] = useState('');

    const renderHeader = () => {
        return (<LinearGradient
            useAngle={true}
            angle={170}
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={["#4370e7", "#4370e7", "#479ae8", "#4ad4e8"]}>
            <View style={{

                marginTop: 20,
                marginLeft: 10,
                marginBottom: 10
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.h3, color: '#FFF', fontFamily: fontName.medium }}>{'Select bank name'}</Text>
                </View>
                <SearchComponent
                    color='#FFF'
                    containerStyle={{ marginLeft: 15 }}
                    onChangeText={(text) => {
                        setSearchText(text)
                        setBankListFilter(bankList.filter((v) =>
                            (v.toLowerCase().includes(text.toLowerCase()))
                        ))
                    }}

                    value={searchText}
                    onClear={() => {
                        setSearchText('')
                    }}

                />
            </View>

        </LinearGradient>)
    }
    useEffect(() => {
        getBankNameList();
    }, [])

    const getBankNameList = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Home.getBankListApi();
            setBankList(response)
            setBankListFilter(response)
            setLoading(false)
        }
        catch (error) {
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

    }, [navigation, bankList, bankListFilter])
    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            {/*Header  */}
            {renderHeader()}
            {/*Flat List*/}
            <FlatList
                data={bankListFilter}
                extraData={bankListFilter}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item, index }) => {
                    return (<TouchableOpacity style={{ paddingVertical: 10 }}
                        onPress={() => {
                            params.setBankName(item)
                            navigation.pop(1)
                        }}
                    >
                        <Text style={{ textAlign: 'left', marginHorizontal: 20, fontFamily: fontName.regular, opacity: 0.8, color: theme.colors.grey }}

                        >{item}</Text>
                        <View style={{ height: 0.5, backgroundColor: colors.dividerColor, marginTop: 10, opacity: 0.5 }} />
                    </TouchableOpacity>)

                }}
            />
            {isLoading && <LoaderComponent />}
        </SafeAreaView>
    )

}
export default SearchBankList;