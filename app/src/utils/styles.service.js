import axios from 'axios' 
import { store } from '../store' 
import { STYLES_URL } from './constants' 
import { setStyles } from '../actions' 

// eslint-disable-next-line import/prefer-default-export 
export const getStyles = async () => {   
  const { styles } = store.getState()   
  try {     
    const instance = axios.create()     
    const response = await instance.get(STYLES_URL + `/${styles.version}` + '/false')     
    store.dispatch(setStyles(response.data))   
  } catch (error) {     
  } 
}

export const getDynamicStyle = (stylesObject) => {
  const styles = {}
  if (stylesObject === null ||
    stylesObject === undefined) {
    return {}
  }
  for (const prop in stylesObject) {
    if (prop === 'text' || prop === 'startColor' || prop === 'endColor') {
      continue
    }
    styles[prop] = stylesObject[prop]
  }
  return styles
}

export const getGradientColors = (colors) => {
  if (colors?.startColor === undefined || colors?.endColor === undefined) {
    return null
  }
  return [colors.startColor, colors.endColor]
}