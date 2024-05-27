import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  OnInit,
  OnChanges,
  ViewChild,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { Validators } from "@angular/forms";
import {
  NgcPage,
  NgcFormGroup,
  NgcWindowComponent,
  NgcFormArray,
  NgcDropDownComponent,
  NgcUtility,
  NgcButtonComponent,
  NgcDataTableComponent,
  PageConfiguration,
  NgcReportComponent
} from "ngc-framework";
import { NgcFormControl } from "ngc-framework";
import { ApplicationEntities } from "../../../common/applicationentities";
import { AdminService } from "../../admin.service";
import { SearchResponseBlackList, AssociatedAirlinesForCustomer } from './../../admin.sharedmodel';
@Component({
  selector: "app-blacklist-customer",
  templateUrl: "./blacklist-customer.component.html"
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class BlacklistCustomerComponent extends NgcPage
  implements OnInit, OnChanges {
  reportParameters: any = new Object();
  response: any;
  reason: string[];
  flagShowEditBlackListedCustomer: boolean = false;
  flagShowBlackListedCustomer: boolean = false;
  showAuthPersonnel: boolean = false;
  showCustPersonnel: boolean = true;
  arrayReason: any[];
  flagEditAuthorizedPersonnel: boolean = false;
  arrayUser: any[];
  flag: boolean;
  requsetAllBlackList: any;
  dropdownsourcesearch: any[] = ["Customer Code", "Authorized Personnel"];
  customerId: any;
  disableFlag: boolean;
  dateFrom: any = NgcUtility.getCurrentDateOnly();
  dateTo: any = NgcUtility.getCurrentDateOnly();

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;

  constructor(
    private adminService: AdminService,
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private blackListForm: NgcFormGroup = new NgcFormGroup({
    // customerId: new NgcFormControl(),
    selectAllCheckBox: new NgcFormControl(),
    customerCode: new NgcFormControl(),
    authorizedPersonnelName: new NgcFormControl(),
    authorizedPersonnelNumber: new NgcFormControl(),
    airportPassNumber: new NgcFormControl(),
    customerAuthorizedPerson: new NgcFormControl(),
    customerCode1: new NgcFormControl(),
    customerName: new NgcFormControl(),
    associatedAirlinesList: new NgcFormControl(),
    blackListStartDate: new NgcFormControl(),
    blackListEndDate: new NgcFormControl(),
    blackListRequestedBy: new NgcFormControl(),
    blackListPurpose: new NgcFormControl(),
    blackListReason: new NgcFormControl(),
    customerCode2: new NgcFormControl(),
    customerName1: new NgcFormControl(),
    associatedAirlinesList1: new NgcFormControl(),
    blackListStartDate1: new NgcFormControl(),
    blackListEndDate1: new NgcFormControl(),
    blackListRequestedBy1: new NgcFormControl(),
    blackListReason1: new NgcFormControl(),
    blackListPurpose1: new NgcFormControl(),
    blackListedCustomerDetails: new NgcFormArray([]),
    noblackListedAuhtorizedPersonnel: new NgcFormArray([]),
    blackListedAuthorizedPersonnelDetails: new NgcFormArray([]),
    blackListAllAuthorizedPersonnel: new NgcFormArray([])
  });

  /**
   *get customer which are already blacklisted or not
   *
   * @memberof BlacklistCustomerComponent
   */
  onSearchBlackListCustomer() {
    this.flagEditAuthorizedPersonnel = false;
    const request = this.blackListForm.getRawValue();
    request.customerId = this.customerId;
    this.adminService.searchBlackListCustomer(request).subscribe(
      data => {
        if (data.data == null) {
          this.flagShowBlackListedCustomer = false;
          this.flagShowEditBlackListedCustomer = false;
        }
        this.refreshFormMessages(data);
        this.response = data.data;
        console.log(this.response);
        if (this.response.blackListReason == null) {
          this.flagShowBlackListedCustomer = false;
          this.flagShowEditBlackListedCustomer = true;

          this.blackListForm.controls['customerCode1'].patchValue(this.response.customerCode);
          this.blackListForm.controls['customerName'].patchValue(this.response.customerName);
          this.blackListForm.controls['associatedAirlinesList'].patchValue(this.response.associatedAirlinesList);
          this.blackListForm.controls['blackListStartDate'].patchValue(this.response.blackListStartDate);
          this.blackListForm.controls['blackListEndDate'].patchValue(this.response.blackListEndDate);
          this.blackListForm.controls['blackListRequestedBy'].patchValue(this.response.blackListRequestedBy);
          this.blackListForm.controls['blackListReason'].patchValue(this.response.blackListReason);
          this.blackListForm.controls['blackListPurpose'].patchValue(this.response.blackListPurpose);

        } else {
          this.flagShowEditBlackListedCustomer = false;

          this.blackListForm.controls['customerCode2'].patchValue(this.response.customerCode);
          this.blackListForm.controls['customerName1'].patchValue(this.response.customerName);
          this.blackListForm.controls['associatedAirlinesList1'].patchValue(this.response.associatedAirlinesList);
          this.response.blackListStartDate = NgcUtility.toDateFromLocalDate(this.response.blackListStartDate);
          this.blackListForm.controls['blackListStartDate1'].patchValue(this.response.blackListStartDate);
          this.response.blackListEndDate = NgcUtility.toDateFromLocalDate(this.response.blackListEndDate);
          this.blackListForm.controls['blackListEndDate1'].patchValue(this.response.blackListEndDate);
          this.blackListForm.controls['blackListRequestedBy1'].patchValue(this.response.blackListRequestedBy);
          this.blackListForm.controls['blackListReason1'].patchValue(this.response.blackListReason);
          this.blackListForm.controls['blackListPurpose1'].patchValue(this.response.blackListPurpose);
          this.flagShowBlackListedCustomer = true;

        }
      },
      error => {
        this.showErrorStatus(
          'g.serverdown'
        );
      }
    );
  }

  /**
   *To blacklist the customer which are not blacklisted yet
   *
   * @memberof BlacklistCustomerComponent
   */
  onUpdateBlackListCustomer() {
    let blackListCustomerUpdate: any = new SearchResponseBlackList();
    blackListCustomerUpdate.customerId = this.response.customerId;
    blackListCustomerUpdate.customerCode = this.blackListForm.get('customerCode1').value;
    blackListCustomerUpdate.customerName = this.blackListForm.get('customerName').value;
    blackListCustomerUpdate.associatedAirlinesList = this.blackListForm.get('associatedAirlinesList').value;
    blackListCustomerUpdate.blackListStartDate = this.blackListForm.get('blackListStartDate').value;
    blackListCustomerUpdate.blackListEndDate = this.blackListForm.get('blackListEndDate').value;
    blackListCustomerUpdate.blackListRequestedBy = this.blackListForm.get('blackListRequestedBy').value;
    blackListCustomerUpdate.blackListReason = this.blackListForm.get('blackListReason').value;
    blackListCustomerUpdate.blackListPurpose = this.blackListForm.get('blackListPurpose').value;
    this.adminService
      .updateBlackListCustomer(blackListCustomerUpdate)
      .subscribe(data => {
        if (data.data === null) {
          this.refreshFormMessages(data);
        } else {
          this.onSearchBlackListCustomer();
          this.showSuccessStatus("g.blacklisted.successfully");
        }
      });
  }

  /**
   *To remove the blacklisted customer
   *
   * @memberof BlacklistCustomerComponent
   */
  onRemoveBlackListCustomer() {
    let removeBlackListCustomer: any = new SearchResponseBlackList();
    removeBlackListCustomer.customerId = this.response.customerId;
    removeBlackListCustomer.customerCode = this.blackListForm.get('customerCode2').value;
    removeBlackListCustomer.customerName = this.blackListForm.get('customerName1').value;
    removeBlackListCustomer.associatedAirlinesList = this.blackListForm.get('associatedAirlinesList1').value;
    removeBlackListCustomer.blackListStartDate = this.blackListForm.get('blackListStartDate1').value;
    removeBlackListCustomer.blackListEndDate = this.blackListForm.get('blackListEndDate1').value;
    removeBlackListCustomer.blackListRequestedBy = this.blackListForm.get('blackListRequestedBy1').value;
    removeBlackListCustomer.blackListReason = this.blackListForm.get('blackListReason1').value;
    removeBlackListCustomer.blackListPurpose = this.blackListForm.get('blackListPurpose1').value;
    this.adminService
      .removeBlackListCustomer(removeBlackListCustomer)
      .subscribe(data => {
        this.response = data.data;
        this.onSearchBlackListCustomer();
        this.showSuccessStatus("g.removed.successfully");
      });
  }

  /**
   *get authorized personnel which are already blacklisted or not
   *
   * @memberof BlacklistCustomerComponent
   */
  onSearchAuthorizedPersonnel() {
    this.blackListForm.get('blackListStartDate').reset();
    this.blackListForm.get('blackListEndDate').reset();
    this.blackListForm.get('blackListRequestedBy').reset();
    this.blackListForm.get('blackListPurpose').reset();
    this.blackListForm.get('blackListReason').reset();
    const request = this.blackListForm.getRawValue();

    const saveFormGroup: NgcFormGroup = (<NgcFormGroup>this.blackListForm);
    saveFormGroup.validate();
    if (!this.blackListForm.get('authorizedPersonnelNumber').valid || !this.blackListForm.get('airportPassNumber').valid || !this.blackListForm.get('authorizedPersonnelName').valid) {
      return;
    }
    this.adminService.searchAuthorizedPersonnel(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.response = data.data;

      this.arrayUser = this.response;
      if (this.arrayUser == null) {
        this.flagShowEditBlackListedCustomer = false;
        this.flagShowBlackListedCustomer = false;
        this.flagEditAuthorizedPersonnel = false;
      } else {
        this.flagEditAuthorizedPersonnel = true;
      }
      let arrayUserNull = new Array();
      this.blackListForm.get('selectAllCheckBox').setValue(false);
      this.arrayUser.forEach(authorizePersonnel => {
        authorizePersonnel.blackListStartDate = NgcUtility.toDateFromLocalDate(authorizePersonnel.blackListStartDate);
        authorizePersonnel.blackListEndDate = NgcUtility.toDateFromLocalDate(authorizePersonnel.blackListEndDate);
        authorizePersonnel.check = false;
        if (authorizePersonnel.blackListReason) {
          authorizePersonnel.flagCRUD = 'R';
        }
        arrayUserNull.push(authorizePersonnel.blackListReason);
      });

      this.arrayReason = arrayUserNull;
      this.blackListForm.controls[
        "noblackListedAuhtorizedPersonnel"
      ].patchValue(this.arrayUser);

      let count = 0;
      this.response.forEach(ele => {
        if (ele.blackListReason != null) {
          count++;
        }
      })

      if (count > 0) {
        this.disableFlag = false;
      } else {
        this.disableFlag = true;
      }


      this.flagShowEditBlackListedCustomer = false;
      this.flagShowBlackListedCustomer = false;
    }, error => {
      this.showErrorStatus(error);
    })
  }

  // /**
  //  *Do not remove this commented code until  10538 closed 
  //To blacklisted the authorised personnel which are not blacklisted yet
  //  *
  //  * @memberof BlacklistCustomerComponent
  //  */
  // onUpdateAuthorizedPersonnel(): void {
  //   this.flag = true;
  //   let newArray: any = new Array();
  //   /*this.arrayUser.forEach(element => {
  //     if (element.blackListReason) {
  //       newArray.push(element)
  //     }
  //   })*/
  //   /*let blackListAuthPerUpdate: any = (<NgcFormArray>this.blackListForm
  //     .controls["noblackListedAuhtorizedPersonnel"]).getRawValue();*/
  //      let blackListAuthPerUpdate = (<NgcFormArray>this.blackListForm.get('noblackListedAuhtorizedPersonnel')).getRawValue().filter(element => element.check);
  //      if(blackListAuthPerUpdate.length === 0){
  //      this.showErrorStatus(
  //         'Error: Please Select Atleast one row to BlackList a person'
  //       );
  //       return;
  //       }
  //  /* let count = 0;*/
  //   const updateAuthorizedPersonArray: any = new Array();
  //   blackListAuthPerUpdate.forEach(authorizedPersonnel => {
  //     if (authorizedPersonnel.check === true) {
  //      // newArray.forEach(user => {
  //        this.arrayUser.forEach(user => {
  //         //checking selected personnel against displayed list to check if the selected person is already black listed
  //         if (user.custAuthPer_Id === authorizedPersonnel.custAuthPer_Id || user.customerId === authorizedPersonnel.customerId) {
  //           //checking black listed dates and purpose  with the selected list
  //           if (this.blackListForm.get('blackListStartDate').value >= authorizedPersonnel.blackListStartDate
  //                  && this.blackListForm.get('blackListStartDate').value <= authorizedPersonnel.blackListEndDate) {
  //             if (this.blackListForm.get('blackListPurpose').value === 'BOTH'
  //               && (authorizedPersonnel.blackListPurpose === 'IMPORT' || authorizedPersonnel.blackListPurpose === 'EXPORT' ||  authorizedPersonnel.blackListPurpose === 'BOTH'
  //               )) {
  //               this.flag = false;

  //             } else if (this.blackListForm.get('blackListPurpose').value === 'IMPORT'
  //               && (authorizedPersonnel.blackListPurpose === 'IMPORT' || authorizedPersonnel.blackListPurpose === 'BOTH')) {
  //               this.flag = false;

  //             } else if (this.blackListForm.get('blackListPurpose').value === 'EXPORT'
  //               && ((authorizedPersonnel.blackListPurpose === 'EXPORT' || authorizedPersonnel.blackListPurpose === 'BOTH') || (user.blackListPurpose === 'EXPORT' || user.blackListPurpose === 'BOTH'))) {
  //               this.flag = false;

  //             }
  //             /* else {
  //               authorizedPersonnel.flagCRUD = 'C';
  //             }
  //             checking black listed dates and purpose  with the remaining list*/
  //           } else if (this.blackListForm.get('blackListStartDate').value <= user.blackListStartDate 
  //                      && this.blackListForm.get('blackListEndDate').value <= user.blackListEndDate) {
  //             if (this.blackListForm.get('blackListPurpose').value === 'BOTH'
  //               && (user.blackListPurpose === 'IMPORT' || user.blackListPurpose === 'EXPORT' || user.blackListPurpose === 'BOTH' )) {
  //               this.flag = false;

  //             } else if (this.blackListForm.get('blackListPurpose').value === 'IMPORT'
  //               && (user.blackListPurpose === 'IMPORT' || user.blackListPurpose === 'BOTH')) {
  //               this.flag = false;

  //             } else if (this.blackListForm.get('blackListPurpose').value === 'EXPORT'
  //               && (user.blackListPurpose === 'EXPORT' || user.blackListPurpose === 'BOTH')) {
  //               this.flag = false;

  //             } else if (this.blackListForm.get('blackListStartDate').value >= user.blackListStartDate 
  //                      && this.blackListForm.get('blackListStartDate').value >= user.blackListEndDate) {
  //               if (this.blackListForm.get('blackListPurpose').value === 'BOTH'
  //               && (user.blackListPurpose === 'IMPORT' || user.blackListPurpose === 'EXPORT' || user.blackListPurpose === 'BOTH' )) {
  //               this.flag = false;

  //             } else if (this.blackListForm.get('blackListPurpose').value === 'IMPORT'
  //               && (user.blackListPurpose === 'IMPORT' || user.blackListPurpose === 'BOTH')) {
  //               this.flag = false;

  //             } else if (this.blackListForm.get('blackListPurpose').value === 'EXPORT'
  //               && (user.blackListPurpose === 'EXPORT' || user.blackListPurpose === 'BOTH')) {
  //               this.flag = false;

  //             }
  //           }
  //            /* else {
  //               authorizedPersonnel.flagCRUD = 'C';
  //             }*/
  //           }
  //          /*  else {
  //             authorizedPersonnel.flagCRUD = 'C';
  //           }*/
  //         }
  //       });
  //       if (!this.flag) {
  //     this.showErrorStatus('Overlapping records in same date range for' + authorizedPersonnel.authorizedPersonnelName );
  //     return;
  //       }
  //       if(!authorizedPersonnel.blackListStartDate 
  //            && !authorizedPersonnel.blackListEndDate
  //                &&  !authorizedPersonnel.blackListPurpose 
  //                  &&  !authorizedPersonnel.blackListReason)
  //          { authorizedPersonnel.flagCRUD = 'U';
  //          }else{
  //            authorizedPersonnel.flagCRUD = 'C';
  //          }      
  //       updateAuthorizedPersonArray.push(authorizedPersonnel);
  //     } 
  //     /*else {
  //       count++;
  //     }*/
  //   });
  //  /* if (count === blackListAuthPerUpdate.length) {
  //     count--
  //     if (count === 0)
  //       this.showErrorStatus(''
  //       'Error: Please Select Atleast one row to BlackList a person'
  //       );
  //   } else*/
  //    if (this.flag) {
  //     updateAuthorizedPersonArray.forEach(element => {
  //       element['blackListStartDate'] = this.blackListForm.get('blackListStartDate').value;
  //       element['blackListEndDate'] = this.blackListForm.get('blackListEndDate').value;
  //       element['blackListRequestedBy'] = this.blackListForm.get('blackListRequestedBy').value;
  //       element['blackListPurpose'] = this.blackListForm.get('blackListPurpose').value;
  //       element['blackListReason'] = this.blackListForm.get('blackListReason').value;

  //     });
  //     this.adminService
  //       .updateAuthorizedPersonnel(updateAuthorizedPersonArray)
  //       .subscribe(data => {
  //         if (data.data === null) {
  //           this.refreshFormMessages(data);
  //         }
  //         else {
  //           this.onSearchAuthorizedPersonnel();
  //           this.showSuccessStatus('g.blacklisted.successfully');
  //         }
  //       },
  //       error => {
  //         this.showErrorStatus(error);
  //       })
  //   } else if (!this.flag) {
  //    /*  count--;
  //     if (count === 0)*/
  //     this.showErrorStatus('Overlapping records in same date range');
  //     return;
  //   }
  // }

  /**
   *To remove the blacklisted authorized personnel
   *
   * @memberof BlacklistCustomerComponent
   */
  onRemoveAuthorizedPersonnel() {
    let removeAuthPer: any = (<NgcFormArray>this.blackListForm.controls[
      "noblackListedAuhtorizedPersonnel"
    ]).getRawValue();
    let removeAuthorizedPersonArray: any = new Array();
    try {
      removeAuthPer.forEach(authorizedPersonnel => {
        if (authorizedPersonnel.check === true) {
          if (!authorizedPersonnel.blackListReason) {
            this.showErrorStatus(
              "admin.select.blacklist.record"
            );
            throw new Error("Not Blacklisted");
          } else {
            removeAuthorizedPersonArray.push(authorizedPersonnel);
          }
        }
      });
      if (removeAuthorizedPersonArray.length < 1) {
        this.showErrorStatus(
          "admin.select.atleast.one.row.to.remove"
        );
      } else {
        removeAuthorizedPersonArray.forEach(authorizedPersonnel => {
          removeAuthPer.forEach(person => {
            if (person.authorizedPersonnelName === authorizedPersonnel.authorizedPersonnelName
              && ((person.icfin_id !== null && person.icfin_id.length > 0) && person.icfin_id === authorizedPersonnel.icfin_id)) {
              removeAuthorizedPersonArray.push(person);
            }
            if (person.authorizedPersonnelName === authorizedPersonnel.authorizedPersonnelName
              && ((person.airportPassNumber !== null && person.airportPassNumber.length > 0) && person.airportPassNumber === authorizedPersonnel.airportPassNumber)) {
              removeAuthorizedPersonArray.push(person);
            }
          });
        });
        this.adminService
          .removeAuthorizedPersonnel(removeAuthorizedPersonArray)
          .subscribe(data => {
            this.response = data.data;
            this.onSearchAuthorizedPersonnel();
            this.showSuccessStatus("g.removed.successfully");
          });
      }

    } catch (e) { }
  }

  /**
   *To blacklist all the authorized personnel in one go
   *
   * @memberof BlacklistCustomerComponent
   */
  onUpdateAllAuthorizedPersonnel() {
    this.flag = true;
    let allPersonArray: any = (<NgcFormArray>this.blackListForm.get('noblackListedAuhtorizedPersonnel')).getRawValue().filter(element => !element.check);

    let blackListAuthPerUpdate = (<NgcFormArray>this.blackListForm.get('noblackListedAuhtorizedPersonnel')).getRawValue().filter(element => element.check);
    if (blackListAuthPerUpdate.length === 0) {
      this.showErrorStatus(
        'admin.select.one.row.blacklist.person'
      );
      return;
    }
    let updateAuthorizedPersonArray: any = new Array();

    blackListAuthPerUpdate.forEach(authorizedPersonnel => {
      if (authorizedPersonnel.check) {
        updateAuthorizedPersonArray.push(authorizedPersonnel);
        allPersonArray.forEach(person => {
          if (person.authorizedPersonnelName === authorizedPersonnel.authorizedPersonnelName
            && ((person.icfin_id !== null && person.icfin_id.length > 0) && person.icfin_id === authorizedPersonnel.icfin_id)) {
            updateAuthorizedPersonArray.push(person);
          }
          if (person.authorizedPersonnelName === authorizedPersonnel.authorizedPersonnelName
            && ((person.airportPassNumber !== null && person.airportPassNumber.length > 0) && person.airportPassNumber === authorizedPersonnel.airportPassNumber)) {
            updateAuthorizedPersonArray.push(person);
          }
        });
      }
    });

    if (this.flag) {
      updateAuthorizedPersonArray.forEach(updateAll => {
        updateAll['blackListStartDate'] = this.blackListForm.get('blackListStartDate').value;
        updateAll['blackListEndDate'] = this.blackListForm.get('blackListEndDate').value;
        updateAll['blackListRequestedBy'] = this.blackListForm.get('blackListRequestedBy').value;
        updateAll['blackListPurpose'] = this.blackListForm.get('blackListPurpose').value;
        updateAll['blackListReason'] = this.blackListForm.get('blackListReason').value;
      })
      this.adminService
        .updateAuthorizedPersonnel(updateAuthorizedPersonArray)
        .subscribe(data => {
          if (data.data == null) {
            this.refreshFormMessages(data);
          }
          else {
            this.onSearchAuthorizedPersonnel();
            this.blackListForm.get('blackListStartDate').reset();
            this.blackListForm.get('blackListEndDate').reset();
            this.blackListForm.get('blackListRequestedBy').reset();
            this.blackListForm.get('blackListPurpose').reset();
            this.blackListForm.get('blackListReason').reset();
            this.showSuccessStatus('g.blacklisted.successfully');

          }
        });
    } else if (!this.flag) {
      this.showErrorStatus('admin.overlapping.records.in.same.range');
    }
  }
  /**
   *To remove all the blacklisted authorized personnel in one go
   *
   * @memberof BlacklistCustomerComponent
   */
  onRemoveAllAuthorizedPersonnel() {
    const request = this.blackListForm.get("selectAllCheckBox").value;
    let removeAuthPer: any = (<NgcFormArray>this.blackListForm.controls[
      "noblackListedAuhtorizedPersonnel"
    ]).getRawValue();
    let removeAuthorizedPersonArray: any = new Array();
    if (request) {
      removeAuthPer.forEach(authorizedPersonnel => {
        removeAuthorizedPersonArray.push(authorizedPersonnel);
      })
      this.adminService
        .removeAuthorizedPersonnel(removeAuthorizedPersonArray)
        .subscribe(data => {
          this.response = data.data;
          this.onSearchAuthorizedPersonnel();
        });

    }
  }

  /**
   *To change the value of input box dynamically on selection of dropdown
   *
   * @memberof BlacklistCustomerComponent
   */
  ngOnInit() {
    super.ngOnInit();
    this.blackListForm.controls.customerAuthorizedPerson.valueChanges.subscribe(
      newValue => {
        if (newValue === "Authorized Personnel") {
          this.showAuthPersonnel = true;
          this.showCustPersonnel = false;
          this.flagShowBlackListedCustomer = false;
          this.flagShowEditBlackListedCustomer = false;
        }
        if (newValue === "Customer Code") {
          this.showCustPersonnel = true;
          this.showAuthPersonnel = false;
          this.flagEditAuthorizedPersonnel = false;
        }
      }
    );

    this.blackListForm.controls.selectAllCheckBox.valueChanges.subscribe(
      (newValue) => {
        let blkAuthPer = (<NgcFormArray>this.blackListForm.controls['noblackListedAuhtorizedPersonnel']).getRawValue();
        blkAuthPer = blkAuthPer.map(function (obj) {
          obj.check = newValue;
          return obj;
        });
        this.blackListForm.controls['noblackListedAuhtorizedPersonnel'].patchValue(blkAuthPer);
      });
    console.log(this.blackListForm);


  }
  ngAfterViewInit() {
    //to restrict blacklist end date 
    /* this.blackListForm.controls['blackListStartDate'].valueChanges.subscribe(data => {
       if(this.blackListForm.get('blackListStartDate').value){
         if(this.blackListForm.get('blackListEndDate').value <this.blackListForm.get('blackListStartDate').value){
             this.blackListForm.get('blackListEndDate').setValue(null);
         }
        
        this.dateTo =   NgcUtility.getDateTime(this.blackListForm.get('blackListStartDate').value);
       }
     });*/

  }
  onCustomerCodeLOVSelect(object) {
    this.blackListForm.get('customerName').setValue(object.desc);
    this.customerId = object.param1;
    //  this.blackListForm.get('customerCode').setValue(object.code);
  }

  onCustomerNameLOVSelect(object) {
    this.blackListForm.get('customerCode').setValue(object.code);
    this.customerId = object.param1;
    // this.blackListForm.get('customerName').setValue(object.desc);
  }

  onReportCreation() {
    // this.reportParameters = new Object();
    // this.reportParameters.authorizedPersonnelName = this.blackListForm.get('authorizedPersonnelName').value;
    // this.reportParameters.authorizedPersonnelNumber = this.blackListForm.get('authorizedPersonnelNumber').value;
    // this.reportParameters.airportPassNumber = this.blackListForm.get('airportPassNumber').value;
    this.reportParameters.airportPassFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_AirportPassNumber);
    this.reportWindow.open();
  }
}
