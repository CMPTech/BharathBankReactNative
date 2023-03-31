package com.apix;

import android.Manifest;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Application;
import android.content.Context;
import android.content.DialogInterface;
import android.content.IntentFilter;
import android.content.SharedPreferences;
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
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.apix.Models.AppSignatureHelper;
import com.apix.Models.DataModel;
import com.apix.Models.Methods;
import com.apix.Models.Model;
import com.apix.Models.MySMSBroadcastReceiver;
import com.apix.Models.RetrofitClient;
import com.apix.Models.SendMetadata;
import com.apix.Models.Version;
import com.example.checksumlib.Checksumlib;
import com.example.devicedetails.DeviceDetails;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

import org.json.JSONException;
import org.json.JSONObject;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DeviceBinding extends AppCompatActivity {
    private final long totalTimerCount = 45000;
    private CountDownTimer countdownTimer;

    private final MySMSBroadcastReceiver mySMSBroadcastReceiver = new MySMSBroadcastReceiver();
    private EditText editText;
    private Button button;

    private final int RECORD_REQUEST_CODE = 101;
    private final int MY_REQUEST_CODE = 123;

    private String details,phno,signature,releaseSIg;

    @SuppressLint("MissingInflatedId")
    @RequiresApi(api = Build.VERSION_CODES.Q)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        editText = (EditText)findViewById(R.id.text_input_edit_text1);
        button = (Button)findViewById(R.id.button_id);

        //Run verifyMetadata first
        verifyMetaData();
        // if the api is successfull render main activity.
        //MainApplication.getInstance().Backtomain();
        //if api returns false
        //Start the device binding process (run primaryFn)

        //if FindAPI returns false run
        primaryFn();
        askPermission();
        generateAppSignKey();
        requestSmsPermission();
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

        button.setOnClickListener(
                v -> {
                    phno = editText.getText().toString();
                    sendMetadata();
                    fetchToken();
                });

        try {
            String encrypted = generateHash(details);
            Log.d("","encrypted" +encrypted);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        askPermission();
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
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_PHONE_STATE}, MY_REQUEST_CODE);
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
                tokenVerify(otp);
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
        verifyDevice(details);
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
            verifyVersion(info.versionCode, info.versionName);
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

    public void verifyDevice(String device){
        Methods methods = RetrofitClient.getRetrofitInstance().create(Methods.class);

        Model modal = new Model(device);

        Call<Model> call = methods.getUserData(modal);

        call.enqueue(new Callback<Model>() {
            @Override
            public void onResponse(Call<Model> call, Response<Model> response) {
                if(response.isSuccessful()){
                    Log.d("","Response while sending Device ID"+response.body().getResponseData());
                    JSONObject obj = new JSONObject((Map) response.body().getResponseData());
                    try {
                        JSONObject apiRes = new JSONObject(obj.getString("response"));
                        String token = apiRes.getString("token");
//                        Log.d("----------","Token "+ token);
                        SharedPreferences sharedPreferences = getSharedPreferences("MySharedPref",MODE_PRIVATE);
                        SharedPreferences.Editor myEdit = sharedPreferences.edit();
                        myEdit.putString("DeviceID", device );
                        myEdit.putString("Token", token);
                        myEdit.apply();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(Call<Model> call, Throwable t) {
                Toast.makeText(DeviceBinding.this,"Error Occurred",Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void tokenVerify(String otp){
        Methods methods = RetrofitClient.getRetrofitInstance().create(Methods.class);

        SharedPreferences sh = getSharedPreferences("MySharedPref", MODE_PRIVATE);
        String s1 = sh.getString("DeviceID", "");
//        String s2 = sh.getString("Token", "");

        DataModel modal = new DataModel(s1,otp);

        Call<DataModel> call = methods.verifyDevice(modal);

        call.enqueue(new Callback<DataModel>() {
            @Override
            public void onResponse(Call<DataModel> call, Response<DataModel> response) {
                if(response.isSuccessful()){
                    Toast.makeText(DeviceBinding.this, "Data updated to API", Toast.LENGTH_SHORT).show();
                    DataModel responseFromAPI = response.body();
                    Log.d("","Response after successful match of ID and token" + response.body().getResponseData());
//                    MainApplication.getInstance().Backtomain();
                }
            }

            @Override
            public void onFailure(Call<DataModel> call, Throwable t) {
                Toast.makeText(DeviceBinding.this,"Error Occurred",Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void verifyVersion(int vCode,String vName){
        Methods methods = RetrofitClient.getRetrofitInstance().create(Methods.class);

        Version modal = new Version(vCode,vName);

        Call<Version> call = methods.verifyVersion(modal);

        call.enqueue(new Callback<Version>() {
            @Override
            public void onResponse(Call<Version> call, Response<Version> response) {
                if(response.isSuccessful()){

                    Toast.makeText(DeviceBinding.this, "Verification done successfully", Toast.LENGTH_SHORT).show();
                    Log.d("","Response after successfull version match" + response.body().getResponseData());
                }
            }

            @Override
            public void onFailure(Call<Version> call, Throwable t) {
                Toast.makeText(DeviceBinding.this,"Error Occurred",Toast.LENGTH_SHORT).show();
//                Alert("The version is invalid. Please install new version and then continue for Device Binding");
            }
        });
    }

    public void sendMetadata(){
        Methods methods = RetrofitClient.getRetrofitInstance().create(Methods.class);

        SendMetadata modal = new SendMetadata(details,"android",signature,phno,"","");

        Call<SendMetadata> call = methods.sendData(modal);

        call.enqueue(new Callback<SendMetadata>() {
            @Override
            public void onResponse(Call<SendMetadata> call, Response<SendMetadata> response) {
                if(response.isSuccessful()){
                    Toast.makeText(DeviceBinding.this, "Data updated to API", Toast.LENGTH_SHORT).show();
                    SendMetadata responseFromAPI = response.body();
                    Log.d("","Response after sending metadata" + response.body().getResponseData());
                }
            }

            @Override
            public void onFailure(Call<SendMetadata> call, Throwable t) {
                Toast.makeText(DeviceBinding.this,"Error Occurred",Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void verifyMetaData(){
        Methods methods = RetrofitClient.getRetrofitInstance().create(Methods.class);

        SendMetadata modal = new SendMetadata(details,"android",releaseSIg,phno,"","");

        Call<SendMetadata> call = methods.verifyData(modal);

        call.enqueue(new Callback<SendMetadata>() {
            @Override
            public void onResponse(Call<SendMetadata> call, Response<SendMetadata> response) {
                if(response.isSuccessful()){
                    Toast.makeText(DeviceBinding.this, "Data updated to API", Toast.LENGTH_SHORT).show();
                    SendMetadata responseFromAPI = response.body();
                    Log.d("","Response after verifing metadata" + response.body().getResponseData());
//                    MainApplication.getInstance().Backtomain();
                }
            }

            @Override
            public void onFailure(Call<SendMetadata> call, Throwable t) {
                Toast.makeText(DeviceBinding.this,"Error Occurred",Toast.LENGTH_SHORT).show();
            }
        });
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
}