# BharathBankReactNative

Changes in MainApplication.java:
1) Libraries functions integrated.
2) Three new java class (Network type, NetworkTypeActivity and LibraryCheck) is added to the package.

Changes in Manifest file:
1) Permissions for accessing WIFI state is added.
2) 3 java classes/Activity is mentioned in the Manifest file as activity.  

Changes in build.gradle(module):
1) Dependencies for the libraries is added.

Repositories added: 
implementation 'com.github.CMPTech:RootCheckerLib:1.5'
implementation 'com.github.CMPTech:RemoteAppsLib:1'
implementation 'com.github.CMPTech:AppchecksumLib:1.7'
implementation 'androidx.appcompat:appcompat:1.6.1'
implementation 'com.google.android.material:material:1.8.0'




Changing minimum sdk version to 23

Change minimum SDK version to 23 in build.gradle (apix) file
minSdkVersion = 23



This has to be added in AndroidManifest.xml file 
<uses-sdk android:targetSdkVersion="33" android:minSdkVersion="23"
   tools:overrideLibrary="com.example.rootcheckerlib.RootLib, com.example.checkremoteappslib"/>



Compare the versions in build.gradle (:app) file
   implementation 'com.github.CMPTech:RootCheckerLib:1.5'
   implementation 'com.github.CMPTech:RemoteAppsLib:1'
   implementation 'com.github.CMPTech:AppchecksumLib:1.7'
   implementation 'androidx.appcompat:appcompat:1.6.1'
   implementation 'com.google.android.material:material:1.8.0'

