import React, { useState, useContext, useEffect , useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon } from '../../../assets/svg';
import { AppContext } from "../../../themes/AppContextProvider";
import { SafeAreaView } from 'react-navigation';
import {  LoaderComponent,SearchComponent } from '../../components'
import { PAY_PEOPLE } from '../../routes';
import { showMessage } from "react-native-flash-message";
import Home from '../../api/dashboard';
const SearchBranchList = ({ navigation, route, }) => {
    const { params } = route;
    const [isLoading, setLoading] = useState(false);
    const [branchListFilter, setBankListFilter] = useState([])
    const [branchList, setBankList] = useState([])
    const [searchText, setSearchText] = useState([]);
    const { theme, changeTheme } = useContext(AppContext);
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
                    <Text style={{ ...FONTS.h3, color: '#FFF', fontFamily: fontName.medium }}>{'Select branch name'}</Text>
                </View>
                <SearchComponent
                    color='#FFF'
                    containerStyle={{ marginLeft: 15 }}
                    onChangeText={(text) => {
                        setSearchText(text)
                        setBankListFilter(branchList.filter((v) =>
                            (v.branchName.toLowerCase().includes(text.toLowerCase()))
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
        getBranchNameList()
    }, [])
    const getBranchNameList = useCallback(async () => {
        try {
            setLoading(true)
            let request={
                bankName:params.bankName,
            }
            const response = await Home.getBranchList(request);
            setBankListFilter(response);
            setBankList(response)
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

    }, [navigation,branchList,branchListFilter])
    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            {/*Header  */}
            {renderHeader()}
            {/*Flat List*/}
            <FlatList
                data={branchListFilter}
                extraData={branchListFilter}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item, index }) => {
                    return (<TouchableOpacity style={{ paddingVertical: 10 }}
                        onPress={() => {

                            params.setIFSCNumber(item.branchIfscCode)
                            params.setFieldValue('ifscNumber',item.branchIfscCode)
                            params.setBankdetails({branchName: item.branchName, item, bankName: item.bankName, ifsc: item.branchIfscCode })
                            params.setDisableButton(false);
                            navigation.pop(1)
                        }}
                    >
                        <Text style={{ textAlign: 'left', marginHorizontal: 20, fontFamily: fontName.regular, opacity: 0.8, color: theme.colors.grey  }}

                        >{item.branchName}</Text>
                        <View style={{ height: 0.5, backgroundColor: colors.dividerColor, marginTop: 10, opacity: 0.5 }} />
                    </TouchableOpacity>)

                }}
            />
             {isLoading && <LoaderComponent />}
        </SafeAreaView>
    )

}
export default SearchBranchList;