package com.apix;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;

import java.net.URISyntaxException;

public class NetworkType extends AppCompatActivity {
    private static final String LOG_TAG = "AndroidExample";
    private static final int MY_REQUEST_CODE = 123;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        startActivity(new Intent(this, NetworkTypeActivity.class));
        Log.d("----------","The value of data");

    }

    private void goToMain() {
            startActivity(new Intent(this, MainActivity.class));
    }
    public void onActivityResult(int requestCode, int resultCode, String data) throws URISyntaxException {
        super.onActivityResult(requestCode, resultCode, Intent.getIntentOld(data));
        Log.d("----------","The value of data");
        if (requestCode == MY_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {
                goToMain();
            }
        }
    }
}
