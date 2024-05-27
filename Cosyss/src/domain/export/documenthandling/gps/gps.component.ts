// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule, Component, Input, ChangeDetectorRef } from '@angular/core';

// // import { AgmCoreModule } from '@agm/core';

// @Component({
//   selector: 'app-gps',
//   styles: [`
//     agm-map {
//       height: 450px;
//       width:650px;
//     }
//   `],
//   template: `
//   Location: {{latitude}},{{longitude}}
//   <agm-map *ngIf="display" [latitude]="latitude" [longitude]="longitude" [zoom]="zoom">
//    <agm-marker [latitude]="latitude" [longitude]="longitude"></agm-marker>
//   </agm-map>
//   `
// })
// export class GpsComponent {

//   @Input() latitude: number;
//   @Input() longitude: number;
//   @Input() zoom:number;

//   private display: boolean = false;

//   constructor(private cd: ChangeDetectorRef) {
//   }

//   public refresh() {
//     this.display = true;
//     this.cd.detectChanges();
//   }

// }
