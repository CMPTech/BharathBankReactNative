package com.apix;

import static android.content.ContentValues.TAG;

import android.Manifest;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Application;
import android.content.Context;
import android.content.DialogInterface;
import android.content.IntentFilter;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.provider.Settings;
import android.telephony.SmsManager;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.apix.Models.AppSignatureHelper;
import com.apix.Models.MySMSBroadcastReceiver;
import com.example.checksumlib.Checksumlib;
import com.example.devicedetails.DeviceDetails;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

public class DeviceBinding extends AppCompatActivity {
    private final long totalTimerCount = 45000;
    private CountDownTimer countdownTimer;

    private final MySMSBroadcastReceiver mySMSBroadcastReceiver = new MySMSBroadcastReceiver();
    private EditText editText;
    private Button button;

    private final int RECORD_REQUEST_CODE = 101;
    private final int MY_REQUEST_CODE = 123;
    private static final String LOG_TAG = "AndroidExample";
    private  String phoneNo = "";
    private String msg = "";
    private  String os = "ANDROID";

    private String details,token,signature,releaseSIg,encrypted,deviceType;

    @SuppressLint("MissingInflatedId")
    @RequiresApi(api = Build.VERSION_CODES.Q)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Run verifyMetadata first

        // if the api is successfull render main activity.
        //MainApplication.getInstance().Backtomain();
        //if api returns false
        //Start the device binding process (run primaryFn)

        //if FindAPI returns false run
        primaryFn();
        askPermission();
        deviceType = getDeviceName();

        token = generateToken();

        msg = "NEXA Secure SMS for verifying your mobile No.  DON'T SHARE THIS SMS with ANYONE. " + token.substring(1);

        Log.d("","details after" +msg);
        Log.d("","deviceType after" +token);


        generateAppSignKey();
//        requestSmsPermission();
        registerSMSReceiver();

