import { Dimensions, PixelRatio } from "react-native";
const { width, height } = Dimensions.get("window");

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window');

const widthBaseScale = SCREEN_WIDTH / 414;
const heightBaseScale = SCREEN_HEIGHT / 896;

function normalize(size, based = 'width') {
    const newSize = (based === 'height') ?
        size * heightBaseScale : size * widthBaseScale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}


//for width  pixel
const widthPixel = (size) => {
    return normalize(size, 'width');
};
//for height  pixel
const heightPixel = (size) => {
    return normalize(size, 'height');
};
//for font  pixel
const fontPixel = (size) => {
    return heightPixel(size);
};
//for Margin and Padding vertical pixel
const pixelSizeVertical = (size) => {
    return heightPixel(size);
};
//for Margin and Padding horizontal pixel
const pixelSizeHorizontal = (size) => {
    return widthPixel(size);
};

export const colors = {
    colorPrimary: '#000',
    colorSecondary: '#000',
    mainBackground1: '#FFFFFF',
    mainBackground2: '#FFFFFF',
    textDisableColor: '#50588744',
    headingTextColor: '#343C6A',
    borderColor: '#DFEAF2',
    buttonColor: '#347AF0',
    white: '#FFFFFF',
    red: '#FF3322',
    secondaryButtonTextColor: '#718EBF',
    redeemText: '#117F3F',
    headingTextColor: '#6B6B6B',
    textColor: '#6B6B6B',
    blackColor: '#000',
    notice_color: '#001033',
    textColorgrey: '#585858',
    dividerColor: '#bbb',
    textColorWhite: '#ffffffff',
    detail_bacgroundColor: '#f9f9f9',

}

export const fontSize = {
    header1: 24,//fontPixel(24),
    header2: 20,//fontPixel(20),
    header3: 18,//fontPixel(18),

    textNormal: 15,// fontPixel(15),
    textSmall: 12,// fontPixel(12),
    textLarge: 16,// fontPixel(16),

}

export const fontName = {
    bold: 'Inter-Bold',
    light: 'Inter-Light',
    semi_bold: 'Inter-Black',
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    thin: 'Inter-Thin',
    black: 'Inter-Black'

}

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // font sizes
    largeTitle: 40,
    h1: 20,//fontPixel(20),
    h2: 18,//fontPixel(18),
    h3: 16,// fontPixel(16),
    h4: 14,// fontPixel(14),
    h5: 12,//fontPixel(12),
    body1: 20,//fontPixel(20),
    body2: 18,//fontPixel(18),
    body3: 16,//fontPixel(16),
    body4: 14,// fontPixel(14),
    body5: 12,//fontPixel(12),

    // app dimensions
    width,
    height
};
export const FONTS = {
    // largeTitle: { fontFamily: "Poppins-Black", fontSize: SIZES.largeTitle },
    h1: { fontFamily: 'Inter-Bold', fontSize: SIZES.h1 },
    h2: { fontFamily: 'Inter-Bold', fontSize: SIZES.h2 },
    h3: { fontFamily: 'Inter-Bold', fontSize: SIZES.h3 },
    h4: { fontFamily: 'Inter-Bold', fontSize: SIZES.h4 },
    h5: { fontFamily: 'Inter-Bold', fontSize: SIZES.h5 },
    body1: { fontFamily: 'Inter-Regular', fontSize: SIZES.body1 },
    body2: { fontFamily: 'Inter-Regular', fontSize: SIZES.body2 },
    body3: { fontFamily: 'Inter-Regular', fontSize: SIZES.body3 },
    body4: { fontFamily: 'Inter-Regular', fontSize: SIZES.body4 },
    body5: { fontFamily: 'Inter-Regular', fontSize: SIZES.body5 },

    headerText: { fontFamily: 'Inter-Bold', fontSize: SIZES.h2, color: colors.white },
};

export const currencyValue = {
    "INR": '₹',
    "EUR": "€",
    "BWP": 'P',
    "USD": '$'
}

export const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
]

export {
    widthPixel,
    heightPixel,
    fontPixel,
    pixelSizeVertical,
    pixelSizeHorizontal
};