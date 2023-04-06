package com.apix;

import static android.content.ContentValues.TAG;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.List;

public class NetworkTypeActivity extends AppCompatActivity {
    private static final String LOG_TAG = "AndroidExample";
    private static final int MY_REQUEST_CODE = 123;
    private WifiManager wifiManager;
    String NetworkType = "";
    private TextView editText;
    private boolean allChecksPassed = false;
    Integer defaultStatusBarColor;
    String returnValue;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        editText = (TextView) findViewById(R.id.textView1);
        this.wifiManager = (WifiManager) this.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        isNetworkSecured();
    }

    @Override
    public void onResume(){
        super.onResume();
        Log.d("onResume", "onResume: invoke ");
        isNetworkSecured();
    }

    protected void onStop() {
        // It will show a message on the screen
        // then onStop is invoked
        super.onStop();
        Log.d("onStop", "onStop: invoke ");
        if(!allChecksPassed) android.os.Process.killProcess(android.os.Process.myPid());
    }

    public String isNetworkSecured(){
        returnValue = locationEnabled();
        return returnValue;
    }

    private String locationEnabled(){
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
            return "Yes";
        }

        else if(gps_enabled && network_enabled){
            String value = doStartScanWifi(this);
            return value;
        }
        else{
        }
        return "Yes";
    }

    private String askAndStartScanWifi(){
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
                String value = this.doStartScanWifi(this);
                return value;
            }
            Log.d(LOG_TAG, "Permissions Already Granted");
        }
        String value = this.doStartScanWifi(this);
        return value;
    }

    private String doStartScanWifi(Context context){
        this.wifiManager.startScan();
        this.wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        WifiInfo wifiInfo = wifiManager.getConnectionInfo();
        String ssid = wifiInfo.getSSID();
        String value = showNetworksDetails(ssid);
        return value;
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
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                            getWindow().setStatusBarColor(defaultStatusBarColor);
                        }
                    } else if (ActivityCompat.shouldShowRequestPermissionRationale(this, permissions[i])) {
                        // permission i denied
                        Log.d(LOG_TAG, "Permission Denied: ");
                        returnValue = "Permission Denied";
                    } else {
                        // permission i denied and don't ask for it again
                    }
                    break;
                default:
                    throw new RuntimeException("unhandled permissions request code: " + requestCode);
            }
        }
    }

    private String showNetworksDetails(String value){
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
                    allChecksPassed = true;
                    MainApplication.getInstance().Backtomain();
                    return "Yes";
                }else{

                    return "No";
                }
            }
        }
        return value1;
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
