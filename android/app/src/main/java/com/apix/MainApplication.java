package com.apix;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.apix.Models.MalwareApps;
import com.apix.newarchitecture.MainApplicationReactNativeHost;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;

public class MainApplication extends Application implements ReactApplication {
  private static String FILE_NAME = "package_list.json";
  public JSONArray response_data;
  private static MainApplication instance;
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


//------------------------------- Changed from here ---------------------------------------
    //Libraries integrated
    // 1.Root Detection.
    // 2.Malware Apps.
    // 3.Checksum validation.
    // 4.Blocking Screenshot and Screen recording.
    // 5.Network secured or not.

    instance = this;

    //BlockScreenshots
    setupActivityListener();

    malware();
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

  public void mainFn() throws JSONException {

    final boolean rooted = isRooted();
    if(rooted){
      return;
    }

    final boolean malware = CheckMalwareApps();
    if(malware){
      return;
    }


    final boolean checksum = validateChecksum();
    if(!checksum){
      return;
    }

    Network();

  }

  public boolean isRooted(){
    LibraryCheck act = new LibraryCheck();
    Context context =getBaseContext();
    boolean val = act.rootCheck(context);
    return val;
  }

  public void malware(){
    RequestQueue queue = Volley.newRequestQueue(this);


    // Create a JSONObject to hold the request body
//        JSONObject requestBody = new JSONObject();

    String url = "http://nexanew.bharatbank.com:9090/apigateway/smart-service/public/malwares";

// Create a new StringRequest object
    StringRequest request = new StringRequest(Request.Method.POST, url, new com.android.volley.Response.Listener<String>() {
      @Override
      public void onResponse(String response) {
        // Handle the response
        Log.e("","response from 3rd api" +response);
        try {
          JSONObject obj = new JSONObject(response);
          JSONArray apiRes = new JSONArray(obj.getString("malwares"));
          response_data = apiRes;
          mainFn();
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
    }, new Response.ErrorListener() {
      @Override
      public void onErrorResponse(VolleyError error) {
        // Handle the
        Log.e("","response from volley" +error);
      }
    }) {
      // Override getHeaders() to set the Content-Type header
      @Override
      public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        return headers;
      }
    };
    // Add the request to the RequestQueue
    queue = Volley.newRequestQueue(this);
    queue.add(request);
  }

  public boolean CheckMalwareApps() throws JSONException {
    LibraryCheck lib = new LibraryCheck();
    Context context = getBaseContext();
    boolean val = false;
    for(int i=0;i<response_data.length();i++){
      JSONObject data = response_data.getJSONObject(i);
      String appname = data.getString("appName");
      String packageName = data.getString("packageName");
      val = lib.malwareApps(packageName,context,appname);
      if(val){
        return val;
      }
    }
    return val;
  }

  public boolean validateChecksum(){
    LibraryCheck data = new LibraryCheck();
    Context context =getBaseContext();
    boolean val = data.checksum(context);
    return val;
  }

  public void Network() {
    Intent intent = new Intent(this, NetworkType.class);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(intent);
  }

  public static MainApplication getInstance() {
    return instance;
  }

  public void Backtomain(){
    Intent intent = new Intent(MainApplication.this, MainActivity.class);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(intent);
    Log.d("","Log inside backtomainfn");
  }

  public void deviceBinding(){
    Intent intent = new Intent(this, DeviceBinding.class);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(intent);
  }
//--------------------------- Changed till here ---------------------------------

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
