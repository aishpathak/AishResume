/* 
  @Author 
  Shubham.11.S 
*/
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
  HostListener,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  PageConfiguration,
  NgcUtility,
  NgcWindowComponent
} from "ngc-framework";
import { ImportService } from '../import.service';
import { ApplicationFeatures } from "../../common/applicationfeatures";
import { Validators, FormControlName } from "@angular/forms";

@Component({
  selector: 'app-shipment-for-custom-inspection',
  templateUrl: './shipment-for-custom-inspection.component.html',
  styleUrls: ['./shipment-for-custom-inspection.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: false,
  focusToBlank: true
})
export class ShipmentForCustomInspectionComponent extends NgcPage implements OnInit {
  @ViewChild('createInspection') createInspection: NgcWindowComponent;
  formValue: any[];
  response: any[];
  hawbconstant: any;
  printFlag: boolean = false;
  hawbLov: {};
  handledByMasterHouse: boolean;
  show: boolean = true;
  hawbInvalid: boolean = false;
  updateFFE: any;
  ffeFlag: boolean;
  required: boolean = false;

  constructor(appZone: NgZone,
    private importService: ImportService,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef) {
    super(appZone, appElement, appContainerElement);
  }
  private customShipmentForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    hawbnumber: new NgcFormControl(),
    inspection: new NgcFormControl(),
    customShipmentList: new NgcFormArray([
      new NgcFormGroup({

      })
    ]),
    customList: new NgcFormArray([
      new NgcFormGroup({
        inspectionNumber: new NgcFormControl(),
        inspectionRequestPieces: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        movedToInspectionDt: new NgcFormControl(),
        inspectionRequestedOnDt: new NgcFormControl()
      })
    ])
  })

  ngOnInit() {
    this.customShipmentForm.get('inspection').setValidators([Validators.required]);

  }

  /* focus to first input  */
  protected afterFocus() {
    (this.customShipmentForm.get('shipmentNumber') as NgcFormControl).focus();
  }
  /* Function called on Link Click */
  onLinkClick(selected) {
    const selectedData = selected.record;
    console.log(selectedData);
    if (selectedData.movedToInspectionDt == null) {
      this.ffeFlag = true;
    }
    if (selectedData.movedToInspectionDt != null) {
      this.ffeFlag = false;
    }
    (<NgcFormArray>this.customShipmentForm.controls["customList"]).patchValue([])
    const requestData = {
      shipmentNumber: selectedData.shipmentNumber,
      hawbNumber: selectedData.hawbnumber,
      inspectionNumber: selectedData.inspectionNumber
    }
    this.importService.getCustomExaminationInfo(requestData).subscribe(response => {
      const resp = response.data.customDetailsInfo;
      this.updateFFE = response.data;
      const customListData = response.data;
      for (let i = 0; i <= resp.length - 1; i++) {
        (<NgcFormArray>this.customShipmentForm.controls["customList"]).patchValue(
          [{
            inspectionRequestPieces: customListData.inspectionRequestPieces,
            shipmentNumber: customListData.shipmentNumber,
            hawbNumber: customListData.hawbNumber == null ? "" : customListData.hawbNumber,
            movedToInspectionDt: customListData.customDetailsInfo[i].movedToInspectionDt,
            inspectionRequestedOnDt: customListData.customDetailsInfo[i].inspectionRequestedOnDt,
            inspectionNumber: customListData.inspectionNumber
          }]
        )
      }
    }, error => {
      this.showErrorStatus(error);
    })
    this.createInspection.open();
  }

  /*  Function Responsible for Updating Custom Inspection */
  createInspectionButton() {
    this.customShipmentForm.validate();
    if (this.customShipmentForm.controls["customList"].status == "INVALID") {
      return true;
    }
    console.log(this.updateFFE);
    const obj = {
      shipmentHouseId: this.updateFFE.shipmentHouseId,
      flightId: this.updateFFE.customDetailsInfo[0].flightId,
      flagCRUD: "U",
      hawbNumber: this.updateFFE.hawbNumber,
      shipmentNumber: this.updateFFE.shipmentNumber,
      inspectionRequestPieces: this.updateFFE.inspectionRequestPieces,
      movedToInspectionDt: this.customShipmentForm.getRawValue().customList[0].movedToInspectionDt,
      modifiedBy: this.getUserProfile().userLoginCode,
      inspectionNumber: this.updateFFE.inspectionNumber,
      flightKey: this.updateFFE.flightKey,
      createdBy: this.getUserProfile().userLoginCode,
      shipmentId: this.updateFFE.shipmentId,
      remarks: this.updateFFE.remarks,
      shipmentDate: this.updateFFE.shipmentDate,
      flightDate: this.updateFFE.customDetailsInfo[0].flightDate
    }
    this.importService.onSaveCustomOrder(obj).subscribe(response => {
      console.log(response);
      this.createInspection.close();
      this.onSearch();
    }, error => {
      this.showErrorStatus('g.try.again');
    })
  }

  /* Function on PicOrderForExamination Button */
  picOrderForExamination(event) {
    this.resetFormMessages();
    const item = (<NgcFormArray>this.customShipmentForm.get('customShipmentList')).getRawValue();
    let obj;
    let count = 0;
    for (let index = 0; index < item.length; index++) {
      if (item[index].flagInsert == true) {
        obj = {
          shipmentNumber: item[index].shipmentNumber,
          hawbnumber: item[index].hawbnumber,
          inspectionNumber: item[index].inspectionNumber
        }
        count++;
      }
    }
    if (count == 0) {
      this.showErrorMessage('export.select.a.record');
      return;
    }
    if (count > 1) {
      this.showErrorMessage('equipment.select.only.onerecord');
      return;
    }
    this.navigateTo(this.router, "import/customsOrderExamination", obj);
  }

  /* Function on Shipment/Hawb Info */
  shipmentInfo(event) {
    this.resetFormMessages();
    const item = (<NgcFormArray>this.customShipmentForm.get('customShipmentList')).getRawValue();
    let obj;
    let count = 0;
    for (let index = 0; index < item.length; index++) {
      if (item[index].flagInsert == true) {
        obj = {
          shipmentNumber: item[index].shipmentNumber,
          hawbNumber: item[index].hawbnumber
        }
        count++;
      }
    }
    if (count == 0) {
      this.showErrorMessage('export.select.a.record');
      return;
    }
    if (count > 1) {
      this.showErrorMessage('equipment.select.only.onerecord');
      return;
    }
    if (obj.hawbNumber == null) {
      this.navigateTo(this.router, "awbmgmt/shipmentinfoCR", obj);
    }
    if (obj.hawbNumber != null) {
      this.navigateTo(this.router, "awbmgmt/maintainhousemaster", obj);
    }
  }

  /* Function On Inspection Status */
  statusSelect(event) {
    this.customShipmentForm.get(['inspection']).patchValue(event)
    this.customShipmentForm.get('fromDate').clearValidators();
    this.customShipmentForm.get('toDate').clearValidators();
    if (event == 'COMPLETED' || event == 'INITIATED') {
      if (this.customShipmentForm.get('shipmentNumber').value == null) {
        this.customShipmentForm.get('fromDate').setValidators([Validators.required]);
        this.customShipmentForm.get('toDate').setValidators([Validators.required]);
      }
    } else {
      this.customShipmentForm.get('fromDate').clearValidators();
      this.customShipmentForm.get('toDate').clearValidators();
    }
  }

  onCheckBoxClick(event) {

  }

  /* Clear Page Function */
  onClear() {
    this.resetFormMessages();
    this.customShipmentForm.reset();
    this.show = true;
  }

  /* On change of AWB Number */
  onAWBChange(object) {
    this.resetFormMessages();
    if (object == null) {
      this.customShipmentForm.get('inspection').setValidators([Validators.required]);
    } else {
      this.customShipmentForm.get('inspection').clearValidators();
    }
    this.customShipmentForm.get('hawbnumber').patchValue("");
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.hawbLov = this.createSourceParameter(this.customShipmentForm.get('shipmentNumber').value);
    }
    this.handledByMasterHouse = false;
    this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbLov).subscribe(data => {
      if (data != null && data.length > 0) {
        this.handledByMasterHouse = true;
        this.retrieveLOVRecords("HWBNUMBER", this.hawbLov).subscribe(data => {
          if (data != null && data.length == 1) {
            this.customShipmentForm.get('hawbnumber').setValue(data[0].code);
          }
        })
      }
      else {
        this.handledByMasterHouse = false;
        this.customShipmentForm.get('hawbnumber').clearValidators();
        this.customShipmentForm.get('hawbnumber').patchValue("");
      }
    });
    if (object != null) {
      this.customShipmentForm.get('fromDate').clearValidators();
      this.customShipmentForm.get('toDate').clearValidators();
      return true;
    }
    if (object == null) {
      if (this.customShipmentForm.get('inspection').value != null) {
        this.customShipmentForm.get('fromDate').setValidators([Validators.required]);
        this.customShipmentForm.get('toDate').setValidators([Validators.required]);
        return true;
      }
    }
  }

  /* On select Hawb Number*/
  onhawbSelect(object) {
    this.hawbconstant = object.code;
    if (object.code == null) {
      this.hawbInvalid = true;
    }
    else {
      this.hawbInvalid = false;
    }
  }

  customInspectionReport() {
    const reportParameters: any = {};
    reportParameters.shipmentNumber;
  }

  /* on search function */
  onSearch() {
    (<NgcFormArray>this.customShipmentForm.controls["customList"]).patchValue([])
    this.show = true;
    if (this.customShipmentForm.get('shipmentNumber').value == null) {
      if (this.customShipmentForm.get('inspection').value == null) {
        this.showErrorMessage("import.inspection.number.mandatory")
        return true;
      }
    }
    if (this.customShipmentForm.status == "INVALID") {
      return true;
    }
    /* validate The form */
    this.customShipmentForm.validate();
    if (this.customShipmentForm.invalid) {
      return true;
    }
    this.resetFormMessages();
    //done to make data table empty
    this.customShipmentForm.get("customShipmentList").patchValue(new Array());
    //get RawValue of Form
    const req = this.customShipmentForm.getRawValue();
    console.log(req)
    this.formValue = this.customShipmentForm.getRawValue();
    this.resetFormMessages();
    this.importService.customShipmentInspectionFetch(req).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.data.length == 0) {
          this.showErrorMessage("NORECORD")
          return;
        } else {
          this.response = data.data;
          this.show = false;
          //patching Data to Data Table
          this.customShipmentForm.get("customShipmentList").patchValue(data.data);
        }
      }
    }, error => {
      this.showErrorStatus('g.try.again');
    }
    );
  }
}
