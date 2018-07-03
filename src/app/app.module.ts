import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule, NavController} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {MSAdal} from "@ionic-native/ms-adal";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {HTTP} from "@ionic-native/http";
import {EliotService} from "../pages/home/eliot.service";
import {IonicStorageModule} from "@ionic/storage";
import {AtlantisService} from "../pages/devices/atlantis.service";
import {ListPage} from "../pages/devices/list";
import {DevicePage} from "../pages/device/device";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DevicePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DevicePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MSAdal,
    InAppBrowser,
    HTTP,
    EliotService,
    AtlantisService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
