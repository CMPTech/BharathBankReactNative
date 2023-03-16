package com.apix.Models;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

public interface Methods {

    @POST("lightray/token/send")
    Call<Model> getUserData(@Body Model model);

    @POST("lightray/token/verify")
    Call<DataModel> verifyDevice(@Body DataModel dataModel);

    @POST("lightray/bcb/checkversion")
    Call<Version> verifyVersion(@Body Version version);

//    @GET("lightray/vmn/list")
//    Call<VMN> getList();

    @POST("lightray/metadata/send")
    Call<SendMetadata> sendData(@Body SendMetadata metadata);

    @POST("lightray/metadata/verify")
    Call<SendMetadata> verifyData(@Body SendMetadata metadata);
}
