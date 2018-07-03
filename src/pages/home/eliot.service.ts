import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import {ListPage} from "../devices/list";
import * as JWT from 'jwt-decode';

@Injectable()
export class EliotService {

  constructor(private http: HTTP, private iab: InAppBrowser, private storage: Storage) {

  }

  getCode(iab) :Promise<any> {
    return new Promise(function(resolve, reject) {
      var browser = iab.create("https://partners-login.eliotbylegrand.com/authorize?client_id=" + "358ca400-fdf6-4357-8cca-27caa6699197" + "&redirect_uri=" + "https://login.microsoftonline.com/tfp/oauth2/nativeclient" + "&response_type=code", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
      browser.on('loadstart').subscribe(event => {
        if ((event.url).indexOf("https://login.microsoftonline.com/tfp/oauth2/nativeclient") === 0) {
          browser.close();

          var responseParameters = ((event.url).split("?")[1]).split("&");
          var parsedResponse = {};
          for (var i = 0; i < responseParameters.length; i++) {
            parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
          }
          if (parsedResponse["code"] !== undefined && parsedResponse["code"] !== null) {
            //console.log(parsedResponse["code"]);
            //console.log(parsedResponse);
            //console.log("on est en place");
            //this.getToken(parsedResponse);
            resolve(parsedResponse);
          } else {
            console.log("Problem authenticating with Legrand");
            reject("Problem authenticating with Legrand");
          }

        }
      });

    })

  }

  getToken(response): Promise<string>  {

    let storageSaver = this.storage;
    console.log("voir reponse : 2");
    //let responseJson = JSON.parse(response);
    //alert("test");


    let body = {
      'client_id':'358ca400-fdf6-4357-8cca-27caa6699197',
      'grant_type':"authorization_code",
      'code': response.code,
      'client_secret':"*d,|`89Jnx/Ea5O8y$T724W4"
    };

    //alert("test 2");

    console.log(body);

    let requestOptions = {};
    requestOptions["Content-Type"] =  'application/x-www-form-urlencoded';

    //console.log("Call post " + "https://partners-login.eliotbylegrand.com/token");

    return this.http.post("https://partners-login.eliotbylegrand.com/token", body, requestOptions)
    //.toPromise()
      .then(function(data){
        //alert(data.data.id_token);
        //console.log(data.data);

        //this.storage.set('refresh_token', data.data.refresh_token);
        //alert(data.data.id_user)
        // console.log(data.data);
        let response = JSON.parse(data.data);
        //console.log(response.refresh_token);

        let decodedToken = JWT(response.id_token);
        let user_id = decodedToken['sub'];
        console.log(user_id);
        storageSaver.set('user_id', user_id);
        //storageSaver.set('refresh_token', response.refresh_token);
        //storageSaver.set('user_token', response.id_token);


        //alert(data.data.refresh_token);
        //this.storeToken(data.data.refresh_token);

        //this.navCtrl.setRoot(ListPage);
        //console.log(data)
        return decodedToken['sub'];
      })
      .catch(function(data){
        //alert("Impossible to login with Eliot, please re-try");
        Promise.reject("Impossible to login with Eliot, please re-try");
        console.log(data);
        //alert(data);
      });
  }

}
