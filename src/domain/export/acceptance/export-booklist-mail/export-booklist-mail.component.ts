import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcFormArray, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { AcceptanceService } from '../acceptance.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-export-booklist-mail',
  templateUrl: './export-booklist-mail.component.html',
  styleUrls: ['./export-booklist-mail.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ExportBooklistMailComponent extends NgcPage implements OnInit {

  searchFlag: any = false;
  resp: any;
  request: any;
  showAssignedUldTable: boolean = false;

  private exportBooklistMailForm: NgcFormGroup = new NgcFormGroup({
    searchOptions: new NgcFormGroup({
      flightKey: new NgcFormControl(),
      departureDate: new NgcFormControl(),
      flightOffPoint: new NgcFormControl()
    }),
    searchInfo: new NgcFormGroup({
      flightKey: new NgcFormControl(),
      departureDate: new NgcFormControl(),
      flightOffPoint: new NgcFormControl()
    }),
    mailBooklist: new NgcFormArray([
      new NgcFormGroup({
        flightID: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        date: new NgcFormControl(),
        dispatch: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        mailType: new NgcFormControl(),
        mailSubType: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        flightBoardPoint: new NgcFormControl(),
        flightOffPoint: new NgcFormControl(),
        nextDestination: new NgcFormControl(),
        weightUnitCode: new NgcFormControl(),
        shipmentCustomerId: new NgcFormControl(),
        remarks: new NgcFormControl(),
        bookingRemarksId: new NgcFormControl(),
        flightBookingId: new NgcFormControl()
      })
    ]),
    totalPieces: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    assignedConteiner: new NgcFormArray([
    ])
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private acceptanceService: AcceptanceService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit()
  }

  //Search Method for fetching data
  onSearch() {
    (this.exportBooklistMailForm.get('searchOptions') as NgcFormGroup).validate();
    //If search options are invalid
    if ((this.exportBooklistMailForm.get('searchOptions') as NgcFormGroup).invalid) {
      return;
    }
    this.request = (this.exportBooklistMailForm.get('searchOptions') as NgcFormGroup).getRawValue();
    this.exportBooklistMailForm.get('searchInfo').reset();
    //Calling Service
    this.acceptanceService.mailBooklistService(this.request).subscribe(data => {
      this.resp = data;
      if (data.data.length != 0) {
        if (!this.showResponseErrorMessages(data)) {
          let totalPieces: number = 0;
          let totalWeight: number = 0;
          if (this.resp.data.bookedMailBagsInfo) {
            this.resp.data.bookedMailBagsInfo.forEach(element => {
              totalPieces = totalPieces + element.pieces;
              totalWeight = totalWeight + element.weight;
            });
          }
          // let totalAssignedPieces: number = 0;
          // let totalAssignedWeight: number = 0;
          if(this.resp.data.assignedConteiner) {
            this.resp.data.assignedConteiner.forEach(element=> {
              element.loadedMailBagsInsideUlds.forEach(element1=> {
                element.totalAssignedPieces = element.totalAssignedPieces+element1.pieces;
                element.totalAssignedWeight = element.totalAssignedWeight+element1.weight;
              })
              
            })
          }
          this.exportBooklistMailForm.get('searchInfo').patchValue(this.request);
          this.exportBooklistMailForm.get('mailBooklist').patchValue(this.resp.data.bookedMailBagsInfo);
          this.exportBooklistMailForm.get('totalPieces').patchValue(totalPieces);
          this.exportBooklistMailForm.get('totalWeight').patchValue(totalWeight);
          this.exportBooklistMailForm.get('assignedConteiner').patchValue(this.resp.data.assignedConteiner);
          //show table
          this.searchFlag = true;
          this.showAssignedUldTable = true
        }
        else {
          this.searchFlag = false;
          this.showAssignedUldTable = false;
        }
      }
      else {
        this.searchFlag = false;
        this.showInfoStatus("no.record");
      }

    }, error => { this.showErrorStatus('g.error'); });
  }

  //Save method for saving the updated data
  onSave() {
    let res = [];
    let request = (<NgcFormArray>this.exportBooklistMailForm.get('mailBooklist')).getRawValue();
    this.acceptanceService.updateBooklistRemarks(request).subscribe(data => {
      this.resp = data;
      this.refreshFormMessages(data);
      if (data.data) {
        this.showSuccessStatus("g.completed.successfully");
        this.onSearch();
      }
    })
  }

  //onBack method to return back to welcome page
  onBack(event) {
    this.navigateTo(this.router, "/", null);
  }
}
