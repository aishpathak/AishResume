import { NgcUtility, NgcULDInputComponent } from 'ngc-framework';
import { DISABLED } from '@angular/forms/src/model';
import { request } from 'http';
// Angular imports
import {
  Component, NgZone, ElementRef, OnInit,
  OnDestroy, ViewContainerRef, QueryList
} from '@angular/core';
import { Validators, PatternValidator, FormControl } from '@angular/forms';
// NGC framework imports
import {
  NgcFormGroup,
  NgcFormArray,
  NgcApplication,
  NgcWindowComponent,
  NgcDropDownComponent,
  NgcPage,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  PageConfiguration,
  NgcInputComponent
} from 'ngc-framework';
import { NgcFormControl, NgcEditTableComponent, NgcReportComponent, NgcFileUploadComponent, FileUploadModel } from 'ngc-framework';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// Backend service imports
import { AdminService } from '../../admin.service';
import {
  AuthorizedPersonnelSearchRequest,
  AuthorizedPersonnelUpdateInsertRequest
} from '../../admin.sharedmodel';
import { ViewChildren, ViewChild } from "@angular/core";
import { group } from '@angular/animations';
import { ApplicationEntities } from '../../../common/applicationentities';
import { element } from 'protractor';
import { Observable, Observer, forkJoin, combineLatest, Subscription } from 'rxjs';
import { startWith, takeWhile } from 'rxjs/operators';
import { DuplicatenamepopupComponent } from '../../../common/duplicatenamepopup/duplicatenamepopup.component';

