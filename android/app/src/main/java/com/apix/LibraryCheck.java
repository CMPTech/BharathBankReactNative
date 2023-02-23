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

    public void rootCheck(Context context) {
        boolean udata= RootLib.INSTANCE.findBinary("su");
        if(!udata){
            Log.d("App close","App close======");
            Toast.makeText(context, "Device is rooted ", Toast.LENGTH_LONG).show();
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
            Toast.makeText(context, "The app is modified please download original from play store", Toast.LENGTH_LONG).show();
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

    public void malwareApps(boolean value,Context context){
        if(value){
            Log.d("App close","App close======");
            Toast.makeText(context, "Malware apps detected please uninstall before opening the app", Toast.LENGTH_LONG).show();
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