import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {InAppBrowser} from "@ionic-native/in-app-browser";
// import {HttpClient, HttpHeaders, HttpParams} from '@ionic-native/http';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import {AtlantisService} from "./atlantis.service";
import {DevicePage} from "../device/device";


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  devices: any;
  user_id: any;

  constructor(public navCtrl: NavController, private atlantisService: AtlantisService, public storage: Storage) {
    let self = this;
    self.devices = [];
    storage.get('user_id').then((val) => {
      self.user_id = val;
      this.atlantisService.getAllDevices(val)
        .then(
          function (data) {

            JSON.parse(data.data).forEach(function (device) {
              self.devices.push(device);
            });

          }
        ).catch(function (data) {
        console.log(data);
      });
    });

  }

  selectDevice(device){
    //alert(device.id,{'idDevice': device.id});
    this.navCtrl.push(DevicePage, {'device': device});
  }

  getIconDeviceType(deviceType){
    switch(deviceType) {
      case "presenceSensor":
        return "wifi";
      case "temperatureSensor":
        return "thermometer";
      case "brightnessSensor":
        return "bulb";
      case "atmosphericPressureSensor":
        return "podium";
      case "humiditySensor":
        return "rainy";
      case "soundLevelSensor":
        return "volume-up";
      case "gpsSensor":
        return "locate";
      case "co2Sensor":
        return "nuclear";
      case "ledDevice":
        return "radio-button-on";
      case "beeperDevice":
        return "alert";
      default:
        return "";
    }
  }

  doRefresh(refresher){
    console.log('Begin async operation', refresher);

    let self = this;
    self.devices = [];
    this.atlantisService.getAllDevices(this.user_id)
      .then(
        function (data) {

          JSON.parse(data.data).forEach(function (device) {
            self.devices.push(device);
          });
          refresher.complete();
          console.log("refresh ok");

        }
      ).catch(function (data) {
        console.log(data);
        refresher.complete();
    });
  }

}
