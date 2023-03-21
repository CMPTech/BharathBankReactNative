package com.apix;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.checksumlib.Checksumlib;
import com.example.rootcheckerlib.RootLib;


public class LibraryCheck extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    public boolean rootCheck(Context context) {
        boolean udata= RootLib.INSTANCE.findBinary("su");
        if(udata){
            Log.d("App close","App closed");
            Toast.makeText(context, "Your device is rooted. The app will not start on a rooted device.", Toast.LENGTH_LONG).show();
            // Use for finish the app
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    android.os.Process.killProcess(android.os.Process.myPid());

                }
            }, 5000);
            return true;
        }
        return false;
    }

    public boolean checksum(Context context) {
        boolean checksum = Checksumlib.INSTANCE.primary(context);
        Log.d("Checksum - ", String.valueOf(checksum));
        if(!checksum){
            Log.d("App close","App closed");
            Toast.makeText(context, "App checksum did not match. Please uninstall and install it again from the Google PlayStore.", Toast.LENGTH_LONG).show();
            // Use for finish the app
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            }, 5000);
            return true;
        }
        return checksum;
    }

    public boolean malwareApps(boolean value, Context context, String appname){
        if(value){
            Log.d("App close","App closed");
            Toast.makeText(context, "Please uninstall " + appname + " before opening the app again.", Toast.LENGTH_LONG).show();
            // Use for finish the app
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            }, 5000);
            return value;
        }
        return value;
    }
}