import { NavController, Platform, ViewController, NavParams, AlertController, ModalController  } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '../../providers/google-maps/google-maps';
import { Plan2Page} from '../plan2/plan2';
import { PenggunaPage } from '../pengguna/pengguna';
import { AutoCompletePage} from '../auto-complete/auto-complete';




@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage{

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
      address;
    latitude: number;
    longitude: number;
    autocompleteService: any;
    placesService: any;
    query: string = '';
    places: any = [];
    searchDisabled: boolean;
    saveDisabled: boolean;
    drawingManager:any;
    location: any;
    nama:any = {};
    placedetails: any;



    constructor(public navCtrl: NavController, public navParams: NavParams, public zone: NgZone, public maps: GoogleMaps, public platform: Platform, public geolocation: Geolocation, public viewCtrl: ViewController, private alertCtrl: AlertController, private modalCtrl: ModalController) {
        this.searchDisabled = true;
        this.saveDisabled = true;

        this.address = {
          place: ''
        };


    }

    ionViewDidLoad(): void {

        let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

            this.autocompleteService = new google.maps.places.AutocompleteService();
            this.placesService = new google.maps.places.PlacesService(this.maps.map);
            this.searchDisabled = false;

        });
        this.initPlacedetails();

    }

    /*selectPlace(place){

        this.address.place = [];


        let location = {
            lat: null,
            lng: null,
            name: place.name
        };

        this.placesService.getDetails({placeId: place.place_id}, (details) => {

            this.zone.run(() => {

                location.name = details.name;
                location.lat = details.geometry.location.lat();
                location.lng = details.geometry.location.lng();
                this.saveDisabled = false;

                this.maps.map.setCenter({lat: location.lat, lng: location.lng});

                this.location = location;

            });

        });

    }*/

    close(){
        this.viewCtrl.dismiss();
    }
    createPlan(){
      if (this.maps.pathstr == undefined) {
          this.presentAlert()
      }else{
      this.nama.latlng = this.maps.pathstr;
      this.navCtrl.push(Plan2Page, {
        latlng : this.nama.latlng
      }); }
        //console.log(latlng);
    }
presentAlert() {
  let alert = this.alertCtrl.create({
    title: 'Note',
    subTitle: 'Buat polygon dahulu',
    buttons: ['Ok']
  });
  alert.present();
}

showAddressModal () {
  let modal = this.modalCtrl.create(AutoCompletePage);
  let self = this;
  modal.onDidDismiss(data => {
    if(data){
        this.address.place = data.description;
        // get details
        this.getPlaceDetail(data.place_id);

    }
  });
  modal.present();
}

private initPlacedetails() {
    this.placedetails = {
        address: '',
        lat: '',
        lng: '',
        components: {
            route: { set: false, short:'', long:'' },                           // calle
            street_number: { set: false, short:'', long:'' },                   // numero
            sublocality_level_1: { set: false, short:'', long:'' },             // barrio
            locality: { set: false, short:'', long:'' },                        // localidad, ciudad
            administrative_area_level_2: { set: false, short:'', long:'' },     // zona/comuna/partido
            administrative_area_level_1: { set: false, short:'', long:'' },     // estado/provincia
            country: { set: false, short:'', long:'' },                         // pais
            postal_code: { set: false, short:'', long:'' },                     // codigo postal
            postal_code_suffix: { set: false, short:'', long:'' },              // codigo postal - sufijo
        }
    };
}

private getPlaceDetail(place_id:string):void {
    var self = this;
    var request = {
        placeId: place_id
    };
    this.placesService.getDetails(request, (details) => {

        this.zone.run(() => {

            self.placedetails.name = details.name;
            self.placedetails.lat = details.geometry.location.lat();
            self.placedetails.lng = details.geometry.location.lng();
            this.saveDisabled = false;

            this.maps.map.setCenter({lat: self.placedetails.lat, lng: self.placedetails.lng});

            this.location = location;

        });

    });
}

}
