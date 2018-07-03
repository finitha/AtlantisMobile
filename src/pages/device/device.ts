import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AtlantisService} from "../devices/atlantis.service";



@Component({
  selector: 'page-device',
  templateUrl: 'device.html'
})
export class DevicePage {

  public metricRealtime: any = {};
  public metricCalcDay: any = {};
  public metricCalcWeek: any = {};
  public device: any = {};

  constructor(public navCtrl: NavController, private atlantisService: AtlantisService, public navParams: NavParams) {
    let self = this;
    self.metricRealtime = {};
    self.device = this.navParams.get('device');
    console.log(self.device);
    this.atlantisService.getRealTimeMetrics(self.device.id)
      .then(
        function (data) {
          let result = JSON.parse(data.data);
          console.log(result);
          console.log(result[0]);
          self.metricRealtime = result[0];
          console.log("get realtime ok");
        }
      ).catch(function (data) {
      console.log(data);
    });

    this.atlantisService.getCalculatedMetrics(self.device.id)
      .then(
        function (data) {
          let result = JSON.parse(data.data);
          console.log(result);
          self.metricCalcDay = {};
          self.metricCalcWeek = {};

          if(result.length > 0){
            result.forEach(function (metrics) {
              console.log(metrics);
              if(metrics.calculatedType == "day"){
                self.metricCalcDay = metrics;
              }
              if(metrics.calculatedType == "Semaine"){
                self.metricCalcWeek = metrics;
              }

            });
          }
          console.log("get calculated ok");
        }
      ).catch(function (data) {
      console.log(data);
    });
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

  sendCommand(idDevice){
    console.log(idDevice);
    alert(idDevice);
    this.atlantisService.sendCommand(idDevice).then(function(data){
      console.log("ok");
    })
      .catch(function(data){
        console.log(data);
      });
  }

}
