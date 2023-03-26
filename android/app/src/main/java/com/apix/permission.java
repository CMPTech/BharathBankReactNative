package com.apix;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class permission extends AppCompatActivity {
    private static final String LOG_TAG = "AndroidExample";
    private static final int MY_REQUEST_CODE = 123;
    private TextView editText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        editText = (TextView) findViewById(R.id.textView1);
        askAndStartScanWifi();
    }
    private void askAndStartScanWifi(){
//        locationEnabled();
        // With Android Level >= 23, you have to ask the user
        // for permission to Call.
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) { // 23
            int permission1 = ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION);
            // Check for permissions
            if (permission1 != PackageManager.PERMISSION_GRANTED) {
                Log.d(LOG_TAG, "Requesting Permissions");
                // Request permissions
                ActivityCompat.requestPermissions(this,
                        new String[]{
                                android.Manifest.permission.ACCESS_COARSE_LOCATION,
                                android.Manifest.permission.ACCESS_FINE_LOCATION,
                                android.Manifest.permission.ACCESS_WIFI_STATE,
                                Manifest.permission.ACCESS_NETWORK_STATE
                        }, MY_REQUEST_CODE);
                NetworkType();
                return;
            }
            Log.d(LOG_TAG, "Permissions Already Granted");
        }
        NetworkType();
    }

    @SuppressLint("SetTextI18n")
    public void onRequestPermissionsResult(int requestCode, String permissions[] , int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        for (int i = 0; i < permissions.length; i++) {
            switch (requestCode) {
                case MY_REQUEST_CODE:
                    if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                        // permission i granted
                        Log.d(LOG_TAG, "Permission Granted: " + permissions[0]);
                    } else if (ActivityCompat.shouldShowRequestPermissionRationale(this, permissions[i])) {
                        // permission i denied
//                        Log.d(LOG_TAG, "Permission Denied: ");
//                        Alert("We need network permission to continue further. Please close the app and allow permissions and then relaunch the app to continue ");
                        editText.setText("The app needs location permission to proceed further. Please close the app, grant the location permission, and reopen the app. ");
//                        android.os.Process.killProcess(android.os.Process.myPid());
//                        onBackPressed();
                    } else {
                        // permission i denied and don't ask for it again
                        editText.setText("The app needs location permission to proceed further. Please close the app, grant the location permission, and reopen the app. ");
//                        android.os.Process.killProcess(android.os.Process.myPid());
//                        onBackPressed();
                    }
                    break;
                default:
                    throw new RuntimeException("unhandled permissions request code: " + requestCode);
            }
        }
    }

    public void NetworkType(){
        Intent intent = new Intent(this, NetworkTypeActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
    }
}