@Component({
  selector: 'app-authorizedPersonnel',
  templateUrl: './authorizedPersonnel.component.html',
  styleUrls: ['./authorizedPersonnel.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true,
  focusToMandatory: false,
  noAutoFocus: true
})
export class AuthorizedPersonnelComponent extends NgcPage implements OnInit {
  commonService: any;
  parameter: any;
  dataRetrieved: any = [];
  companyCode: string;
  disableControls: any = [];
  reportParameters: any = new Object();
  showTable: boolean;
  afterSearch: boolean;
  recordsExist: boolean;
  showTableLastChanged: any;
  @ViewChildren('authorizedPersonnelName') authorizedPersonnelName: QueryList<NgcInputComponent>;
  @ViewChild("goTo") goTo: NgcEditTableComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('showPopUpWindow') showPopUpWindow: NgcWindowComponent;
  @ViewChild('duplicateNamePopup') duplicateNamePopup: DuplicatenamepopupComponent;
  //private companyCodeSourceParameter = {};
  private authorizedPersonnelNameParams: any;
  private authorizedPersonnelNumberParams: any;
  private contractorCodeParams: any;
  private contractorNameParams: any;
  private airportPassNumberParams: any;
  authUpdateFlag = false;
  newFocusControlIndex = 0;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private authorizedPersonnelService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
    this.route.params.subscribe(params => (this.parameter = params.id));
  }
  private authorizedPersonnelForm: NgcFormGroup = new NgcFormGroup({
    companyCode: new NgcFormControl(),
    customerId: new NgcFormControl(),
    authorizedPersonnelNametxt: new NgcFormControl(),
    authorizedPersonnelNumberTxt: new NgcFormControl(),
    airportPassNumberTxt: new NgcFormControl(),
    contractorNameLOV: new NgcFormControl(),
    contractorName: new NgcFormControl(),
    authorizedPersonnelList: new NgcFormArray([]),
    purpose: new NgcFormControl(),
    delete: new NgcFormControl(),
    edit: new NgcFormControl(),
    lastUpdateByOn: new NgcFormControl(),
    companyName: new NgcFormControl(),
    contractorCodeLOV: new NgcFormControl(),
    digitalSignature: new NgcFormControl(),
    customerCode: new NgcFormControl(),
    authorizationLetterDate: new NgcFormControl(),
    expiryDate: new NgcFormControl(),
    authorizationLetterReference: new NgcFormControl(),
    otherCompanyFlag: new NgcFormControl(),
    customerAuthorizePersonnelList: new NgcFormArray([])
  });

  private CustomerAuthorizePersonnelList: NgcFormGroup = new NgcFormGroup({
    authorizeCompanyCode: new NgcFormControl(),
    authorizeCompanyName: new NgcFormControl(),
    authorizedPersonnelName: new NgcFormControl(),
    capl: new NgcFormArray([])
  });
  resp: any;
  responseArray: any = [];
  deleteList: any = [];
  user: any;
  old: any = [];
  cancelClearClick: boolean = false;



  ngOnInit() {
    super.ngOnInit();
    this.showTable = false;
    this.afterSearch = false;
    this.recordsExist = false;
    this.duplicateNamePopup.isAuthorizedPersonnelScreen = true;
    const forwardedData = this.getNavigateData(this.activatedRoute);
    this.user = this.getUserProfile();
    if (forwardedData) {
      this.authorizedPersonnelForm.get('companyCode').patchValue(forwardedData.companyCode);
      this.authorizedPersonnelForm.get('companyName').patchValue(forwardedData.companyName);
      this.authorizedPersonnelForm.get('customerId').patchValue(forwardedData.customerId);
      // this.companyCodeSourceParameter = this.createSourceParameter(forwardedData.companyCode);
      this.setLOVSourceParameters(forwardedData.companyCode);
      this.searchAuthorizedPersonnel();
    }
  }



  onGenerateReportCustomerReport(event) {
    this.reportParameters.customerId = this.authorizedPersonnelForm.get('customerId').value;
    this.reportParameters.customerCode = this.authorizedPersonnelForm.get('companyCode').value;
    this.reportParameters.authorizedPersonnelName = this.authorizedPersonnelForm.get('authorizedPersonnelNametxt').value;
    this.reportParameters.authorizedPersonnelNumber = this.authorizedPersonnelForm.get('authorizedPersonnelNumberTxt').value;
    this.reportParameters.airportPassNumber = this.authorizedPersonnelForm.get('airportPassNumberTxt').value;
    this.reportParameters.contractorCode = this.authorizedPersonnelForm.get('contractorCodeLOV').value;
    this.reportParameters.icfin = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_PersonalIdentificationNumber).displayName;
    this.reportParameters.haffaChopFlag = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_AuthRep_HaffaMember).displayName;
    this.reportParameters.expiryDate = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_AuthRep_ExpiryDate).displayName;
    this.reportParameters.displayFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_AuthRep_ExpiryDate);
    this.reportParameters.airportPassFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_AirportPassNumber);
    this.reportParameters.otherCoFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Adm_AuthorisePersonnel_OtherCO);
    this.reportWindow.open();
  }

  onGenerateReportCustomerXLSReport(event) {
    this.reportParameters.customerId = this.authorizedPersonnelForm.get('customerId').value;
    this.reportParameters.customerCode = this.authorizedPersonnelForm.get('companyCode').value;
    this.reportParameters.authorizedPersonnelName = this.authorizedPersonnelForm.get('authorizedPersonnelNametxt').value;
    this.reportParameters.authorizedPersonnelNumber = this.authorizedPersonnelForm.get('authorizedPersonnelNumberTxt').value;
    this.reportParameters.airportPassNumber = this.authorizedPersonnelForm.get('airportPassNumberTxt').value;
    this.reportParameters.contractorCode = this.authorizedPersonnelForm.get('contractorCodeLOV').value;
    this.reportParameters.icfin = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_PersonalIdentificationNumber).displayName;
    this.reportParameters.haffaChopFlag = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_AuthRep_HaffaMember).displayName;
    this.reportParameters.expiryDate = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_AuthRep_ExpiryDate).displayName;
    this.reportParameters.displayFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_AuthRep_ExpiryDate);
    this.reportWindow1.downloadReport();
  }
  public ngAfterViewInit() {
    super.ngAfterViewInit();
    // this.authorizedPersonnelForm.get('companyCode').setValue('AAB');
    // this.authorizedPersonnelService.dataAuto =
  }

  /**
   * After Focus
   */
  public afterFocus() {

    super.afterFocus();
    //
    if (this.authorizedPersonnelName.toArray().length > 0) {
      if (!(<NgcInputComponent>this.authorizedPersonnelName.toArray()[this.newFocusControlIndex]).disabled) {
        (<NgcInputComponent>this.authorizedPersonnelName.toArray()[this.newFocusControlIndex]).focus();
      }
    }
  }

  public onAddPersonnel() {
    this.refreshFormMessages([]);
    this.showTable = true;
    this.authorizedPersonnelForm.validate();
    if (this.authorizedPersonnelForm.invalid) {
      this.showErrorStatus('admin.fill.blank.rows');
      return;
    }

    for (let i = 9; i >= 0; i--) {
      const authPersonnel = new NgcFormGroup(null);
      authPersonnel.patchValue({
        authorizedPersonnelName: '',
        authorizedPersonnelNumber: '',
        airportPassNumber: '',
        authorizationLetterDate: '',
        expiryDate: '',
        authorizationLetterReference: '',
        // airportPassValidityDate: '',
        purpose: null,
        digitalSignature: null,
        contractorCode: null,
        contractorName: null,
        allowClearVALCargo: false,
        haffaChopFlag: false,
        delete: null,
        edit: null,
        lastUpdateByOn: null,
        flagDelete: 'N',
        flagUpdate: 'N',
        flagInsert: 'Y',
        authUpdateFlag: false,
        companyCode: this.authorizedPersonnelForm.get('companyCode').value,
        customerCode: this.authorizedPersonnelForm.get('companyCode').value,
        otherCompanyFlag: '',
        customerAuthorizePersonnelList: [],
        hkidFlag: true,
      });
      if (i === 0) {
        authPersonnel.get('contractorName').enable();
      } else {
        authPersonnel.get('contractorName').disable();
      }
      (<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).insert(this.newFocusControlIndex, authPersonnel);
    }
    (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[this.newFocusControlIndex])
      .get('contractorName').valueChanges.subscribe(value => {
        (<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls.forEach((authPersonnel, index) => {
          if (index > 0 && index < 10) {
            authPersonnel.get('contractorName').patchValue(value);
          }
        });
      });

    // Create new subscriptions for validation of name field against IC/Airport Pass fields
    for (let i = 0; i <= 9; i++) {

      let o1$ = (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[i]).get('authorizedPersonnelName').valueChanges;
      const streamName$ = o1$.pipe(takeWhile(dummy => this.showTable));

      streamName$.subscribe(name => {
        var nameSpaceTrimmed = name.trim().replace(/  +/g, ' ');
        (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[i]).get('authorizedPersonnelName').setValue(nameSpaceTrimmed, { onlySelf: true, emitEvent: false });
        if ((<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[i]).get('authorizedPersonnelName').valid) {
          const request = {
            companyCode: this.authorizedPersonnelForm.get('companyCode').value,
            authorizedPersonnelName: nameSpaceTrimmed
          }
          // this.authorizedPersonnelService.validateAuthorizedPersonName(request).subscribe(response => {
          //   if (response.data === null && response.messageList[0].code == "DUPAUTHNAME") {
          //     this.showFormControlErrorMessage((<NgcFormControl>this.authorizedPersonnelForm.get(['authorizedPersonnelList', i, 'authorizedPersonnelName'])), 'error.auth.personalised.name.duplicate');
          //     return;
          //   }
          // })
        }


      })

      let o2$ = (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[i]).get('authorizedPersonnelNumber').valueChanges;
      let o3$ = (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[i]).get('airportPassNumber').valueChanges;
      const streamICAirportPass$ = combineLatest(o2$.pipe(startWith(null)), o3$.pipe(startWith(null)).pipe(takeWhile(dummy => this.showTable)));
      // Last field in array to track if cancel button was clicked from popup window
      this.old.push([null, null, null]);
      streamICAirportPass$.subscribe(icAirportPass => {
        // Prevent double opening of popup window when value is reset
        if (this.cancelClearClick) {
          this.cancelClearClick = !this.cancelClearClick;
          return;
        }
        var icNo = icAirportPass[0];
        var airportPass = icAirportPass[1];

        if ((icNo || airportPass) &&
          ((<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[i]).get('authorizedPersonnelNumber').valid && (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[i]).get('airportPassNumber').valid)) {
          // var companyCode = (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[i]).get('authorizedPersonnelNumber').valueChanges
          // Track if last changed field is IC/FIN or Airport Pass Number
          const key = Object.keys([icNo, airportPass]).find(k => [icNo, airportPass][k] != this.old[i][k]);
          this.showTableLastChanged = key == '0' ? 'authorizedPersonnelNumber' : 'airportPassNumber';
          this.old[i] = [icNo, airportPass, null];
          const request = {
            authorizedPersonnelNumber: icNo,
            airportPassNumber: airportPass,
            companyCode: this.authorizedPersonnelForm.get('companyCode').value

          };
          // this.authorizedPersonnelService.fetchDuplicateAirportPass(request).subscribe(response => {
          //   var resp = response.data;
          //   // (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[i]).get('authorizedPersonnelName').reset();
          //   if (resp == null) {
          //     this.showErrorStatus('Unable to contact server');
          //     return;
          //   }
          //   else if (response.messageList.length) {
          //     this.showErrorStatus(response.messageList[0].message);
          //     return;
          //   }
          //   else if (resp.authorizedPersonList == null || resp.authorizedPersonList.length == 0) {
          //     return;
          //   }
          //   else {
          //     this.duplicateNamePopup.open(resp.authorizedPersonList, i);
          //   }
          // })
        }
        else {
          // Track if last changed field is IC/FIN or Airport Pass Number
          this.old[i] = [icNo, airportPass, null];
        }


      })
    }

    this.async(() => {
      try {
        (this.authorizedPersonnelForm.get(['authorizedPersonnelList', this.newFocusControlIndex, 'contractorName']) as NgcFormControl).focus();
      } catch (e) { }
    }, 1);
  }



  public onSave(event) {
    this.resetFormMessages();
    if (this.authorizedPersonnelForm.get('companyCode').value === null) {
      this.showErrorStatus('admin.select.companycode');
      return;
    }

    let selectedRows: any = [];
    selectedRows = (<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).getRawValue();
    // Merge deleted list into list of updated rows
    selectedRows = selectedRows.concat(this.deleteList);

    let nameblank = false;
    let x = true;
    let namelength = false;
    let nameformat = false;

    // Manual validation for newly inserted name fields
    selectedRows.filter(function (item) { return item.flagInsert == 'Y' && item.authorizedPersonnelName }).forEach(item => {
      if (item.authorizedPersonnelName.length < 4 || item.authorizedPersonnelName.length > 35) {
        namelength = true;
        return;
      }
      if (!this.validateForValidFormatAuthName(item.authorizedPersonnelName.length)) {
        nameformat = true;
        return;
      }
    });

    if (namelength) {
      this.showErrorStatus('ERROR_IC_NAME_CHR');
      return;
    }
    if (nameformat) {
      this.showErrorStatus('Authorised Person Name should not contain double spacing and must be alphanumeric');
      return;
    }

    let authorizedPersonnelNameResult = [];
    var valueArr = selectedRows
      .filter(function (item) { return item.flagDelete != 'Y' && item.authorizedPersonnelName && item.authorizedPersonnelName != "" && item.companyCode && item.companyCode != "" })
    valueArr.filter(function (item, idx, array) {
      return array.some(function (record, index) {
        return index != idx && item.authorizedPersonnelName === record.authorizedPersonnelName && item.companyCode === record.companyCode
      })
    }).forEach(item => {
      if (authorizedPersonnelNameResult.indexOf(item.authorizedPersonnelName) < 0) {
        authorizedPersonnelNameResult.push(item.authorizedPersonnelName);
      }
    });
    if (authorizedPersonnelNameResult.length > 0) {
      this.showErrorStatus(NgcUtility.translateMessage('error.duplicate.ic.name', [authorizedPersonnelNameResult.join(', ')]));
      return;
    }

    selectedRows.forEach(ele => {

      ele['customerCode'] = this.authorizedPersonnelForm.get('companyCode').value;
      if (ele['allowClearVALCargo']) {
        if (ele['digitalSignature'] == null) {
          x = false;
        }
      }
      if (ele['authorizedPersonnelNumber'] == "") {
        ele['authorizedPersonnelNumber'] = null;
      }
      if (ele['airportPassNumber'] == "") {
        ele['airportPassNumber'] = null;
      }
      // Fixed purpose not being editable when initial value is blank for existing personnel
      if (ele['purpose']) {
        if (ele['purpose'][0] == '' || ele['purpose'][0] == null) {
          ele['purpose'].length = 0;
        }
      }
      if ((ele['purpose'] || ele['airportPassNumber'] || ele['authorizedPersonnelNumber']) && (ele['authorizedPersonnelName'] == null || ele['authorizedPersonnelName'] == "")) {
        nameblank = true;
      }

    });
    if (nameblank) {
      this.showErrorStatus('admin.authorizedpersonname.mandatory');
    }

    else {
      if (x) {

        const request: AuthorizedPersonnelUpdateInsertRequest = new AuthorizedPersonnelUpdateInsertRequest();
        request.insertUpdateAuthorizedPersonnelRQ = selectedRows.filter(function (obj) {
          return obj.authorizedPersonnelName != null && obj.authorizedPersonnelName !== ''
            && !(obj.flagCRUD == 'C' && obj.flagDelete == 'Y');
        });

        this.authorizedPersonnelService.checkForBlacklistedCustomer(request).subscribe(data => {
          // Custom error handling of error messages
          // Modify response body directly to be triggered via showResponseErrorMessages method later
          if (data.messageList && !data.data) {
            if (data.messageList[0].code == 'minlength') {
              var errorMessageList = data.messageList;
              var errorForLengthIcAirportPass = [];
              var errorForMinLengthName = [];
              var errorForPatternName = [];

              // !! Index is reversed
              errorMessageList.slice().reverse().forEach(function (item, index, object) {
                var errorCode: string = item.code;

                var referenceString: string = item.referenceId;
                var arrIndex = referenceString.match(/\d+/)[0];
                var fieldName = referenceString.substr(referenceString.indexOf('.') + 1);
                var errorValue = request.insertUpdateAuthorizedPersonnelRQ[arrIndex][fieldName];

                if (fieldName === "authorizedPersonnelName" && errorCode === "minlength") {
                  if (errorForMinLengthName.length) {
                    errorMessageList.splice(object.length - 1 - index, 1);
                  }
                  errorForMinLengthName.push(errorValue);
                }

                if (fieldName === "airportPassNumber" || fieldName === "authorizedPersonnelNumber") {
                  if (errorForLengthIcAirportPass.length) {
                    errorMessageList.splice(object.length - 1 - index, 1);
                  }
                  errorForLengthIcAirportPass.push(errorValue);
                }
              })

              for (let i = 0; i < errorMessageList.length; i++) {
                var fieldName = errorMessageList[i].referenceId.substr(errorMessageList[i].referenceId.indexOf('.') + 1);
                var errorCode: string = errorMessageList[i].code;
                if (fieldName === "airportPassNumber" || fieldName === "authorizedPersonnelNumber") {
                  errorMessageList[i].code = 'ERROR_IC_CODE_CHR'
                  continue;
                }
              }
              data.messageList = errorMessageList;
            }
          }

          // Custom error handling for blacklist message
          if (data.data && data.data.messageList.length == 1) {
            if (data.data.messageList[0].code == "error.following.blacklisted.want.to.continue") {
              var blacklistErrorString = NgcUtility.translateMessage(data.data.messageList[0].code, data.data.messageList[0].placeHolder);
              var blacklistContactString = data.data.blackListErrorMessageContact;
              var blacklistFullString = blacklistErrorString + blacklistContactString;
              this.showErrorStatus(blacklistFullString);
              return;
            }
          }

          // Custom error handling of error messages END

          if (!this.showResponseErrorMessages(data)) {
            if (data.data.blackListWarningMessage.length > 0) {
              var blacklistWarningMessageList = data.data.blackListWarningMessage;
              var numberOfBlacklistWarningMessage = blacklistWarningMessageList.length;
              for (var idx = 0; idx < blacklistWarningMessageList.length; idx++) {
                var placeHolders = blacklistWarningMessageList[idx];
                this.showConfirmMessage(NgcUtility.translateMessage("error.warning.blacklisted.want.to.continue", placeHolders)).then(fulfilled => {
                  numberOfBlacklistWarningMessage--;
                  if (numberOfBlacklistWarningMessage <= 0) {
                    this.insertUpdateAuthorizedPersonnel(request);
                  }
                }).catch(reason => {
                  return;
                })
              }
            }
            else {
              this.insertUpdateAuthorizedPersonnel(request);
            }
          }
        })

      } else {
        this.showErrorStatus('admin.digital.signature.blank');
      }
    }
  }


  validateForSpecialCharacters(airportPassNumber) {
    const result = /^[A-Za-z0-9 ]*$/.test(airportPassNumber);
    return result;
  }

  validateForSpecialCharactersAuthName(authName) {
    const result = /^[A-Za-z0-9- ]*$/.test(authName);
    return result;
  }

  validateForValidFormatAuthName(authName) {
    // If fail regex den true
    const result = /^(?!.*[ ]{2})[a-zA-Z0-9 ]+$/.test(authName);
    return result;
  }

  public insertUpdateAuthorizedPersonnel(request) {
    this.authorizedPersonnelService.insertUpdateAuthorizedPersonnel(request)
      .subscribe(data => {
        let resp: any = data.data;
        //this.refreshFormMessages(data);
        if (data.data) {
          this.deleteList = new Array();
          this.old.length = 0;
          this.resetFormMessages();
          this.showSuccessStatus('g.completed.successfully');
          this.searchAuthorizedPersonnel();
        } else {
          this.refreshFormMessages(data);
        }

        if (data.data === null && data.messageList[0].code == "DUPAUTHNAME") {

          return this.showErrorStatus(NgcUtility.translateMessage("error.auth.personalised.name.same", [data.messageList[0].referenceId]));
        }

        this.resp = data;
        this.responseArray = this.resp.data;


      });
  }

  public searchAuthorizedPersonnel() {
    this.showTable = false;
    this.recordsExist = false;
    if (this.authorizedPersonnelForm.get('companyCode').value === null) {
      this.showErrorStatus('admin.select.companycode');
      this.afterSearch = false;
      return;
    }
    this.afterSearch = true;
    const searchRequest: AuthorizedPersonnelSearchRequest = new AuthorizedPersonnelSearchRequest();
    searchRequest.authorizedPersonnelName = this.authorizedPersonnelForm.get('authorizedPersonnelNametxt').value;
    searchRequest.authorizedPersonnelNumber = this.authorizedPersonnelForm.get('authorizedPersonnelNumberTxt').value;
    searchRequest.airportPassNumber = this.authorizedPersonnelForm.get('airportPassNumberTxt').value;
    searchRequest.contractorName = this.authorizedPersonnelForm.get('contractorNameLOV').value;
    searchRequest.companyCode = this.authorizedPersonnelForm.get('companyCode').value;
    searchRequest.contractorName = this.authorizedPersonnelForm.get('contractorNameLOV').value;
    searchRequest.companyName = this.authorizedPersonnelForm.get('companyName').value;
    searchRequest.contractorCode = this.authorizedPersonnelForm.get('contractorCodeLOV').value;
    searchRequest.id = this.authorizedPersonnelForm.get('customerId').value;
    searchRequest.authorizationLetterDate = this.authorizedPersonnelForm.get('authorizationLetterDate').value;
    searchRequest.expiryDate = this.authorizedPersonnelForm.get('expiryDate').value;
    searchRequest.authorizationLetterReference = this.authorizedPersonnelForm.get('authorizationLetterReference').value;
    searchRequest.otherCompanyFlag = this.authorizedPersonnelForm.get('otherCompanyFlag').value;
    searchRequest.customerAuthorizePersonnelList = this.authorizedPersonnelForm.get('customerAuthorizePersonnelList').value;
    if (searchRequest.companyCode && searchRequest.companyName) {
      this.authorizedPersonnelService
        .searchAuthorizedPersonnelByName(searchRequest)
        .subscribe(data => {
          let labelVariable: String;
          this.refreshFormMessages(data);
          this.resp = data;
          this.responseArray = this.resp.data;
          if (this.responseArray.length !== 0) {
            this.deleteList = new Array();
            this.showTable = true;
            this.recordsExist = true;

            (<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).patchValue(this.responseArray);
            this.responseArray.forEach((obj, index) => {
              (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", index])).disable();
              (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", index, "authUpdateFlag"])).patchValue(false);

              (<NgcFormGroup>this.authorizedPersonnelForm.get(["authorizedPersonnelList", index])).valueChanges.subscribe(value => {
                (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", index, "authUpdateFlag"])).patchValue(true);
              })
              if (this.authorizedPersonnelForm.get(["authorizedPersonnelList", index, "otherCompanyFlag"]).value == 'Y') {
                (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", index, "otherCompanyFlag"])).enable({

                  onlySelf: true, emitEvent: false
                });
              }
            });
          } else {
            this.showTable = false;
            this.recordsExist = false;
            this.showErrorStatus('NO_RECORDS_EXIST');  //bugzilla - 1458
            this.deleteList = new Array();
            //this.onAddPersonnel();
          }
        }, error => {
          this.showErrorStatus(
            'g.serverdown'
          );
        });
    }
    else {
      this.showErrorMessage('expaccpt.fill.all.mandatory.details');
    }
  }

  /**
   * Set value of recieving Contractor Name
   * on select of LOV value
   *
   */

  public onContractorCodeSelect(object) {
    this.authorizedPersonnelForm.get('contractorNameLOV').setValue(object.desc);
    // this.authorizedPersonnelForm.get('contractorCodeLOV').setValue(object.code);
  }
  public onContractorNameSelect(object) {
    // this.authorizedPersonnelForm.get('contractorNameLOV').setValue(object.desc);
    this.authorizedPersonnelForm.get('contractorCodeLOV').setValue(object.code);
  }
  public onLOVSelect(index, object) {
    // this.authorizedPersonnelForm.get('contractorNameLOV').setValue(index.desc); bugzilla - 1458
    // this.authorizedPersonnelForm.get('contractorCodeLOV').setValue(index.code); bugzilla - 1458
    const updateRec: NgcFormGroup =
      (Object)(<NgcFormArray>this.authorizedPersonnelForm.get('authorizedPersonnelList')).controls[index];
    updateRec.get('contractorId').setValue(object.code);
    // this.authorizedPersonnelForm.get('contractorCodeLOV').setValue(object.desc); bugzilla - 1458
  }


  public onCompanyLOVSelect(object) {
    this.authorizedPersonnelForm.get('contractorNameLOV').setValue('');
    this.authorizedPersonnelForm.get('contractorCodeLOV').setValue('');
    this.authorizedPersonnelForm.get('companyCode').setValue(object.code);
    this.authorizedPersonnelForm.get('companyName').setValue(object.desc);
    // this.companyCodeSourceParameter = this.createSourceParameter(object.code);
    this.setLOVSourceParameters(object.code);
    this.authorizedPersonnelForm.get('customerId').setValue(object.param1);
  }
  public onCompanyNameLOVSelect(object) {
    this.authorizedPersonnelForm.get('contractorNameLOV').setValue('');
    this.authorizedPersonnelForm.get('contractorCodeLOV').setValue('');
    this.authorizedPersonnelForm.get('companyName').setValue(object.desc);
    this.authorizedPersonnelForm.get('companyCode').setValue(object.code);
    // this.companyCodeSourceParameter = this.createSourceParameter(object.code);
    this.setLOVSourceParameters(object.code);
    this.authorizedPersonnelForm.get('customerId').setValue(object.param1);
  }

  public deleteAuthorizedPersonnel(group) {
    const authorizedPersonnelList = (<NgcFormArray>this.authorizedPersonnelForm
      .controls['authorizedPersonnelList']).getRawValue();
    authorizedPersonnelList[group].flagDelete = 'Y';
    this.deleteList.push(authorizedPersonnelList[group]);
    (<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).removeAt(group);
  }

  public onEditLink(group) {
    // Do nothing if edit is already enabled for row
    if ((<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "authorizedPersonnelNumber"])).enabled) {
      return;
    }
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "companyCode"])).setValue(this.authorizedPersonnelForm.get('companyCode').value);
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "authorizedPersonnelNumber"])).enable();
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "airportPassNumber"])).enable();
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "purpose"])).enable({

      onlySelf: true, emitEvent: false
    });
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "allowClearVALCargo"])).enable();
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "haffaChopFlag"])).enable();
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "digitalSignature"])).enable();
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "authorizationLetterDate"])).enable();
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "expiryDate"])).enable();
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "authorizationLetterReference"])).enable();
    //Change done for BUG -20393
    //(<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "contractorName"])).enable();
    (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "hkidFlag"])).patchValue(true);
    //(<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "authorizedPersonnelName"])).enable();
    // Fixed purpose not being editable when initial value is blank for existing personnel
    if (this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "purpose"]).value.length == 0) {
      (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "purpose"])).reset();
      (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "purpose"])).patchValue(["", ""]);
    }
    let o2$ = (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "authorizedPersonnelNumber"])).valueChanges;
    let o3$ = (<NgcFormControl>this.authorizedPersonnelForm.get(["authorizedPersonnelList", group, "airportPassNumber"])).valueChanges;
    const streamICAirportPass$ = combineLatest(o2$.pipe(startWith(null)), o3$.pipe(startWith(null)).pipe(takeWhile(dummy => this.showTable)));
    // Last field in array to track if cancel button was clicked from popup window
    this.old.push([null, null, null]);
    var oldValuesIndex = this.old.length - 1;
    streamICAirportPass$.subscribe(icAirportPass => {
      // Prevent double opening of popup window when value is reset
      if (this.cancelClearClick) {
        this.cancelClearClick = !this.cancelClearClick;
        return;
      }
      var icNo = icAirportPass[0];
      var airportPass = icAirportPass[1];

      if ((icNo || airportPass) &&
        ((<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[group]).get('authorizedPersonnelNumber').valid && (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[group]).get('airportPassNumber').valid)) {
        // Track if last changed field is IC/FIN or Airport Pass Number
        const key = Object.keys([icNo, airportPass]).find(k => [icNo, airportPass][k] != this.old[oldValuesIndex][k]);
        this.showTableLastChanged = key == '0' ? 'authorizedPersonnelNumber' : 'airportPassNumber';
        this.old[oldValuesIndex] = [icNo, airportPass, null];
        const request = {
          authorizedPersonnelNumber: icNo,
          airportPassNumber: airportPass,
          companyCode: this.authorizedPersonnelForm.get('companyCode').value

        };
        // this.authorizedPersonnelService.fetchDuplicateAirportPass(request).subscribe(response => {
        //   var resp = response.data;
        //   if (resp == null) {
        //     this.showErrorStatus('Unable to contact server');
        //     return;
        //   }
        //   else if (response.messageList.length) {
        //     this.showErrorStatus(response.messageList[0].message);
        //     return;
        //   }
        //   else if (resp.authorizedPersonList == null || resp.authorizedPersonList.length == 0) {
        //     return;
        //   }
        //   else {
        //     this.duplicateNamePopup.open(resp.authorizedPersonList, group);
        //   }
        // })
      }
      else {
        // Track if last changed field is IC/FIN or Airport Pass Number
        this.old[oldValuesIndex] = [icNo, airportPass, null];
      }
    })
  }

  setLOVSourceParameters(customerCode) {
    this.authorizedPersonnelNameParams = this.createSourceParameter(customerCode);
    this.authorizedPersonnelNumberParams = this.createSourceParameter(customerCode);
    this.airportPassNumberParams = this.createSourceParameter(customerCode);
    this.contractorCodeParams = this.createSourceParameter(customerCode);
    this.contractorNameParams = this.createSourceParameter(customerCode);
  }

  onCancel(event) {
    this.navigateBack(this.authorizedPersonnelForm.getRawValue());
  }
  customerAuthorizePersonalList(index): void {

    let customer = (<NgcFormArray>this.authorizedPersonnelForm.get(["authorizedPersonnelList", index])).getRawValue();
    this.CustomerAuthorizePersonnelList.patchValue(customer);
    this.CustomerAuthorizePersonnelList.get('capl').patchValue(this.authorizedPersonnelForm.get(["authorizedPersonnelList", index, "customerAuthorizePersonnelList"]).value);
    this.showPopUpWindow.open();

  }

  // For name validation against IC/Airport Pass Number

  onClose() {
  }

  onCancelClear(index) {
    // Prevent double opening of popup window when value is reset
    this.cancelClearClick = true;
    (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[index]).get(this.showTableLastChanged).patchValue(null);
    // Track if last changed field is IC/FIN or Airport Pass Number
    this.old[index][0] = (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[index]).get('authorizedPersonnelNumber').value;
    this.old[index][1] = (<NgcFormGroup>(<NgcFormArray>this.authorizedPersonnelForm.controls['authorizedPersonnelList']).controls[index]).get('airportPassNumber').value;
    this.old[index][2] = this.showTableLastChanged;
  }
}
