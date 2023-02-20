package com.apix;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;

import com.apix.newarchitecture.MainApplicationReactNativeHost;
import com.example.checkremoteappslib.checkRemoteApps;
import com.example.checksumlib.Checksumlib;
import com.example.devicedetails.DeviceDetails;
import com.example.rootcheckerlib.RootLib;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication{
  private static final int MY_REQUEST_CODE = 123;
  boolean Ntype;
  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  private final ReactNativeHost mNewArchitectureNativeHost =
      new MainApplicationReactNativeHost(this);

  @Override
  public ReactNativeHost getReactNativeHost() {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return mNewArchitectureNativeHost;
    } else {
      return mReactNativeHost;
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    //Libraries integrated
    // 1.Root Detection.
    // 2.Malware Apps.
    // 3.Checksum validation.
    // 4.Blocking Screenshot and Screen recording.
    // 5.Network secured or not.

    // isRooted
    isRooted();

    //CheckMalwareApps
    CheckMalwareApps();

    //DeviceDetails
    DeviceDetails();

    //validateChecksum
    validateChecksum();

    //BlockScreenshots
    setupActivityListener();

    //isNetworkOpen
    Network();
  }
  private void setupActivityListener() {
    registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
      @Override
      public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
        activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);            }
      @Override
      public void onActivityStarted(Activity activity) {
      }
      @Override
      public void onActivityResumed(Activity activity) {

      }
      @Override
      public void onActivityPaused(Activity activity) {

      }
      @Override
      public void onActivityStopped(Activity activity) {
      }
      @Override
      public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
      }
      @Override
      public void onActivityDestroyed(Activity activity) {
      }
    });
  }

  public  void  isRooted(){
    boolean data = RootLib.INSTANCE.findBinary("su");
    Log.d("The device is rooted","Rooted:"+data);
  }

  public void CheckMalwareApps(){
    boolean isPackageInstaled = checkRemoteApps.INSTANCE.isPackagesInstalled("com.anydesk.anydeskandroid", this.getPackageManager());
    Log.d("Is com.anydesk.anydeskandroid installed ---------- ","Background"+ isPackageInstaled);
  }

  public  void validateChecksum(){
    boolean checksum = Checksumlib.INSTANCE.primary(this);
    Log.d("Checksum - ", String.valueOf(checksum));
  }

  public void DeviceDetails(){
    String details = DeviceDetails.INSTANCE.getDeviceId(this);
    Log.d("Device Details - ",details);
  }

  public void Network() {
    Intent intent = new Intent(this, NetworkType.class);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(intent);
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.apix.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
