// Angular imports
import {
  Component, OnInit, Input, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

// Application imports
import {
  NgcFormGroup, NgcFormControl, NgcFormArray,
  NgcPage, NgcButtonComponent, NgcUtility, NgcInputComponent, PageConfiguration
} from 'ngc-framework';

// ULD Transfer New and edit imports
import {
  UldTransferViewDataRequest, UldTransferViewDataResponse,
  UldGenerateRecieptNumberRequest, UldTransferRequest, ULD
} from '../../uld.shared';
import { UldService } from '../../uld.service';

/**
 *
 *
 * @export
 * @class UldtransfernewComponent
 * @extends {NgcPage}
 * @implements {OnInit}
 */
@Component({
  selector: 'ngc-uldtransfernew',
  templateUrl: './uldtransfernew.component.html',
  styleUrls: ['./uldtransfernew.component.scss'],
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  // restorePageOnBack: true
})
export class UldtransfernewComponent extends NgcPage {

  @ViewChild('finalizebutton') finalizebutton: NgcButtonComponent;
  @ViewChild('generaterecieptnumber') generateRecieptDisableButtom: NgcButtonComponent;
  usedByFlag = false;
  rowValidationFlag = false;
  duplicateDataFlag = false;
  invalidCarrierFlag = false;
  blankFieldFlag = false;
  titleFlag = true;
  CarrierDiasbleFlag = false;
  displayTransferCarrierName = false;
  displayRecievingCarrierName = false;
  errors: any;
  generateRecieptFlag = false;
  recieptNumberData: any = '';
  autoRecptGenFlag = false;
  listLength = 0;
  createdflag = false;
  transferData: any;
  finalizedData: any;
  finalizedFlag = false;
  flagUpdateTransfer = false;
  uldTransferData: any;
  remarksList: any[];
  listForeignUld: any[];
  listNewUld: any[];
  receiptNum: any;
  awbprefix: any;
  uldTransferFinalizedList: any;
  hasReadPermission: boolean = false;

  uldTransferRequest: UldTransferRequest = new UldTransferRequest();
  private uldTansferNewForm: NgcFormGroup = new NgcFormGroup
    ({
      transferId: new NgcFormControl(),
      lastReceiptNum: new NgcFormControl(),
      transferCarrier: new NgcFormControl('', [Validators.required]),
      transferCarrierName: new NgcFormControl(),
      transCarrierName: new NgcFormControl(NgcUtility.getTenantConfiguration().airportCode, [Validators.required]),
      receivingCarrier: new NgcFormControl('', [Validators.required]),
      receivCarrierName: new NgcFormControl(),
      lucReceiptNum: new NgcFormControl(),
      transferAirport: new NgcFormControl(),
      issueDateTime: new NgcFormControl(new Date(), [Validators.required]),
      recFlag: new NgcFormControl(false),
      recDisableFlag: new NgcFormControl(false),
      remarks1: new NgcFormControl(),
      remarks2: new NgcFormControl(),
      remarks3: new NgcFormControl(),
      ULdtransferList: new NgcFormArray(
        [
        ]
      ),
      ULdRemarks: new NgcFormArray(
        [
        ]
      )

    });
  private formUldTransferOsi: NgcFormGroup = new NgcFormGroup({
    osiRemarkFormGp: new NgcFormGroup({
      uldRemarks: new NgcFormArray([
        new NgcFormGroup({
          uldRemark: new NgcFormControl()
        })
      ])
    })

  });


  /**
   * Creates an instance of UldtransfernewComponent.
   * @param {NgZone} appZone
   * @param {ElementRef} appElement
   * @param {ViewContainerRef} appContainerElement
   * @param {ActivatedRoute} activatedRoute
   * @param {Router} router
   * @param {UldService} uldService
   * @memberof UldtransfernewComponent
   */
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute,
    private router: Router,
    private uldService: UldService
  ) {
    super(appZone, appElement, appContainerElement);
  }
  /**
   * On initialization transferdata from view page
   * is set to display
   *
   * @memberof UldtransfernewComponent
   */
  ngOnInit() {
    this.hasReadPermission = NgcUtility.hasReadPermission('ULD_TRANSFER_MANAGEMENT');
    this.finalizebutton.disabled = true;
    if (this.uldService.transferUldData) {
      // this.uldTansferNewForm.get('transferId').setValue(this.uldService.transferUldData.transferId);
      this.uldTansferNewForm.get('transferCarrier').setValue(this.uldService.transferUldData.transferCarrier);
      this.uldTansferNewForm.get('transferCarrierName').setValue(this.uldService.transferUldData.transCarrierName);
      this.uldTansferNewForm.get('receivingCarrier').setValue(this.uldService.transferUldData.receivingCarrier);
      this.uldTansferNewForm.get('receivCarrierName').setValue(this.uldService.transferUldData.receivCarrierName);
      this.uldTansferNewForm.get('transferAirport').setValue(this.uldService.transferUldData.transferAirport);
      this.uldTansferNewForm.get('issueDateTime').setValue(this.uldService.transferUldData.issueDateTime);
    }
    this.transferData = this.getNavigateData(this.activatedRoute);
    this.createdflag = false;
    if (this.transferData) {
      this.CarrierDiasbleFlag = true;
      this.usedByFlag = true;
      this.titleFlag = false;
      // this.createdflag = true;
      this.flagUpdateTransfer = true;
      this.finalizebutton.disabled = false;
      this.displayTransferCarrierName = true;
      this.displayRecievingCarrierName = true;
      if (this.transferData.lucReceiptNum) {
        this.autoRecptGenFlag = true;
        this.generateRecieptFlag = true;
      }
      // else {
      //   this.createdflag = false;
      // }
      this.uldTansferNewForm.get('transferId').setValue(this.transferData.transferId);
      this.uldTansferNewForm.get('transferCarrier').setValue(this.transferData.transferCarrier);
      this.uldTansferNewForm.get('transferCarrierName').setValue(this.transferData.transCarrierName);
      this.uldTansferNewForm.get('receivingCarrier').setValue(this.transferData.receivingCarrier);
      this.uldTansferNewForm.get('receivCarrierName').setValue(this.transferData.receivCarrierName);
      this.uldTansferNewForm.get('transferAirport').setValue(this.transferData.transferAirport);

      if (this.transferData.uldTransfers[this.transferData.uldTransfers.length - 1].uldCreationDateTime === null) {
        this.uldTansferNewForm.get('issueDateTime').setValue(new Date());
      } else {
        this.uldTansferNewForm.get('issueDateTime')
          .setValue(this.transferData.uldTransfers[this.transferData.uldTransfers.length - 1].uldCreationDateTime);
      }
      if (this.transferData.lucReceiptNum) {
        this.uldTansferNewForm.get('lucReceiptNum').setValue(this.transferData.lucReceiptNum);
      }

      // this.transferData.uldTransfers.forEach(element => {
      //   if(element.usedBy == ){

      //   }
      // });


      // this.uldTansferNewForm.get('lucReceiptNum').setValue(this.transferData.uldTransfers[0].lucReceiptNum);
      (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).patchValue(this.transferData.uldTransfers);
      if (this.transferData.uldRemarks) {
        // for (let i = 0; i < this.transferData.uldRemarks.length; i++) {
        //   this.uldTansferNewForm.get('remarks' + (i + 1))
        //     .setValue(this.transferData.uldRemarks[i].uldRemark);

        // }
        (<NgcFormArray>this.formUldTransferOsi.get(['osiRemarkFormGp', 'uldRemarks'])).patchValue(this.transferData.uldRemarks);
      }
    }
    if ((<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).length < 1) {
      this.createEmptyRow();
    }
    this.remarksList = [];
    this.autoRecptGenFlag = false;
  }
  /**
   * This function makes a call to generate reciept
   * and set luc reciept number
   *
   * @private
   * @memberof UldtransfernewComponent
   */
  private generateReceipt() {
    this.createdflag = true;
    if (this.uldTansferNewForm.get('transferCarrier').value) {
      const generateRecieptRequest: UldGenerateRecieptNumberRequest = new UldGenerateRecieptNumberRequest();
      generateRecieptRequest.transferCarrier = this.uldTansferNewForm.get('transferCarrier').value;
      this.uldService.getRecieptNumber(generateRecieptRequest).subscribe(data => {
        this.refreshFormMessages(data);
        this.autoRecptGenFlag = true;
        this.recieptNumberData = data.data;
        this.generateRecieptFlag = true;

        this.CarrierDiasbleFlag = true;
        this.errors = data.messageList;
        this.generateRecieptDisableButtom.disabled = true;
        this.uldTansferNewForm.get('lucReceiptNum').setValue(this.recieptNumberData.lucReceiptNum);
        this.uldTansferNewForm.get('lucReceiptNum').disable();
        this.uldTansferNewForm.get('lastReceiptNum').setValue(this.recieptNumberData.lastReceiptNum);
        this.setAutomaticRowValue();
      });
    } else {
      this.showErrorStatus('uld.transfering.carrier.mandatory.to.generate.reciept.number');
    }
  }
  public createEmptyRow() {
    (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).addValue([
      {
        uldNum: '',
        usedBy: '',
        awbPrefix: '',
        lucSerialNo: '',
        lucReceiptNum: '',
        conditionType: '',
        destination: '',
        remarks: '',
      }
    ]);
  }
  /**
   * Used to add a new row
   *
   * @memberof UldtransfernewComponent
   */
  public addRow() {
    this.usedByFlag = false;
    ++this.listLength;
    if (this.transferData && !this.uldTansferNewForm.get('lucReceiptNum').value) {
      this.createEmptyRow();
    } else {
      this.createEmptyRow();
      if (this.recieptNumberData || this.transferData) {
        this.setAutomaticRowValue();
      }
    }
  }
  /**
   * Used to set automatic row values
   *
   * @memberof UldtransfernewComponent
   */
  public setAutomaticRowValue() {
    const length = (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).length;
    for (let i = 0; i < length; i++) {
      if (this.recieptNumberData) {
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
          controls[i].get('awbPrefix').setValue(this.recieptNumberData.awbPrefix);
        if (this.generateRecieptFlag) {
          (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).controls[i].get('awbPrefix').disable();
          (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
            controls[i].get('lucSerialNo').setValue(i + 1);
          (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).controls[i].get('lucSerialNo').disable();
          (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
            controls[i].get('lucReceiptNum').setValue(this.recieptNumberData.lucReceiptNum);
          (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).controls[i].get('lucReceiptNum').disable();
        }
      } else if (length > 1 && (this.recieptNumberData === '') && !this.transferData) {
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
          controls[i].get('awbPrefix').setValue((<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
            controls[0].get('awbPrefix').value);
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).controls[i].get('awbPrefix').disable();
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
          controls[i].get('lucSerialNo').setValue(i + 1);
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).controls[i].get('lucSerialNo').disable();
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
          controls[i].get('lucReceiptNum').setValue((<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
            controls[0].get('lucReceiptNum').value);
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).controls[i].get('lucReceiptNum').disable();
      } else {
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
          controls[i].get('awbPrefix').setValue(this.transferData.uldTransfers[0].awbPrefix);
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).controls[i].get('awbPrefix').disable();
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
          controls[i].get('lucSerialNo').setValue(i + 1);
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).controls[i].get('lucSerialNo').disable();
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
          controls[i].get('lucReceiptNum').setValue(this.transferData.uldTransfers[0].lucReceiptNum);
        (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).controls[i].get('lucReceiptNum').disable();
      }
    }

  }
  /**
   * Calls appropriate methods to set data and validate
   *
   * @param {any} $event
   * @memberof UldtransfernewComponent
   */
  public onSave($event) {
    this.finalizedFlag = false;
    this.setRequestData();
    this.doValidation();
    this.createdflag = false;
  }
  /**
   * This function calls validation method at backend
   * After validation it is used to give appropriate message
   * if created or updated successfully
   * Else call the appropriate function
   *
   * @memberof UldtransfernewComponent
   */
  public doValidation() {
    if (this.invalidCarrierFlag === false && this.rowValidationFlag) {
      if (this.blankFieldFlag === false) {
        // if (this.duplicateDataFlag === false) {
        this.uldService.doUldValidation(this.uldTransferRequest).subscribe(data => {
          this.refreshFormMessages(data);
          this.transferData = data.data;
          if (this.transferData && this.transferData.transferId !== 0) {
            if ((this.transferData.flagUpdate === 'Y') && this.finalizedFlag) {
              this.fetchfinalizedData(this.transferData);
            } else if ((this.transferData.flagUpdate === 'Y') && this.flagUpdateTransfer) {
              this.fetchNewData(this.transferData);
              this.showSuccessStatus('operation.success');
            } else if (this.flagUpdateTransfer || this.finalizedFlag) {
              this.checkForeignUld(this.transferData.uldTransfers);
              this.uldTransferRequest.uldTransfers = this.transferData.uldTransfers;
            }
            if (this.transferData.flagUpdate === 'N' && (!this.finalizedFlag && !this.flagUpdateTransfer)) {
              this.uldTansferNewForm.get('transferId').setValue(this.transferData.transferId);
              this.fetchNewData(this.transferData);
              this.createdflag = false;
              //this.finalizebutton.disabled = false;
              this.showSuccessStatus('operation.success');
              // this.navigateTo(this.router, '/uld/transfernew', this.transferData);
            }
          }
          if (this.transferData && this.transferData.transferId === 0) {
            this.checkForeignUld(this.transferData.uldTransfers);
          }
          if (data.messageList != null) {
            if (data.messageList[0].code == "TRANRCPT02") {
              this.showErrorStatus("uld.invalid.receipt.number.format.please.update.in.XXX.X.XXXXXXX.format");
            }
          }
          if (data.messageList != null) {
            if (data.messageList[0].code == "TRANRCPT03") {
              this.showErrorStatus("uld.invalid.receipt.number.format.please.update.in.XXX.X.XXXXXXX.format");
            }
          }

        },
          error => { this.showErrorStatus('uld.error.while.creating.uld.transfer.list'); });
      } else {
        this.showErrorStatus('uld.please.fill.all.mandatory.fields');
      }

    }

  }
  /**
   * This function checks for foreign ULD using flag
   * and display confirmation message
   *
   * @param {any} object
   * @memberof UldtransfernewComponent
   */
  public checkForeignUld(object) {
    this.listForeignUld = [];
    const lengthTransferList = object.length;
    for (let i = 0; i < lengthTransferList; i++) {
      if (object[i].flagForeign === true) {
        this.listForeignUld.push(object[i].uldNum);
      }
    }
    if (this.listForeignUld.length > 0) {

      this.showConfirmMessage(NgcUtility.translateMessage("uld.you.are.transfering.foreign", this.listForeignUld))
        .then(fulfilled => {
          this.checkNewUld(object);
        });
    } else {
      this.checkNewUld(object);
    }
  }
  /**
   * This function checks for new ULD using flag
   * and display confirmation message
   * @param {any} object
   * @memberof UldtransfernewComponent
   */
  public checkNewUld(object) {
    this.listNewUld = [];
    const lengthTransferList = object.length;
    for (let i = 0; i < lengthTransferList; i++) {
      if (object[i].flagNewUld === true) {
        this.listNewUld.push(object[i].uldNum);
      }
    }
    if (this.listNewUld.length > 0) {

      this.showConfirmMessage
        (NgcUtility.translateMessage('uld.uld.is.not.found.do.you.want.to.create.new.uld.please.confirm', this.listNewUld))
        .then(fulfilled => {
          this.createUld(object);
        });
    } else {
      if (this.flagUpdateTransfer) {
        this.createUld(object);

      } else if (this.finalizedFlag) {
        this.finalizeTransfer();
      } else {
        this.createUld(object);
      }
    }
  }
  /**
   * This function calls create method of backend
   *
   * @memberof UldtransfernewComponent
   */
  public createUld(object) {
    this.uldTransferRequest.uldTransfers = object;
    if (this.flagUpdateTransfer) {
      this.updateUld();
    } else if (this.finalizedFlag) {
      this.finalizeTransfer();
    } else {
      this.uldService.createUldTransfer(this.uldTransferRequest).subscribe(data => {
        this.refreshFormMessages(data);
        this.transferData = data.data;
        this.errors = data.messageList;
        this.uldTansferNewForm.get('transferId').setValue(this.transferData.transferId);
        this.fetchNewData(this.transferData);
        this.showSuccessStatus('operation.success');
      });
    }
  }
  /**
   * This function calls update method of backend
   *
   * @memberof UldtransfernewComponent
   */


  public updateUld() {

    this.uldService.updateTransfer(this.uldTransferRequest).subscribe(data => {
      this.refreshFormMessages(data);
      this.transferData = data.data;
      this.errors = data.messageList;
      if (this.transferData.flagUpdate === 'Y') {
        this.showSuccessStatus('operation.success');
        this.fetchNewData(this.transferData);
        this.createdflag = true;
      }
    }, error => { this.showErrorStatus('uld.error.while.updating.the.transfer'); });
  }
  /**
   * Set value of recieving carrier name
   * on select of LOV value
   *
   * @param {any} object
   * @memberof UldtransfernewComponent
   */
  public onSelect(object) {
    if (this.transferData) {
      this.CarrierDiasbleFlag = true;
    }
    if (this.generateRecieptFlag) {
      this.CarrierDiasbleFlag = true;
    }
    this.displayTransferCarrierName = true;
    this.uldTansferNewForm.get('transferCarrier').setValue(object.code);
    this.uldTansferNewForm.get('transferCarrierName').setValue(object.desc);
  }
  /**
   * Set value of recieving carrier name
   * on select of LOV value
   *
   * @param {any} object
   * @memberof UldtransfernewComponent
   */
  public onSelectRecievecarrier(object) {
    if (this.transferData) {
      this.CarrierDiasbleFlag = true;
    }
    if (this.generateRecieptFlag) {
      this.CarrierDiasbleFlag = true;
    }
    this.displayRecievingCarrierName = true;
    this.uldTansferNewForm.get('receivingCarrier').setValue(object.code);
    this.uldTansferNewForm.get('receivCarrierName').setValue(object.desc);
  }
  /**
   * Used to set create,update or finalize Transfer request object
   *
   * @memberof UldtransfernewComponent
   */
  public setRequestData() {
    this.invalidCarrierFlag = false;
    this.duplicateDataFlag = false;
    this.blankFieldFlag = false;
    this.uldTransferRequest.finalized = this.finalizedFlag;
    this.uldTransferRequest.transferCarrier = this.uldTansferNewForm.get('transferCarrier').value;
    this.uldTransferRequest.receivingCarrier = this.uldTansferNewForm.get('receivingCarrier').value;
    this.uldTransferRequest.transferAirport = this.uldTansferNewForm.get('transferAirport').value;
    this.uldTransferRequest.issueDateTime = this.uldTansferNewForm.get('issueDateTime').value;
    this.uldTransferRequest.transferId = this.uldTansferNewForm.get('transferId').value;
    this.uldTransferRequest.lucReceiptNum = this.uldTansferNewForm.get('lucReceiptNum').value;
    if (this.uldTansferNewForm.get('lucReceiptNum').value) {
      this.uldTransferRequest.lucReceiptNum = this.uldTansferNewForm.get('lucReceiptNum').value;
    }
    if (this.uldTransferRequest.transferId && !this.finalizedFlag) {
      this.flagUpdateTransfer = true;
      this.uldTransferRequest.flagUpdateTransfer = true;
    } else {
      this.uldTransferRequest.flagUpdateTransfer = false;
    }
    this.uldTransferRequest.uldTransfers = (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).getRawValue();
    this.remarksList = [];

    // if (this.uldTansferNewForm.get('remarks1').value) {
    //   this.remarksList.push({
    //     'uldRemark': this.uldTansferNewForm.get('remarks1').value,
    //     'transferSeqNum': ''
    //   });
    // }
    // if (this.uldTansferNewForm.get('remarks2').value) {
    //   this.remarksList.push({
    //     'uldRemark': this.uldTansferNewForm.get('remarks2').value,
    //     'transferSeqNum': ''
    //   });
    // }
    // if (this.uldTansferNewForm.get('remarks3').value) {
    //   this.remarksList.push({
    //     'uldRemark': this.uldTansferNewForm.get('remarks3').value,
    //     'transferSeqNum': ''
    //   });
    // }

    const rows = (<NgcFormArray>this.formUldTransferOsi.get(["osiRemarkFormGp", "uldRemarks"])).getRawValue();
    if (rows.length > 3) {
      this.showErrorStatus('uld.remarks.can.be.maximum.line');
      return;
    }

    if (this.transferData) {
      if (this.transferData.uldRemarks) {
        for (let i = 0; i < this.transferData.uldRemarks.length; i++) {
          this.transferData.uldRemarks[i].transferSeqNum = i + 1;
        }
      }
    }

    (<NgcFormArray>this.formUldTransferOsi.get(["osiRemarkFormGp", "uldRemarks"])).getRawValue().forEach(ele => {
      if (ele.uldRemark != null) {
        this.uldTransferRequest.uldRemarks = (<NgcFormArray>this.formUldTransferOsi.get(["osiRemarkFormGp", "uldRemarks"])).getRawValue();
      } else {
        this.uldTransferRequest.uldRemarks = (<NgcFormArray>this.formUldTransferOsi.get(["osiRemarkFormGp", "uldRemarks"])).patchValue(null);
      }
    })



    // if (this.transferData) {
    //   if (this.transferData.uldRemarks) {
    //     for (let i = 0; i < this.transferData.uldRemarks.length; i++) {
    //       this.remarksList[i].transferSeqNum = i + 1;
    //     }
    //   } else if (this.transferData.uldTransfers && this.transferData.uldTransfers[0].uldRemarks) {
    //     for (let i = 0; i < this.transferData.uldTransfers[0].uldRemarks.length; i++) {
    //       this.remarksList[i].transferSeqNum = i + 1;
    //     }
    //   }
    // }

    // if (this.remarksList) {
    //   this.uldTransferRequest.uldRemarks = this.remarksList;
    // }
    const length = this.uldTransferRequest.uldTransfers.length;
    if (this.uldTransferRequest.uldTransfers.length > 0) {
      this.rowValidationFlag = true;
      this.checkUldNumber();
    } else {
      this.showErrorStatus('uld.uld.details.not.entered');
    }
  }

  /**
   * Used to make call to appropriate functions
   * when user clicks on finalize button
   *
   * @memberof UldtransfernewComponent
   */
  public Finalize() {
    this.finalizedFlag = true;
    this.flagUpdateTransfer = false;
    this.setRequestData();
    if (this.uldTransferRequest.transferId == null) {
      this.showErrorMessage('Please save before Finalize')
      return;
    }

    this.flagUpdateTransfer = false;
    this.doValidation();
  }
  /**
   * This function is used to apply flag
   * after validation of mandatory fields
   * and ULD number duplicacy
   *
   * @memberof UldtransfernewComponent
   */
  public checkUldNumber() {

    if (this.uldTransferRequest.transferCarrier.length > 0 && this.uldTransferRequest.receivingCarrier.length > 0) {
      const length = this.uldTransferRequest.uldTransfers.length;

      for (let i = 0; i < length; i++) {
        if (this.uldTransferRequest.uldTransfers[i].remarks !== ''
          && this.uldTransferRequest.uldTransfers[i].remarks && this.uldTransferRequest.uldTransfers[i].remarks.length > 100) {
          this.showErrorStatus('uld.remarks.cannot.have.length.more.then');
          this.rowValidationFlag = false;
        }
        if (this.uldTransferRequest.uldTransfers[i].uldNum === null ||
          this.uldTransferRequest.uldTransfers[i].uldNum.length === 0 ||
          this.uldTransferRequest.uldTransfers[i].conditionType === null ||
          this.uldTransferRequest.uldTransfers[i].conditionType.length === 0 ||
          this.uldTransferRequest.uldTransfers[i].destination === null ||
          this.uldTransferRequest.uldTransfers[i].destination.length === 0
        ) {
          this.blankFieldFlag = true;
        }
      }
    } else {
      this.blankFieldFlag = true;
    }
  }
  /**
   * This function calls finalize method of backend
   *
   * @memberof UldtransfernewComponent
   */
  public finalizeTransfer() {
    this.uldTransferRequest.uldRemarks = this.formUldTransferOsi.getRawValue().osiRemarkFormGp.uldRemarks;
    this.uldService.finalizeTransfer(this.uldTransferRequest).subscribe(data => {
      this.refreshFormMessages(data);
      this.transferData = data.data;
      this.errors = data.messageList;
      if (this.transferData.flagUpdate === 'Y') {
        this.fetchfinalizedData(this.transferData);
      }
    },
      error => { this.showErrorStatus('uld.error.while.finalizing.uld.transfer.list'); });
  }
  public fetchfinalizedData(trasferObject) {
    trasferObject.transferFinalizedFlag = false;
    this.uldService.fetchUldTransferData(trasferObject).subscribe(data => {
      this.refreshFormMessages(data);
      this.finalizedData = data.data;
      this.uldTransferData = this.finalizedData.uldTransfers[0];
      this.uldTransferData.finalizedDateTime
        = NgcUtility.toDateFromLocalDate(this.uldTransferData.issueDateTime);
      this.uldTransferData.transCarrierName
        = this.uldTansferNewForm.get('transferCarrierName').value;
      this.uldTransferData.receivCarrierName
        = this.uldTansferNewForm.get('receivCarrierName').value;
      this.showSuccessStatus('operation.success');
      this.navigateTo(this.router, '/uld/transferviewdata', this.uldTransferData);
    },
      error => { this.showErrorStatus('g.error'); });
  }

  public onDelete(index) {
    if (index === 0) {
      this.createdflag = false;
      this.generateRecieptFlag = false;
      this.uldTansferNewForm.get('lucReceiptNum').setValue(null);
      // if()
      (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).
        controls[0].get('awbPrefix').setValue(null);
    } else {
      this.createdflag = true;
    }
    const transfers = (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).getRawValue();
    if (transfers[index].uldNum) {
      if (this.uldTansferNewForm.get('transferId').value) {
        this.uldTransferRequest.transferId = this.uldTansferNewForm.get('transferId').value;
        this.uldTransferRequest.transferSeqNum = transfers[index].transferSeqNum;
        if (transfers[index].flagSaved === 'Y') {
          this.uldService.deleteTransfer(this.uldTransferRequest).subscribe(data => {
            this.refreshFormMessages(data);
          },
            error => { this.showErrorStatus('uld.error.while.finalizing.uld.transfer.list'); });
        }
      }
    }
    (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).deleteValueAt(index);

  }

  public fetchNewData(trasferObject) {
    trasferObject.transferFinalizedFlag = true;
    this.finalizebutton.disabled = false;
    this.createdflag = false;
    this.uldService.fetchUldTransferData(trasferObject).subscribe(data => {
      this.refreshFormMessages(data);
      this.finalizedData = data.data;
      this.uldTransferData = this.finalizedData.uldTransfers[0];
      (<NgcFormArray>this.uldTansferNewForm.controls['ULdtransferList']).patchValue(this.uldTransferData.uldTransfers);
      this.uldTansferNewForm.get('issueDateTime').patchValue(this.uldTransferData.uldTransfers[this.uldTransferData.uldTransfers.length - 1].uldCreationDateTime)
      this.transferData = data.data;
      (<NgcFormArray>this.formUldTransferOsi.get(['osiRemarkFormGp', 'uldRemarks'])).patchValue(this.transferData.uldTransfers[0].uldRemarks);
    });
  }

  /**
   * Get and set Handling Carrier Code in 'Used By' Field on Tab-Out from 'ULD Number' Input Field
   */
  getHandlingCarrierCode(event, index) {

    //If 'ULD Number' Input Field is Blank
    if (event.target.value === "") {
      return;
    }
    let conditionTypeData = this.uldTansferNewForm.get(["ULdtransferList", index, "conditionType"]).value;
    if (conditionTypeData === 'SER') {
      conditionTypeData = 'Serviceable';
    }
    if (conditionTypeData === 'DAM') {
      conditionTypeData = 'Damaged';
    }

    const uld: ULD = new ULD();
    uld.uldNumber = event.target.value;
    this.uldService.getHandlingCarrierCode(uld).subscribe(data => {
      //If No Handling Carrier Code Found for the entered 'ULD Number'
      if (data.data === null) {
        return;
      }
      if (!data.data.conditionType) {
        data.data.conditionType = conditionTypeData;
      }
      //set Handling Carrier Code in 'Used By' Field
      if (data.data.uldCarrier != data.data.usedBy) {
        (<NgcFormGroup>(<NgcFormArray>this.uldTansferNewForm.controls.ULdtransferList).controls[index]).get('usedBy').patchValue(data.data.usedBy);
      } else {
        (<NgcFormGroup>(<NgcFormArray>this.uldTansferNewForm.controls.ULdtransferList).controls[index]).get('usedBy').patchValue(null);
      }
      (<NgcFormGroup>(<NgcFormArray>this.uldTansferNewForm.controls.ULdtransferList).controls[index]).get('conditionType').patchValue(data.data.conditionType);
      this.resetFormMessages();
    },
      error => { this.showErrorStatus('g.error'); });

  }

  addRow1() {
    (<NgcFormArray>this.formUldTransferOsi.get(["osiRemarkFormGp", "uldRemarks"])).addValue([
      {
        uldRemark: ''
      }
    ]);
  }
  delRow(item, index) {
    (<NgcFormArray>this.formUldTransferOsi.get(["osiRemarkFormGp", "uldRemarks"])).removeAt(index)

    const osiRemarksRequest: any = new Object();
    osiRemarksRequest.transferId = this.uldTansferNewForm.get('transferId').value;
    osiRemarksRequest.transferSeqNum = item.value.transferSeqNum;

    this.uldService.delUldTransferOsiRemark(osiRemarksRequest).subscribe((data) => {
      const resp = data;
      if (data.success) {
        this.showSuccessStatus('g.operation.successful');
      }
    });

  }



}
