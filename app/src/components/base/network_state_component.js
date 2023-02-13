import React from 'react'
import { Component } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { View, BackHandler, } from 'react-native'
import { Overlay } from 'react-native-elements'
import StyleTextView from "../input/StyleTextView";
import PlainButton from "../../components/button/PlainButton";
import { colors, fontName, fontSize, SIZES } from "../../../styles/global.config";
import { kickUserNoInternet} from '../../utils/auth.service';
export default class NeoNetworkState extends Component {
    state = {
        show: false
    }

    unsubscribe = null

    _checkConnection = state => {
        this.setState({
            show: !state.isInternetReachable
        })
    }

    _initNetworkListener() {
        this.unsubscribe = NetInfo.addEventListener(this._checkConnection)
    }

    componentDidMount() {
        this._initNetworkListener()
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    render() {
        return (
            <Overlay
                isVisible={this.state.show}
                fullScreen={false}
                height='auto'
                overlayBackgroundColor='white'
                borderRadius={10}>
                <View style={{ width: SIZES.width * 0.85, padding: 10, marginTop: 20 }}>
                    <StyleTextView
                        value={"No network"}
                        style={{
                            fontSize: fontSize.textLarge,
                            fontFamily: fontName.medium,
                            color: '#2b2c2c',

                        }}
                    />
                    <StyleTextView value={"Please connect to the network"}
                        style={{
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.regular,
                            marginTop: 10,
                            opacity: .6,
                            lineHeight: 20,
                            marginBottom: 40,
                            marginTop: 20,
                            color: '#2b2c2c',
                        }} />
                    <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                        <PlainButton title={"Okay "} onPress={async() => {
                            await kickUserNoInternet();
                        }

                        } />
                    </View>
                </View>
            </Overlay>
        )
    }
}
