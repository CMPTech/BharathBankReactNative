const { getTranslation } = require("../assets/translations")

var _Environments = {
    smart_bank: {
        BASE_URL:'http://14.143.217.151',
        OWN_ACCOUNT_NO_LENGTH: 15,
        OTHER_BANK_ACCOUNT_NO_LENGTH_MIN: 7,
        OTHER_BANK_ACCOUNT_NO_LENGTH_MAX: 20,
        DEFAULT_COUNTRY_CODE: '260',
        ACCOUNT_LOGO_TEXT: "SMART",
        DEFAULT_CURRENCY: "ZMW",
        ANDROID_APP_ID: '',
        IOS_APP_ID: '123456789',
        OTP_LENGTH:6,
        MOBIE_NO_LENGTH:10
       

    },
}

function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)
    var platform = "smart_bank"

    // ...now return the correct environment
    return _Environments[platform]
}

var Environment = getEnvironment()
module.exports = Environment