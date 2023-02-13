import {
  ImageBackground,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler
} from 'react-native';

import { currencyValue, FONTS } from '../../styles/global.config';


export const getAmount = (text) => text.replace(/,/g, '')

export const getNumbersAndDecimalPlacesOnly = (text) => text.replace(/[^0-9.]/g, '')

export const getFormattedAmount = (text) => getNumbersAndDecimalPlacesOnly(text).replace(/,/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').replace(/^0+/, '')

export const getFormattedAmountCard = (text) => getNumbersAndDecimalPlacesOnly(text).replace(/,/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')


export const getFormattedIdentityNumber = (text, deleting) => {
  // eslint-disable-next-line no-param-reassign
  text = getNumbersOnly(text)
  if (text.length > 6 && text.length < 9 && !deleting) {
    return [text.slice(0, 6), '/', text.slice(6)].join('')
  } else if (text.length > 8 && !deleting) {
    const temp = [text.slice(0, 6), '/', text.slice(6)].join('')
    return [temp.slice(0, 9), '/', temp.slice(9)].join('')
  }
  return text
}

export const getFormattedAmountDecimalFormat = (text) => {
  const preDecimalText = text.split('.');
  const formattedText = getNumbersAndDecimalPlacesOnly(preDecimalText[0]).replace(/,/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').replace(/^0+/, '');
  if (preDecimalText.length >= 2) {
    return formattedText + '.' + preDecimalText[1]
  }
  if (preDecimalText.length == 2) {
    return formattedText + '.' + preDecimalText[1]
  } else
    return formattedText;
}
export const getPrecisionPoints = (text) => {
  if (text.split('.').length == 2) {
    return text.split('.')[1].length;
  } return 0;
}

export const currencyFormat = (num, curr) => {
  try {
    return (curr != null ? currencySymbol() : "") + " " + Intl.NumberFormat('en-IN').format(parseFloat(num).toFixed(2)) //parseFloat(num).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  } catch (error) {
    return ((curr != null ? currencySymbol() : curr) + " " + num)
  }

}


export const amountFormat = (input) => {
  if (!isNaN(input)) {
    var currencySymbol = '₹';

    input = parseFloat(input).toFixed(2)
    //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
    var result = input.toString().split('.');

    var lastThree = result[0].substring(result[0].length - 3);
    var otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers != '')
      lastThree = ',' + lastThree;
    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    if (result.length > 1) {
      output += "." + result[1];
    }

    return currencySymbol + output;
  }
  return input;
}

export const amountFormatIndian = (input) => {
  if (!isNaN(input)) {
    input = input
    var lastThree = input.substring(input.length - 3);
    var otherNumbers = input.substring(0, input.length - 3);
    if (otherNumbers != '')
      lastThree = ',' + lastThree;
    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return output;
  }
  return input;
}

export const intCapitalize = (str) => {
  try {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  catch (error) {
    return str
  }

}

export const abbrNum = (number, decPlaces) => {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces);

  // Enumerate number abbreviations
  var abbrev = ["L", "Cr", "Ar"];

  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {

    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 5);

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round(number * decPlaces / size) / decPlaces;

      // Handle special case where we round up to the next abbreviation
      if ((number == 100000) && (i < abbrev.length - 1)) {
        number = 1;
        i++;
      }

      // Add the letter for the abbreviation
      number += abbrev[i];

      // We are done... stop
      break;
    }
  }

  return amountFormatWithoutCurrency(number);
}


export const getWholeAndDecimal = (value) => {

  const guardNaN = value => isFinite(value) ? value : "00";
  const [whole, decimal] = String(value).split('.');
  return [Number(guardNaN(whole)), (guardNaN(decimal))];
}

export const amountFormatWithoutCurrency = (input) => {
  if (!isNaN(input)) {

    // input = parseFloat(input).toFixed(2)

    var currencySymbol = '₹';
    //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
    var result = input.toString().split('.');

    var lastThree = result[0].substring(result[0].length - 3);
    var otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers != '')
      lastThree = ',' + lastThree;
    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    if (result.length > 1) {
      output += "." + result[1];
    }

    return output;
  }
  return input;
}
export const amountFormatInput = (input) => {
  if (!isNaN(input)) {

    input = parseFloat(input).toFixed(2)
    var result = input.toString().split('.');

    var lastThree = result[0].substring(result[0].length - 3);
    var otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers != '')
      lastThree = ',' + lastThree;
    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    if (result.length > 1) {
      output += "." + result[1];
    }

    return output;
  }
  return input;
}
export const getAlphabetsOnly = (text) => text.replace(/[^a-zA-Z]/g, '')

export const getIdentityNumber = (text) => text.replace(/\//g, '')

export const getNumbersOnly = (text) => text.replace(/[^0-9]/g, '')

export const getAlphabetsWithSpacesOnly = (text) => text.replace(/[^a-zA-Z ]/g, '')

export const getAlphabetsAndNumbersOnly = (text) => text.replace(/[^a-zA-Z0-9]/g, '')

export const getAlphabetsAndNumbersSpaceOnly = (text) => text.replace(/[^a-zA-Z0-9 ]/g, '')

export const getAlphabetsWithSpacesOnlyCaps = (text) => text.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase()

export const getAllWithoutSpaces = (text) => text.replace(/ /g, '')
export const getAlphabetsAndNumbersOnlyUpperCase = (text) => text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

export const getAlphabetsUpperCaseAndNumbersOnly = (text) => text.replace(/[^A-Z0-9]/g, '')
export const currencySymbol = () => "₹"
export const sentenceCase = (str) => {
  if ((str === null) || (str === ''))
    return false;
  else
    str = str.toString();

  return str.replace(/\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() +
        txt.substr(1).toLowerCase();
    });
}
export const mask = (input) => {
  if (input === undefined || input === null || input === 'undefined' || input === 'null') {
    return ''
  }
  return input
    .slice(0, input.length - 4)
    .replace(/([a-zA-Z0-9])/g, 'x') + input.slice(-4)
}