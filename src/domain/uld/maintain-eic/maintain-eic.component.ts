import { Component, OnInit, Input } from '@angular/core';
import {
  NgZone,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  PageConfiguration,
  NgcWindowComponent
} from "ngc-framework";
import { UldService } from './../uld.service';
import { Validators } from '@angular/forms';
import { error } from 'protractor';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-maintain-eic',
  templateUrl: './maintain-eic.component.html',
  styleUrls: ['./maintain-eic.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: false,
  focusToBlank: true
})

export class MaintainEicComponent extends NgcPage implements OnInit {

  @Input('showAsPopup') showAsPopup: boolean;

  uldValue: any;
  eicType: any;
  show: boolean = false;
  request: any;
  rowValue: any = 1;
  flag = false;
  inputData: { flightKey: any; flightDate: any; uldNumber: any; modeType: string; };

  uldNumber: any;
  @ViewChild('accessoryPopUp')
  accessoryPopUp: NgcWindowComponent;
  uldNo: any;

  constructor(appZone: NgZone,
    private importService: UldService,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef) {
    super(appZone, appElement, appContainerElement);
  }

  private maintainEic: NgcFormGroup = new NgcFormGroup({
    /* formcontroller for search */
    eicType: new NgcFormControl(),
    uldNo: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    uploadingPoint: new NgcFormControl(),
    maintainEicUld: new NgcFormArray([
      new NgcFormGroup({
        lUldNumber: new NgcFormControl(),
        rUldNumber: new NgcFormControl(),
        lcheck: new NgcFormControl(),
        rcheck: new NgcFormControl()
      })
    ]),
    /*  maintainEicUldInfo: new NgcFormArray([
     ]), */
    maintainEicUldInfo: new NgcFormArray([
      new NgcFormGroup({
        UldNumber: new NgcFormControl(),
        flightId: new NgcFormControl(),
        wareHouseDestination: new NgcFormControl(),
        location: new NgcFormControl(),
        flightNumber: new NgcFormControl(),
        basePallet: new NgcFormControl(),
      })
    ]),
    maintainEicInformation:
      new NgcFormGroup({
        /* Import, Export and Flight formcontroller  */
        flightNumber: new NgcFormControl(),
        basePallet: new NgcFormControl(),
        ata: new NgcFormControl(),
        date: new NgcFormControl(),
        remarks: new NgcFormControl(),
        grossWeight: new NgcFormControl(),
        tareWeight: new NgcFormControl(),
        quantity: new NgcFormControl(),
        flightId: new NgcFormControl(),
        unloadingPt: new NgcFormControl(),
        basePalletBoardPoint: new NgcFormControl(),
        uploadingPoint: new NgcFormControl(),
        handlingCarrierCode: new NgcFormControl(),
        wareHouseDestination: new NgcFormControl(),
        location: new NgcFormControl(),
        portOfCall: new NgcFormControl(),
        std: new NgcFormControl(),
        AccessoryType: new NgcFormControl()

      })
  });