        String packageName = this.getPackageName();
        PackageManager pm = this.getPackageManager();
        ApplicationInfo ai = null;
        try {
            ai = pm.getApplicationInfo(packageName,0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        String srcDir = ai.publicSourceDir;

        //send metadata
        Signature value = Checksumlib.INSTANCE.getSignature(this);
        signature = String.valueOf(value.hashCode());

        //verify-metadata
        Signature value1 = Checksumlib.INSTANCE.getReleasedSignature(srcDir,this);
        releaseSIg = String.valueOf(value1.hashCode());

        try {
            encrypted = generateHash(details);
            Log.d("","encrypted" +encrypted);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        verifyDevice();

        fetchToken();
    }

    @Override
    protected void onResume() {
        super.onResume();
        askPermission();
    }

    public String generateToken(){
        String key = "%"+ details.charAt(0) + os.charAt(1) + deviceType.charAt(2) + details.charAt(1) + os.charAt(0) + deviceType.charAt(0)
                + details.charAt(2) + os.charAt(2) + deviceType.charAt(1) + details.charAt(3) + "X" + deviceType.charAt(3)
                + details.charAt(4) + "Z" + deviceType.charAt(4) + "~" + details.substring(5) + "~" + deviceType.substring(5) + "~";

        return key;
    }

    public void primaryFn(){
        final boolean isSimSupport = isSimSupport(this);
        if(!isSimSupport){
            Alert("This device do not have sim. Please insert sim and then continue for Device Binding");
            return;
        }

        final boolean isAirplaneModeOn = isAirplaneModeOn(this);
        Log.d("","airplane"+isAirplaneModeOn);
        if(isAirplaneModeOn){
            Alert("Airplane mode is switched on. Please turn off and then continue for Device Binding");
            return;
        }

        final boolean isOnline = isOnline(this);
        if(!isOnline){
            Alert("The device network is turned off. Please turn on and then continue for Device Binding");
            return;
        }

        final Object versionInfo =  getVersionInfo(this);
    }

    private void askPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            final int permission1 = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE);
            if (permission1 != PackageManager.PERMISSION_GRANTED) {
                Log.d("", "Requesting Permissions");
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_PHONE_STATE, Manifest.permission.SEND_SMS}, MY_REQUEST_CODE);
                getDevice();
                return;
            }
            Log.d("", "permission already granted");
        }
        getDevice();
    }

    public static String generateHash(String message) throws NoSuchAlgorithmException {

        MessageDigest digest = MessageDigest.getInstance("SHA-512");

        byte[] hashedBytes = digest.digest(message.getBytes());

        StringBuilder builder = new StringBuilder();

        for (int i = 0; i < hashedBytes.length; i++) {

            builder.append(Integer.toString((hashedBytes[i] & 0xff) + 0x100, 16).substring(1));

        }

        return builder.toString();

    }

    private void getDevice() {
        details = DeviceDetails.INSTANCE.getDeviceId(this);
        Log.d("Device Details - ", details);
    }

    private void generateAppSignKey() {
        final AppSignatureHelper appSignatureHelper = new AppSignatureHelper(getApplicationContext());
        final String hashKey = String.valueOf(appSignatureHelper.getAppSignatures());
        Log.d("hashKey----------->", "hashKey: " + hashKey);
    }


    private void registerSMSReceiver() {

        this.registerReceiver(mySMSBroadcastReceiver, new IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION));

        mySMSBroadcastReceiver.init(new MySMSBroadcastReceiver.OTPReceiveListener() {
            @Override
            public void onOTPReceived(final String otp) {
                Log.d("onOTPReceived ------------>", "onOTPReceived ---> " + otp);
            }

            @Override
            public void onOTPTimeOut() {
                Log.d("onOTPTimeOut----------->", "onOTPTimeOut");
            }
        });
    }

    private void requestSmsPermission() {
        final int permission = ContextCompat.checkSelfPermission(this, Manifest.permission.SEND_SMS);

        if (permission != PackageManager.PERMISSION_GRANTED) {
            Log.i("requestSmsPermission", "Permission to record denied");
            makeRequest();
        }
        startSMSRetrieverClient();

    }

    private void makeRequest() {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.SEND_SMS},
                RECORD_REQUEST_CODE);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            if (mySMSBroadcastReceiver != null) {
                getApplicationContext().unregisterReceiver(mySMSBroadcastReceiver);
            }
        } catch (Exception e) {
            Log.e("onDestroy", "error --->  " + e);
        }
    }

    private void startSMSRetrieverClient() {
        SmsRetrieverClient client = SmsRetriever.getClient(this);
        Task<Void> task = client.startSmsRetriever();
        task.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                Log.d("startSMSRetrieverClient -------->", "success: " + aVoid);
            }
        });
        task.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Log.d("startSMSRetrieverClient -------->", "failure: " + e);
            }
        });
    }

    private void fetchToken() {
        Log.d("fetchToken", "fetchToken: ");
        startTimer();
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    public void initEventListeners() {
        registerActivityLifecycleCallbacks(new Application.ActivityLifecycleCallbacks() {
            @Override
            public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
            }

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
                Log.d("LifeCycle", "onActivityStopped: ");
                stopTimer();
            }

            @Override
            public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
            }

            @Override
            public void onActivityDestroyed(Activity activity) {
            }
        });
    }

    private void startTimer() {
        Log.d("startTimer", "startTimer: ");
        countdownTimer = new CountDownTimer(totalTimerCount, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                Log.d("onTick", "onTick in secs: " + millisUntilFinished / 1000);
            }

            @Override
            public void onFinish() {
                Log.d("timer", "onFinish: ");
                stopTimer();
            }
        }.start();
    }

    public void stopTimer() {
        Log.d("stopTimer", "onFinish: ");
        if (countdownTimer != null) {
            countdownTimer.cancel();
            countdownTimer = null;
        }
    }

    private Object getVersionInfo(DeviceBinding mainActivity) {
        PackageManager manager = this.getPackageManager();
        PackageInfo info = null;
        try {
            info = manager.getPackageInfo(this.getPackageName(), PackageManager.GET_ACTIVITIES);
            Log.d("version", "VersionCode = " + info.versionCode + "\nVersionName = " + info.versionName);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return info;
    }

    private boolean isSimSupport(Context context) {
        TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        return tm.getSimState() != TelephonyManager.SIM_STATE_ABSENT;
    }



    @SuppressWarnings("deprecation")
    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR1)
    public static boolean isAirplaneModeOn(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN_MR1) {
            return Settings.System.getInt(context.getContentResolver(),
                    Settings.System.AIRPLANE_MODE_ON, 0) != 0;
        } else {
            return Settings.Global.getInt(context.getContentResolver(),
                    Settings.Global.AIRPLANE_MODE_ON, 0) != 0;
        }
    }

    @SuppressLint("MissingPermission")
    private static boolean isOnline(Context context) {
        ConnectivityManager connectivityManager =
                (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager != null) {
            NetworkCapabilities capabilities = connectivityManager.getNetworkCapabilities(
                    connectivityManager.getActiveNetwork());
            Log.d("","outside if" +capabilities);
            if (capabilities != null) {
                if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                    Log.d("Internet", "NetworkCapabilities.TRANSPORT_WIFI");
                    return true;
                } else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) {
                    Log.d("Internet", "NetworkCapabilities.TRANSPORT_ETHERNET");
                    return true;
                }
                else return true;
            }
        }
        return false;
    }

    public void verifyDevice(){

        RequestQueue queue = Volley.newRequestQueue(this);

        // Create a JSONObject to hold the request body
        JSONObject requestBody = new JSONObject();
        try {
            requestBody.put("deviceId", encrypted);
            requestBody.put("appChecksum", signature);
            requestBody.put("versionNo", "1.0");
            requestBody.put("osType", "ANDROID");

        } catch (JSONException e) {
            e.printStackTrace();
        }

        String url = "http://nexanew.bharatbank.com:9090/apigateway/smart-service/public/verifyDevice";

// Create a new StringRequest object
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                // Handle the response
                Log.d("","response from volley" +response);
                try {
                    JSONObject obj = new JSONObject( response);
                    String Resmessage = obj.getString("message");
                    if(Resmessage.equals("Device details not found!")){
                        JSONArray vmnList = obj.getJSONArray("vmnList");
                        phoneNo = vmnList.getString(0);
                        if(isSMSPermissionGranted()){
                            sendSMS( phoneNo, msg);
                        }
                        verifyToken();
                    }

                    else if (Resmessage.equals("Device id found!")){
                        //Load the app
                    }

                    else if (Resmessage.equals("Version number not macthed!")){
                        //show the view and exit the app
                    }

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
            // Override getBody() to return the request body
            @Override
            public byte[] getBody() throws AuthFailureError {
                return requestBody.toString().getBytes();
            }

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

    public  void verifyToken(){
        RequestQueue queue = Volley.newRequestQueue(this);


        // Create a JSONObject to hold the request body
        JSONObject requestBody = new JSONObject();
        try {
            requestBody.put("deviceId", encrypted);
            requestBody.put("token", token.substring(1));
            requestBody.put("osType", "AND");

        } catch (JSONException e) {
            e.printStackTrace();
        }

        String url = "http://nexanew.bharatbank.com:9090/apigateway/smart-service/public/verifyDeviceToken";

// Create a new StringRequest object
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                // Handle the response
                Log.e("","response from 2nd api" +response);
                JSONObject obj = null;
                try {
                    obj = new JSONObject( response);
                    String verificationMsg = obj.getString("message");
                    String seed = obj.getString("seed");
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
            // Override getBody() to return the request body
            @Override
            public byte[] getBody() throws AuthFailureError {
                return requestBody.toString().getBytes();
            }

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

    public void Alert(String message){
        AlertDialog.Builder builder = new AlertDialog.Builder(DeviceBinding.this);

        // Set the message show for the Alert time
        builder.setMessage(message);

        // Set Alert Title
        builder.setTitle("Alert !");

        // Set Cancelable false for when the user clicks on the outside the Dialog Box then it will remain show
        builder.setCancelable(false);

        // Set the positive button with yes name Lambda OnClickListener method is use of DialogInterface interface.
        builder.setPositiveButton("OK", (DialogInterface.OnClickListener) (dialog, which) -> {
            // When the user click yes button then app will close
            android.os.Process.killProcess(android.os.Process.myPid());
        });

        AlertDialog alertDialog = builder.create();
        // Show the Alert Dialog box
        alertDialog.show();
    }

    public static String getDeviceName() {
        String manufacturer = Build.MANUFACTURER;
        String model = Build.MODEL;
        if (model.startsWith(manufacturer)) {
            return capitalize(model);
        }
        return capitalize(manufacturer);
    }

    private static String capitalize(String str) {
        if (TextUtils.isEmpty(str)) {
            return str;
        }
        char[] arr = str.toCharArray();
        boolean capitalizeNext = true;

        StringBuilder phrase = new StringBuilder();
        for (char c : arr) {
            if (capitalizeNext && Character.isLetter(c)) {
                phrase.append(Character.toUpperCase(c));
                capitalizeNext = false;
                continue;
            } else if (Character.isWhitespace(c)) {
                capitalizeNext = true;
            }
            phrase.append(c);
        }

        return phrase.toString();
    }

    public  boolean isSMSPermissionGranted() {
        if (Build.VERSION.SDK_INT >= 23) {
            if (checkSelfPermission(Manifest.permission.SEND_SMS)
                    == PackageManager.PERMISSION_GRANTED) {
                Log.v(TAG,"Permission is granted");
                return true;
            } else {

                Log.v(TAG,"Permission is revoked");
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.SEND_SMS}, 0);
//                sendSMS( phoneNo, msg);
                return false;
            }
        }
        else { //permission is automatically granted on sdk<23 upon installation
            Log.v(TAG,"Permission is granted");
            return true;
        }
    }

    private void sendSMS(String phoneNumber, String message)
    {
        SmsManager smsManager = SmsManager.getDefault();
        smsManager.sendTextMessage(phoneNumber, null, message, null, null);
        Toast.makeText(getApplicationContext(), "SMS sent.",
                Toast.LENGTH_LONG).show();
    }
}