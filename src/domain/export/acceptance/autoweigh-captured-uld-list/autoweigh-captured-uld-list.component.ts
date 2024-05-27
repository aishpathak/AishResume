import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray,
  NgcUtility, DateTimeKey, NgcButtonComponent, NgcWindowComponent, PageConfiguration
} from 'ngc-framework';
import { AcceptanceService } from '../acceptance.service';
import {
  SearchAutoWeighDetailsRequest, DgRowData, UpdateFlightDetails, UpdateFlightData,
  PrintUldtagData, UldWeighRecord
} from '../../export.sharedmodel';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-autoweigh-captured-uld-list',
  templateUrl: './autoweigh-captured-uld-list.component.html',
  styleUrls: ['./autoweigh-captured-uld-list.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AutoweighCapturedUldListComponent extends NgcPage implements OnInit {
  @ViewChild('uldTagRemarkWindow') uldTagRemarkWindow: NgcWindowComponent;
  @ViewChild('flightUpdateWindow') flightUpdateWindow: NgcWindowComponent;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;


  widthOfTag: number;
  heightOfTag: number;
  flightIdforDropdown: any;
  listofAutoWeighUld: any;
  listToUpdateFlightNumber: any[];
  flagShowDgDetail = false;
  flagShowData = false;
  listOfShipmentNumbers: NgcFormArray = new NgcFormArray([]);
  uldTagPrintData: any;
  item: any;
  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });

  private AutoweighCapturedUldListForm: NgcFormGroup = new NgcFormGroup({
    selectedTerminal: new NgcFormControl(),
    fromDateTime: new NgcFormControl(),
    toDateTime: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    checkBox: new NgcFormControl(),
    autoWeighCapturedList: new NgcFormArray([])
  });

  private PrintUldTagForm: NgcFormGroup = new NgcFormGroup({
    xpsShipment: new NgcFormControl(),
    dgShipment: new NgcFormControl(false),
    cargo: new NgcFormControl(),
    mail: new NgcFormControl(),
    bup: new NgcFormControl(),
    courier: new NgcFormControl(),
    tagRemarks: new NgcFormControl('', [Validators.maxLength(27)]),
    dgDetails: new NgcFormArray([])
  });

  private UpdateFlightDetailsForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    date: new NgcFormControl(),
    flightSegmentId: new NgcFormControl(),
    autoWeighBupHeaderId: new NgcFormControl(),
    segment: new NgcFormControl(),
    updatedFlightKey: new NgcFormControl(),
    newDate: new NgcFormControl(),
    newFlightSegmentId: new NgcFormControl()


  });
  seg: any;


  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.AutoweighCapturedUldListForm.get('selectedTerminal').setValue(this.getUserProfile().terminalId);
    this.AutoweighCapturedUldListForm.get('fromDateTime').setValue(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.MINUTES));
    this.AutoweighCapturedUldListForm.get('toDateTime').setValue(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 1439, DateTimeKey.MINUTES));
  }

  ngAfterViewInit() {

    super.ngAfterViewInit();

    this.UpdateFlightDetailsForm.get('newDate').valueChanges
      .subscribe(changedValue => {
        this.flightIdforDropdown =
          this.createSourceParameter(this.UpdateFlightDetailsForm.get('updatedFlightKey').value,
            this.UpdateFlightDetailsForm.get('newDate').value);
      });

    this.UpdateFlightDetailsForm.get('updatedFlightKey').valueChanges
      .subscribe(changedValue => {
        console.log(changedValue);
        this.flightIdforDropdown =
          this.createSourceParameter(this.UpdateFlightDetailsForm.get('updatedFlightKey').value,
            this.UpdateFlightDetailsForm.get('newDate').value);
      });

    this.PrintUldTagForm.get('dgShipment').valueChanges
      .subscribe(changedValue => {
        console.log(`dgShipment ${changedValue}`);
        if (changedValue === true) {
          this.flagShowDgDetail = true;
          this.widthOfTag = 800;
        } else {
          this.flagShowDgDetail = false;
          this.widthOfTag = 400;
        }
      });

  }

  onChangeRadioDg() {
    this.widthOfTag = 1400;
    this.heightOfTag = 550;
    this.showConfirmMessage("expaccpt.content.type.change.dg.confirmation").then(fulfilled => {

    }).catch(reason => {
      this.flagShowDgDetail = false;
      this.PrintUldTagForm.get("dgShipment").reset();
    })
  }

  onChangeRadioCargo() {
    this.widthOfTag = 700;
    this.heightOfTag = 300;
    this.showConfirmMessage("expaccpt.content.type.change.cargo.confirmation").then(fulfilled => {
      this.flagShowDgDetail = false;
    }).catch(reason => {
      this.PrintUldTagForm.get("cargo").reset();
    })
  }

  onChangeRadioMail() {
    this.widthOfTag = 700;
    this.heightOfTag = 300;
    this.showConfirmMessage("expaccpt.content.type.change.mail.confirmation").then(fulfilled => {
      this.flagShowDgDetail = false;
    }).catch(reason => {
      this.PrintUldTagForm.get("mail").reset();
    })
  }

  onChangeRadioCourier() {
    this.widthOfTag = 700;
    this.heightOfTag = 300;
    this.showConfirmMessage("expaccpt.content.type.change.courier.confirmation").then(fulfilled => {
      this.flagShowDgDetail = false;
    }).catch(reason => {
      this.PrintUldTagForm.get("courier").reset();
    })
  }
  onSelectDGSHC(object: any, index) {
    this.PrintUldTagForm.get(['dgDetails', index, 'specialHandlingCode']).patchValue(object.code);
  }
  getAutoWeighCapturedUldList() {
    this.UpdateFlightDetailsForm.reset();
    if (this.AutoweighCapturedUldListForm.valid) {
      this.listOfShipmentNumbers = new NgcFormArray([]);
      const searchAutoWeighDetailsRequest = new SearchAutoWeighDetailsRequest();
      searchAutoWeighDetailsRequest.fromDateTime = this.AutoweighCapturedUldListForm.get('fromDateTime').value;
      searchAutoWeighDetailsRequest.toDateTime = this.AutoweighCapturedUldListForm.get('toDateTime').value;
      searchAutoWeighDetailsRequest.selectedTerminal = this.AutoweighCapturedUldListForm.get('selectedTerminal').value;
      searchAutoWeighDetailsRequest.flightKey = this.AutoweighCapturedUldListForm.get('flightKey').value;
      searchAutoWeighDetailsRequest.uldNumber = this.AutoweighCapturedUldListForm.get('uldNumber').value;
      searchAutoWeighDetailsRequest.shipmentNumber = this.AutoweighCapturedUldListForm.get('shipmentNumber').value;
      this.acceptanceService.getAutoWeighCapturedUldList(searchAutoWeighDetailsRequest).subscribe(response => {
        this.refreshFormMessages(response);
        console.log(response.data);
        const data = response.data;
        this.listofAutoWeighUld = data.autoWeighCapturedList;
        if (this.listofAutoWeighUld.length > 0) {
          this.flagShowData = true;
          this.listofAutoWeighUld.forEach(element => {
            element['checkBox'] = false;
          });
          data.autoWeighCapturedList.forEach(element => {
            element['shipmentNumber'] = element['shipmentNumberList'].join(" ");
          });
          this.AutoweighCapturedUldListForm.patchValue(response.data);
        } else {
          this.showErrorStatus('NO_RECORDS_EXIST');
        }
      });
    } else {
      this.showErrorStatus('expaccpt.fill.all.mandatory.details');
    }
  }

  printuldtag() {
    this.flagShowDgDetail = false;
    if (this.listOfShipmentNumbers.length > 1) {
      this.showErrorStatus('expaccpt.print.one.tag.only');
    } else {
      this.widthOfTag = 700;
      this.heightOfTag = 300;
      const rowValue = this.listOfShipmentNumbers.getRawValue()[0]['NGC_ROW_ID'];
      this.PrintUldTagForm.patchValue(this.listofAutoWeighUld[rowValue]);
      this.uldTagPrintData = this.listofAutoWeighUld[rowValue];
      if (this.uldTagPrintData.dgShipment) {
        this.flagShowDgDetail = true;
        this.widthOfTag = 1400;
        this.heightOfTag = 550;
      } else {
        this.widthOfTag = 700;
        this.heightOfTag = 300;
      }
      this.uldTagRemarkWindow.open();
    }
  }

  changeFlightDetails() {
    let countOfSameFlight = 0;
    const flightNumer = this.listOfShipmentNumbers.getRawValue()[0]['flightKey'] +
      this.listOfShipmentNumbers.getRawValue()[0]['date'] + this.listOfShipmentNumbers.getRawValue()[0]['segment'];
    this.listOfShipmentNumbers.controls.forEach((formGroup: NgcFormGroup) => {
      if ((formGroup.get('flightKey').value + formGroup.get('date').value + formGroup.get('segment').value
        === flightNumer)) {
        countOfSameFlight = countOfSameFlight + 1;
      }
    });

    if (countOfSameFlight < this.listOfShipmentNumbers.length) {
      this.showErrorStatus('expaccpt.uld.flight.change.validation');
    } else {

      const rowValue = this.listOfShipmentNumbers.getRawValue()[0]['NGC_ROW_ID'];
      this.UpdateFlightDetailsForm.patchValue(this.listofAutoWeighUld[rowValue]);
      this.flightUpdateWindow.open();
    }
  }

  changeButtonFlag(event) {
    console.log(event);
    if (event.record.checkBox) {
      const sizeOfList = this.listOfShipmentNumbers.length;
      if (sizeOfList >= 1) {
        let flagForSameRow: boolean;
        this.listOfShipmentNumbers.controls.forEach((formGroup: NgcFormGroup) => {
          const rowValue: number = formGroup.get('NGC_ROW_ID').value;
          if (event.record.NGC_ROW_ID === rowValue) {
            flagForSameRow = true;
          } else {
            flagForSameRow = false;
          }
        });
        if (!flagForSameRow) {
          this.listOfShipmentNumbers.addValue([event.record]);
          console.log(this.listOfShipmentNumbers);
        }

      } else {
        console.log(event.record);
        this.listOfShipmentNumbers.addValue([event.record]);

      }

    } else {
      this.listOfShipmentNumbers.deleteValue([{ 'uldNumber': event.record.uldNumber }]);

    }
  }

  addDgRow() {
    (<NgcFormArray>this.PrintUldTagForm.controls['dgDetails']).addValue([new DgRowData()]);
  }

  onDeleteRowDgDetail(event, index) {
    const deleteRec = (<NgcFormArray>this.PrintUldTagForm.controls['dgDetails']);
    deleteRec.removeAt(index);
    console.log(index);
  }

  saveAndPrintTag() {
    this.item = this.PrintUldTagForm.getRawValue();
    console.log(this.item);
    this.windowPrinter.open();
  }

  printUld() {
    this.showSuccessStatus("expaccpt.print.request.sucess");
    this.windowPrinter.hide();
    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorStatus("expaccpt.select.printer.and.proceed");
    }
    else {
      this.item.printerName = this.popupPrinterForm.get("printerdropdown").value;
      this.printUldTagRequest(this.item);
    }
  }

  printUldTagRequest(printData) {
    console.log(this.uldTagPrintData);
    const printUldtagData = new PrintUldtagData();
    printUldtagData.cargo = printData['cargo'];
    printUldtagData.xpsShipment = printData['xpsShipment'];
    printUldtagData.bup = printData['bup'];
    printUldtagData.courier = printData['courier'];
    printUldtagData.tagRemarks = printData['tagRemarks'];
    printUldtagData.mail = printData['mail'];
    printUldtagData.dgDetails = printData['dgDetails'];
    printUldtagData.dgShipment = printData['dgShipment'];
    printUldtagData.uldNumber = this.uldTagPrintData.uldNumber
    printUldtagData.weightCapturedManually = this.uldTagPrintData.weightCapturedManually
    printUldtagData.pdTrolleyWeight = this.uldTagPrintData.pdTrolleyWeight
    printUldtagData.grossWeight = this.uldTagPrintData.grossWeight
    printUldtagData.flightKey = this.uldTagPrintData.flightKey;
    printUldtagData.date = this.uldTagPrintData.date;
    printUldtagData.segment = this.uldTagPrintData.segment;
    printUldtagData.contourCode = this.uldTagPrintData.contourCode;
    printUldtagData.autoWeighBupHeaderId = printData['autoWeighBupHeaderId'];
    printUldtagData.printerName = printData['printerName'];
    printUldtagData.flightSegmentId = printData['flightSegmentId'];
    printUldtagData.carrierCode = printData['carrierCode'];
    printUldtagData.reprint = true;
    printUldtagData.acceptanceBy = 'RPRN';
    if(!printUldtagData.dgShipment) {
      printUldtagData.dgDetails = null;
    }
    console.log(printUldtagData);
    let pageData = new UldWeighRecord();
    printData.acceptedBy = 'WHW'
    printData.acceptanceBy = 'RPRN';
    pageData = printData;
    pageData.reprint = true;
    if(!pageData.dgShipment) {
      pageData.dgDetails = null;
    }
    this.acceptanceService.insertBupAutoWeighDetails
      (pageData).subscribe(response => {
        this.refreshFormMessages(response);
        if (response.messageList != null) {
          this.showErrorMessage(response.messageList[0].code);
        }

        if (response.data !== null) {
          printUldtagData.autoWeighBupHeaderId = response.data.autoWeighBupHeaderId;
          printUldtagData.acceptanceBy = 'RPRN';
          this.acceptanceService.printAndUpdateUldTagDetails(printUldtagData).subscribe(response => {
            this.refreshFormMessages(response);
            if (response.success == true) {
              this.uldTagRemarkWindow.close();
              this.showSuccessStatus('g.completed.successfully');
              this.getAutoWeighCapturedUldList();
            }
          });
        }

      });




  }

  updateFlightDetails() {

    const tempDate = NgcUtility.getCurrentDateOnly();
    let list: Array<UpdateFlightData> = [];

    const updateFlightDetailsRequest = new UpdateFlightDetails();
    let UpdateFlightDetailsData;

    const length = this.listOfShipmentNumbers.controls.length;
    this.listOfShipmentNumbers.controls.forEach((formGroup: NgcFormGroup) => {
      UpdateFlightDetailsData = new UpdateFlightData();
      let formValue = formGroup.getRawValue();
      UpdateFlightDetailsData.cargo = formGroup.get('cargo').value;
      UpdateFlightDetailsData.xpsShipment = formGroup.get('xpsShipment').value;
      UpdateFlightDetailsData.bup = formGroup.get('bup').value;
      UpdateFlightDetailsData.courier = formGroup.get('courier').value;
      UpdateFlightDetailsData.mail = formGroup.get('mail').value;
      UpdateFlightDetailsData.dgDetails = formGroup.get('dgDetails').value;
      UpdateFlightDetailsData.dgShipment = formGroup.get('dgShipment').value;
      UpdateFlightDetailsData.uldNumber = formGroup.get('uldNumber').value;
      UpdateFlightDetailsData.weightCapturedManually = formGroup.get('weightCapturedManually').value;
      UpdateFlightDetailsData.pdTrolleyWeight = formGroup.get('pdTrolleyWeight').value;
      UpdateFlightDetailsData.grossWeight = formGroup.get('grossWeight').value;
      UpdateFlightDetailsData.contourCode = formGroup.get('contourCode').value;
      UpdateFlightDetailsData.carrierCode = formGroup.get('carrierCode').value;
      UpdateFlightDetailsData.oldFlightKey = formValue.flightKey;
      UpdateFlightDetailsData.oldFlightDate = formValue.date;
      UpdateFlightDetailsData.autoWeighBupHeaderId = formGroup.get('autoWeighBupHeaderId').value;
      UpdateFlightDetailsData.flightKey = this.UpdateFlightDetailsForm.get('updatedFlightKey').value;
      UpdateFlightDetailsData.date = this.UpdateFlightDetailsForm.get('newDate').value;
      UpdateFlightDetailsData.flightSegmentId = this.UpdateFlightDetailsForm.get('newFlightSegmentId').value;
      UpdateFlightDetailsData.segment = this.seg;
      UpdateFlightDetailsData.acceptanceBy = 'CHF';
      UpdateFlightDetailsData.terminal = this.AutoweighCapturedUldListForm.get('selectedTerminal').value;
      UpdateFlightDetailsData.tagRemarks = formGroup.get('tagRemarks').value;
      list.push(UpdateFlightDetailsData);
    });
    console.log(list);
    updateFlightDetailsRequest.autoWeighCapturedList = list;
    console.log(updateFlightDetailsRequest);
    if (UpdateFlightDetailsData.date < tempDate) {
      this.showErrorStatus('expaccpt.past.date.cannot.provide');
    } else {
      this.acceptanceService.updateFlightDetails(updateFlightDetailsRequest).subscribe(response => {
        this.refreshFormMessages(response);
        if (response.success == true) {
          this.flightUpdateWindow.close();
          this.showSuccessStatus('g.completed.successfully');
          this.getAutoWeighCapturedUldList();
        }
      });
    }
  }

  getDes(event) {
    this.seg = event.desc;
    //console.log("itemdesc"+
  }

  onCancel(event){
    this.navigateHome();
  }
}

