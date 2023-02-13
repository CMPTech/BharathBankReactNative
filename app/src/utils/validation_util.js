import i18n from '../../../i18n';
import { VALIDATION_MESSAGES } from '../../assets/translations/constants'
function isValidEmail(value) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
}
function isValidMobileNumber(value) {
    const re = /^[6-9][0-9]{9}$/;
    // const re=/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/
    return re.test(value);
}
function validateEmail(value, setEmailError) {
    if (value == "") {
        setEmailError("")
    }
    else if (isValidEmail(value)) {
        setEmailError("")
    }
    else {
        setEmailError(i18n.t(VALIDATION_MESSAGES.VALIDE_EMAIL))
    }
}

function validatePassword(value, setPasswordError) {
    if (value.length < 9) {
        setPasswordError(i18n.t(i18n.t(VALIDATION_MESSAGES.PASSWORD_MUST_BE)))
    } else {
        setPasswordError("")
    }
}
function debitCardValidation(value, setDebitCardError) {
    if (value.length < 8) {
        setDebitCardError(i18n.t(VALIDATION_MESSAGES.PLEASE_ENTER_FIVE_DIGIT_DEBIT_CARD))
    } else {
        setDebitCardError("")
    }
}

function validateMobileNumber(value, setMobileError) {
    if (!isValidMobileNumber(value)) {
        setMobileError(i18n.t(VALIDATION_MESSAGES.MOBILE_NUMBER_ERROR))
    }
    else {
        setMobileError("")
    }
}
function validatePayeeName(value, setPayeeError) {
    var regex = /^[a-zA-Z ]+$/
    var isValid = regex.test(value);
    if (value === "") {
        setPayeeError(i18n.t(VALIDATION_MESSAGES.PLEASE_ENTER_PAYEE_NAME));
    }
    else if (!isValid) {
        setPayeeError(i18n.t(VALIDATION_MESSAGES.SORRY_PLEASE_AVOID_NUMBERS_AND_SPECIAL_CHAR))
    } else {
        setPayeeError("");
    }

}
function validateAccountNumber(value, setAccountNoError) {
    var regex = /[a-zA-Z0-9]{9,30}$/
    var isValid = regex.test(value);
    if (value === "") {
        setAccountNoError(i18n.t(VALIDATION_MESSAGES.PLEASE_ENTER_ACC_NO));
    }
    else if (!isValid) {
        setAccountNoError(i18n.t(VALIDATION_MESSAGES.PLEASE_ENTER_VALID_ACC_NO))
    } else {
        setAccountNoError("");
    }

}
function validateConfirmAccountNumber(value, confirm, setConfirmAccountNoError) {
    if (value === confirm) {
        setConfirmAccountNoError("");
    } else {
        setConfirmAccountNoError(i18n.t(VALIDATION_MESSAGES.ACC_NO_DOESNT_MATCH))
    }

}
function validateIFSCCode(value, setIFSCNumberError) {
    var regex = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;
    var isValid = regex.test(value);
    if (value === "") {
        setIFSCNumberError(i18n.t(VALIDATION_MESSAGES.PLEASE_ENTER_IFSC));
    }
    else if (!isValid) {
        setIFSCNumberError(i18n.t(VALIDATION_MESSAGES.PLEASE_ENTER_VALID_IFSC))
    } else {
        setIFSCNumberError("");
    }


}

const ValidationUtils = {
    isValidEmail,
    validateEmail,
    validatePassword,
    isValidMobileNumber,
    validateMobileNumber,
    debitCardValidation,
    validatePayeeName,
    validateAccountNumber,
    validateConfirmAccountNumber,
    validateIFSCCode
};

export default ValidationUtils;