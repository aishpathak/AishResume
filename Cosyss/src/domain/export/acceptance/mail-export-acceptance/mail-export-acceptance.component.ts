import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Validators } from "@angular/forms";
import { Router } from "@angular/router";
// NGC framework imports
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, NgcWindowComponent, PageConfiguration, NgcUtility } from "ngc-framework";
import { MailExportAcceptanceDetails, MailExportAcceptanceRequest } from "../../export.sharedmodel";
import { AcceptanceService } from "../acceptance.service";
import { ReturnShipmentModule } from "../return-shipment/return-shipment.module";

@Component({
  selector: "app-mail-export-acceptance",
  templateUrl: "./mail-export-acceptance.component.html",
  styleUrls: ["./mail-export-acceptance.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  //autoBackNavigation: true
})
export class MailExportAcceptanceComponent extends NgcPage implements OnInit {
  @ViewChild("insertionWindow") insertionWindow: NgcWindowComponent;

  show: boolean = false;
  agentModeFlag: boolean = true;
  displayTabs: boolean = false;
  mailBagNumber: any;
  custId: any;
  cuscode: any;
  custName: any;
  registerFlag: any;
  registerMail: any;
  piece: any;
  weightValue: any;
  weightDescription: any;
  orginOeCountry: any;
  orignOeCity: any;
  orginOeQualifier: any;
  destOeCountry: any;
  destOeCity: any;
  destOeQualifier: any;
  category: any;
  mailSubType: any;
  year: any;
  dispatchNumber: any;
  dispatchSeries: any;
  receptacle: any;
  lastBag: any;
  nextDestination: any;
  setRequestParams: any;
  res: any;
  paDate: any;
  carrier: any;
  transferFromCarrier: any;
  mailDataSaveRequest: any = [];
  newArray: any = [];
  displayWarehouseLocation: any;
  displayStoreLocation: any;
  showPiece: boolean = false;
  isSatsAssistedCar: any;

  sumPieces: number = 0;
  sumWeight: number = 0;
  addbutton: boolean = true;
  displayQuery: boolean;

  paCarrier: string;
  mailBup: any;
  specialCharCheck: boolean;
  validContainer: boolean = true;


  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private acceptanceService: AcceptanceService,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private exportAcceptanceForm: NgcFormGroup = new NgcFormGroup({
    byAgentMode: new NgcFormControl(''),
    byGHAMode: new NgcFormControl(''),
    carrierCode: new NgcFormControl("", [Validators.maxLength(3)]),
    fromcarrier: new NgcFormControl("", [Validators.maxLength(3)]),
    dnNumber: new NgcFormControl(),
    customerName: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    customerId: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    nestedStoreLocation: new NgcFormControl(),
    warehouseLocation: new NgcFormControl(),
    mailBagNumber: new NgcFormControl(),
    originOe1: new NgcFormControl("", [Validators.maxLength(2)]),
    originOe2: new NgcFormControl(),
    originOe3: new NgcFormControl(),
    destinationOe1: new NgcFormControl("", [Validators.maxLength(2)]),
    destinationOe2: new NgcFormControl(),
    destinationOe3: new NgcFormControl(),
    category: new NgcFormControl("A"),
    mailType: new NgcFormControl(),
    year: new NgcFormControl(new Date().getFullYear().toString().substring(3)),
    dsn: new NgcFormControl(),
    rsn: new NgcFormControl(),
    lastBag: new NgcFormControl("No"),
    registerMail: new NgcFormControl("No"),
    weight: new NgcFormControl(),
    pieces: new NgcFormControl(),
    bup: new NgcFormControl(),
    nestedId: new NgcFormControl(),
    nextDestination: new NgcFormControl(),
    mailExportAcceptance: new NgcFormArray([])
  });

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    //Singapore Specific code
    this.exportAcceptanceForm.get(['warehouseLocation']).setValue("TRUCKDOCK");

    this.exportAcceptanceForm.get(['byAgentMode']).valueChanges.subscribe(byAgentMode => {
      if (byAgentMode == true) {
        this.agentModeFlag = true;
        this.exportAcceptanceForm.get(['agentCode']).reset();
        this.exportAcceptanceForm.get(['carrierCode']).reset();
        this.exportAcceptanceForm.get(['fromcarrier']).reset();
        this.show = false;
        this.exportAcceptanceForm.get(['uldNumber']).reset();
        this.displayQuery = false;
        //Singapore Specific code
        this.exportAcceptanceForm.get(['warehouseLocation']).setValue("TRUCKDOCK");
      }
    });
    this.exportAcceptanceForm.get(['byGHAMode']).valueChanges.subscribe(byGHAMode => {
      if (byGHAMode == true) {
        this.agentModeFlag = false;
        this.displayTabs = false;
        this.exportAcceptanceForm.get(['carrierCode']).reset();
        this.exportAcceptanceForm.get(['uldNumber']).reset();
        this.show = false;
        this.displayQuery = false;
        //Singapore Specific code
        this.exportAcceptanceForm.get(['warehouseLocation']).setValue("DNATA");
      }
    });
  }

  onBup() {
    if (this.exportAcceptanceForm.get("bup").value) {
      this.showPiece = true;
    }
    else {
      this.showPiece = false;
    }
  }

  customerDetails(event) {
    this.custId = event.param1;
    this.custName = event.desc;
    this.cuscode = event.code;
  }

  captureDamage() {
    this.newArray = [];
    let arrayNested: any = (<NgcFormArray>this.exportAcceptanceForm.controls["mailExportAcceptance"]).getRawValue();
    for (let elements of arrayNested) {
      if (elements.select) {
        this.newArray.push(elements);
      }
    }
    if (!this.newArray.length) {
      this.showErrorStatus("expaccpt.select.row.first");
      return;
    }
    if (this.newArray.length > 1) {
      this.showErrorStatus("expaccpt.select.one.row.only");
      return;
    }
    const request: any = {};
    request.entityKey = this.newArray[0].mailBagNumber;
    request.entityType = "MBN";
    let event = request;
    this.navigateTo(this.router, "/common/capturedamageDesktop", event);
  }

  onAdd($event, index) {
    this.mailBagNumber = null;
    if (this.exportAcceptanceForm.get('byAgentMode').value) {
      if (!this.exportAcceptanceForm.get('agentCode').valid ||
        this.exportAcceptanceForm.get('agentCode').value == null) {
        this.showErrorMessage("enter.agent.m");
        return;
      }
    }
    if (this.exportAcceptanceForm.get('byGHAMode').value) {
      if ((this.exportAcceptanceForm.get('fromcarrier').value == "")) {
        this.showErrorMessage("expaccpt.provide.transfer.carrier");
        return;
      }
    }
    if (this.specialCharCheck) {
      this.showErrorStatus("expaccpt.invalid.shipment.warehouse.location");
      return;
    }
    if (!this.validContainer) {
      return;
    }
    if (this.exportAcceptanceForm.get("mailBagNumber").value == null) {
      if (!this.exportAcceptanceForm.get("bup").value) {
        if (this.exportAcceptanceForm.get("originOe1").value == null || this.exportAcceptanceForm.get("originOe2").value == null
          || this.exportAcceptanceForm.get("originOe3").value == null || this.exportAcceptanceForm.get("destinationOe1").value == null
          || this.exportAcceptanceForm.get("destinationOe2").value == null || this.exportAcceptanceForm.get("destinationOe3").value == null
          || this.exportAcceptanceForm.get("category").value == null || this.exportAcceptanceForm.get("mailType").value == null
          || this.exportAcceptanceForm.get("year").value == null || this.exportAcceptanceForm.get("dsn").value == null
          || this.exportAcceptanceForm.get("rsn").value == null || this.exportAcceptanceForm.get("weight").value == null) {
          this.showErrorMessage("expaccpt.provide.mandatory.fields")
          return;
        }
      } else {
        let pieces = this.exportAcceptanceForm.get("pieces").value;
        if (!pieces || pieces < 1) {
          this.showErrorMessage("expaccpt.input.pieces");
          return;
        }
      }

    }

    if (this.exportAcceptanceForm.get("mailBagNumber").value) {
      this.mailBagNumber = this.exportAcceptanceForm.get("mailBagNumber").value;
      this.orginOeCountry = this.mailBagNumber.slice(0, 2);
      this.orignOeCity = this.mailBagNumber.slice(2, 5);
      this.orginOeQualifier = this.mailBagNumber.slice(5, 6);
      this.destOeCountry = this.mailBagNumber.slice(6, 8);
      this.destOeCity = this.mailBagNumber.slice(8, 11);
      this.destOeQualifier = this.mailBagNumber.slice(11, 12);
      this.category = this.mailBagNumber.slice(12, 13);
      this.mailSubType = this.mailBagNumber.slice(13, 15);
      this.year = this.mailBagNumber.slice(15, 16);
      this.dispatchNumber = this.mailBagNumber.slice(16, 20);
      this.receptacle = this.mailBagNumber.slice(20, 23);
      this.lastBag = this.mailBagNumber.slice(23, 24);
      this.registerFlag = this.mailBagNumber.slice(24, 25);
      this.weightValue = this.mailBagNumber.slice(25, 29) / 10;
      this.piece = 1;
    } else {
      this.orginOeCountry = this.exportAcceptanceForm.get("originOe1").value;
      this.orignOeCity = this.exportAcceptanceForm.get("originOe2").value;
      this.orginOeQualifier = this.exportAcceptanceForm.get("originOe3").value;
      this.destOeCountry = this.exportAcceptanceForm.get("destinationOe1").value;
      this.destOeCity = this.exportAcceptanceForm.get("destinationOe2").value;
      this.destOeQualifier = this.exportAcceptanceForm.get("destinationOe3").value;
      this.category = this.exportAcceptanceForm.get("category").value;
      this.mailSubType = this.exportAcceptanceForm.get("mailType").value;
      this.year = this.exportAcceptanceForm.get("year").value;
      this.dispatchNumber = this.exportAcceptanceForm.get("dsn").value;
      this.receptacle = this.exportAcceptanceForm.get("rsn").value;
      this.weightValue = this.exportAcceptanceForm.get("weight").value;
      if (this.showPiece && this.weightValue && this.weightValue.toString().length > 5) {
        this.weightDescription = ("00000" + this.weightValue * 10).slice(-5);
      } else {
        this.weightDescription = ("0000" + this.weightValue * 10).slice(-4);
      }

      if (this.exportAcceptanceForm.get('lastBag').value === 'No') {
        this.lastBag = 0;
      } else {
        this.lastBag = 1;
      }

      if (this.exportAcceptanceForm.get('registerMail').value === 'No') {
        this.registerFlag = 0;
      } else {
        this.registerFlag = 1;
      }

      if (this.dispatchNumber.length < 4) {
        this.dispatchNumber = ("0000" + this.dispatchNumber).slice(-4);
      }
      //BUP container specific code
      this.mailBup = this.exportAcceptanceForm.get("bup").value;
      if (!this.mailBup) {
        this.receptacle = ("000" + this.receptacle).slice(-3);
        this.piece = 1;
      } else {
        //In case of BUP, ULD field cannot be empty
        if (this.exportAcceptanceForm.get("uldNumber").value === "" || this.exportAcceptanceForm.get("uldNumber").value === null) {
          this.showErrorStatus("expaccpt.input.uld");
          return;
        }
        this.receptacle = "___";
        this.piece = this.exportAcceptanceForm.get("pieces").value;
      }

      this.mailBagNumber = this.orginOeCountry.concat(
        this.orignOeCity,
        this.orginOeQualifier,
        this.destOeCountry,
        this.destOeCity,
        this.destOeQualifier,
        this.category,
        this.mailSubType,
        this.year,
        this.dispatchNumber,
        this.receptacle,
        this.lastBag,
        this.registerFlag,
        this.weightDescription
      );
    }

    if (this.mailBagNumber === null || this.mailBagNumber === "") {
      this.showErrorStatus("expaccpt.input.mailbag.number");
      return;
    }
    if (this.receptacle === null || this.receptacle === "000") {
      this.showErrorStatus("expaccpt.input.RSN");
      return;
    }

    this.displayWarehouseLocation = this.exportAcceptanceForm.get("warehouseLocation").value;
    if (this.displayWarehouseLocation) {
      this.displayWarehouseLocation = this.displayWarehouseLocation.toUpperCase();
    }
    this.displayStoreLocation = this.exportAcceptanceForm.get("uldNumber").value;
    if (this.displayStoreLocation) {
      this.displayStoreLocation = this.displayStoreLocation.toUpperCase();
    }

    if (this.registerFlag === 1) {
      this.registerMail = "Y";
    } else {
      this.registerMail = "N";
    }

    this.mailDataSaveRequest = (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance"])).value;

    this.mailDataSaveRequest = this.mailDataSaveRequest.filter(i => i.mailBagNumber == this.mailBagNumber);
    if (this.mailDataSaveRequest.length) {
      this.showErrorMessage("expaccpt.mailbag.number.exists");
      return;
    }

    //Construct Request Object
    const request: MailExportAcceptanceRequest = new MailExportAcceptanceRequest();
    //request.agentCode = this.exportAcceptanceForm.get('agentCode').value;
    request.agentCode = this.cuscode;
    request.mailBagNumber = this.mailBagNumber;
    let storeLocation: string = this.displayStoreLocation;
    request.uldNumber = storeLocation;
    //this.setShipmentLocation(storeLocation);
    this.displayStoreLocation = request.uldNumber;
    request.warehouseLocation = this.exportAcceptanceForm.get("warehouseLocation").value;
    request.incomingCarrier = null;
    request.outgoingCarrier = this.exportAcceptanceForm.get('carrierCode').value;
    request.originOfficeExchange = this.orginOeCountry + this.orignOeCity + this.orginOeQualifier;
    request.originCountry = this.orginOeCountry;
    request.originCity = this.orignOeCity;
    request.destinationOfficeExchange = this.destOeCountry + this.destOeCity + this.destOeQualifier;
    request.destinationCountry = this.destOeCountry;
    request.destinationCity = this.destOeCity;
    request.shipmentType = "MAIL";
    request.shipmentNumber = this.mailBagNumber.slice(0, 20);
    request.carrierCode = this.exportAcceptanceForm.get('carrierCode').value;
    request.bup = this.mailBup;
    if (this.displayQuery) {
      request.fieldLocked = true;
    } else {
      request.fieldLocked = false;
    }
    if (this.agentModeFlag) {
      request.byAgent = this.exportAcceptanceForm.get('byAgentMode').value;
      request.searchMode = 'ByAgent';
    } else {
      request.byGHA = this.exportAcceptanceForm.get('byGHAMode').value;
      request.searchMode = 'ByGHA';
      request.customerId = null;
    }

    if (this.exportAcceptanceForm.get('byAgentMode').value && !NgcUtility.isTenantCityOrAirport(request.originCity)) {
      this.showErrorMessage("INVDOGN002");
      return;
    }


    //Call Service
    this.acceptanceService.getPAFlight(request).subscribe(data => {
      let _embargoFlag;
      let _damage;
      let _nextDestination;
      let _isSatsAssistedCar;
      let _paDetails;
      if (!this.showResponseErrorMessages(data)) {
        this.addbutton = false;
        if (data.data) {
          this.res = data.data.paFlightKey;
          this.carrier = data.data.outgoingCarrier;
          this.paCarrier = data.data.carrierCode;
          if (data.data.paFlightDate) {
            this.paDate = data.data.paFlightDate.slice(0, 10);
            _paDetails = this.res.concat(" ", this.paDate);
          }
          _nextDestination = data.data.nextDestination;
          _isSatsAssistedCar = data.data.isSatsAssistedCar;
          _embargoFlag = data.data.embargoFlag;
          _damage = data.data.damaged;
          this.resetFormMessages();
        } else {
          this.nextDestination = "";
          if (data.messageList) {
            this.refreshFormMessages(data);
          } else {
            this.resetFormMessages();
          }
        }
        if (!request.fieldLocked) {
          this.exportAcceptanceForm.get(['carrierCode']).reset();
        }
        if (_paDetails) {
          this.exportAcceptanceForm.get('carrierCode').setValue(this.paCarrier);
        }
        (<NgcFormArray>this.exportAcceptanceForm.controls["mailExportAcceptance"]).addValue([
          {
            select: false,
            shipmentNumber: this.mailBagNumber.slice(0, 20),
            mailBagNumber: this.mailBagNumber,
            outgoingCarrier: this.exportAcceptanceForm.get('fromcarrier').value,
            carrierCode: this.paCarrier,
            nextDestination: _nextDestination,
            dispatchNumber: this.dispatchNumber,
            receptacleNumber: this.receptacle,
            origin: this.orignOeCity,
            destination: this.destOeCity,
            pieces: this.piece,
            weight: this.weightValue,
            registeredIndicator: this.registerMail,
            embargoFlag: _embargoFlag,
            damaged: _damage,
            paFlightKey: _paDetails,
            carrierDetermined: true,
            warehouseLocation: this.displayWarehouseLocation,
            shipmentLocation: this.displayStoreLocation,
            bup: this.mailBup,
            paFlightDate: data.data.paFlightDate,
            returned: data.data.returned
          }
        ]);

      }
    }, error => {
      this.showErrorMessage(error);
    });
    // if (!this.exportAcceptanceForm.get('carrierCode').value) {
    //   this.exportAcceptanceForm.get('carrierCode').setValue(this.carrier);
    // }
    this.mailDataSaveRequest.push(request);
    this.show = true;

  }

  // onClick(event) {
  //   this.exportAcceptanceForm.get('fromcarrier').disable();
  // }
  // onCarrier(event) {
  //   this.exportAcceptanceForm.get('agentCode').disable();
  // }

  // onClear() {
  //   this.show = false;
  //   this.exportAcceptanceForm.reset();
  //   (<NgcFormArray>this.exportAcceptanceForm.controls[
  //     "mailExportAcceptance"
  //   ]).resetValue([]);
  //   this.resetFormMessages();
  //   this.addbutton = true;
  // }

  onSave(item) {
    let mode: boolean = this.exportAcceptanceForm.get('byAgentMode').value;
    if (this.exportAcceptanceForm.get("agentCode").value == null
      && this.exportAcceptanceForm.get("carrierCode").value == null && mode) {
      this.showErrorMessage('expaccpt.input.all.mandatory.details');
      return;
    }
    const request: MailExportAcceptanceRequest = this.exportAcceptanceForm.getRawValue();
    request.agentCode = this.cuscode;
    request.validateContainerDest = true;
    request.customerId = this.custId;
    request.customerName = this.custName;
    request.uldNumber = this.exportAcceptanceForm.get("uldNumber").value;
    request.warehouseLocation = this.exportAcceptanceForm.get("warehouseLocation").value;
    request.outgoingCarrier = this.exportAcceptanceForm.get('fromcarrier').value;


    if (this.agentModeFlag) {
      request.byAgent = this.exportAcceptanceForm.get('byAgentMode').value;
      request.searchMode = 'ByAgent';
    } else {
      request.byGHA = this.exportAcceptanceForm.get('byGHAMode').value;
      request.searchMode = 'ByGHA';
      request.customerId = null;
    }
    let index = 0;
    request.mailExportAcceptance.forEach(e => {
      //e.carrierCode = (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance", index, "carrierCode"])).value;
      e.category = (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance", index, "mailBagNumber"])).value.slice(12, 13);
      e.mailType = (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance", index, "mailBagNumber"])).value.slice(13, 15);
      e.year = (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance", index, "mailBagNumber"])).value.slice(15, 16);
      e.lastBagIndicator = (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance", index, "mailBagNumber"])).value.slice(23, 24);
      e.registeredIndicator = (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance", index, "mailBagNumber"])).value.slice(24, 25);
      e.origin = (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance", index, "mailBagNumber"])).value.slice(0, 6);
      e.destination = (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance", index, "mailBagNumber"])).value.slice(6, 12);
      e.returned = (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance", index, "returned"])).value;
      index++;
    });
    this.acceptanceService.addMailExportAcceptance(request).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          let destinationMismatchBags = [];
          let slUlds = new Set();
          let slPopUpMessage = '';
          let mismatchBagsMessage = '';
          let toUpdateDestination = {}

          data.data.mailExportAcceptance.forEach(bag => {
            if (bag.flagCRUD !== 'D' && bag.flagCRUD !== 'R' && bag.shipmentLocation !== null && bag.releaseDest === false) {
              destinationMismatchBags.push(bag);
              toUpdateDestination[bag.mailBagNumber] = bag.containerDestination;
              mismatchBagsMessage = mismatchBagsMessage + bag.mailBagNumber + " : " + (bag.containerDestination == null ? 'Not Found' : bag.containerDestination) + '<br/>'
            }

            if (bag.flagCRUD !== 'D' && bag.flagCRUD !== 'R' && bag.shipmentLocation !== null && bag.uldPopup) {
              slUlds.add(bag.shipmentLocation);
            }
          });

          Array.from(slUlds).forEach(element => {
            if (slPopUpMessage.length > 0) {
              slPopUpMessage = slPopUpMessage + ',<br/>' + element;
            } else {
              slPopUpMessage = element + '';
            }

          });

          if (slUlds.size > 0) {
            this.showConfirmMessage(NgcUtility.translateMessage('error.uld.loaded.shipment.confirmation', [slPopUpMessage])).then(fulfilled => {

              //dest logic start
              if (destinationMismatchBags.length > 0) {
                this.showConfirmMessage(NgcUtility.translateMessage('error.container.dest.mailbag.confirmation', [mismatchBagsMessage])).then(fulfilled => {
                  request.validateContainerDest = false;
                  request.mailExportAcceptance.forEach(b => {
                    let bagNum = b.mailBagNumber;
                    if (bagNum in toUpdateDestination) {
                      b.nextDestination = toUpdateDestination[bagNum];
                    }
                  });
                  request.mailExportAcceptance = request.mailExportAcceptance.filter(obj => obj.flagCRUD !== 'R');
                  this.acceptanceService.addMailExportAcceptance(request).subscribe(updatedData => {
                    if (!this.showResponseErrorMessages(updatedData)) {
                      let withoutDeletedData = updatedData.data.mailExportAcceptance.filter(obj => obj.flagCRUD !== 'D');
                      if (updatedData.data) {
                        this.showSuccessStatus("g.completed.successfully");
                        this.patchData(withoutDeletedData);
                        this.resetFormMessages();
                        let placeHolders = new Array();
                        placeHolders.push(updatedData.data.alreadyAcceptedBags.toString())
                        if (updatedData.data.alreadyAcceptedBags && updatedData.data.alreadyAcceptedBags.length > 0) {
                          this.showErrorStatus(NgcUtility.translateMessage('airmail.mailbags.already.saved', placeHolders));
                        }
                        //this.onSearch();
                      } else {
                        this.refreshFormMessages(updatedData);
                      }
                    }
                  }, error => {
                    this.showErrorMessage(error);
                    this.sumWeight = 0;
                    this.sumPieces = 0;
                  });
                });
              } else {
                request.validateContainerDest = false;
                this.acceptanceService.addMailExportAcceptance(request).subscribe(updatedData => {
                  if (!this.showResponseErrorMessages(updatedData)) {
                    let withoutDeletedData = updatedData.data.mailExportAcceptance.filter(obj => obj.flagCRUD !== 'D');
                    if (updatedData.data) {

                      this.showSuccessStatus("g.completed.successfully");
                      this.patchData(withoutDeletedData);
                      this.resetFormMessages();
                      let placeHolders = new Array();
                      placeHolders.push(updatedData.data.alreadyAcceptedBags.toString())
                      if (updatedData.data.alreadyAcceptedBags && updatedData.data.alreadyAcceptedBags.length > 0) {
                        this.showErrorStatus(NgcUtility.translateMessage('airmail.mailbags.already.saved', placeHolders));
                      }
                      //this.onSearch();
                    } else {
                      this.refreshFormMessages(updatedData);
                    }
                  }
                }, error => {
                  this.showErrorMessage(error);
                  this.sumWeight = 0;
                  this.sumPieces = 0;
                });
              }
              //dest logic end

            });
          } else {

            //dest logic start
            if (destinationMismatchBags.length > 0) {
              this.showConfirmMessage(NgcUtility.translateMessage('error.container.dest.mailbag.confirmation', [mismatchBagsMessage])).then(fulfilled => {
                request.validateContainerDest = false;
                request.mailExportAcceptance.forEach(b => {
                  let bagNum = b.mailBagNumber;
                  if (bagNum in toUpdateDestination) {
                    b.nextDestination = toUpdateDestination[bagNum];
                  }
                });
                this.acceptanceService.addMailExportAcceptance(request).subscribe(updatedData => {
                  if (!this.showResponseErrorMessages(updatedData)) {
                    let withoutDeletedData = updatedData.data.mailExportAcceptance.filter(obj => obj.flagCRUD !== 'D');
                    if (updatedData.data) {
                      this.showSuccessStatus("g.completed.successfully");
                      this.patchData(withoutDeletedData);
                      this.resetFormMessages();
                      let placeHolders = new Array();
                      placeHolders.push(updatedData.data.alreadyAcceptedBags.toString())
                      if (updatedData.data.alreadyAcceptedBags && updatedData.data.alreadyAcceptedBags.length > 0) {
                        this.showErrorStatus(NgcUtility.translateMessage('airmail.mailbags.already.saved', placeHolders));
                      }
                      //this.onSearch();
                    } else {
                      this.refreshFormMessages(updatedData);
                    }
                  }
                }, error => {
                  this.showErrorMessage(error);
                  this.sumWeight = 0;
                  this.sumPieces = 0;
                });
              });
            } else {
              request.validateContainerDest = false;
              this.acceptanceService.addMailExportAcceptance(request).subscribe(updatedData => {
                if (!this.showResponseErrorMessages(updatedData)) {
                  let withoutDeletedData = updatedData.data.mailExportAcceptance.filter(obj => obj.flagCRUD !== 'D');
                  if (updatedData.data) {
                    this.showSuccessStatus("g.completed.successfully");
                    this.patchData(withoutDeletedData);
                    this.resetFormMessages();
                    let placeHolders = new Array();
                    placeHolders.push(updatedData.data.alreadyAcceptedBags.toString())
                    if (updatedData.data.alreadyAcceptedBags && updatedData.data.alreadyAcceptedBags.length > 0) {
                      this.showErrorStatus(NgcUtility.translateMessage('airmail.mailbags.already.saved', placeHolders));
                    }
                    //this.onSearch();
                  } else {
                    this.refreshFormMessages(updatedData);
                  }
                }
              }, error => {
                this.showErrorMessage(error);
                this.sumWeight = 0;
                this.sumPieces = 0;
              });
            }
            //dest logic end
          }




        }
      }, error => {
        this.showErrorMessage(error);
        this.sumWeight = 0;
        this.sumPieces = 0;
      }
    );
  }

  onDelete(event) {

    let x = this.exportAcceptanceForm.get("mailExportAcceptance").value;
    let uIndex = 0;
    x.forEach(e => {
      if (e["select"]) {
        (<NgcFormArray>this.exportAcceptanceForm.controls["mailExportAcceptance"]).markAsDeletedAt(uIndex);
      }
      uIndex++;
    });
  }

  nestedId() {
    this.insertionWindow.open();
  }

  onNext() {
    if (this.agentModeFlag) {
      if (this.exportAcceptanceForm.get("agentCode").value && this.exportAcceptanceForm.get("carrierCode").value) {
        this.displayQuery = !this.displayQuery;
      }
      else {
        if (!this.exportAcceptanceForm.get('agentCode').valid) {
          this.showErrorMessage("enter.agent.name.m");
        }
        else {
          this.showErrorMessage("expaccpt.provide.mandatory.details");
        }
      }
    }
    else {
      if (this.exportAcceptanceForm.get("fromcarrier").value && this.exportAcceptanceForm.get("carrierCode").value) {
        this.displayQuery = !this.displayQuery;
      }
      else {
        this.showErrorMessage("expaccpt.provide.mandatory.details");
      }
    }
  }

  // onClearCarrier() {
  //   this.exportAcceptanceForm.get(['carrierCode']).reset();
  // }

  onSearch() {
    const request = new MailExportAcceptanceDetails();
    // const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.exportAcceptanceForm.get('searchFormGroup'));
    if (this.agentModeFlag) {
      request.byAgent = this.exportAcceptanceForm.get('byAgentMode').value;
      request.searchMode = 'ByAgent';
      //request.agentCode = this.exportAcceptanceForm.get("agentCode").value;
      request.agentCode = this.cuscode;
    } else {
      request.byGHA = this.exportAcceptanceForm.get('byGHAMode').value;
      request.transferredFromCarrierCode = this.exportAcceptanceForm.get('fromcarrier').value;
      request.searchMode = 'ByGHA';
    }
    request.carrierCode = this.exportAcceptanceForm.get("carrierCode").value;
    request.warehouseLocation = this.exportAcceptanceForm.get("warehouseLocation").value;
    request.uldNumber = this.exportAcceptanceForm.get("uldNumber").value;

    this.acceptanceService.fetchAcceptanceDetails(request).subscribe(data => {
      if (!data.messageList) {
        if (data.data.length != 0) {
          this.patchData(data.data);
        } else {
          this.showInfoStatus("no.record");
          (<NgcFormArray>this.exportAcceptanceForm.controls["mailExportAcceptance"]).resetValue([]);
          this.displayTabs = true;
          this.resetFormMessages();
          this.addbutton = true;
        }
      } else if (data.messageList) {
        this.refreshFormMessages(data);
        (<NgcFormArray>this.exportAcceptanceForm.controls["mailExportAcceptance"]).resetValue([]);
        this.displayTabs = true;
      }
    });
  }

  public patchData(_mailList) {
    for (let element of _mailList) {
      element.select = false;
      element.flagCRUD = "R";
      element.embargoFlag = false;
      element.shipmentType = "MAIL";
      let weightBup: any;
      if (element.lastBagIndicator === 1) {
        element.lastBagIndicator = "Y";
      } else {
        element.lastBagIndicator = "N";
      }
      if (element.registeredIndicator === 1) {
        element.registeredIndicator = "Y";
      } else {
        element.registeredIndicator = "N";
      }
      element.origin = element.origin.substring(2, 5);
      element.destination = element.destination.substring(2, 5);
    }

    this.exportAcceptanceForm.get('originOe1').reset();
    this.exportAcceptanceForm.get('originOe2').reset();
    this.exportAcceptanceForm.get('originOe3').reset();
    this.exportAcceptanceForm.get('destinationOe1').reset();
    this.exportAcceptanceForm.get('destinationOe2').reset();
    this.exportAcceptanceForm.get('destinationOe3').reset();
    this.exportAcceptanceForm.get('mailType').reset();
    this.exportAcceptanceForm.get('dsn').reset();
    this.exportAcceptanceForm.get('rsn').reset();
    this.exportAcceptanceForm.get('pieces').reset();
    this.exportAcceptanceForm.get('uldNumber').reset();
    this.exportAcceptanceForm.get('weight').reset();
    (<NgcFormArray>this.exportAcceptanceForm.controls[
      "mailExportAcceptance"
    ]).reset();

    this.show = true;
    this.displayTabs = true;
    (<NgcFormArray>this.exportAcceptanceForm.get(["mailExportAcceptance"])).patchValue(_mailList);
    this.resetFormMessages();
    this.addbutton = false;
    this.exportAcceptanceForm.get("bup").patchValue(false);
  }

  public onToggleInsert() {
    this.insertionWindow.hide();
  }

  public addNestedId() {
    const request = new MailExportAcceptanceDetails();
    request.uldNumber = this.exportAcceptanceForm.get("nestedStoreLocation").value;
    //request.agentCode = this.exportAcceptanceForm.get("agentCode").value;
    request.agentCode = this.cuscode;
    request.carrierCode = this.exportAcceptanceForm.get("carrierCode").value;
    if (request.uldNumber) {
      request.uldType = this.exportAcceptanceForm
        .get("nestedStoreLocation")
        .value.slice(0, 3);
      request.uldNum = this.exportAcceptanceForm
        .get("nestedStoreLocation")
        .value.slice(3, 8);
      request.uldCarrier = this.exportAcceptanceForm
        .get("nestedStoreLocation")
        .value.slice(8, 10);
      request.uldKey = this.exportAcceptanceForm
        .get("nestedStoreLocation")
        .value
    }
    request.nestedId = this.exportAcceptanceForm.get("nestedId").value;

    this.acceptanceService.updateNestedId(request).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data)
            this.showSuccessStatus("g.completed.successfully");
          this.insertionWindow.hide();
        }
      },
      error => {
        this.showErrorStatus(error);
        this.insertionWindow.hide();
      }
    );
  }

  getCountryCodeDestination(item) {
    this.exportAcceptanceForm.get("destinationOe1").patchValue(item.desc);
  }

  getCountryCodeOrigin(item) {
    this.exportAcceptanceForm.get("originOe1").patchValue(item.desc);
  }

  appendDsnNumber() {
    let dispatchNumber = this.exportAcceptanceForm.get("dsn").value;
    //this.exportAcceptanceForm.get('dsn').patchValue(('0000' + dispatchNumber).slice(-4));
  }

  appendReceptacleNumber() {
    let receptacleNumber = this.exportAcceptanceForm.get("rsn").value;
    //this.exportAcceptanceForm.get('rsn').patchValue(('000' + receptacleNumber).slice(-3));
  }

  onUldNumber(item) {
    if (this.agentModeFlag) {
      if (!this.exportAcceptanceForm.get('agentCode').valid) {
        this.showErrorMessage("enter.agent.name.m");
        return;
      }
    }
    const request: MailExportAcceptanceRequest = new MailExportAcceptanceRequest;
    this.validateLocationWithNoSpecialCharacter(item);
    if (this.specialCharCheck) {
      return;
    }
    request.uldNumber = item;
    this.validContainer = true;
    if (request.uldNumber) {
      this.acceptanceService.fetchUldDetails(request).subscribe(data => {

        if (!this.showResponseErrorMessages(data)) {
          this.validContainer = true;
          if (data.data) {
            if (data.data.flightAssigned) {
              this.showConfirmMessage(NgcUtility.translateMessage('error.uld.already.assigned.confirmation', [data.data.flightKey, data.data.flightDate.substring(0, 10)])).then(fulfilled => {
                if (data.data.intact) {
                  this.exportAcceptanceForm.get('bup').setValue(true);
                }
                this.exportAcceptanceForm.get('bup').disable();
              }).catch(reason => {
                this.exportAcceptanceForm.get('uldNumber').patchValue(null);
                return;
              });
            } else {
              if (data.data.intact) {
                this.exportAcceptanceForm.get('bup').setValue(true);
              }
              this.exportAcceptanceForm.get('bup').disable();
            }
          }

        } else {
          this.validContainer = false;
        }

      }, error => {
        this.showErrorMessage(error);
      })
    }

  }

  setShipmentLocation(item): string {
    let locationType: string;
    let locationnumber: string;
    if (item) {
      locationType = item.substring(0, 2).toUpperCase();
      if ("BT" === locationType || "MT" === locationType) {
        locationnumber = item.substring(2);
        if (locationnumber.length === 1) {
          locationnumber = "000" + locationnumber;
        } else if (locationnumber.length === 2) {
          locationnumber = "00" + locationnumber;
        } else if (locationnumber.length === 3) {
          locationnumber = "0" + locationnumber;
        } else {
          locationnumber = locationnumber;
        }
        item = locationType + locationnumber;
      }
    }
    return item;
  }

  validateLocationWithNoSpecialCharacter(item) {
    let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(item)) {
      this.specialCharCheck = true;
      this.showErrorStatus("expaccpt.invalid.shipment.warehouse.location");
      return;
    } else {
      this.specialCharCheck = false;
      this.refreshFormMessages(item);
    }
  }
  onCancel(event) {
    this.exportAcceptanceForm.reset();
    this.navigateHome();
  }




}
