package com.apix;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MyModule extends ReactContextBaseJavaModule {
    public MyModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }


    @Override
    public String getName() {
        return "MyModule";
    }
    // ...

    @ReactMethod
    public void myMethod(String arg1, int arg2, Callback callback) {
        // Do something with the arguments
        String result = "Result";
        // Invoke the callback with the result
//        NetworkTypeActivity obj = new NetworkTypeActivity();
//        String Value = obj.isNetworkSecured();
//        Log.d("abcd","value inside" +Value);
        callback.invoke(arg1);
    }


}
