package com.apix;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.rootcheckerlib.RootLib;

import com.example.checksumlib.Checksumlib;


public class LibraryCheck extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    public void rootCheck(Context context) {
        boolean udata= RootLib.INSTANCE.findBinary("su");
        if(udata){
            Log.d("App close","App close======");
            Toast.makeText(context, "Your device is rooted. The app will not start on a rooted device.", Toast.LENGTH_LONG).show();
            // Use for finish the app
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            }, 5000);
        }
    }

    public void checksum(Context context) {
        boolean checksum = Checksumlib.INSTANCE.primary(context);
        Log.d("Checksum - ", String.valueOf(checksum));
        if(!checksum){
            Log.d("App close","App close======");
            Toast.makeText(context, "App checksum did not match. Please uninstall and install it again from the Google Play Store.", Toast.LENGTH_LONG).show();
            // Use for finish the app
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            }, 5000);
        }
    }

    public void malwareApps(boolean value,Context context, String appname){
        if(value){
            Log.d("App close","App close======");
            Toast.makeText(context, "Please uninstall " + appname + " before opening the app again.", Toast.LENGTH_LONG).show();
            // Use for finish the app
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            }, 5000);
        }
    }
}