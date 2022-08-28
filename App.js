import React, { useCallback } from "react";
import { WebView } from "react-native-webview";
import { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Platform,
  BackHandler,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";
import OfflineScreen from "./OfflineScreen";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenOrientation from "expo-screen-orientation";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const WEBVIEW_REF = useRef(null);
  const window = useWindowDimensions();
  const [exitApp, setExitApp] = useState(0);
  const [appIsReady, setAppIsReady] = useState(false);
  const [isTV, setIsTV] = useState(false);
  const [activeUri] = useState("https://aicinemas.com");

  const INJECTEDJAVASCRIPT_TV = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=${window.width}px, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`;
  const INJECTEDJAVASCRIPT_PHONE = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`;

  const handleBackButton = () => {
    WEBVIEW_REF.current.goBack();
    setExitApp((curr) => curr + 1);
    setTimeout(() => {
      setExitApp(0);
    }, 500);

    return true;
  };

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.DEFAULT
    );
  }

  useEffect(() => {
    if (Platform.isTV) {
      changeScreenOrientation();
      setIsTV(true);
    }

    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, []);

  useEffect(() => {
    if (exitApp >= 2) {
      BackHandler.exitApp();
    }
  }, [exitApp]);

  useEffect(() => {
    if (appIsReady) {
      (async () => {
        await SplashScreen.hideAsync();
      })();
    }
  }, [appIsReady]);

  if (NetInfo.useNetInfo().isConnected === false) {
    return <OfflineScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden={Platform.OS !== "ios"} />
      <WebView
        scrollEnabled
        setBuiltInZoomControls
        ref={WEBVIEW_REF}
        style={{ flex: 1 }}
        scalesPageToFit={true}
        allowsFullscreenVideo={true}
        source={{ uri: activeUri }}
        onLoad={() => setAppIsReady(true)}
        injectedJavaScript={
          isTV ? INJECTEDJAVASCRIPT_TV : INJECTEDJAVASCRIPT_PHONE
        }
      />
    </SafeAreaView>
  );
}
