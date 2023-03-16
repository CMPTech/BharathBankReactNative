package com.apix.Models;

import android.content.pm.Signature;

public class SendMetadata {

    private Object responseData;
    private String token;
    private String deviceId;
    private String os;
    private String checksum;
    private String phno;
    private String simno;
    private String IMEI;


    public SendMetadata(String device, String os, String checksum, String phno, String simno, String IMEI){
        this.deviceId = device;
        this.os = os;
        this.checksum = checksum;
        this.phno = phno;
        this.simno = simno;
        this.IMEI = IMEI;
    }

    public Object getResponseData() {
        return responseData;
    }
}