  ngOnInit() {
    this.flag = false;
  }
  /*  Alert popup should come for damaged eic on first search. 
      Handled it by providing true value when clicked for first time else null . */
  onsearch(value) {
    if (this.maintainEic.get("eicType").value == 'Export_EIC' && (this.maintainEic.get("flightNumber").value == null || this.maintainEic.get("flightNumber").value == "")) {
      this.show = false;
      return;
    }

    this.flag = true;
    this.rowValue = 0;
    this.maintainEic.get("maintainEicInformation").get("tareWeight").clearValidators();
    this.maintainEic.get("maintainEicInformation").get("grossWeight").clearValidators();
    this.maintainEic.validate();
    if (this.maintainEic.invalid) {
      this.show = false;
      return true;
    }
    this.resetFormMessages();
    this.uldValue = this.maintainEic.getRawValue().maintainEicUld;
    let request = this.maintainEic.getRawValue();
    this.maintainEic.controls["maintainEicUldInfo"].patchValue(new Array());
    this.maintainEic.controls["maintainEicInformation"].patchValue(new Array());
    this.show = false;
    this.importService.MaintainEicdFetch(request).subscribe(data => {
      if (this.showResponseErrorMessages(data)) {
        return;
      }
      if (data.data.maintainEicInformation != null) {
        if (value == true) {
          if (data.data.maintainEicInformation.damagedFlag == 1) {
            this.showConfirmMessage('imp.confirmation.base.pallet').then(fulfilled => {
              (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).patchValue(new Array());
              this.maintainEic.get("maintainEicInformation").patchValue(data.data.maintainEicInformation);
              this.maintainEic.get("maintainEicUldInfo").patchValue(data.data.maintainEicUldInfo);
              this.patchValue();
              this.show = true;
              this.eicType = data.data.eicType;
              if (data.data.maintainEicUldInfo.length != 0 || data.data.maintainEicUldInfo.length == 0) {
                for (let i = 0; i < 7; i++) {
                  this.add();
                }
              }
            }).catch(reason => {
            });
          }
          else {
            (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).patchValue(new Array());
            this.maintainEic.get("maintainEicInformation").patchValue(data.data.maintainEicInformation);
            this.maintainEic.get("maintainEicUldInfo").patchValue(data.data.maintainEicUldInfo);
            this.patchValue();
            this.show = true;
            this.eicType = data.data.eicType;
            if (data.data.maintainEicUldInfo.length != 0 || data.data.maintainEicUldInfo.length == 0) {
              for (let i = 0; i < 7; i++) {
                this.add();
              }
            }
          }
        }
        else {
          (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).patchValue(new Array());
          this.maintainEic.get("maintainEicInformation").patchValue(data.data.maintainEicInformation);
          this.maintainEic.get("maintainEicUldInfo").patchValue(data.data.maintainEicUldInfo);
          this.patchValue();
          this.show = true;
          this.eicType = data.data.eicType;
          if (data.data.maintainEicUldInfo.length != 0 || data.data.maintainEicUldInfo.length == 0) {
            for (let i = 0; i < 7; i++) {
              this.add();
            }
          }
        }
      }
      else {
        this.showErrorStatus("SHCCODE036");
        return;
      }
    }
      , err => {
        this.showErrorStatus(err);
      })
  }

  /* This Function is used to check all the items in the table */
  oncheckAll = (data) => {
    if (data == true) {
      let obj = this.maintainEic.getRawValue().maintainEicUld;
      (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).patchValue(new Array());
      for (let i = 0; i <= obj.length - 1; i++) {
        (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).addValue(
          [{
            lUldNumber: obj[i].lUldNumber,
            rUldNumber: obj[i].rUldNumber,
            lcheck: true,
            rcheck: true
          }]
        )
      }
    }
    if (data == false) {
      let obj = this.maintainEic.getRawValue().maintainEicUld;
      (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).patchValue(new Array());
      for (let i = 0; i <= obj.length - 1; i++) {
        (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).addValue(
          [{
            lUldNumber: obj[i].lUldNumber,
            rUldNumber: obj[i].rUldNumber,
            lcheck: false,
            rcheck: false,
          }]
        )
      }
    }
  }

