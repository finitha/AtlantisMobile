import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class AtlantisService {

  public endPointUrl =  "http://35.205.104.50:11080/atlantisFacade-war/webdata/data";

  constructor(private http: HTTP, private storage: Storage) {

  }

  getAllDevices(id_user){
    return this.http.get(this.endPointUrl + "/devices/" + String(id_user), {}, {});

  }

  getRealTimeMetrics(idDevice){
    return this.http.get(this.endPointUrl + "/measures/" + String(idDevice), {}, {});
  }

  getCalculatedMetrics(idDevice){
    return this.http.get(this.endPointUrl + "/calculated/" + String(idDevice), {}, {});
  }

  sendCommand(idDevice){
    let requestOptions = {};
    requestOptions["Content-Type"] =  'application/json';
    let body = {'id':idDevice};
    this.http.setDataSerializer("json");
    return this.http.post(this.endPointUrl + "/sendCommand", body, {});
  }

}
