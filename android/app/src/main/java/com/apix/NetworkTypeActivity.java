package com.apix;

import static android.content.ContentValues.TAG;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;

public class NetworkTypeActivity extends AppCompatActivity {
    private static final String LOG_TAG = "AndroidExample";
    private static final int MY_REQUEST_CODE = 123;
    private WifiManager wifiManager;
    String NetworkType = "";
    private TextView editText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        editText = (TextView) findViewById(R.id.textView1);
        this.wifiManager = (WifiManager) this.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        locationEnabled();
    }

    @Override
    public void onResume(){
        super.onResume();
        Toast.makeText(this,"Triggered from onResume function",Toast.LENGTH_LONG).show();
        locationEnabled();
    }

    private void location() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        LocationManager lm = (LocationManager) getSystemService(Context. LOCATION_SERVICE ) ;
        boolean gps_enabled;
        boolean network_enabled;
        gps_enabled = lm.isProviderEnabled(LocationManager. GPS_PROVIDER ) ;
        network_enabled = lm.isProviderEnabled(LocationManager. NETWORK_PROVIDER ) ;
        if (gps_enabled && network_enabled) {
            askAndStartScanWifi();
        }
    }

    private void locationEnabled(){
        LocationManager lm = (LocationManager)
                getSystemService(Context. LOCATION_SERVICE ) ;
        boolean gps_enabled = false;
        boolean network_enabled = false;
        boolean network = checkMobileDataIsEnabled(this);
        try {
            gps_enabled = lm.isProviderEnabled(LocationManager. GPS_PROVIDER );
        } catch (Exception e) {
            e.printStackTrace() ;
        }
        try {
            network_enabled = lm.isProviderEnabled(LocationManager. NETWORK_PROVIDER );
            Log.d("","network enabled" +network_enabled);
        } catch (Exception e) {
            e.printStackTrace() ;
        }

        if(network){
            MainApplication.getInstance().Backtomain();
            return;
        }

        else if(gps_enabled && network_enabled){
            askAndStartScanWifi();
            return;
        }
        else{
            new AlertDialog.Builder(this )
                    .setMessage( "Turn on your LOCATION services" )
                    .setPositiveButton( "Settings" , new
                            DialogInterface.OnClickListener() {
                                @Override
                                public void onClick (DialogInterface paramDialogInterface , int paramInt) {
                                    startActivity( new Intent(Settings. ACTION_LOCATION_SOURCE_SETTINGS )) ;
                                }
                            })
                    .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            editText.setText("The app needs location permission to proceed further. Please close the app, grant the location permission, and reopen the app. ");
                        }
                    })
                    .show() ;
            return;
        }
    }

    private void askAndStartScanWifi(){
//        locationEnabled();
        // With Android Level >= 23, you have to ask the user
        // for permission to Call.
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) { // 23
            int permission1 = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION);
            // Check for permissions
            if (permission1 != PackageManager.PERMISSION_GRANTED) {
                Log.d(LOG_TAG, "Requesting Permissions");
                // Request permissions
                ActivityCompat.requestPermissions(this,
                        new String[]{
                                Manifest.permission.ACCESS_COARSE_LOCATION,
                                Manifest.permission.ACCESS_FINE_LOCATION,
                                Manifest.permission.ACCESS_WIFI_STATE,
                                Manifest.permission.ACCESS_NETWORK_STATE
                        }, MY_REQUEST_CODE);
                this.doStartScanWifi(this);
                return;
            }
            Log.d(LOG_TAG, "Permissions Already Granted");
        }
        this.doStartScanWifi(this);
    }

    private void doStartScanWifi(Context context){
        this.wifiManager.startScan();
        this.wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        WifiInfo wifiInfo = wifiManager.getConnectionInfo();
        String ssid = wifiInfo.getSSID();
        showNetworksDetails(ssid);
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
                        editText.setText("The app needs location permission to proceed further. Please close the app, grant the location permission, and reopen the app. ");
                    } else {
                        // permission i denied and don't ask for it again
                        editText.setText("The app needs location permission to proceed further. Please close the app, grant the location permission, and reopen the app. ");
                    }
                    break;
                default:
                    throw new RuntimeException("unhandled permissions request code: " + requestCode);
            }
        }
    }

    private void showNetworksDetails(String value){
        String value1 =value.replace("\"","");
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
//            return value1;
        }
        List<ScanResult> list = wifiManager.getScanResults();
        for (int i = 0; i < list.size(); i++){
            if (value1.equals(list.get(i).SSID)) {
                Log.d("The SSID id :", list.get(i).SSID);
                Log.d("The network Type is : ", list.get(i).capabilities);
                NetworkType = list.get(i).capabilities;
                if(NetworkType.contains("WPA2") || NetworkType.contains("WPA")){
                    Toast.makeText(this,"Triggered before loading react app.",Toast.LENGTH_LONG).show();
                    MainApplication.getInstance().Backtomain();
                    return;
                }else{
                    AlertDialog.Builder builder = new AlertDialog.Builder(this);
                    builder.setMessage("Open Network detected. For Security reasons the app will not proceed.");
                    builder.setTitle("Alert !");
                    builder.setCancelable(false);
                    builder.setPositiveButton("OK", (DialogInterface.OnClickListener) (dialog, which) -> {
                        finish();
                        android.os.Process.killProcess(android.os.Process.myPid());

                    });
                    AlertDialog alertDialog = builder.create();
                    alertDialog.show();
                    return;
                }
            }
        }
    }

    private boolean checkMobileDataIsEnabled(Context context){
        boolean mobileYN = false;

        TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        if (tm.getSimState() == TelephonyManager.SIM_STATE_READY) {
            int dataState = tm.getDataState();
            Log.v(TAG,"tm.getDataState() : "+ dataState);
            if(dataState != TelephonyManager.DATA_DISCONNECTED){
                mobileYN = true;
            }

        }

        return mobileYN;
    }

    @Override
    public void onBackPressed() {
        // Do Here what ever you want do on back press;
    }
}