  //check if grossWeight is less than tareweight
  checkTareWeight() {
    let grossWeight = parseFloat(this.maintainEic.get("maintainEicInformation").get("grossWeight").value);
    let tareWeight = parseFloat(this.maintainEic.get("maintainEicInformation").get("tareWeight").value);
    if (grossWeight < tareWeight) {
      this.showErrorMessage("imp.gross.tare.weight");
      return
    }
  }
  /* This function sets validation of inputs on basis of maintain eic type */
  statusSelect = (data) => {
    /* clear validation and patch null on partially mandatory fields */
    this.maintainEic.get('uldNo').clearValidators();
    this.maintainEic.get('flightNumber').clearValidators();
    this.maintainEic.get('flightDate').clearValidators();
    this.maintainEic.get('uploadingPoint').clearValidators();
    this.maintainEic.get("uldNo").patchValue(null);
    this.maintainEic.get("flightNumber").patchValue(null);
    this.maintainEic.get("flightDate").patchValue(null);
    this.maintainEic.get("uploadingPoint").patchValue(null);
    if (data == 'Import_EIC') {
      this.maintainEic.get('uldNo').setValidators([Validators.required]);
      /*    this.maintainEic.get('flightNumber').setValidators([Validators.required]);
            this.maintainEic.get('flightDate').setValidators([Validators.required]);
            this.maintainEic.get('uploadingPoint').setValidators([Validators.required]); */
    }
    if (data == 'Without_Flight') {
      this.maintainEic.get('uldNo').setValidators([Validators.required]);
    }
    if (data == 'Export_EIC') {
      this.maintainEic.get('uldNo').setValidators([Validators.required]);
      this.maintainEic.get('flightNumber').setValidators([Validators.required]);
      this.maintainEic.get('flightDate').setValidators([Validators.required]);
      this.maintainEic.get('uploadingPoint').setValidators([Validators.required]);
    }
  }
  onLOVSelect = (value) => {
    this.show = false;
    if (this.maintainEic.get("eicType").value == "Without_Flight") {
      this.maintainEic.get("uldNo").patchValue(value.code);
    }
    else {
      this.maintainEic.get("uldNo").patchValue(value.code);
      this.maintainEic.get("flightNumber").patchValue(value.parameter1);
      this.maintainEic.get("flightDate").patchValue(new Date(value.parameter2));
      this.maintainEic.get("uploadingPoint").patchValue(value.parameter3);
    }
  }
  patchValue = () => {
    /* This function patches data into uld table and removes extra rows from it */
    let uldInfo = this.maintainEic.getRawValue().maintainEicUldInfo;
    for (let i = 0; i <= uldInfo.length - 1; i++) {
      (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).addValue(
        [{
          lUldNumber: uldInfo[i + i] === undefined ? null : uldInfo[i + i].uldNumber,
          rUldNumber: uldInfo[i + i + 1] === undefined ? null : uldInfo[i + i + 1].uldNumber,
          lcheck: false,
          rcheck: false
        }]
      )
    }
    /* This function removes the null values from table */
    let obj = this.maintainEic.getRawValue().maintainEicUld;
    (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).patchValue(new Array());
    for (let i = 0; i <= obj.length - 1; i++) {
      if (obj[i].lUldNumber != null && obj[i].lUldNumber != "") {
        (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).addValue(
          [{
            lUldNumber: obj[i].lUldNumber,
            rUldNumber: obj[i].rUldNumber,
            lcheck: false,
            rcheck: false
          }]
        )
      }
    }
    console.log(this.maintainEic.getRawValue().maintainEicUld.length);
  }
  dismantle = () => {
    /* This function dismantle's the uld's and patches them */
    let obj = this.maintainEic.getRawValue().maintainEicUld;
    let countl = 0;
    let countr = 0;
    (<NgcFormArray>this.maintainEic.controls["maintainEicUldInfo"]).patchValue(new Array());
    for (let i = 0; i <= obj.length - 1; i++) {
      if (obj[i].lcheck == true) {
        if (obj[i].lUldNumber != null && obj[i].lUldNumber != "") {
          (<NgcFormArray>this.maintainEic.controls["maintainEicUldInfo"]).addValue(
            [{
              uldNumber: obj[i].lUldNumber
            }]
          )
        }
        countl++;
      }
      if (obj[i].rcheck == true) {
        if (obj[i].rUldNumber != null && obj[i].rUldNumber != "") {
          (<NgcFormArray>this.maintainEic.controls["maintainEicUldInfo"]).addValue(
            [{
              uldNumber: obj[i].rUldNumber
            }]
          )
        }
        countr++
      }

    }
    console.log(this.maintainEic.get("maintainEicUldInfo").value)
    if (countl + countr == 0) {
      this.showErrorMessage("Select a record");
      return
    }
    let request = this.maintainEic.getRawValue();

    this.importService.DismantleUld(request).subscribe(data => {
      this.showSuccessStatus("g.completed.successfully");
      this.onsearch(null);
    }
      , error => {
        this.showErrorStatus(error);
      }
    )
  }

  /*  This function adds new row in the table */
  add() {
    (<NgcFormArray>this.maintainEic.controls["maintainEicUld"]).addValue(
      [{
        lUldNumber: "",
        rUldNumber: "",
        lcheck: false,
        rcheck: false
      }]
    )
    let value = this.maintainEic.getRawValue().maintainEicUld;
    let count = 0;
    value.forEach(element => {
      count++;
    });
    this.rowValue = count;
  }

  setFocus = () => {

  }

