import { NgcFormControl, NgcULDInputComponent } from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";
import { UldMovement, MovementsUldEnquires } from "./../uld.shared";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  ViewChildren,
  QueryList
} from "@angular/core";
// NGC framework imports
import {
  NgcPage,
  NgcFormGroup,
  NgcWindowComponent,
  NgcFormArray,
  NgcDropDownComponent,
  NgcUtility,
  NgcButtonComponent,
  PageConfiguration
} from "ngc-framework";
import { Validators, ValidatorFn, AbstractControl } from "@angular/forms";
import { UldService } from "../uld.service";
/* constructor for dependency injection */
@Component({
  selector: "app-uldmovment",
  templateUrl: "./uldmovment.component.html",
  styleUrls: ["./uldmovment.component.scss"]
})
/* page configuration on page initialization */
@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true,
  focusToBlank: true,
  focusToMandatory: true
})
export class UldMovmentComponent extends NgcPage {
  /* opening of history pop up */
  @ViewChild('historyPopUp') historyPopUp: NgcWindowComponent;
  /* list of uld inputs */
  @ViewChildren('uld') uldInputList: QueryList<NgcULDInputComponent>;
  /* this flag is used for enabling and disabling of new ulds and uld in inventory with last movement grids */
  movementListFlag = false;
  initialFocus: boolean = false;
  /* this flag is used for enabling and disabling of movement type dropdowns */
  createuldsection: boolean = false;
  createnewdata: any;
  /* this is used for sending data to uld movement history screen to open it as a pop up screen  */
  inputData = null;
  /* this form is used for all the operations in capture multiple uld in out movements screen */
  private uldmovementform: NgcFormGroup = new NgcFormGroup({
    uldNumberConcat: new NgcFormControl(),
    movementDateTime: new NgcFormControl(),
    movementType: new NgcFormControl(),
    movementDescription: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    segments: new NgcFormControl(),
    conditionType: new NgcFormControl(),
    contentCode: new NgcFormControl(),
    airportPosition: new NgcFormControl(),
    usedBy: new NgcFormControl(),
    remarks: new NgcFormControl(),
    reserved: new NgcFormControl(),
    uldNumbers: new NgcFormArray([]),
    departureflight: new NgcFormControl(),
    reserve: new NgcFormControl(),
    movementdescription: new NgcFormControl(),
    flight: new NgcFormControl(),
    flightdate: new NgcFormControl(),
    selectinmovement: new NgcFormControl(),
    selectmovement: new NgcFormControl(),
    wareHouseLocation: new NgcFormControl(),
    uldMovement: new NgcFormArray([]),
    movementList: new NgcFormArray([]),
    uldLastMovementList: new NgcFormArray([]),
    dateForNew: new NgcFormControl(),
    flightInFlightKey: new NgcFormControl(),
    flightInArrivalDate: new NgcFormControl(),
    flightInOriginAirportId: new NgcFormControl(),
    flightInOriginAirport: new NgcFormControl(),
    flightOutFlightKey: new NgcFormControl(),
    flightOutDepartureDate: new NgcFormControl(),
    flightOutDestinationAirportId: new NgcFormControl(),
    flightOutDestinationAirport: new NgcFormControl(),
    uldNumber: new NgcFormControl("", [
      Validators.maxLength(11)
    ]),
    agent: new NgcFormControl(),

  });
  /* constructor for dependency injection */
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private uldService: UldService
  ) {
    super(appZone, appElement, appContainerElement);
  }
  /* Oninit function */
  ngOnInit() {
    super.ngOnInit();
    for (let i = 0; i < 15; i++) {
      (<NgcFormArray>this.uldmovementform.get('uldNumbers')).addValue([
        {
          uldNumberConcat: ''
        }
      ]);
    }
    this.createnewdata = this.getNavigateData(this.activatedRoute);
    if (this.createnewdata) {
      (<NgcFormControl>this.uldmovementform.get(["uldNumbers", 0, "uldNumberConcat"])).setValue(this.createnewdata.uldNumber);
      this.onSearch();
    }
  }

  /* this method is used to point to the first field after saving of the record*/
  public afterFocus() {
    if (!this.initialFocus && this.uldInputList.length > 0) {
      this.uldInputList.first.focus();
      this.initialFocus = true;
    }
  }
  /* this method is used for save of different movement types */
  onSave() {
    this.resetFormMessages();
    const searchFormGroup = null;
    let movementList = (<NgcFormArray>this.uldmovementform.get("movementList")).value.filter(temp => temp.flagCRUD != 'D')
    // check for length of newUld array
    // if it is greater than 0   
    if (movementList.length > 0) {
      this.uldmovementform.validate();
      if (this.uldmovementform.invalid) {
        return;
      }
    } else {
      // if it is not greater than 0
      (<NgcFormControl>this.uldmovementform.get(['movementType'])).setValidators([]);
      (<NgcFormControl>this.uldmovementform.get(['selectinmovement'])).setValidators([]);
      const searchFormGroup: NgcFormArray = (<NgcFormArray>this.uldmovementform.get('movementList'));
      searchFormGroup.validate();
      if (searchFormGroup.invalid) {
        return;
      }
    }
    let uldLastMovementList = (<NgcFormArray>this.uldmovementform.get("uldLastMovementList")).value.filter(temp => temp.flagCRUD != 'D')
    uldLastMovementList.forEach(element => {
      movementList.push(element);
    });
    let request = new UldMovement();
    request.uldMovement = [];
    let movementulds = [];

    /* prepare request  for INW movement type */
    let requestINW: any = this.createRequest(movementList, movementulds, "INW", "D", "C");
    if (requestINW.movementList.length > 0) {
      /* Api call for INW movement type */
      this.uldService.feedNewUld(requestINW).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          if (response.success) {
            this.showSuccessStatus("g.operation.successful");
            this.initialFocus = false;
            this.afterFocus();
            this.resetFields(['remarks', 'selectinmovement', 'movementType',
              'conditionType', 'airportPosition', 'contentCode',
              'usedBy', 'wareHouseLocation'])
          }
        }
      },
        error => {
          this.showErrorMessage(error);
        }
      );
    }
    // prepare IFL request
    let requestIFL: any = this.createRequest(movementList, movementulds, "IFL", "D", "C");
    if (requestIFL.movementList.length > 0) {
      /* Api call for IFL movement type */
      this.uldService.checkDulicateInFlightMovement(requestIFL).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          let flag: boolean = false;
          if (data.data.duplicateInMovementCheck) {
            this.insertForFlightInForAssignFlight(data.data);
          } else {
            this.showSuccessStatus('g.operation.successful');
            this.resetFields(['remarks', 'selectinmovement', 'movementType',
              'conditionType', 'airportPosition', 'contentCode',
              'flightInFlightKey', 'flightInArrivalDate', 'flightInOriginAirportId'])
          }
        }
      },
        error => {
          this.showErrorMessage(error);
        }
      );
    }
    // prepare request for inmovement type without IFL and INW 
    let requestinmovement = new UldMovement();
    movementList.forEach(element => {
      if ((element.movementType == "IFN")
        || (element.movementType == "IGH")
        || (element.movementType == "IRA")
        || (element.movementType == "IRW")
        || (element.movementType == "IFW")
        || (element.movementType == "IRF")) {
        if (element.flagCRUD != 'D') {
          if (element.contentCode == null) {
            element.contentCode = "C"
          }
          movementulds.push({
            flagCRUD: 'U',
            uldNumberConcat: element.uldNumberConcat,
            movementType: element.movementType
          });
        }
      }
    });
    let inmovementlist = null;
    let inmovementuld = null;
    inmovementlist = movementList.filter(element => (element.movementType == "IFN") || (element.movementType == "IGH")
      || (element.movementType == "IFW") || (element.movementType == "IRA") || (element.movementType == "IRW")
      || (element.movementType == "IRF"));
    inmovementuld = movementulds.filter(element => (element.movementType == "IFN") || (element.movementType == "IGH")
      || (element.movementType == "IFW") || (element.movementType == "IRA") || (element.movementType == "IRW")
      || (element.movementType == "IRF"));
    if (inmovementlist.length > 0) {
      requestinmovement.movementList = inmovementlist;
      requestinmovement.uldMovement = inmovementuld;
      /* Api call for other movement types except INW and IFL */
      this.uldService.checkDuplicateInMovement(requestinmovement).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data.data.duplicateInMovementCheck) {
            this.insertCreateInMovement(data.data);
          } else {
            this.showSuccessStatus('g.operation.successful');
            this.resetFields(['remarks', 'selectinmovement', 'movementType'])
          }
        }
      },
        error => {
          this.showErrorMessage(error);
        }
      );
    }
    let requestdeletemovement: any = this.createRequest(movementList, movementulds, "ODL", "D", "C");
    if (requestdeletemovement.movementList.length > 0) {
      /*Api call for ODL */
      this.uldService.checkDuplicateOutMovementForDeleteUld(requestdeletemovement).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data.data.duplicateOutMovementCheck) {
            this.insertDeleteUld(requestdeletemovement);
          } else {
            this.showSuccessStatus('g.operation.successful');
            this.initialFocus = false;
            this.afterFocus();
            this.resetFields(['remarks', 'selectinmovement', 'movementType',])

          }
        }
      },
        error => {
          this.showErrorMessage(error);
        }
      );
    }
    let requestOFL: any = this.createRequest(movementList, movementulds, "OFL", "D", "C");
    if (requestOFL.movementList.length > 0) {
      /*Api call for OFL */
      this.uldService.checkDulicateOutFlightMovement(requestOFL).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data.data.duplicateOutMovementCheck) {
            this.insertForFlightOutForAssignFlight(data.data);
          }
          else {
            this.showSuccessStatus('g.operation.successful');
            this.resetFields(['remarks', 'selectinmovement', 'movementType',
              'conditionType', 'airportPosition', 'contentCode',
              'flightOutFlightKey', 'flightOutDepartureDate', 'flightOutDestinationAirportId'
              , 'reserve'])
          }
        }
      },
        error => {
          this.showErrorMessage(error);
        }
      );
    }
    let requestoutmovement = new UldMovement();
    movementList.forEach(element => {
      if ((element.movementType == "OLS")
        || (element.movementType == "OLW")
        || (element.movementType == "ORP")
        || (element.movementType == "ORA")
        || (element.movementType == "OGH")) {
        if (element.flagCRUD != 'D') {
          if (element.contentCode == null) {
            element.contentCode = "C"
          }
          movementulds.push({
            flagCRUD: 'U',
            uldNumberConcat: element.uldNumberConcat,
            movementType: element.movementType
          });
        }
      }
    });
    let outmovementlist = null;
    let outmovementulds = null;
    outmovementlist = movementList.filter(element => (element.movementType == "OLS")
      || (element.movementType == "OLW")
      || (element.movementType == "ORP")
      || (element.movementType == "ORA")
      || (element.movementType == "OGH"));
    outmovementulds = movementulds.filter(element => (element.movementType == "OLS")
      || (element.movementType == "OLW")
      || (element.movementType == "ORP")
      || (element.movementType == "ORA")
      || (element.movementType == "OGH"));
    if (outmovementlist.length > 0) {
      requestoutmovement.movementList = outmovementlist;
      requestoutmovement.uldMovement = outmovementulds;
      /*Api call for out movement types except ODL and OFL*/
      this.uldService.checkDuplicateOutMovement(requestoutmovement).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data.data.duplicateOutMovementCheck) {
            this.insertCreateOutMovement(data.data);
          } else {
            this.showSuccessStatus('g.operation.successful');
            this.resetFields(['remarks', 'selectinmovement', 'movementType', 'agent'])
          }
        }
      },
        error => {
          this.showErrorMessage(error);
        }
      );
    }
  }
  /* this method is used for the saving the records for ODL movement type */
  insertDeleteUld(request) {
    this.uldService.deleteUld(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.success) {
          this.showSuccessStatus("g.operation.successful");
          this.resetFields(['remarks', 'selectinmovement', 'movementType',])
        }
      }
    },
      error => {
        this.showErrorMessage(error);
      }
    );
  }
  /* this method is used for the checking whether the flight is already assigned and saving the records for OFL movement type */
  insertForFlightOutForAssignFlight(request) {
    this.uldService.assignFlight(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {

        if (data.data.inMovementCheck) {
          this.showSuccessStatus("g.operation.successful");
          this.resetFields(['remarks', 'selectinmovement', 'movementType',
            'conditionType', 'airportPosition', 'contentCode',
            'flightOutFlightKey', 'flightOutDepartureDate', 'flightOutDestinationAirportId'
            , 'reserve'])
        }
        if (!data.data.inMovementCheck) {
          this.showSuccessStatus("g.operation.successful");
          this.insertFlightOut(data.data);
          this.resetFields(['remarks', 'selectinmovement', 'movementType',
            'conditionType', 'airportPosition', 'contentCode',
            'flightOutFlightKey', 'flightOutDepartureDate', 'flightOutDestinationAirportId'
            , 'reserve'])

        }
      }

    },
      error => {
        this.showErrorMessage(error);
      }
    );
  }
  /* this method is used for the saving the records for OFL movement type */
  insertFlightOut(request) {
    this.uldService.feedFlightOutUld(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.success) {
          this.showSuccessStatus('g.operation.successful');
          this.resetFields(['remarks', 'selectinmovement', 'movementType',
            'conditionType', 'airportPosition', 'contentCode',
            'flightOutFlightKey', 'flightOutDepartureDate', 'flightOutDestinationAirportId'
            , 'reserve'])
        }
      }
    })
  }
  /* this method is used for the saving the records for in movement type except IFL and INW */
  insertCreateInMovement(request) {
    this.uldService.feedInReturnFromWorkshop(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.success) {
          this.showSuccessStatus("g.operation.successful");
          this.resetFields(['remarks', 'selectinmovement', 'movementType',])
        }
      }
    })
  }
  /* this method is used for the saving the records for out movement type except ODL,OFL */
  insertCreateOutMovement(request) {
    this.uldService.feedRepairUld(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.success) {
          this.showSuccessStatus("g.operation.successful");
          this.resetFields(['remarks', 'selectinmovement', 'movementType', 'agent'])
        }
      }
    })
  }
  /* this method is used for the checking whether the flight is already assigned and saving the records for IFL movement type */
  insertForFlightInForAssignFlight(request) {
    this.uldService.checkAssignFlightForInFlight(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        let flag: boolean = false;
        if (data.data.inMovementCheck) {
          flag = true;
          if (flag) {
            this.insertFlightIn(data.data);
          }
        }
        if (!data.data.inMovementCheck) {
          this.showSuccessStatus("g.operation.successful");
          this.resetFields(['remarks', 'selectinmovement', 'movementType',
            'conditionType', 'airportPosition', 'contentCode',
            'flightInFlightKey', 'flightInArrivalDate', 'flightInOriginAirportId'])
        }
      }
    },
      error => {
        this.showErrorMessage(error);
      }
    );
  }
  /* this method is used for the saving the records for IFL movement type */
  insertFlightIn(request) {
    this.uldService.feedFlightInUld(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.success) {
          this.showSuccessStatus("g.operation.successful");
          this.resetFields(['remarks', 'selectinmovement', 'movementType',
            'conditionType', 'airportPosition', 'contentCode',
            'flightInFlightKey', 'flightInArrivalDate', 'flightInOriginAirportId'])
        }
      }
    },
      error => {
        this.showErrorMessage(error);
      }
    );
  }

  onCancel(event) {
    this.navigateTo(this.router, '/', null);
  }
  /* this method is used for setting the  origin airport description  in the origin airport field */
  getIncomingFlightOffPoint(event) {
    this.uldmovementform.get("flightInOriginAirport").setValue(event.desc);
  }
  /* this method is used for setting the  destination airport description  in the destination airport field */
  getOutgoingFlightOffPoint(event) {
    this.uldmovementform.get("flightOutDestinationAirport").setValue(event.desc);
  }
  /* On search : called when search is clicked */
  onSearch() {
    this.resetFormMessages();
    let array = [];
    this.uldmovementform.getList('uldNumbers').forEach(uld => {
      if (uld.value.uldNumberConcat != "" && uld.value.uldNumberConcat != null) {
        array.push(uld.value);
      }
    });
    if (array.length < 1) {
      this.showErrorMessage('please.enter.atleast.one.uld.number');
      return;
    }
    let requestData: any = new MovementsUldEnquires();
    requestData = array;
    this.uldService.searchInOutMovementUld(requestData).subscribe(res => {
      if (res.data.oldUldList) {
        this.movementListFlag = true;
        this.createuldsection = true;
        (<NgcFormArray>this.uldmovementform.controls['uldLastMovementList']).patchValue(res.data.oldUldList);
        res.data.oldUldList.forEach(element => {
          element.movementDateTime = NgcUtility.toDateFromLocalDate(element.movementDateTime);
          if (element.movementType == 'IFN' ||
            (element.movementType == 'IFW')
            || (element.movementType == 'IGH')
            || (element.movementType == 'INW')
            || (element.movementType == 'IRA')
            || (element.movementType == 'IRW')
            || (element.movementType == 'IRF')
            || (element.movementType == 'ODL')
            || (element.movementType == 'OGH')
            || (element.movementType == 'OLS')
            || (element.movementType == 'OLW')
            || (element.movementType == 'ORA')
            || (element.movementType == 'ORP')) {
            element.flightKey = null;
            element.newflightDate = null;
          }
        });
      }
      if (res.data.newUldList) {
        this.movementListFlag = true;
        this.createuldsection = true;
        if (res.data.newUldList.length > 0) {
          (<NgcFormControl>this.uldmovementform.get(['movementType'])).setValidators([Validators.required]);
          (<NgcFormControl>this.uldmovementform.get(['selectinmovement'])).setValidators([Validators.required]);
        }
        (<NgcFormArray>this.uldmovementform.controls['movementList']).patchValue(res.data.newUldList);
        res.data.newUldList.forEach(element => {
          element.movementDateTime = NgcUtility.toDateFromLocalDate(element.movementDateTime);
        });
      }

    })

  }
  /* onUpdate method is called when update button is clicked*/
  onUpdate() {
    let uldNumbers = (<NgcFormArray>this.uldmovementform.get("movementList")).value;
    let uldlastmovementlist = (<NgcFormArray>this.uldmovementform.get("uldLastMovementList")).value;
    let formData = this.uldmovementform.getRawValue();
    let conditiontype = formData.conditionType;
    let remarks = formData.remarks;
    let airportposition = formData.airportPosition;
    let contentCode = formData.contentCode;
    let usedBy = formData.usedBy;
    let date = formData.dateForNew;
    let warehouselocation = formData.wareHouseLocation;
    let movementtype = formData.selectinmovement
    let originAirport = formData.flightInOriginAirport
    let destinationAirport = formData.flightOutDestinationAirport
    let movement = formData.movementType
    var parameters = { 'parameter1': movement, 'parameter2': movementtype };
    if (movementtype == "IFN") {
      airportposition = "APRON"
    }
    if ((movementtype === "IFW")
      || (movementtype === "IGH")
      || (movementtype === "IRA")
      || (movementtype === "IRW")
      || (movementtype === "IRF")) {
      airportposition = "CARGO"
    }
    if ((movementtype === "IFN")
      || (movementtype === "IFW")
      || (movementtype === "IGH")
      || (movementtype === "IRA")
      || (movementtype === "IRW")
      || (movementtype === "IRF")) {
      contentCode = "C"
    }
    let arrivalflight = formData.flightInFlightKey;
    let departureflight = formData.flightOutFlightKey;
    let arrivaldate = formData.flightInArrivalDate;
    let departuredate = formData.flightOutDepartureDate;
    let reserve = formData.reserve;
    let agent = formData.agent;
    for (let i = 0; i < uldNumbers.length; i++) {
      if ((movementtype === "IFN")
        || (movementtype === "IFW")
        || (movementtype === "IGH")
        || (movementtype === "IRA")
        || (movementtype === "IRW")
        || (movementtype === "INW")
        || (movementtype === "IRF")) {
        this.uldmovementform.get(['movementList', i, 'conditionType']).patchValue("Serviceable")
      } else {
        this.uldmovementform.get(['movementList', i, 'conditionType']).patchValue(conditiontype)
      }
      this.uldmovementform.get(['movementList', i, 'remarks']).patchValue(remarks)
      this.uldmovementform.get(['movementList', i, 'agent']).patchValue(agent);
      this.uldmovementform.get(['movementList', i, 'wareHouseLocation']).patchValue(warehouselocation);
      this.uldmovementform.get(['movementList', i, 'airportPosition']).patchValue(airportposition)
      this.uldmovementform.get(['movementList', i, 'contentCode']).patchValue(contentCode);
      this.uldmovementform.get(['movementList', i, 'usedBy']).patchValue(usedBy);
      this.uldmovementform.get(['movementList', i, 'movementDateTime']).patchValue(date);
      this.uldmovementform.get(['movementList', i, 'movementType']).patchValue(movementtype);
      this.retrieveDropDownListRecords('INOUTMOVEMENTTYPEDROPDOWN', 'query', parameters).subscribe(data => {
        this.uldmovementform.get(['movementList', i, 'movementDescription']).setValue(data[0].parameter3);
      })
      if (movementtype === "IFL") {
        this.uldmovementform.get(['movementList', i, 'originAirport']).patchValue(originAirport);
        this.uldmovementform.get(['movementList', i, 'flightKey']).patchValue(arrivalflight);
        this.uldmovementform.get(['movementList', i, 'newflightDate']).patchValue(arrivaldate);
      }
      this.uldmovementform.get(['movementList', i, 'reserved']).patchValue(reserve);
      if (movementtype === "OFL") {
        this.uldmovementform.get(['movementList', i, 'flightKey']).patchValue(departureflight);
        this.uldmovementform.get(['movementList', i, 'newflightDate']).patchValue(departuredate);
        this.uldmovementform.get(['movementList', i, 'destAirport']).patchValue(destinationAirport);
      }

    }
    for (let i = 0; i < uldlastmovementlist.length; i++) {
      this.uldmovementform.get(['uldLastMovementList', i, 'movementType']).patchValue(movementtype);
      if (movementtype === "INW") {
        this.uldmovementform.get(['uldLastMovementList', i, 'remarks']).patchValue(remarks)
        this.uldmovementform.get(['uldLastMovementList', i, 'airportPosition']).patchValue(airportposition)
        this.uldmovementform.get(['uldLastMovementList', i, 'contentCode']).patchValue(contentCode);
        this.uldmovementform.get(['uldLastMovementList', i, 'usedBy']).patchValue(usedBy);
        this.uldmovementform.get(['uldLastMovementList', i, 'movementDateTime']).patchValue(date);
        this.uldmovementform.get(['uldLastMovementList', i, 'wareHouseLocation']).patchValue(warehouselocation);
      }
      if (movementtype === "IFL") {
        this.uldmovementform.get(['uldLastMovementList', i, 'originAirport']).patchValue(originAirport);
        this.uldmovementform.get(['uldLastMovementList', i, 'flightKey']).patchValue(arrivalflight);
        this.uldmovementform.get(['uldLastMovementList', i, 'newflightDate']).patchValue(arrivaldate);
        this.uldmovementform.get(['uldLastMovementList', i, 'remarks']).patchValue(remarks)
        this.uldmovementform.get(['uldLastMovementList', i, 'movementDateTime']).patchValue(date);
        this.uldmovementform.get(['uldLastMovementList', i, 'conditionType']).patchValue(conditiontype)
        this.uldmovementform.get(['uldLastMovementList', i, 'airportPosition']).patchValue(airportposition)
        this.uldmovementform.get(['uldLastMovementList', i, 'contentCode']).patchValue(contentCode);

      }
      if (movementtype === "OFL") {
        this.uldmovementform.get(['uldLastMovementList', i, 'reserved']).patchValue(reserve);
        this.uldmovementform.get(['uldLastMovementList', i, 'destAirport']).patchValue(destinationAirport);
        this.uldmovementform.get(['uldLastMovementList', i, 'flightKey']).patchValue(departureflight);
        this.uldmovementform.get(['uldLastMovementList', i, 'newflightDate']).patchValue(departuredate);
        this.uldmovementform.get(['uldLastMovementList', i, 'remarks']).patchValue(remarks)
        this.uldmovementform.get(['uldLastMovementList', i, 'movementDateTime']).patchValue(date);
        this.uldmovementform.get(['uldLastMovementList', i, 'conditionType']).patchValue(conditiontype)
        this.uldmovementform.get(['uldLastMovementList', i, 'airportPosition']).patchValue(airportposition)
        this.uldmovementform.get(['uldLastMovementList', i, 'contentCode']).patchValue(contentCode);
      }
      if (movementtype === "ODL") {
        this.uldmovementform.get(['uldLastMovementList', i, 'remarks']).patchValue(remarks)
        this.uldmovementform.get(['uldLastMovementList', i, 'movementDateTime']).patchValue(date);
        this.uldmovementform.get(['uldLastMovementList', i, 'flightKey']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'newflightDate']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'segments']).patchValue(null);

      }
      if ((movementtype === "IFN")
        || (movementtype === "IFW")
        || (movementtype === "IGH")
        || (movementtype === "IRW")
        || (movementtype === "IRF")) {
        this.uldmovementform.get(['uldLastMovementList', i, 'remarks']).patchValue(remarks)
        this.uldmovementform.get(['uldLastMovementList', i, 'movementDateTime']).patchValue(date);
        this.uldmovementform.get(['uldLastMovementList', i, 'flightKey']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'newflightDate']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'segments']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'agent']).patchValue(null);
      }
      if ((movementtype === "OLS")
        || (movementtype === "OLW")
        || (movementtype === "ORP")
        || (movementtype === "OGH")) {
        this.uldmovementform.get(['uldLastMovementList', i, 'remarks']).patchValue(remarks)
        this.uldmovementform.get(['uldLastMovementList', i, 'movementDateTime']).patchValue(date);
        this.uldmovementform.get(['uldLastMovementList', i, 'flightKey']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'newflightDate']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'segments']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'agent']).patchValue(null);

      }
      if (movementtype === "IRA") {
        this.uldmovementform.get(['uldLastMovementList', i, 'agent']).patchValue(agent);
        this.uldmovementform.get(['uldLastMovementList', i, 'remarks']).patchValue(remarks)
        this.uldmovementform.get(['uldLastMovementList', i, 'movementDateTime']).patchValue(date);
        this.uldmovementform.get(['uldLastMovementList', i, 'flightKey']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'newflightDate']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'segments']).patchValue(null);
      }
      if (movementtype === "ORA") {
        this.uldmovementform.get(['uldLastMovementList', i, 'agent']).patchValue(agent);
        this.uldmovementform.get(['uldLastMovementList', i, 'remarks']).patchValue(remarks)
        this.uldmovementform.get(['uldLastMovementList', i, 'movementDateTime']).patchValue(date);
        this.uldmovementform.get(['uldLastMovementList', i, 'flightKey']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'newflightDate']).patchValue(null);
        this.uldmovementform.get(['uldLastMovementList', i, 'segments']).patchValue(null);
      }
      this.retrieveDropDownListRecords('INOUTMOVEMENTTYPEDROPDOWN', 'query', parameters).subscribe(data => {
        this.uldmovementform.get(['uldLastMovementList', i, 'movementDescription']).setValue(data[0].parameter3);
      })
    }
  }
  /* this method is called when the movementtypes is selected from select In/Out movement dropdown*/
  getNextInMovementFlightData(event) {
    this.uldmovementform.get('dateForNew').patchValue(this.getUserProfile().loginTime);
    let movementtype = this.uldmovementform.get('selectinmovement').value;
    /* setting and removing of the validators based on the selected movement type*/
    if (movementtype == "IFL") {
      this.setValidatorsRequired(true, ['flightInFlightKey', 'flightInArrivalDate', 'flightInOriginAirportId', 'airportPosition', 'dateForNew']);
      this.setValidatorsRequired(false, ['flightOutFlightKey', 'flightOutDepartureDate', 'flightOutDestinationAirportId', 'flightOutDestinationAirport']);
      this.resetFieldsforMovements()
    }
    else if (movementtype == "INW") {
      this.setValidatorsRequired(true, ['airportPosition', 'dateForNew']);
      this.setValidatorsRequired(false, ['flightInFlightKey', 'flightInArrivalDate', 'flightInOriginAirportId', 'flightInOriginAirport', 'flightOutFlightKey', 'flightOutDepartureDate', 'flightOutDestinationAirportId', 'flightOutDestinationAirport']);
      this.resetFieldsforMovements()
    }
    else if ((movementtype === "IFN")
      || (movementtype === "IFW")
      || (movementtype === "IGH")
      || (movementtype === "IRA")
      || (movementtype === "IRW")
      || (movementtype === "IRF")) {
      this.setValidatorsRequired(true, ['dateForNew']);
      this.setValidatorsRequired(false, ['airportPosition', 'flightInFlightKey', 'flightInArrivalDate', 'flightInOriginAirportId', 'flightInOriginAirport', 'flightOutFlightKey', 'flightOutDepartureDate', 'flightOutDestinationAirportId', 'flightOutDestinationAirport']);
      this.resetFieldsforMovements()
    }
    else if (movementtype == "OFL") {
      this.setValidatorsRequired(true, ['airportPosition', 'dateForNew', 'flightOutFlightKey', 'flightOutDepartureDate', 'flightOutDestinationAirportId']);
      this.setValidatorsRequired(false, ['flightInFlightKey', 'flightInArrivalDate', 'flightInOriginAirportId', 'flightInOriginAirport',]);
      this.resetFieldsforMovements()
    }
    else if ((movementtype === "OLS")
      || (movementtype === "OLW")
      || (movementtype === "ORP")
      || (movementtype === "OGH")
      || (movementtype === "ODL")
      || (movementtype === "ORA")) {
      this.setValidatorsRequired(true, ['dateForNew']);
      this.setValidatorsRequired(false, ['airportPosition', 'flightInFlightKey', 'flightInArrivalDate', 'flightInOriginAirportId', 'flightInOriginAirport', 'flightOutFlightKey', 'flightOutDepartureDate', 'flightOutDestinationAirportId', 'flightOutDestinationAirport']);
      this.resetFieldsforMovements()
    }
  }
  /* this method is used for deleting the particular row for movement list and uld in inventory with last movement grid*/
  ondeletemovementlist(i, event) {

    (<NgcFormArray>this.uldmovementform.get([event])).removeAt(i);
    // this.ondeletelist(i, ['movementList'], ['uldLastMovementList']);
  }
  /* this method is used for deleting the uldnumbers from the uldlist grid*/
  deleteuldarray($event, index) {
    (<NgcFormArray>this.uldmovementform.get('uldNumbers')).deleteValueAt(index);
  }
  /* this method is called when the uldnumber hyperlink is clicked from the uld in inventory with last movement */
  openmovementhistory(event) {
    this.inputData = {
      uldNumberConcat: event.record.uldNumberConcat,
      uldFromDate: "",
      uldToDate: "",
      selectmovement: this.uldmovementform.get('selectmovement').value
    };
    this.historyPopUp.open();
  }
  /* this method is used for iterating the uldnumbers in uldlist grid*/
  uldnumberchange(value, index) {
    // (<NgcFormControl>this.uldmovementform.get(['uldNumbers', index, 'uldNumberConcat'])).setValue(value);
    this.movementListFlag = false;
    this.createuldsection = false;
    this.uldmovementform.get('movementType').reset();
    this.uldmovementform.get('selectinmovement').reset();
  }
  /* this method is used for closing of the uldmovement history window*/
  closeWindow() {
    this.inputData = null;
    this.historyPopUp.close();
  }
  /* this method is used for calling the search method of the uldmovement history screen*/
  autoSearchAccessoryInfo($event) {
    this.historyPopUp.close();
    this.onSearch();
  }
  /* this method is used for preparing the request for movements types in the save method*/
  createRequest(movementList, movementulds, movementTypeValue, flagCRUDCheck, flagCRUDValue) {
    movementList.forEach(element => {
      if (element.movementType == movementTypeValue) {
        if (element.flagCRUD != flagCRUDCheck) {
          if (element.contentCode == null) {
            element.contentCode = "C"
          }
          movementulds.push({
            flagCRUD: flagCRUDValue,
            uldNumberConcat: element.uldNumberConcat,
            movementType: element.movementType
          });
        }
      }
    });
    const returnValue = {
      movementList: movementList.filter(element => element.movementType == movementTypeValue),
      uldMovement: movementulds.filter(element => element.movementType == movementTypeValue),
    }
    return returnValue;
  }
  /* this method is used for resetting of the fields based on the movement types*/
  resetFields(event) {
    (<NgcFormControl>this.uldmovementform.get(['movementType'])).setValidators([]);
    (<NgcFormControl>this.uldmovementform.get(['selectinmovement'])).setValidators([]);
    this.uldmovementform.get('dateForNew').patchValue(this.getUserProfile().loginTime);
    for (const eachRow of event) {
      this.uldmovementform.get(eachRow).reset();
    }
    this.onSearch();
  }

  /* this method is used for resetting of the fields in the create uld movement section after the selection of particular movement type*/
  resetFieldsforMovements() {
    this.uldmovementform.get('remarks').reset();
    this.uldmovementform.get('conditionType').reset();
    this.uldmovementform.get('airportPosition').reset();
    this.uldmovementform.get('contentCode').reset();
    this.uldmovementform.get('usedBy').reset();
    this.uldmovementform.get('dateForNew').patchValue(this.getUserProfile().loginTime);
    this.uldmovementform.get('flightInFlightKey').reset();
    this.uldmovementform.get('flightOutFlightKey').reset();
    this.uldmovementform.get('flightOutDepartureDate').reset();
    this.uldmovementform.get('flightInArrivalDate').reset();
    this.uldmovementform.get('flightInOriginAirportId').reset();
    this.uldmovementform.get('flightOutDestinationAirportId').reset();
    this.uldmovementform.get('reserve').reset();
    this.uldmovementform.get('agent').reset();
    this.uldmovementform.get('wareHouseLocation').reset();
  }
  setValidatorsRequired(event, listOfParameters) {
    for (const eachRow of listOfParameters) {
      (<NgcFormControl>this.uldmovementform.get([eachRow])).setValidators(event ? [Validators.required] : []);
    }
  }
  onClear(event) {
    this.movementListFlag = false;
    this.createuldsection = false;
    this.resetFormMessages();
    this.uldmovementform.reset();
    (<NgcFormArray>this.uldmovementform.get('movementList')).reset();
    (<NgcFormArray>this.uldmovementform.get('uldLastMovementList')).reset();

  }
  flightKeyChange(event) {
    this.uldmovementform.get('flightInArrivalDate').reset();
    this.uldmovementform.get('flightInOriginAirportId').reset();
    this.uldmovementform.get('flightInOriginAirport').reset();
  }
  outflightKeyChange(event) {
    this.uldmovementform.get('flightOutDepartureDate').reset();
    this.uldmovementform.get('flightOutDestinationAirportId').reset();
    this.uldmovementform.get('flightOutDestinationAirport').reset();
  }
}
