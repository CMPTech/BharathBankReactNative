import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions
} from "react-native";
import { FONTS, SIZES, fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import MainButton from "../../components/button/MainButton";
import { BackIcon, SearchIcon } from '../../../assets/svg'
import PDFView from 'react-native-view-pdf';
import Auth from "../../api/auth";
import { showMessage, hideMessage } from "react-native-flash-message";
import { LoaderComponent } from "../../components";
import { useSelector } from "react-redux";
import { metaDataSelector } from "../../store/selectors";

export default function PrivacyPolicyScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const { theme, changeTheme } = useContext(AppContext);
  const { height } = Dimensions.get('window');
  const [isLoading, setLoading] = useState(false);

  const [resources, setResources] = useState({
    file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
    url: null,
    base64: 'JVBERi0xLjMKJcfs...',
  });


  const resourceType = 'url';

  useEffect(() => {
    getPrivacyPolicy()
  }, []);

  const getPrivacyPolicy = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Auth.getPrivacyPolicyApi();
      //setLoading(false)
      setResources({
        file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
        url: response.url,
        base64: 'JVBERi0xLjMKJcfs...',
      })
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Privacy Policy",
        description: error.message || error.error,
        type: t(AUTH_KEYS.LOCATE_US.TYPE_ERROR),
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation]
  );

  const renderHeader = () => {
    return (


      <LinearGradient
        useAngle={true}
        angle={135}
        style={{ paddingTop: 10 }}
        angleCenter={{ x: 0.5, y: 0.5 }}
        colors={["#4370e7", "#4370e7", "#4370e7", "#4ad4e8"]}>
        <View style={{
          flexDirection: 'row',
          alignContent: 'center',
          padding: 10,

          alignItems: 'center'
        }}>
          <TouchableOpacity
            onPress={() => { navigation.goBack() }}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={FONTS.headerText}>{t(AUTH_KEYS.REGISTER.PRIVACY_POLICY)}</Text>
        </View>

      </LinearGradient>
    )
  }

  return (
    <LinearGradient
      useAngle={true}
      style={{ flex: 1, height: height }}
      angle={45}
      angleCenter={{ x: 0.5, y: 0.5 }}
      colors={[theme.colors.mainBackground1, theme.colors.mainBackground2]} >

      {renderHeader()}


      <PDFView
        fadeInDuration={250.0}
        style={{ width: '100%', height: '85%', marginTop: 10 }}
        resource={resources[resourceType]}
        resourceType={resourceType}
        onLoad={(load) =>
          setLoading(false)
           //console.log(load)
        }
        onError={(error) => console.log('Cannot render PDF', error)}
        onScrolled={(error) => console.log('Cannot scroll PDF', error)}
      />

      {isLoading && <LoaderComponent />}
    </LinearGradient>
    // </AuthBody>
  );
}

