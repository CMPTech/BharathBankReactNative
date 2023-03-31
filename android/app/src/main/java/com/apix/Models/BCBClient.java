package com.apix.Models;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class BCBClient {
        private static Retrofit retrofit;
        private static String BASE_URL = "http://nexanew.bharatbank.com:9090/apigateway/smart-service/public/";
        public static Retrofit getRetrofitInstance() {
            if (retrofit == null) {
                retrofit = new Retrofit.Builder().baseUrl(BASE_URL).addConverterFactory(GsonConverterFactory.create()).build();
            }
            return retrofit;
        }
}
