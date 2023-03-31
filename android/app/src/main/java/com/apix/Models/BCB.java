package com.apix.Models;

public class BCB {
    private Object response;
    private String deviceId;
    private String os;
    private String checksum;
    private String versionNo;


    public BCB(String device, String os, String checksum, String versionNo){
        this.deviceId = device;
        this.os = os;
        this.checksum = checksum;
        this.versionNo = versionNo;
    }

    public Object getResponse() {
        return response;
    }
}
