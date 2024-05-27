import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from "@angular/core";
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcUtility, NgcButtonComponent, PageConfiguration } from "ngc-framework";
import { Router, ActivatedRoute } from '@angular/router';
import { BuildUpMailSearch } from "./../buildup.sharedmodel";
import { BuildupService } from "../buildup.service";
import {
  MailExportAcceptance,
  MailExportAcceptanceRequest,
  MailExportAcceptanceDetails
} from "../../export.sharedmodel";


@Component({
  selector: "app-mail-load-shipment",
  templateUrl: "./mail-load-shipment.component.html",
  styleUrls: ["./mail-load-shipment.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class MailLoadShipmentComponent extends NgcPage implements OnInit {
  uldNumberData: any;
  mailNumber: any;
  arraylist: any;
  flightResponse: any;
  resLoad: any;
  isULDflg: boolean = false;
  isMailflg: boolean = false;
  uldDisabled: boolean = false;

  weightValue: any;
  oe1: any;
  oe2: any;
  oe3: any;
  destOe1: any;
  destOe2: any;
  destOe3: any;
  category: any;
  mailType: any;
  year: any;
  dsn: any;
  rsn: any;
  lastBag: any;
  registerMail: any;
  registerMailValue: any;
  weightNumber: any;
  weightVal: any;
  mailLastBag: any = null;
  mailRegistered: any = null;

  hashTable = {};

  private loadForm: NgcFormGroup = new NgcFormGroup({
    mailBagNumber: new NgcFormControl(),
    flightSegmentId: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(),
    flightOffPoint: new NgcFormControl(),
    dlsCompleted: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    originOe1: new NgcFormControl(),
    originOe2: new NgcFormControl(),
    originOe3: new NgcFormControl(),
    destinationOe1: new NgcFormControl(),
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
    damage: new NgcFormControl(),
    preBookedList: new NgcFormArray([]),
    prebookTotalPieces: new NgcFormControl(),
    prebookTotalWeight: new NgcFormControl(),
    containerList: new NgcFormArray([]),
    containerTotalPieces: new NgcFormControl(),
    containerTotalWeight: new NgcFormControl(),
    dispatchList: new NgcFormArray([]),
    loadedContainerTotalPieces: new NgcFormControl(),
    loadedContainerTotalWeight: new NgcFormControl(),
    mailIndicator: new NgcFormControl(),
    embargoBypassFlag: new NgcFormControl()
  });
  arr: any;
  arr1: any;
  temp: any;
  preList: any = [];
  containerList: any = [];

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private buildUpService: BuildupService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  checkAssignedUldTrolleyToFight() {
    const checkUldAssignmentToFightRequest = new BuildUpMailSearch();
    checkUldAssignmentToFightRequest.uldNumber = this.loadForm.get("uldNumber").value;
    checkUldAssignmentToFightRequest.mailBagNumber = null;
    checkUldAssignmentToFightRequest.shipmentType = "MAIL";
    if (
      checkUldAssignmentToFightRequest.uldNumber == null ||
      checkUldAssignmentToFightRequest.uldNumber == ""
    ) {
      this.isULDflg = false;
      this.isMailflg = false;
    } else {
      this.buildUpService
        .mailFetchFlightDetail(checkUldAssignmentToFightRequest)
        .subscribe(response => {
          this.arraylist = response.data;
          if (this.arraylist == null) {
            this.loadForm.reset();
            this.isULDflg = false;
            this.isMailflg = false;
            this.loadForm.get("dispatchList").patchValue(new Array());
            this.refreshFormMessages(response);
          } else {
            this.resetFormMessages();
            this.isULDflg = true;
            this.isMailflg = false;
            this.uldDisabled = true;
            // this.loadForm.get("dispatchList").patchValue(this.arraylist);
            let prebookTotalPieces = 0;
            let prebookTotalWeight = 0;
            let containerTotalPieces = 0;
            let containerTotalWeight = 0;
            let loadedContainerTotalPieces = 0;
            let loadedContainerTotalWeight = 0;
            this.arraylist.preBookedList.map(element => {
              element.loaded = false;
              prebookTotalPieces = prebookTotalPieces + element.pieces;
              prebookTotalWeight = prebookTotalWeight + element.weight;
            })
            this.arraylist.containerList.map(element => {
              element.loaded = false;
              containerTotalPieces = containerTotalPieces + element.pieces;
              containerTotalWeight = containerTotalWeight + element.weight;
            });
            this.arraylist.dispatchList.map(element => {
              element.loaded = true;
              loadedContainerTotalPieces = loadedContainerTotalPieces + element.pieces;
              loadedContainerTotalWeight = loadedContainerTotalWeight + element.weight;
            });
            this.loadForm.patchValue(this.arraylist);
            this.loadForm.get('containerTotalPieces').patchValue(containerTotalPieces);
            this.loadForm.get('containerTotalWeight').patchValue(containerTotalWeight);
            this.loadForm.get('loadedContainerTotalPieces').patchValue(loadedContainerTotalPieces);
            this.loadForm.get('loadedContainerTotalWeight').patchValue(loadedContainerTotalWeight);
          }
        });
    }
  }

  onAdd(event) {
    const checkMailBagNumber = new BuildUpMailSearch();
    checkMailBagNumber.mailBagNumber = this.loadForm.controls[
      "mailBagNumber"
    ].value;
    if (checkMailBagNumber.mailBagNumber == null) {
      this.showErrorStatus("export.enter.mailbag.number.continue");
    } else {
      checkMailBagNumber.shipmentType = "MAIL";
      this.buildUpService
        .checkMailBagNumber(checkMailBagNumber)
        .subscribe(response => {
          this.flightResponse = response.data;
          if (this.flightResponse == null) {
            this.refreshFormMessages(response);
          } else {
            this.resetFormMessages();
            this.onAddMailBagNumber(checkMailBagNumber.mailBagNumber);
          }
        });
    }
  }

  onAddMailBagNumber(mail: any) {
    const mailBagNum = mail;
    if (!this.hashTable[mailBagNum]) {
      this.hashTable[mailBagNum] = true;
      this.isMailflg = true;
      (<NgcFormArray>this.loadForm.controls["dispatchList"]).addValue([
        {
          select: false,
          dispatchSeries: mailBagNum.slice(0, 20),
          mailbags: [
            {
              select: false,
              number: mailBagNum,
              damage: false,
            }
          ]
        }
      ]);
      this.loadForm.get("mailBagNumber").reset();
    } else {
      this.showErrorStatus("export.enter.new.mailbag.number.continue");
    }
  }

  onTransferMailbag($event) {
    this.arr = this.loadForm.getRawValue().preBookedList;
    this.arr1 = this.loadForm.getRawValue().containerList;
    this.temp = this.loadForm.getRawValue().dispatchList;
    this.preList = [];
    this.containerList = [];
    let totalPiecesToBeLoaded = this.loadForm.get("loadedContainerTotalPieces").value;
    let totalWeightToBeLoaded = this.loadForm.get("loadedContainerTotalWeight").value;
    let totalPiecesAssigned = this.loadForm.get("containerTotalPieces").value;
    let totalWeightAssigned = this.loadForm.get("containerTotalWeight").value;
    this.arr.forEach(value => {
      if (value.check) {
        value.check = false;
        value.flagCRUD = "C";
        this.temp.push(value);
        totalPiecesToBeLoaded = totalPiecesToBeLoaded + value.pieces;
        totalWeightToBeLoaded = totalWeightToBeLoaded + value.weight;
        value.mailbags.forEach(element => {
          element.flagCRUD = "C";
        });
      } else {
        this.preList.push(value);
      }
    });

    let embargoCount = 0;
    this.arr1.forEach(value => {
      if (value.check) {
        if (value.embargoBypassFlag == 1) {
          embargoCount++;
        }
        value.check = false;
        value.flagCRUD = "C";
        totalPiecesToBeLoaded = totalPiecesToBeLoaded + value.pieces;
        totalWeightToBeLoaded = totalWeightToBeLoaded + value.weight;
        totalPiecesAssigned = totalPiecesAssigned - value.pieces;
        totalWeightAssigned = totalWeightAssigned - value.weight;
        this.temp.push(value);
        value.mailbags.forEach(element => {
          element.flagCRUD = "C";
        });
      }
      else {
        this.containerList.push(value);
      }
    });
    if (embargoCount > 0) {
      this.showErrorMessage('export.mailbag.embargo.perform.bypass');
      return;
    }
    this.loadForm.get('loadedContainerTotalPieces').patchValue(totalPiecesToBeLoaded);
    this.loadForm.get('loadedContainerTotalWeight').patchValue(totalWeightToBeLoaded);
    this.loadForm.get('containerTotalPieces').patchValue(totalPiecesAssigned);
    this.loadForm.get('containerTotalWeight').patchValue(totalWeightAssigned);
    (<NgcFormArray>this.loadForm.get('dispatchList')).resetValue([]);
    this.loadForm.get('dispatchList').patchValue(this.temp);
    (<NgcFormArray>this.loadForm.get('preBookedList')).resetValue([]);
    this.loadForm.get('preBookedList').patchValue(this.preList);
    (<NgcFormArray>this.loadForm.get('containerList')).resetValue([]);
    this.loadForm.get('containerList').patchValue(this.containerList);
  }

  onTransferMailbagReverse(item) {
    let remainingBags: Array<any> = this.loadForm.getRawValue().containerList;
    let loadedShipments: Array<any> = this.loadForm.getRawValue().dispatchList;
    let previousLoadedShipments = loadedShipments;
    loadedShipments = loadedShipments.filter(element => {
      return (element.check);
    });
    previousLoadedShipments = previousLoadedShipments.filter(element => {
      return (!element.check);
    })
    if (!loadedShipments || (loadedShipments && loadedShipments.length === 0)) {
      this.showErrorMessage('export.select.one.shipment');
      return;
    }
    for (item of loadedShipments) {
      if (item.loaded) {
        this.showErrorMessage(NgcUtility.translateMessage('error.loaded.shpmnt',[item.dispatchSeries]));
        return;
      }
      item.check = false;
    }
    let piecesToLoaded = this.loadForm.get('loadedContainerTotalPieces').value;
    let weigthToLoaded = this.loadForm.get('loadedContainerTotalWeight').value;
    let assignedPieces = this.loadForm.get('containerTotalPieces').value;
    let assignedWeight = this.loadForm.get('containerTotalWeight').value;
    loadedShipments.forEach(obj => {
      assignedPieces = assignedPieces + obj.pieces;
      assignedWeight = assignedWeight + obj.weight;
      piecesToLoaded = piecesToLoaded - obj.pieces;
      weigthToLoaded = weigthToLoaded - obj.weight;
    });
    if (remainingBags && remainingBags.length > 0) {
      remainingBags.forEach(obj => {
        loadedShipments.push(obj);
      })
    }
    this.loadForm.get('containerTotalPieces').patchValue(assignedPieces);
    this.loadForm.get('containerTotalWeight').patchValue(assignedWeight);
    this.loadForm.get('loadedContainerTotalPieces').patchValue(piecesToLoaded);
    this.loadForm.get('loadedContainerTotalWeight').patchValue(weigthToLoaded);
    this.loadForm.get('containerList').patchValue(loadedShipments);
    this.loadForm.get('dispatchList').patchValue(previousLoadedShipments);
  }

  onMailbagAdd($event) {
    this.oe1 = this.loadForm.get("originOe1").value;
    this.oe2 = this.loadForm.get("originOe2").value;
    this.oe3 = this.loadForm.get("originOe3").value;
    this.destOe1 = this.loadForm.get("destinationOe1").value;
    this.destOe2 = this.loadForm.get("destinationOe2").value;
    this.destOe3 = this.loadForm.get("destinationOe3").value;
    this.category = this.loadForm.get("category").value;
    this.mailType = this.loadForm.get("mailType").value;
    this.year = this.loadForm.get("year").value;
    this.dsn = this.loadForm.get("dsn").value;
    this.rsn = this.loadForm.get("rsn").value;
    this.weightNumber = this.loadForm.get("weight").value;

    if (
      this.weightNumber === null ||
      this.oe2 === null ||
      this.destOe2 === null ||
      this.mailType === null ||
      this.dsn === null ||
      this.rsn === null
    ) {
      this.showErrorStatus("export.input.mailbag.details");
    }
    this.lastBag = this.mailLastBag;
    this.registerMail = this.mailRegistered;
    if (this.loadForm.get("lastBag").value == "No") {
      this.lastBag = '0';
      this.mailLastBag = 'NO';
    }
    if (this.loadForm.get("registerMail").value == "No") {
      this.registerMail = '0';
      this.mailRegistered = 'NO';
    }
    if (this.mailLastBag === null || this.mailRegistered === null) {
      this.showErrorStatus("export.select.last.bag.and.register.mail");
    }


    if (this.registerMail === "1") {
      this.registerMailValue = "Y";
    } else {
      this.registerMailValue = "N";
    }

    if (this.weightNumber % 1 == 0) {
      if (this.weightNumber.toString().length == 1) {
        this.weightNumber = "00" + this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 2) {
        this.weightNumber = "0" + this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 3) {
        this.weightNumber = this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 4) {
        this.weightNumber = this.weightNumber * 10;
      }
    } else {
      if (
        this.weightNumber.toString().length == 3 &&
        this.weightNumber.toString().substr(0, 1) == 0
      ) {
        this.weightNumber = "000" + this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 3) {
        this.weightNumber = "00" + this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 4) {
        this.weightNumber = "0" + this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 5) {
        this.weightNumber = this.weightNumber * 10;
      }
    }

    this.mailNumber = this.oe1.concat(
      this.oe2,
      this.oe3,
      this.destOe1,
      this.destOe2,
      this.destOe3,
      this.category,
      this.mailType,
      this.year,
      this.dsn,
      this.rsn,
      this.lastBag,
      this.registerMail,
      this.weightNumber
    );
    const checkMailBagNumber = new BuildUpMailSearch();
    checkMailBagNumber.mailBagNumber = this.mailNumber;
    checkMailBagNumber.shipmentType = "MAIL";
    this.buildUpService
      .checkMailBagNumber(checkMailBagNumber)
      .subscribe(response => {
        this.flightResponse = response.data;
        if (this.flightResponse == null) {
          this.refreshFormMessages(response);
        } else {
          this.resetFormMessages();
          this.onAddMailBagNumberDetail(this.mailNumber);
        }
      });
  }

  onAddMailBagNumberDetail(mailBag) {
    if (!this.hashTable[mailBag]) {
      this.hashTable[mailBag] = true;
      this.isMailflg = true;
      (<NgcFormArray>this.loadForm.controls["dispatchList"]).addValue([
        {
          select: false,
          dispatchSeries: mailBag.slice(0, 20),
          mailbags: [
            {
              select: false,
              number: mailBag,
              damage: false,
            }
          ]
        }
      ]);
      // this.loadForm.get("mailBagNumber").patchValue(null);
    } else {
      this.showErrorStatus("export.enter.new.mailbag.number.continue");
    }
  }

  insertRecord() {
    const buildUpMailSearch = new BuildUpMailSearch();
    buildUpMailSearch.uldNumber = this.loadForm.get("uldNumber").value;
    buildUpMailSearch.flightKey = this.loadForm.get("flightKey").value;
    buildUpMailSearch.carrierCode = this.arraylist.carrierCode;
    buildUpMailSearch.mailIndicator = 'MAIL';
    buildUpMailSearch.flightOriginDate = this.loadForm.get(
      "flightOriginDate"
    ).value;
    buildUpMailSearch.flightOffPoint = this.loadForm.get(
      "flightOffPoint"
    ).value;
    let mailBagNumber = new Array();
    this.loadForm.get("dispatchList").value.forEach(mailbag => {
      mailbag.mailbags.forEach(number => {
        if (number["flagCRUD"] === "C") {
          mailBagNumber.push(number.number);
        }
      });
    });
    buildUpMailSearch.mailbagId = mailBagNumber;
    buildUpMailSearch.flightId = this.arraylist.flightId;
    buildUpMailSearch.segmentId = this.arraylist.segmentId;
    buildUpMailSearch.dispatchList = this.loadForm.get(['dispatchList']).value;
    this.buildUpService
      .mailInsertLoad(buildUpMailSearch)
      .subscribe(response => {
        this.resLoad = response;
        if (this.resLoad && this.resLoad.messageList && this.resLoad.messageList.length > 0) {
          this.refreshFormMessages(response);
        } else {
          this.showSuccessStatus("g.completed.successfully");
          // this.loadForm.reset();
          this.isULDflg = false;
          this.isMailflg = false;
          this.uldDisabled = false;
          this.checkAssignedUldTrolleyToFight();
        }
      });
  }

  onLastBag(event) {
    this.mailLastBag = event.desc;
    if (this.mailLastBag === "Yes") {
      this.mailLastBag = "1";
    } else {
      this.mailLastBag = "0";
    }
  }

  onRegisteredBag(event) {
    this.mailRegistered = event.desc;
    if (this.mailRegistered === "No") {
      this.mailRegistered = "0";
    } else {
      this.mailRegistered = "1";
    }
  }

  getCountryCodeDestination(item) {
    this.loadForm.get("destinationOe1").patchValue(item.desc);
  }

  getCountryCodeOrigin(item) {
    this.loadForm.get("originOe1").patchValue(item.desc);
  }
  appendDsnNumber() {
    let dispatchNumber = this.loadForm.get("dsn").value;
    if (dispatchNumber.length === 1) {
      this.loadForm.get("dsn").patchValue("000" + dispatchNumber);
    } else if (dispatchNumber.length === 2) {
      this.loadForm.get("dsn").patchValue("00" + dispatchNumber);
    } else if (dispatchNumber.length === 3) {
      this.loadForm.get("dsn").patchValue("0" + dispatchNumber);
    }
  }
  appendRsnNumber() {
    let receptacleNumber = this.loadForm.get("rsn").value;
    if (receptacleNumber.length === 1) {
      this.loadForm.get("rsn").patchValue("00" + receptacleNumber);
    } else if (receptacleNumber.length === 2) {
      this.loadForm.get("rsn").patchValue("0" + receptacleNumber);
    }
  }
  captureDamage(index, subIndex) {
    const request: any = {};
    request.entityKey = this.loadForm.get(['dispatchList', index, 'mailbags', subIndex, 'number']).value;
    request.entityType = "MBN";
    let event = request;
    this.navigateTo(this.router, "/common/capturedamageDesktop", event);
  }

  uldMaskingForBTandMT(uld) {
    if (uld == null || uld == '') {
      return;
    }
    else {
      let btChar = uld.substring(0, 2).toUpperCase();
      if (btChar === 'BT' || btChar === 'MT') {
        let num = uld.substring(2, 6);
        if (num.length < 4) {
          let maskedUld = btChar + ("0000" + num).slice(-4);
          this.loadForm.get("uldNumber").setValue(maskedUld);
        }
      }
    }
  }

  /**
       *
       *This method is used to Clear the filled customer Code and Name
       * @memberof MaintainAgentLocationComponent
       */
  // onClear(): void {
  //   this.loadForm.reset();
  //   this.resetFormMessages();
  //   this.isULDflg = false;
  //   this.isMailflg = false;
  //   this.uldDisabled = false;
  // }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    let routeData = this.getNavigateData(this.activeRoute);
    if (routeData) {
      let _screen = routeData.screen;
      if (_screen === "LyingList") {
        // let _lynListArray = _screen.lyingListContainerFormArray;
        // console.log(_lynListArray);

        routeData.lyingListContainerFormArray.forEach(element => {
          if (element.storeLocation != null) {
            this.loadForm.get("uldNumber").setValue(element.storeLocation);
          }
        });
        this.checkAssignedUldTrolleyToFight();
        routeData.lyingListContainerFormArray.forEach(element => {
          element.lyingListShipment.forEach(element => {
            this.loadForm.get("mailBagNumber").setValue(element.mailBagNumber);
            this.onAdd(null);
          });
        });
      }
    }
  }
}
