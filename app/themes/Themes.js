import { DefaultTheme } from 'react-native-paper'

export const TechurateTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
        ...DefaultTheme.colors,

        colorPrimary: '#000',
        colorSecondary: '#000',
        mainBackground1: '#FFFFFF',
        mainBackground2: '#FFFFFF',
        homeBackground1: '#DFEAF244',
        homeBackground2: '#DFEAF244',
        textColor: "#545555",

        bgColor:'#f9f9f9',
        borderColor: '#DFEAF2',

        white: '#FFFFFF',
        grey: '#808080',
        black: '#000000',
        red: '#FF3322',
        green: '#117F3F',
        secondaryButtonTextColor: '#718EBF',

        yellowColor: '#FACC00',
        lightYellowColor: '#FFEA8B',
        pinkColor:'#ff588bf8',


        lightGreen: '#00ffce',

        buttonStrokeStartColor: '#15c9a6',
        buttonStrokeCenterColor: '#15c9a6',
        buttonStrokeEndColor: '#15c9a6',//1ad5b1

        disableButtonStrokeStartColor: '#bcc6c7',
        disableButtonStrokeCenterColor: '#bcc6c7',
        disableButtonStrokeEndColor: '#bcc6c7',

        buttonTextColor: '#FFFFFF',
        buttonColor: '#347AF0',

        radioButtonColor: '#347AF0',

        headingTextColor: '#2b2c2c',
        headingSubTextColor: '#4F4F4F',
        buttonBgColor: '#F9FAFB',
        otpBackground: '#F9FAFB',

        type1CardGradStart: '#FFAA07',
        type1CardGradEnd: '#D99D2A',
        type2CardGradStart: '#ED74D6',
        type2CardGradEnd: '#8842FF',
        type3CardGradStart: '#2EE7F9',
        type3CardGradEnd: '#435DFA',
        redeemText: '#117F3F',
        cellborderColor:'#2FA2B9',
        loaderColor:'#3f51b5',
        borderColor:'#4275ef',
        ligthgreenButtonColor:'#15c7a5',
        textConfirmation:'#111827',
        orangeColor:'#ff9813',
    },

    paddings: {
        boderWidth: 1,
        width: '100%',
        marginTop: 0
    }


}

export const BCBTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,

        colorPrimary: '#000',
        colorSecondary: '#000',
        mainBackground1: '#412e89',
        mainBackground2: '#1d1259',
        homeBackground1: '#412e89',
        homeBackground2: '#1d1259',
        textColor: '#000',
        headingTextColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        buttonColor: '#9A4EFA',
        white: '#FFFFFF',
        black: '#000',
        red: '#FF3322',
        green: '#117F3F',
        secondaryButtonTextColor: '#FFFFFF',
        buttonStrokeStartColor: '#15c7a5',
        buttonStrokeEndColor: '#15c7a5',
        lightGreen: '#00ffce',

        type1CardGradStart: '#9A4EFA',
        type1CardGradEnd: '#9A4EFA',
        type2CardGradStart: '#9A4EFA',
        type2CardGradEnd: '#9A4EFA',
        type3CardGradStart: '#9A4EFA',
        type3CardGradEnd: '#9A4EFA',

        redeemText: '#FFFFFF',
        cellborderColor:'#2FA2B9',
        loaderColor:'#3f51b5',
        pinkColor:'#ff588bf8',
        dividerColor:'#bbb3',
        orangeColor:'#ff9813',
    },
    paddings: {
        boderWidth: 0,
        width: '99%',
        marginTop: 3
    }
}


