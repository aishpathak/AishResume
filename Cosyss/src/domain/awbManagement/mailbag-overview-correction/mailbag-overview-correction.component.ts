import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcFormArray, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { AwbManagementService } from '../awbManagement.service'
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-mailbag-overview-correction',
  templateUrl: './mailbag-overview-correction.component.html',
  styleUrls: ['./mailbag-overview-correction.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class MailbagOverviewCorrectionComponent extends NgcPage {
  @ViewChild('captureDamage') captureDamage: NgcWindowComponent;
  serialNumber: number = 1;
  deleteArray: any;
  forwardedData: any;
  /**
     * Initialize
     * @param appZone Ng Zone
     * @param appElement Element Ref
     * @param appContainerElement View Container Ref
     */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }


  private mailbagCorrectionForm: NgcFormGroup = new NgcFormGroup({
    searchFormGroup: new NgcFormGroup({
      mailbagNumber: new NgcFormControl()
    }),

    mailbagCorrectionDetailsForm: new NgcFormGroup({
      incomingFlightKey: new NgcFormControl(''),
      incomingFlightDate: new NgcFormControl(''),
      manifestedFlight: new NgcFormControl(''),
      manifestedFlightDate: new NgcFormControl(''),
      storeLocation: new NgcFormControl(''),
      manifestedUldTrolley: new NgcFormControl(''),
      dsnRemark: new NgcFormControl('')
    }),

    captureDamageForm: new NgcFormGroup({
      captureDamageDetails: new NgcFormArray([
        new NgcFormGroup({
          sno: new NgcFormControl(this.serialNumber),
          natureOfDamage: new NgcFormControl(),
          piecesDamaged: new NgcFormControl(),
          severity: new NgcFormControl(),
          occurrence: new NgcFormControl(),
          selectDeleteIcon: new NgcFormControl()
        })
      ])
    })
  })

  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    console.log("forwardedData", this.forwardedData);
    if (this.forwardedData != null) {
      this.mailbagCorrectionForm.get(['searchFormGroup', 'mailbagNumber']).patchValue(this.forwardedData.mailbagNumber);
      this.mailbagCorrectionForm.get(['mailbagCorrectionDetailsForm', 'incomingFlightKey']).patchValue(this.forwardedData.incomingFlightKey);
      this.mailbagCorrectionForm.get(['mailbagCorrectionDetailsForm', 'incomingFlightDate']).patchValue(this.forwardedData.incomingFlightDate);
      this.mailbagCorrectionForm.get(['mailbagCorrectionDetailsForm', 'manifestedFlight']).patchValue(this.forwardedData.manifestedFlight);
      this.mailbagCorrectionForm.get(['mailbagCorrectionDetailsForm', 'manifestedFlightDate']).patchValue(this.forwardedData.manifestedFlightDate);
      this.mailbagCorrectionForm.get(['mailbagCorrectionDetailsForm', 'storeLocation']).patchValue(this.forwardedData.storeLocation);
      this.mailbagCorrectionForm.get(['mailbagCorrectionDetailsForm', 'manifestedUldTrolley']).patchValue(this.forwardedData.manifestedUldTrolley);
      this.mailbagCorrectionForm.get(['mailbagCorrectionDetailsForm', 'dsnRemark']).patchValue(this.forwardedData.dsnRemark);
    }
  }

  onSearch() {

  }


  openCaptureDamageDetails() {
    this.captureDamage.open();
    }

  addDamage() {
    const noOfRows = (<NgcFormArray>this.mailbagCorrectionForm.get('captureDamageForm').get('captureDamageDetails')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.mailbagCorrectionForm.get('captureDamageForm').get('captureDamageDetails')).controls[noOfRows - 1] : null;
    if (noOfRows > -1) {
      this.serialNumber = this.serialNumber + 1;
      (<NgcFormArray>this.mailbagCorrectionForm.get('captureDamageForm').get('captureDamageDetails')).addValue([
        {
          sno: this.serialNumber,
          natureOfDamage: "",
          piecesDamaged: "",
          severity: "",
          occurrence: "",
          selectDeleteIcon: ""
        }
      ]);
    }
  }


  onDelete(index) {
    // this.deleteArray = [];
    // let select: any = this.mailbagCorrectionForm.get(['captureDamageForm', 'captureDamageDetails']).value;
    // let index = 0;
    // select.forEach(a => {
    //   if (a['selectDeleteIcon']) {
    //     a['flagCRUD'] = 'D';
    //     this.deleteArray.push(a);
    //     (<NgcFormArray>this.mailbagCorrectionForm.get(['captureDamageForm', 'captureDamageDetails'])).removeAt(index);
    //   } else {
    //     index++;
    //   }
    // })

    console.log("item", index);

  }

}