  /* This function saves Eic Information */
  onSave = (data) => {
    if (this.show == false) {
      return;
    }
    let grossWeight = parseFloat(this.maintainEic.get("maintainEicInformation").get("grossWeight").value);
    let tareWeight = parseFloat(this.maintainEic.get("maintainEicInformation").get("tareWeight").value);
    console.log(typeof grossWeight);
    console.log(typeof grossWeight);
    if (grossWeight < tareWeight) {
      this.showErrorMessage("imp.gross.tare.weight");
      return
    }
    this.maintainEic.get('flightNumber').clearValidators();
    this.maintainEic.get('flightDate').clearValidators();
    this.maintainEic.get('uploadingPoint').clearValidators();
    if (this.maintainEic.get("eicType").value == 'Export_EIC' && (this.maintainEic.get("flightDate").value == null || this.maintainEic.get("flightDate").value == "" || this.maintainEic.get("flightDate").value == 'Invalid Date')) {
      this.maintainEic.get("flightDate").patchValue(new Date());
    }
    this.maintainEic.validate();
    if (this.maintainEic.invalid) {
      return true;
    }
    let val = this.adduld();
    if (val == 0) {
      return;
    }

    let request = this.maintainEic.getRawValue();
    this.importService.SaveMaintainEic(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus("g.completed.successfully");
        this.onsearch(null);
      }
    }, err => {
      this.showErrorStatus(err);
    }
    )


  }


  adduld() {
    let countl = 0;
    let countr = 0;
    let count = 0;
    this.uldValue = this.maintainEic.getRawValue().maintainEicUld;
    this.uldValue.forEach(element => {
      if (element.lcheck == false && element.rcheck == false
        && (element.lUldNumber == "" || element.lUldNumber == null)
        && (element.rUldNumber == "" || element.rUldNumber == null)) {
        count++;
      }
    });
    if (count == this.uldValue.length) {
      return 1;
    }

    this.resetFormMessages();
    let obj = this.maintainEic.getRawValue().maintainEicUld;
    (<NgcFormArray>this.maintainEic.controls["maintainEicUldInfo"]).patchValue(new Array());
    for (let i = 0; i <= obj.length - 1; i++) {
      //uncomment if want to save data on tick of save
      // if (obj[i].lcheck == true) {
      if (obj[i].lUldNumber != null && obj[i].lUldNumber != "") {
        (<NgcFormArray>this.maintainEic.controls["maintainEicUldInfo"]).addValue(
          [{
            uldNumber: obj[i].lUldNumber,
            flightId: this.maintainEic.getRawValue().maintainEicInformation.flightId,
            location: this.maintainEic.getRawValue().maintainEicInformation.location,
            wareHouseDestination: this.maintainEic.getRawValue().maintainEicInformation.wareHouseDestination,
            flightNumber: this.maintainEic.getRawValue().maintainEicInformation.flightNumber,
            basePallet: this.maintainEic.getRawValue().maintainEicInformation.basePallet
          }]
        )
      }
      countl++;
      // }
      // if (obj[i].rcheck == true) {
      if (obj[i].rUldNumber != null && obj[i].rUldNumber != "") {
        (<NgcFormArray>this.maintainEic.controls["maintainEicUldInfo"]).addValue(
          [{
            uldNumber: obj[i].rUldNumber,
            flightId: this.maintainEic.getRawValue().maintainEicInformation.flightId,
            location: this.maintainEic.getRawValue().maintainEicInformation.location,
            wareHouseDestination: this.maintainEic.getRawValue().maintainEicInformation.wareHouseDestination,
            flightNumber: this.maintainEic.getRawValue().maintainEicInformation.flightNumber,
            basePallet: this.maintainEic.getRawValue().maintainEicInformation.basePallet
          }]
        )
      }
      countr++;
      // }
    }
    if (countl + countr == 0) {
      this.showErrorStatus("export.select.a.record");
      return 0;
    }
  }

  autoSearchAccessoryInfo($event) {
    this.accessoryPopUp.close();
    //this.onSearch();
  }

  closeWindow() {
    this.accessoryPopUp.close();
  }
  openAddAccessory($event) {
    // console.log(accessory);
    this.inputData = {
      flightKey: this.maintainEic.get('flightNumber').value,
      flightDate: this.maintainEic.get('flightDate').value,
      uldNumber: this.maintainEic.get('uldNo').value,
      modeType: 'EXPORT'
    };
    this.accessoryPopUp.open();

  }

}
