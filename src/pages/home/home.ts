import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {InAppBrowser} from "@ionic-native/in-app-browser";
// import {HttpClient, HttpHeaders, HttpParams} from '@ionic-native/http';
import { HTTP } from '@ionic-native/http';
import {EliotService} from "./eliot.service";
import { Storage } from '@ionic/storage';
import {ListPage} from "../devices/list";
import {AtlantisService} from "../devices/atlantis.service";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {



  constructor(public loadingCtrl: LoadingController,  public navCtrl: NavController, private iab: InAppBrowser, private http: HTTP, private eliotService: EliotService, private storage: Storage, public apiService: AtlantisService) {

  }

  list(){
    this.navCtrl.setRoot(ListPage);
  }

  launchLogin(){
    this.storage.set('user_token', "test");
    alert("first try");
    /* this.storage.set('user_token', "test");
    this.storage.get('user_token').then((val) => {
      alert(val);
    }); */
    //this.eliotService.getCode();
  }

  doLogin2(){
    this.eliotService.getCode(this.iab).then(success => {
      /*let loader = this.loadingCtrl.create({
        content: "Connection"
      }); */
      //Show the loading indicator
      //loader.present();
      //alert(success);
      this.eliotService.getToken(success).then(
        token => {
          this.navCtrl.setRoot(ListPage);
        },
        error => {
          //loader.dismiss();
          console.error('Error Log in' + error);

        }
      )
    }, (error) => {
      alert(error);
      console.log(error);
    });
  }


  doLogin() {
    /*
     let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.microsoftonline.com/tfp/');
     authContext.validateAuthority = false;
     alert("test");

     authContext.acquireTokenAsync('https://graph.windows.net', '358ca400-fdf6-4357-8cca-27caa6699197', 'urn:ietf:wg:oauth:2.0:oob', null, null)
     .then((authResponse: AuthenticationResult) => {
     console.log('Token is' , authResponse.accessToken);
     console.log('Token will expire on', authResponse.expiresOn);
     })
     .catch((e: any) => console.log('Authentication failed', e)); */


    var browser = this.iab.create("https://partners-login.eliotbylegrand.com/authorize?client_id=" + "358ca400-fdf6-4357-8cca-27caa6699197" + "&redirect_uri=" + "https://login.microsoftonline.com/tfp/oauth2/nativeclient" + "&response_type=code", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
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
          console.log(parsedResponse);
          console.log("on est en place");
          this.getToken(parsedResponse).then(function (data) {
            console.log(data);
            console.log("success");
            //this.navCtrl.setRoot(ListPage);
          })
        } else {
          console.log("Problem authenticating with Legrand");
        }

      }
    });

  }
    getToken(response){
      /*let headerDict = {};
      headerDict["Content-Type"] =  'application/x-www-form-urlencoded';

      const requestOptions = {
        headers: new HttpHeaders(headerDict),
      };

      let body = new HttpParams()
        .set('client_id', "358ca400-fdf6-4357-8cca-27caa6699197")
        .set('grant_type', "authorization_code")
        .set('code', code)
        .set('client_secret', "*d,|`89Jnx/Ea5O8y$T724W4"); */
      let movePage = this.goToList();


      let body = {
        'client_id':'358ca400-fdf6-4357-8cca-27caa6699197',
        'grant_type':"authorization_code",
        'code': response.code,
        'client_secret':"*d,|`89Jnx/Ea5O8y$T724W4"
      };

      let requestOptions = {};
      requestOptions["Content-Type"] =  'application/x-www-form-urlencoded';

      console.log("Call post " + "https://partners-login.eliotbylegrand.com/token");

      return this.http.post("https://partners-login.eliotbylegrand.com/token", body, requestOptions);
        //.toPromise()
      /*
        .then(function(data){
          //alert("success");
          //this.navCtrl.setRoot(ListPage);
          console.log("success");
          console.log(data)
        })
        .catch(function(data){
          alert("fail");
          console.log(data)
        });
      */

    }

    goToList(){
      //this.navCtrl.setRoot(ListPage);
    }

    test(){
      this.apiService.sendCommand("28:C1:5B:7D:7A:12").then(function (data) {
        console.log(data);
      }).catch(function (data) {
        console.log(data);
      });
    }



    /*browserRef.addEventListener("loadstart", (event) => {
      if ((event.url).indexOf("https://login.microsoftonline.com/tfp/oauth2/nativeclient") === 0) {
        browserRef.removeEventListener("exit", (event) => {});
        browserRef.close();
        var responseParameters = ((event.url).split("?")[1]).split("&");
        var parsedResponse = {};
        for (var i = 0; i < responseParameters.length; i++) {
          parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
        }
        if (parsedResponse["code"] !== undefined && parsedResponse["code"] !== null) {
          resolve(parsedResponse);
        } else {
          reject("Problem authenticating with Legrand");
        }
      }
      */



}
