import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators } from "@angular/forms";
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, PageConfiguration, NgcDropDownComponent, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { LoadAndUnloadModelForAmendFlight, SearchLoadShipment, LoadUldShipment, MoveToFlight, UnloadShipment, Flight, CommonLoadShipment, BuildUpULD, UldShipments, Segment } from '../export.sharedmodel';
import { BuildupService } from '../buildup/buildup.service';


@Component({
  selector: 'app-amend-uld-trolley',
  templateUrl: './amend-uld-trolley.component.html',
  styleUrls: ['./amend-uld-trolley.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AmendUldTrolleyComponent extends NgcPage implements OnInit {
  @ViewChild('routingInfoWindow') routingInfoWindow: NgcWindowComponent;
  displaytareWtFlag: boolean = false;
  autoSelectFlag: boolean = true;
  previousContourCode: any;
  contourCode: any;
  proportionWeightResponse: any;
  moveFlightFlag: boolean = false;
  movetrolleyFlag: boolean = false;
  flightDate: any = null;
  valueData: any = null;
  flightId: any;
  response: any;
  uldSourceParameter: any;
  toBeLoadFlag: boolean;
  flightSearchFlag: boolean;
  FlightFlag: boolean;
  ULDFlag: boolean;
  disablePiecesWeightFlag: boolean = true;
  mandatroyCheckFlag: boolean = true;
  nonMatchingRoutePresent = false;
  private loadShipmentEnableFlag: Boolean = true;
  @ViewChild('ID') dropdown: NgcDropDownComponent;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildupService: BuildupService) {
    super(appZone, appElement, appContainerElement);
  }

  private form: NgcFormGroup = new NgcFormGroup({
    aircraftRegistration: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(new Date()),
    std: new NgcFormControl(),
    dateEtd: new NgcFormControl(),
    assUldTrolleyNo: new NgcFormControl(),
    param1: new NgcFormControl(),
    contentCode: new NgcFormControl(),
    assUldTrolleyId: new NgcFormControl(),
    loadTime: new NgcFormControl(new Date()),
    heightCode: new NgcFormControl(),
    phcIndicator: new NgcFormControl(),
    status: new NgcFormControl(),
    newflightKey: new NgcFormControl(),
    newflightOriginDate: new NgcFormControl(),
    segment: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    select: new NgcFormControl(),
    tareWeight: new NgcFormControl(),
    uldTrolleyNumber: new NgcFormControl(),
    assUldTrolleyNumber: new NgcFormControl(),
    shipmentLocation: new NgcFormControl(),
    reason: new NgcFormControl,
    newsegment: new NgcFormControl,
    piecesToMove: new NgcFormControl(),
    weightToMove: new NgcFormControl(),
    flightToDisplay: new NgcFormControl(),
    tenantId: new NgcFormControl(),
    toBeLoadedList: new NgcFormArray([

    ]),
    toBeLoadedListWithRouting: new NgcFormArray([

    ]),
    toBeLoadedListWithMatchingRoutes: new NgcFormArray([

    ]),
    toBeLoadedListWithNonMatchingRoutes: new NgcFormArray([

    ]),
    toBeLoadedListWithNoRouteInfo: new NgcFormArray([

    ]),
    uldShipmentArray: new NgcFormArray([
    ]),



  })

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.form.controls.newflightKey.valueChanges.subscribe(
      (newValue) => {
        if (this.valueData != newValue) {
          this.valueData = newValue;
          this.flightId = this.createSourceParameter(this.valueData, this.flightDate);
          if (this.flightId) {
            this.form.get('newsegment').patchValue(null);
          }
        }

      }
    );
    this.form.controls.newflightOriginDate.valueChanges.subscribe(
      (newValue) => {

        if (this.flightDate != newValue) {
          this.flightDate = newValue;
          this.flightId = this.createSourceParameter(this.valueData, this.flightDate);
          if (!this.flightId) {
            this.form.get('newsegment').patchValue(null);
          }
        }
      }
    );
  }

  onSearch() {
    this.displaytareWtFlag = false;
    // reset the new segment form control and its drop down value
    this.form.get('newflightOriginDate').setValue(null);
    this.form.get('newflightKey').setValue(null);
    this.form.get('newsegment').patchValue(null);
    if (this.form.get('flightKey').value == null || this.form.get('flightOriginDate').value == null) {
      this.showErrorMessage("export.fill.flight.details");
      return;
    }

    this.moveFlightFlag = false;
    this.movetrolleyFlag = false;
    this.toBeLoadFlag = false;
    this.flightSearchFlag = false;
    this.FlightFlag = false;
    this.ULDFlag = false;
    const searchReq = new SearchLoadShipment();
    searchReq.flightKey = this.form.get('flightKey').value;
    searchReq.flightOriginDate = this.form.get('flightOriginDate').value;

    this.buildupService.searchLoadShipmentAmend(searchReq).subscribe((resp) => {
      this.form.reset();
      this.response = resp;
      if (this.refreshFormMessages(this.response)) {
        return;
      }
      if (this.response.data) {
        if (this.response.data.toBeLoadedList == undefined || this.response.data.toBeLoadedList == null || this.response.data.toBeLoadedList.length == 0) {
          this.moveFlightFlag = true;
          this.movetrolleyFlag = true;
        }

        this.form.patchValue(this.response.data);

        //this.form.reset();
        this.toBeLoadFlag = true;
        this.flightSearchFlag = true;
        this.FlightFlag = true;
        this.ULDFlag = true;

        this.uldSourceParameter = this.createSourceParameter(this.response.data.flightKey, this.response.data.flightOriginDate);
      } else {
        this.refreshFormMessages(this.response);
        this.form.get('flightOriginDate').setValue(new Date());
        this.showErrorStatus('no.record');


      }


    });

  }

  onMoveToULD2() {
    const uldList = (<NgcFormArray>this.form.get('toBeLoadedList')).getRawValue();
    const uldToBeMoved = [];
    let currentSegment, index = -1;
    for (const eachUld of uldList) {
      ++index;
      if (eachUld.select) {
        currentSegment = eachUld.segment
        const unloadShipment = new UnloadShipment();
        unloadShipment.flight = new Flight();
        unloadShipment.assUldTrolleyId = uldList[index].assUldTrolleyId;
        unloadShipment.loadedShipmentInfoId = uldList[index].loadedShipmentInfoId;
        unloadShipment.flight.flightId = uldList[index].flightId;
        unloadShipment.assUldTrolleyNumber = uldList[index].uldTrolleyNumber;
        unloadShipment.shipmentId = uldList[index].shipmentId;
        unloadShipment.shipmentNumber = uldList[index].shipmentNumber;
        unloadShipment.loadedPieces = uldList[index].pieces;
        unloadShipment.loadedWeight = uldList[index].weight;
        unloadShipment.sumOfLoadedWeightForAmend = uldList[index].sumOfLoadedWeightForAmend;
        unloadShipment.sumOfLoadedPiecesForAmend = uldList[index].sumOfLoadedPiecesForAmend;
        uldToBeMoved.push(unloadShipment);
        break;
      }
    }

    for (let i = index + 1; i < uldList.length; ++i) {
      if (uldList[i].select) {
        if (uldList[i].segment !== currentSegment) {
          this.showErrorStatus('export.segments.should.be.same.type');
          return;
        }
        const unloadShipment = new UnloadShipment();
        unloadShipment.flight = new Flight();
        unloadShipment.assUldTrolleyId = uldList[i].assUldTrolleyId;
        unloadShipment.loadedShipmentInfoId = uldList[i].loadedShipmentInfoId;
        unloadShipment.flight.flightId = uldList[i].flightId;
        unloadShipment.assUldTrolleyNumber = uldList[i].uldTrolleyNumber;
        unloadShipment.shipmentId = uldList[i].shipmentId;
        unloadShipment.shipmentNumber = uldList[i].shipmentNumber;
        unloadShipment.loadedPieces = uldList[i].pieces;
        unloadShipment.loadedWeight = uldList[i].weight;
        unloadShipment.sumOfLoadedWeightForAmend = uldList[index].sumOfLoadedWeightForAmend;
        unloadShipment.sumOfLoadedPiecesForAmend = uldList[index].sumOfLoadedPiecesForAmend;
        uldToBeMoved.push(unloadShipment);
      }
    }

    let parentUldSegment;
    for (const eachUld of uldList) {
      if (this.form.get('uldNumber').value == eachUld.uldTrolleyNumber) {
        parentUldSegment = eachUld.segment;
        break;
      }
    }
    if (parentUldSegment !== currentSegment) {
      let errorMessage = 'ULD ' + this.form.get('uldNumber').value + ' does not belong to Segment ' + uldList[index].segment;
      this.showErrorStatus(errorMessage);
      return;
    }


    const unloadShipment = new UnloadShipment();


    for (let i = 0; i < uldList.length; i++) {
      if (uldList[i].select) {
        const unloadShipment = new UnloadShipment();
        unloadShipment.flight = new Flight();
        unloadShipment.assUldTrolleyId = uldList[i].assUldTrolleyId;
        unloadShipment.loadedShipmentInfoId = uldList[i].loadedShipmentInfoId;
        unloadShipment.flight.flightId = uldList[i].flightId;
        unloadShipment.assUldTrolleyNumber = uldList[i].uldTrolleyNumber;
        unloadShipment.shipmentId = uldList[i].shipmentId;
        unloadShipment.shipmentNumber = uldList[i].shipmentNumber;
        unloadShipment.loadedPieces = uldList[i].pieces;
        unloadShipment.loadedWeight = uldList[i].weight;
        unloadShipment.sumOfLoadedWeightForAmend = uldList[index].sumOfLoadedWeightForAmend;
        unloadShipment.sumOfLoadedPiecesForAmend = uldList[index].sumOfLoadedPiecesForAmend;
        uldToBeMoved.push(unloadShipment);
      }
    }

    unloadShipment.reason = this.form.get('reason').value;

    this.buildupService.onMoveToTrolley(uldToBeMoved).subscribe((resp) => {
      this.response = resp;

      if (this.response.success) {

        //this.showSuccessStatus('g.completed.successfully');

      } else {
        this.showResponseErrorMessages(this.response);
      }
    });
  }

  onPiecesChangeEvent(event) {
    if (event == 0) {
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get('piecesToMove'), "export.cannot.zero");
      return;
    }
    const uldList = (<NgcFormArray>this.form.get('toBeLoadedList')).getRawValue();
    let selectedUldList = uldList.filter(i => i.select);
    if (event != null && selectedUldList.length > 0) {

      if (selectedUldList.length > 1) {
        this.showErrorMessage("export.select.uld.to.move.pieces.weight");
        return;
      }
      else {
        let unloadShipment: UnloadShipment = new UnloadShipment();
        unloadShipment.unloadPieces = event;
        unloadShipment.loadedPieces = selectedUldList[0].pieces;
        unloadShipment.loadedWeight = selectedUldList[0].weight;
        unloadShipment.shipmentId = selectedUldList[0].shipmentId;
        this.buildupService.unloadWeight(unloadShipment).subscribe(response => {

          if (!this.showResponseErrorMessages(response)) {
            this.proportionWeightResponse = response.data;
            this.form.get('weightToMove').setValue(this.proportionWeightResponse.unloadWeight);
          }
          else {
            this.showErrorMessage("export.pieces.cannot.greater.loaded.pieces");
          }
        });
      }
    }


  }



  onMoveToULD() {
    this.form.get('uldNumber').setValidators([Validators.required]);

    // this.form.get('heightCode').setValidators([Validators.required]);
    // this.form.get('tareWeight').setValidators([Validators.required]);
    this.form.get('newflightKey').clearValidators();
    this.form.get('newflightOriginDate').clearValidators();;
    this.form.get('newsegment').clearValidators();
    var uldNumber = this.form.get('uldNumber').value;

    if (uldNumber != null && (uldNumber.startsWith("BT") || uldNumber.startsWith("PD") || uldNumber.startsWith("MT") ||
      uldNumber.startsWith("HPD") || uldNumber.startsWith("APST") || (uldNumber && uldNumber.toUpperCase() == "BULK"))) {
      this.form.get('heightCode').clearValidators();
      this.form.get('tareWeight').clearValidators();
    } else {
      this.form.get('heightCode').setValidators(Validators.required);
      this.form.get('tareWeight').setValidators(Validators.required);
    }

    this.form.validate();
    if (this.form.invalid == true) {
      this.showErrorMessage("expaccpt.fill.all.mandatory.details");
      return;
    }

    const uldList = (<NgcFormArray>this.form.get('toBeLoadedList')).getRawValue();
    let uldToBeMoved = new Array<any>();
    const unloadShipment = new UnloadShipment();

    let filterdUld = uldList.filter(uld => uld.select);
    if (filterdUld.length < 1) {
      this.showErrorMessage("export.seelct.one.uld.to.move");
      return;
    }
    let piecesToMove = this.form.get('piecesToMove').value;
    let weightToMove = this.form.get('weightToMove').value;

    if (piecesToMove != null && weightToMove != null) {
      let selectedUldList = uldList.filter(i => i.select);
      if (selectedUldList.length < 1) {
        this.showErrorMessage("export.select.uld.to.move.pieces.weight");
        return;
      }
      else {
        if (piecesToMove == 0) {
          this.showFormControlErrorMessage(<NgcFormControl>this.form.get('piecesToMove'), "export.cannot.zero");
          return;
        }
        if (weightToMove == 0) {
          this.showFormControlErrorMessage(<NgcFormControl>this.form.get('weightToMove'), "export.cannot.zero");
          return;
        }

        if (piecesToMove != 0 && weightToMove !== 0) {
          let obj = {
            "piecesToMove": piecesToMove,
            "weightToMove": weightToMove
          }
          this.methodToPerformAmendUld(uldList, uldToBeMoved, obj);
        }
      }
    }




    // set heright code of request in uld list
    if (piecesToMove == null && weightToMove == null) {
      this.methodToPerformAmendUld(uldList, uldToBeMoved, null);
    }


  }

  methodToPerformAmendUld(uldList, uldToBeMoved, pieceWeightObj) {
    for (let i = 0; i < uldList.length; i++) {
      if (uldList[i].select) {
        const unloadShipment = new UnloadShipment();
        unloadShipment.flight = new Flight();
        unloadShipment.trolleyInd = uldList[i].trolleyIndicator;
        unloadShipment.assUldTrolleyId = uldList[i].assUldTrolleyId;
        unloadShipment.loadedShipmentInfoId = uldList[i].loadedShipmentInfoId;
        unloadShipment.flight.flightId = uldList[i].flightId;
        unloadShipment.assUldTrolleyNumber = uldList[i].uldTrolleyNumber;
        unloadShipment.shipmentId = uldList[i].shipmentId;
        unloadShipment.shipmentNumber = uldList[i].shipmentNumber;
        unloadShipment.sumOfLoadedWeightForAmend = uldList[i].sumOfLoadedWeightForAmend;
        unloadShipment.sumOfLoadedPiecesForAmend = uldList[i].sumOfLoadedPiecesForAmend;
        //set part Suffix
        unloadShipment.partSuffix = uldList[i].partSuffix;
        // unloadShipment.shipmentType = uldList[i].shipmentType;
        if (pieceWeightObj != null) {
          if (pieceWeightObj.piecesToMove > uldList[i].pieces) {
            this.showFormControlErrorMessage(<NgcFormControl>this.form.get('piecesToMove'), "export.cannot.greater.uld.pieces");
            return;
          }
          if (pieceWeightObj.weightToMove > uldList[i].weight) {
            this.showFormControlErrorMessage(<NgcFormControl>this.form.get('weightToMove'), "export.cannot.greater.uld.weight");
            return;
          }
          if (pieceWeightObj.piecesToMove == uldList[i].pieces
            && ((pieceWeightObj.weightToMove > uldList[i].weight) ||
              pieceWeightObj.weightToMove < uldList[i].weight)) {
            this.showFormControlErrorMessage(<NgcFormControl>this.form.get('weightToMove'), "Moving Weight should be equal to Uld Weight for same Pcs.");
            return;
          }

          unloadShipment.loadedPieces = pieceWeightObj.piecesToMove;
          unloadShipment.loadedWeight = pieceWeightObj.weightToMove;
          unloadShipment.unloadPieces = uldList[i].pieces;
          unloadShipment.unloadWeight = uldList[i].weight;

        }
        else {
          unloadShipment.loadedPieces = uldList[i].pieces;
          unloadShipment.loadedWeight = uldList[i].weight;

        }

        uldToBeMoved.push(unloadShipment);
      }
    }
    //unloadShipment.reason = this.form.get('reason').value;
    //  this.refreshFormMessages(this.response);

    //calling the  load shipement

    this.onLoadCall(uldToBeMoved);



  }







  onLoadCall(uldToBeMoved: any) {
    let loadAndUnloadModelForAmendFlight = new LoadAndUnloadModelForAmendFlight();
    loadAndUnloadModelForAmendFlight.unLoadShipmentList = uldToBeMoved;
    //  loadAndUnloadModelForAmendFlight.commonLoadShipment = this.onPrepareLoadData();

    const uldList = (<NgcFormArray>this.form.get('toBeLoadedList')).getRawValue();
    const common = new CommonLoadShipment();
    common.flightKey = this.form.get('flightKey').value;
    common.flightOriginDate = this.form.get('flightOriginDate').value;
    const uld = new BuildUpULD();
    const uldsList = [];
    const shipList = [];
    uld.uldTrolleyNo = this.form.get('uldNumber').value;


    for (let i = 0; i < uldList.length; i++) {
      if (uldList[i].select) {
        const shipment = new UldShipments();
        shipment.shipmentNumber = uldList[i].shipmentNumber;
        shipment.newUldNumber = this.form.get('uldNumber').value;
        shipment.assUldTrolleyNo = uldList[i].uldTrolleyNumber;
        shipment.flightKey = this.form.get('flightKey').value;
        shipment.flightOriginDate = this.form.get('flightOriginDate').value;
        shipment.shipmentId = uldList[i].shipmentId;
        shipment.segmentId = uldList[i].segmentId;
        shipment.flightId = uldList[i].flightId;
        shipment.assUldTrolleyId = uldList[i].assUldTrolleyId;
        shipment.phcIndicator = 0;
        common.flightId = uldList[i].flightId;
        common.flightSegmentId = uldList[i].flightSegmentId;
        shipment.flightSegmentId = uldList[i].flightSegmentId;
        shipment.contentCode = uldList[i].contentCode;
        shipment.shipmentId = uldList[i].shipmentId;
        shipment.heightCode = this.form.get('heightCode').value;
        shipment.dryIceWeight = 0;
        shipment.moveDryIce = 0;
        shipment.shcList = uldList[i].shcList;
        shipment.partSuffix = uldList[i].partSuffix;
        shipment.sumOfLoadedWeightForAmend = uldList[i].sumOfLoadedWeightForAmend;
        shipment.sumOfLoadedPiecesForAmend = uldList[i].sumOfLoadedPiecesForAmend;
        shipList.push(shipment);
      }
    }
    uld.shipmentList = shipList;
    uldsList.push(uld);
    common.uldList = uldsList;

    // setting Common model to  loadAndUnloadModelForAmendFlight
    loadAndUnloadModelForAmendFlight.commonLoadShipment = common;
    //service call for amendUldtrolley
    this.buildupService.onUnloadAndLoadForAmendUldTrolley(loadAndUnloadModelForAmendFlight).subscribe((resp) => {
      this.response = resp;
      if (!this.showResponseErrorMessages(resp)) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();

      } else {
        this.showResponseErrorMessages(resp);
      }
    });
  }
  protected groupsRenderer = (text: any, group: any, expanded: any, groupData: any): any => {
    //
    if (groupData.groupcolumn.datafield === "segment") {
      let totalULDs: number = 0;
      let totalTrolleys: number = 0;
      let totalPieces: number = 0;
      let totalWeight: number = 0;
      //
      if (groupData.subGroups) {
        (groupData.subGroups as Array<any>).forEach((uldGroup: any) => {
          if (uldGroup.subItems) {
            let isULD: boolean = false;
            let isTrolley: boolean = false;
            //
            (uldGroup.subItems as Array<any>).forEach((awb: any) => {
              if (awb) {
                totalPieces += (awb.pieces ? awb.pieces : 0);
                totalWeight += (awb.weight ? awb.weight : 0);
              }
              if (Number(awb.trolleyInd) === 1) {
                isTrolley = true;
              } else if (Number(awb.trolleyInd) === 0) {
                isULD = true;
              }
            });
            if (isTrolley) {
              totalTrolleys++;
            } else if (isULD) {
              totalULDs++;
            }
          }
        });
      }
      //
      return `<label style=''>${group}</label> &nbsp&nbsp&nbsp
        <label style=''>${this.getI18NValue("ULD")}</label>- ${totalULDs} &nbsp&nbsp
        <label style=''>${this.getI18NValue("Trolley")}</label>- ${totalTrolleys} &nbsp&nbsp
        <label style=''>${this.getI18NValue("Pieces")}</label>- ${totalPieces} &nbsp&nbsp
        <label style=''>${this.getI18NValue("Weight")}</label>- ${totalWeight} &nbsp&nbsp
        `;
    } if (groupData.groupcolumn.datafield === "uldTrolleyNumber") {
      for (let index = 0; index < groupData.subItems.length; index++) {
        let contentCode = groupData.subItems && groupData.subItems.length > 0 ? groupData.subItems[index].contentCode : '';
        let heightCode = groupData.subItems && groupData.subItems.length > 0 ? groupData.subItems[index].heightCode : '';
        let tareWeight = groupData.subItems && groupData.subItems.length > 0 ? groupData.subItems[index].tareWeight : '';

        return `<label style=''>${group}</label> &nbsp&nbsp&nbsp
          <label style=''>${this.getI18NValue("")}</label>- ${contentCode || 0} &nbsp&nbsp
          <label style=''>${this.getI18NValue("")}</label>- ${heightCode || 0} &nbsp&nbsp
          <label style=''>${this.getI18NValue("")}</label>- ${tareWeight || 0} &nbsp&nbsp

          `;

      }



    }
  }


  /*   public onFlightChange(event) {
      const flightKey: string = this.form.get('newflightKey').value;
      const flightDate: any = this.form.get('newflightOriginDate').value;
      //
      this.flightId = this.createSourceParameter(flightKey, flightDate);
    } */
  public onSelect(event) {
    var uldNumber: string = this.form.get('uldNumber').value;
    if (event.code) {
      this.clearErrorList();
      this.movetrolleyFlag = false;
      this.getTareWeightFromService();
    } else {
      this.clearFormControlMessages();
      this.showErrorMessage("export.entered.uld.not.assigned", "", [uldNumber], null);
      this.movetrolleyFlag = true;
      return;
    }

    //this.form.get('tareWeight').setValue(event.param4);
  }





  onMoveToFlightULD() {
    const uldList = (<NgcFormArray>this.form.get('toBeLoadedList')).getRawValue();
    let uldToBeMoved = new Array<any>();
    const unloadShipment = new UnloadShipment();
    let segments: any;
    let newSeg = this.form.get('newsegment').value
    for (let i = 0; i < uldList.length; i++) {
      if (uldList[i].select) {
        const unloadShipment = new UnloadShipment();
        unloadShipment.flight = new Flight();
        unloadShipment.assUldTrolleyId = uldList[i].assUldTrolleyId;
        unloadShipment.loadedShipmentInfoId = uldList[i].loadedShipmentInfoId;
        unloadShipment.flight.flightId = uldList[i].flightId;
        unloadShipment.assUldTrolleyNumber = uldList[i].uldTrolleyNumber;
        unloadShipment.shipmentId = uldList[i].shipmentId;
        unloadShipment.shipmentNumber = uldList[i].shipmentNumber;
        unloadShipment.loadedPieces = uldList[i].pieces;
        unloadShipment.loadedWeight = uldList[i].weight;
        unloadShipment.segment = new Segment();
        segments = unloadShipment.segment.segment = uldList[i].segment;
        uldToBeMoved.push(unloadShipment);
      }
    }

    unloadShipment.reason = this.form.get('reason').value;

    this.refreshFormMessages(this.response);
    this.buildupService.onMoveToTrolley(uldToBeMoved).subscribe((resp) => {
      this.response = resp;
      this.onLoadCallOnFlightMove();
      if (this.response.success) {

        //this.showSuccessStatus('g.completed.successfully');

      } else {
        this.refreshFormMessages(this.response);
      }
    });


  }
  onLoadCallOnFlightMove() {
    const uldList = (<NgcFormArray>this.form.get('toBeLoadedList')).getRawValue();
    const common = new CommonLoadShipment();
    common.newflightKey = this.form.get('newflightKey').value;
    common.newflightOriginDate = this.form.get('newflightOriginDate').value;

    common.newsegment = this.form.get('newsegment').value;
    common.destination = this.form.get('newsegment').value;
    const uld = new BuildUpULD();
    const uldsList = [];
    const shipList = [];
    //uld.uldTrolleyNo = this.form.get('uldNumber').value;

    //common.flightKey = this.form.get('newflightKey').value;
    //common.flightOriginDate = this.form.get('newflightKey').value;
    for (let i = 0; i < uldList.length; i++) {
      if (uldList[i].select) {
        const shipment = new UldShipments();
        shipment.shipmentNumber = uldList[i].shipmentNumber;

        shipment.assUldTrolleyNo = uldList[i].uldTrolleyNumber;
        shipment.flightKey = this.form.get('newflightKey').value;
        shipment.flightOriginDate = this.form.get('newflightOriginDate').value;
        shipment.shipmentId = uldList[i].shipmentId;
        shipment.segmentId = uldList[i].segmentId;
        shipment.flightId = uldList[i].flightId;
        shipment.assUldTrolleyId = uldList[i].assUldTrolleyId;
        shipment.phcIndicator = 0;
        common.flightId = uldList[i].flightId;
        common.flightSegmentId = uldList[i].flightSegmentId;
        shipment.flightSegmentId = uldList[i].flightSegmentId;
        shipment.contentCode = uldList[i].contentCode;
        shipment.shipmentId = uldList[i].shipmentId;
        shipment.heightCode = uldList[i].heightCode;
        shipment.dryIceWeight = 0;
        shipment.moveDryIce = 0;
        common.pieces = uldList[i].pieces;
        common.weight = uldList[i].weight;
        common.natureOfGoods = uldList[i].natureOfGoods;
        common.shipmentNumber = uldList[i].shipmentNumber;
        common.segment = uldList[i].segment;
        shipList.push(shipment);
      }
    }
    uld.shipmentList = shipList;
    uldsList.push(uld);
    common.uldList = uldsList;


  }


  // move flight updated code
  onAmendFlight() {
    this.form.get('uldNumber').clearValidators();
    this.form.get('heightCode').clearValidators();
    this.form.get('tareWeight').clearValidators();
    this.form.validate();
    if (this.form.invalid === true) {
      this.showErrorMessage("expaccpt.fill.all.mandatory.details");
      return;
    }
    let loadAndUnloadModelForAmendFlight = new LoadAndUnloadModelForAmendFlight();
    const uldListWithRoutingInfo = [];
    const uldList = (<NgcFormArray>this.form.get('toBeLoadedList')).getRawValue();

    let uldToBeMoved = new Array<any>();
    const unloadShipment = new UnloadShipment();
    let segmentArray = [];
    let segments: any;
    let newSeg = this.form.get('newsegment').value;
    if (this.nonMatchingRoutePresent) {
      const uldListWithMatchingRoute = (<NgcFormArray>this.form.get('toBeLoadedListWithMatchingRoutes')).getRawValue();
      const uldListWithNonMatchingRoute = (<NgcFormArray>this.form.get('toBeLoadedListWithNonMatchingRoutes')).getRawValue();
      const uldListWithNoRouteInfo = (<NgcFormArray>this.form.get('toBeLoadedListWithNoRouteInfo')).getRawValue();
      let isShipmentSelected = false;
      for (let i = 0; i < uldListWithMatchingRoute.length; i++) {
        if (uldListWithMatchingRoute[i].checkBox) {
          for (let j = 0; j < uldList.length; j++) {
            if (uldList[j].assUldTrolleyId == uldListWithMatchingRoute[i].assUldTrolleyId
              && uldList[j].loadedShipmentInfoId == uldListWithMatchingRoute[i].loadedShipmentInfoId) {
              uldListWithRoutingInfo.push(uldList[j]);
              isShipmentSelected = true;
            }
          }
        }
      }
      for (let i = 0; i < uldListWithNonMatchingRoute.length; i++) {
        if (uldListWithNonMatchingRoute[i].checkBox) {
          for (let j = 0; j < uldList.length; j++) {
            if (uldList[j].assUldTrolleyId == uldListWithNonMatchingRoute[i].assUldTrolleyId
              && uldList[j].loadedShipmentInfoId == uldListWithNonMatchingRoute[i].loadedShipmentInfoId) {
              uldListWithRoutingInfo.push(uldList[j]);
              isShipmentSelected = true;
            }
          }
        }
      }
      for (let i = 0; i < uldListWithNoRouteInfo.length; i++) {
        for (let j = 0; j < uldList.length; j++) {
          if (uldList[j].assUldTrolleyId == uldListWithNoRouteInfo[i].assUldTrolleyId
            && uldList[j].loadedShipmentInfoId == uldListWithNoRouteInfo[i].loadedShipmentInfoId) {
            uldListWithRoutingInfo.push(uldList[j]);
            // isShipmentSelected = true;
          }
        }
      }
      if (!isShipmentSelected) {
        this.showErrorMessage("export.select.shipments.to.proceed");
        return;
      }

      for (let i = 0; i < uldListWithRoutingInfo.length; i++) {
        for (let j = 0; j < uldList.length; j++) {
          if (uldList[j].assUldTrolleyId == uldListWithRoutingInfo[i].assUldTrolleyId
            && uldList[j].loadedShipmentInfoId == uldListWithRoutingInfo[i].loadedShipmentInfoId) {
            const unloadShipment = new UnloadShipment();
            unloadShipment.flight = new Flight();
            unloadShipment.trolleyInd = uldListWithRoutingInfo[i].trolleyIndicator;
            unloadShipment.assUldTrolleyId = uldListWithRoutingInfo[i].assUldTrolleyId;
            unloadShipment.loadedShipmentInfoId = uldListWithRoutingInfo[i].loadedShipmentInfoId;
            unloadShipment.flight.flightId = uldListWithRoutingInfo[i].flightId;
            unloadShipment.assUldTrolleyNumber = uldListWithRoutingInfo[i].uldTrolleyNumber;
            unloadShipment.shipmentId = uldListWithRoutingInfo[i].shipmentId;
            unloadShipment.shipmentNumber = uldListWithRoutingInfo[i].shipmentNumber;
            unloadShipment.loadedPieces = uldListWithRoutingInfo[i].pieces;
            unloadShipment.loadedWeight = uldListWithRoutingInfo[i].weight;
            unloadShipment.partSuffix = uldListWithRoutingInfo[i].partSuffix;
            unloadShipment.sumOfLoadedWeightForAmend = uldListWithRoutingInfo[i].sumOfLoadedWeightForAmend;
            unloadShipment.sumOfLoadedPiecesForAmend = uldListWithRoutingInfo[i].sumOfLoadedPiecesForAmend;
            unloadShipment.segment = new Segment();
            segments = unloadShipment.segment.segment = uldListWithRoutingInfo[i].segment;
            segmentArray.push(uldListWithRoutingInfo[i].segment);
            uldToBeMoved.push(unloadShipment);
            isShipmentSelected = true;
          }
        }
      }
      if (!isShipmentSelected) {
        this.showErrorMessage("export.select.shipments.to.proceed!");
        return;
      }

      this.performAmendOpeartionForFlightWithRoutingInfo(loadAndUnloadModelForAmendFlight, uldToBeMoved);
    } else {
      for (let i = 0; i < uldList.length; i++) {
        if (uldList[i].select) {
          const unloadShipment = new UnloadShipment();
          unloadShipment.flight = new Flight();
          unloadShipment.trolleyInd = uldList[i].trolleyIndicator;
          unloadShipment.assUldTrolleyId = uldList[i].assUldTrolleyId;
          unloadShipment.loadedShipmentInfoId = uldList[i].loadedShipmentInfoId;
          unloadShipment.flight.flightId = uldList[i].flightId;
          unloadShipment.assUldTrolleyNumber = uldList[i].uldTrolleyNumber;
          unloadShipment.shipmentId = uldList[i].shipmentId;
          unloadShipment.shipmentNumber = uldList[i].shipmentNumber;
          unloadShipment.loadedPieces = uldList[i].pieces;
          unloadShipment.loadedWeight = uldList[i].weight;
          unloadShipment.partSuffix = uldList[i].partSuffix;
          unloadShipment.sumOfLoadedWeightForAmend = uldList[i].sumOfLoadedWeightForAmend;
          unloadShipment.sumOfLoadedPiecesForAmend = uldList[i].sumOfLoadedPiecesForAmend;
          unloadShipment.segment = new Segment();
          segments = unloadShipment.segment.segment = uldList[i].segment;
          segmentArray.push(uldList[i].segment);
          uldToBeMoved.push(unloadShipment);
        }
      }
      this.performAmendOpeartionForFlight(loadAndUnloadModelForAmendFlight, uldToBeMoved);
    }
  }

  performAmendOpeartionForFlight(loadAndUnloadModelForAmendFlight, uldToBeMoved) {
    loadAndUnloadModelForAmendFlight.unLoadShipmentList = uldToBeMoved;
    loadAndUnloadModelForAmendFlight.commonLoadShipment = this.onPrepareLoadData();


    this.buildupService.onUnloadAndLoadForAmendFlight(loadAndUnloadModelForAmendFlight).subscribe((resp) => {
      this.response = resp;
      if (this.showResponseErrorMessages(this.response)) {
        return;
      }
      if (this.response.success) {
        this.successResponce(this.response);
      } else {
        if (this.response.data.infoAndWarnMessage) {
          this.showConfirmMessage(this.response.data.infoAndWarnMessage).then(fulfilled => {
            loadAndUnloadModelForAmendFlight.skipCpeCheck = true;
            this.buildupService.onUnloadAndLoadForAmendFlight(loadAndUnloadModelForAmendFlight).subscribe((resp) => {
              this.response = resp;
              if (this.response.success) {
                this.successResponce(this.response);
              } else {
                this.showResponseErrorMessages(this.response);
              }
            });

          }).catch(reason => {
          });

        } else if (this.response.data.warnForForeignUld) {
          this.showConfirmMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.5", [this.response.data.foreignUldNumber])).then(fulfilled => {
            loadAndUnloadModelForAmendFlight.ackForeignUld = true;
            this.afterAckOfForegnUld(loadAndUnloadModelForAmendFlight);
          }).catch(reason => {
          });
        } else {
          //this.refreshFormMessages(this.response);
          this.showResponseErrorMessages(this.response);
        }

      }
    });
  }

  afterAckOfForegnUld(loadAndUnloadModelForAmendFlight) {
    this.buildupService.onUnloadAndLoadForAmendFlight(loadAndUnloadModelForAmendFlight).subscribe((resp) => {
      this.response = resp;
      if (this.response.success) {
        this.successResponce(this.response);
      }
      else if (this.response.data.infoAndWarnMessage) {
        this.showConfirmMessage(this.response.data.infoAndWarnMessage).then(fulfilled => {
          loadAndUnloadModelForAmendFlight.skipCpeCheck = true;
          this.buildupService.onUnloadAndLoadForAmendFlight(loadAndUnloadModelForAmendFlight).subscribe((resp) => {
            this.response = resp;
            if (this.response.success) {
              this.successResponce(this.response);
            } else {
              this.showResponseErrorMessages(this.response);
            }
          });

        }).catch(reason => {
        });

      } else {
        this.showResponseErrorMessages(this.response);
      }
    });
  }

  successResponce(response) {
    if (response.data.noPartMatchFlag) {
      this.showInfoStatus("export.booking.pcs.wt.not.matching.update.booking");
      this.onSearch();
    } else {
      this.showSuccessStatus('g.completed.successfully');
      this.onSearch();
    }
  }

  onPrepareLoadData(): CommonLoadShipment {
    const uldList = (<NgcFormArray>this.form.get('toBeLoadedList')).getRawValue();
    const common = new CommonLoadShipment();
    common.newflightKey = this.form.get('newflightKey').value;
    common.newflightOriginDate = this.form.get('newflightOriginDate').value;

    common.newsegment = this.form.get('newsegment').value;
    common.destination = this.form.get('newsegment').value;
    const uld = new BuildUpULD();
    const uldsList = [];
    const shipList = [];
    //uld.uldTrolleyNo = this.form.get('uldNumber').value;

    //common.flightKey = this.form.get('newflightKey').value;
    //common.flightOriginDate = this.form.get('newflightKey').value;
    for (let i = 0; i < uldList.length; i++) {
      if (uldList[i].select) {
        let shipment = new UldShipments();
        shipment.segment = uldList[i].segment;
        shipment.shipmentNumber = uldList[i].shipmentNumber;
        shipment.shipmentDate = uldList[i].shipmentDate;
        shipment.assUldTrolleyNo = uldList[i].uldTrolleyNumber;
        shipment.flightKey = this.form.get('newflightKey').value;
        shipment.flightOriginDate = this.form.get('newflightOriginDate').value;
        shipment.shipmentId = uldList[i].shipmentId;
        shipment.segmentId = uldList[i].segmentId;
        shipment.flightId = uldList[i].flightId;
        shipment.assUldTrolleyId = uldList[i].assUldTrolleyId;
        shipment.phcIndicator = 0;
        common.flightId = uldList[i].flightId;
        common.flightSegmentId = uldList[i].flightSegmentId;
        shipment.flightSegmentId = uldList[i].flightSegmentId;
        shipment.contentCode = uldList[i].contentCode;
        shipment.shipmentId = uldList[i].shipmentId;
        shipment.heightCode = uldList[i].heightCode;
        shipment.dryIceWeight = 0;
        shipment.moveDryIce = 0;
        shipment.pieces = uldList[i].pieces;
        shipment.weight = uldList[i].weight;
        common.pieces = uldList[i].pieces;
        common.weight = uldList[i].weight;
        common.natureOfGoods = uldList[i].natureOfGoods;
        common.shipmentNumber = uldList[i].shipmentNumber;
        common.segment = uldList[i].segment;
        shipment.segment = uldList[i].segment;
        // shipment.shipmentType = uldList[i].shipmentType;
        shipment.shcList = uldList[i].shcList;
        shipment.partSuffix = uldList[i].partSuffix;
        shipment.sumOfLoadedWeightForAmend = uldList[i].sumOfLoadedWeightForAmend;
        shipment.sumOfLoadedPiecesForAmend = uldList[i].sumOfLoadedPiecesForAmend;
        shipList.push(shipment);
      }
    }
    uld.shipmentList = shipList;
    uldsList.push(uld);
    common.uldList = uldsList;
    return common;

  }

  //get tare Weight for uld
  getTareWeightFromService() {
    let uldNumber = this.form.get('uldNumber').value;
    let heightCode = this.form.get('heightCode').value;
    let flightId = this.form.get('flightId').value;
    if (heightCode == null || heightCode == undefined) {
      heightCode = this.contourCode;
    }
    let model = new LoadAndUnloadModelForAmendFlight();
    model.uldNumber = uldNumber;
    model.heightCode = heightCode;
    model.flightId = flightId;
    if (uldNumber != null || uldNumber != undefined) {
      this.buildupService.ontareWeightCalForAmendUld(model).subscribe((response) => {
        if (response.success && response.data) {
          let result = response.data;
          if (result.tareWeight == null && result.heightCode == null) {
            this.displaytareWtFlag = false;
          } else {
            this.displaytareWtFlag = true;
          }
          this.form.get('tareWeight').setValue(result.tareWeight);
          this.form.get('contentCode').setValue(result.heightCode);
          this.form.get('heightCode').setValue(result.heightCode);

        }
      });
    }
  }

  onSelectCheckBox(event) {
    if (event.record.shipmentType === 'MAIL') {
      this.moveFlightFlag = true;
    } else {
      this.moveFlightFlag = false;
    }
    let length = this.form.get('toBeLoadedList').value.filter(t => t.select).length;
    if (length > 1) {
      this.disablePiecesWeightFlag = false;
    }
    else {
      this.disablePiecesWeightFlag = true;
    }

  }

  validateRouting() {
    this.form.get('uldNumber').clearValidators();
    this.form.get('heightCode').clearValidators();
    this.form.get('tareWeight').clearValidators();
    this.form.get('newsegment').clearValidators();
    this.form.get('newflightKey').setValidators([Validators.required]);
    this.form.get('newflightOriginDate').setValidators([Validators.required]);
    // this.form.get('newsegment').setValidators([Validators.required]);
    this.form.validate();
    if (this.form.invalid === true) {
      this.showErrorMessage("expaccpt.fill.all.mandatory.details");
      return;
    }
    let loadAndUnloadModelForAmendFlight = new LoadAndUnloadModelForAmendFlight();
    const uldList = (<NgcFormArray>this.form.get('toBeLoadedList')).getRawValue();
    let uldToBeMoved = new Array<any>();
    const unloadShipment = new UnloadShipment();
    let segmentArray = [];
    let segments: any;
    let newSeg = this.form.get('newsegment').value;
    for (let i = 0; i < uldList.length; i++) {
      if (uldList[i].select) {
        const unloadShipment = new UnloadShipment();
        unloadShipment.flight = new Flight();
        unloadShipment.trolleyInd = uldList[i].trolleyIndicator;
        unloadShipment.assUldTrolleyId = uldList[i].assUldTrolleyId;
        unloadShipment.loadedShipmentInfoId = uldList[i].loadedShipmentInfoId;
        unloadShipment.flight.flightId = uldList[i].flightId;
        unloadShipment.assUldTrolleyNumber = uldList[i].uldTrolleyNumber;
        unloadShipment.shipmentId = uldList[i].shipmentId;
        unloadShipment.shipmentNumber = uldList[i].shipmentNumber;
        unloadShipment.loadedPieces = uldList[i].pieces;
        unloadShipment.loadedWeight = uldList[i].weight;
        unloadShipment.partSuffix = uldList[i].partSuffix;
        unloadShipment.sumOfLoadedWeightForAmend = uldList[i].sumOfLoadedWeightForAmend;
        unloadShipment.sumOfLoadedPiecesForAmend = uldList[i].sumOfLoadedPiecesForAmend;
        unloadShipment.segment = new Segment();
        segments = unloadShipment.segment.segment = uldList[i].segment;
        segmentArray.push(uldList[i].segment);
        uldToBeMoved.push(unloadShipment);
      }
    }
    if (uldToBeMoved.length <= 0) {
      this.showErrorMessage("export.select.uld.to.move");
      return;
    }

    this.validateRouteForAmendFlight(loadAndUnloadModelForAmendFlight, uldToBeMoved);


  }


  onPrepareLoadDataWithRoutingInfo(): CommonLoadShipment {
    const uldList = (<NgcFormArray>this.form.get('toBeLoadedList')).getRawValue();
    const uldListWithMatchingRoute = (<NgcFormArray>this.form.get('toBeLoadedListWithMatchingRoutes')).getRawValue();
    const uldListWithNonMatchingRoute = (<NgcFormArray>this.form.get('toBeLoadedListWithNonMatchingRoutes')).getRawValue();
    const uldListWithNoRouteInfo = (<NgcFormArray>this.form.get('toBeLoadedListWithNoRouteInfo')).getRawValue();
    const common = new CommonLoadShipment();
    common.newflightKey = this.form.get('newflightKey').value;
    common.newflightOriginDate = this.form.get('newflightOriginDate').value;

    common.newsegment = this.form.get('newsegment').value;
    common.destination = this.form.get('newsegment').value;
    const uld = new BuildUpULD();
    const uldsList = [];
    const shipList = [];
    let isShipmentSelected = false;
    const uldListWithRoutingInfo = [];
    for (let i = 0; i < uldListWithMatchingRoute.length; i++) {
      if (uldListWithMatchingRoute[i].checkBox) {
        for (let j = 0; j < uldList.length; j++) {
          if (uldList[j].assUldTrolleyId == uldListWithMatchingRoute[i].assUldTrolleyId
            && uldList[j].loadedShipmentInfoId == uldListWithMatchingRoute[i].loadedShipmentInfoId) {
            uldListWithRoutingInfo.push(uldList[j]);
          }
        }
      }
    }
    for (let i = 0; i < uldListWithNonMatchingRoute.length; i++) {
      if (uldListWithNonMatchingRoute[i].checkBox) {
        for (let j = 0; j < uldList.length; j++) {
          if (uldList[j].assUldTrolleyId == uldListWithNonMatchingRoute[i].assUldTrolleyId
            && uldList[j].loadedShipmentInfoId == uldListWithNonMatchingRoute[i].loadedShipmentInfoId) {
            uldListWithRoutingInfo.push(uldList[j]);
          }
        }
      }
    }
    for (let i = 0; i < uldListWithNoRouteInfo.length; i++) {
      // if (uldListWithNoRouteInfo[i].checkBox) {
      for (let j = 0; j < uldList.length; j++) {
        if (uldList[j].assUldTrolleyId == uldListWithNoRouteInfo[i].assUldTrolleyId
          && uldList[j].loadedShipmentInfoId == uldListWithNoRouteInfo[i].loadedShipmentInfoId) {
          uldListWithRoutingInfo.push(uldList[j]);
        }
      }
      // }
    }
    for (let i = 0; i < uldListWithRoutingInfo.length; i++) {
      let shipment = new UldShipments();
      shipment.segment = uldListWithRoutingInfo[i].segment;
      shipment.shipmentNumber = uldListWithRoutingInfo[i].shipmentNumber;
      shipment.shipmentDate = uldListWithRoutingInfo[i].shipmentDate;
      shipment.assUldTrolleyNo = uldListWithRoutingInfo[i].uldTrolleyNumber;
      shipment.flightKey = this.form.get('newflightKey').value;
      shipment.flightOriginDate = this.form.get('newflightOriginDate').value;
      shipment.shipmentId = uldListWithRoutingInfo[i].shipmentId;
      shipment.segmentId = uldListWithRoutingInfo[i].segmentId;
      shipment.flightId = uldListWithRoutingInfo[i].flightId;
      shipment.assUldTrolleyId = uldListWithRoutingInfo[i].assUldTrolleyId;
      shipment.phcIndicator = 0;
      common.flightId = uldListWithRoutingInfo[i].flightId;
      common.flightSegmentId = uldListWithRoutingInfo[i].flightSegmentId;
      shipment.flightSegmentId = uldListWithRoutingInfo[i].flightSegmentId;
      shipment.contentCode = uldListWithRoutingInfo[i].contentCode;
      shipment.shipmentId = uldListWithRoutingInfo[i].shipmentId;
      shipment.heightCode = uldListWithRoutingInfo[i].heightCode;
      shipment.dryIceWeight = 0;
      shipment.moveDryIce = 0;
      shipment.pieces = uldListWithRoutingInfo[i].pieces;
      shipment.weight = uldListWithRoutingInfo[i].weight;
      common.pieces = uldListWithRoutingInfo[i].pieces;
      common.weight = uldListWithRoutingInfo[i].weight;
      common.natureOfGoods = uldListWithRoutingInfo[i].natureOfGoods;
      common.shipmentNumber = uldListWithRoutingInfo[i].shipmentNumber;
      common.segment = uldListWithRoutingInfo[i].segment;
      shipment.segment = uldListWithRoutingInfo[i].segment;
      // shipment.shipmentType = uldList[i].shipmentType;
      shipment.shcList = uldListWithRoutingInfo[i].shcList;
      shipment.partSuffix = uldListWithRoutingInfo[i].partSuffix;
      shipment.sumOfLoadedWeightForAmend = uldListWithRoutingInfo[i].sumOfLoadedWeightForAmend;
      shipment.sumOfLoadedPiecesForAmend = uldListWithRoutingInfo[i].sumOfLoadedPiecesForAmend;
      shipList.push(shipment);
    }

    uld.shipmentList = shipList;
    uldsList.push(uld);
    common.uldList = uldsList;
    return common;

  }

  performAmendOpeartionForFlightWithRoutingInfo(loadAndUnloadModelForAmendFlight, uldToBeMoved) {
    loadAndUnloadModelForAmendFlight.unLoadShipmentList = uldToBeMoved;
    loadAndUnloadModelForAmendFlight.commonLoadShipment = this.onPrepareLoadDataWithRoutingInfo();


    this.buildupService.onUnloadAndLoadForAmendFlight(loadAndUnloadModelForAmendFlight).subscribe((resp) => {
      this.response = resp;
      if (this.showResponseErrorMessages(this.response)) {
        return;
      }
      if (this.response.success) {
        this.successResponce(this.response);
      } else {
        if (this.response.data.infoAndWarnMessage) {
          this.showConfirmMessage(this.response.data.infoAndWarnMessage).then(fulfilled => {
            loadAndUnloadModelForAmendFlight.skipCpeCheck = true;
            this.buildupService.onUnloadAndLoadForAmendFlight(loadAndUnloadModelForAmendFlight).subscribe((resp) => {
              this.response = resp;
              if (this.response.success) {
                this.successResponce(this.response);
              } else {
                this.showResponseErrorMessages(this.response);
              }
            });

          }).catch(reason => {
          });


        } else if (this.response.data.warnForForeignUld) {
          this.showConfirmMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.5", [this.response.data.foreignUldNumber])).then(fulfilled => {
            loadAndUnloadModelForAmendFlight.ackForeignUld = true;
            this.afterAckOfForegnUld(loadAndUnloadModelForAmendFlight);
          }).catch(reason => {
          });
        }
        else {
          //this.refreshFormMessages(this.response);
          this.showResponseErrorMessages(this.response);
        }

      }
    });
    this.closeRoutingInfoWindow();
  }

  validateRouteForAmendFlight(loadAndUnloadModelForAmendFlight, uldToBeMoved) {
    // this.nonMatchingRoutePresent = false;
    loadAndUnloadModelForAmendFlight.unLoadShipmentList = uldToBeMoved;
    loadAndUnloadModelForAmendFlight.commonLoadShipment = this.onPrepareLoadData();
    loadAndUnloadModelForAmendFlight.commonLoadShipment.flightOffPoint = this.form.get('newsegment').value;
    loadAndUnloadModelForAmendFlight.commonLoadShipment.flightKey = this.form.get('newflightKey').value;
    this.nonMatchingRoutePresent = false;
    this.buildupService.validateRouteForAmendFlight(loadAndUnloadModelForAmendFlight).subscribe((resp) => {
      this.response = resp;
      this.response.data.unLoadShipmentList;
      if (this.response.data.unLoadShipmentList.length > 0) {
        let matchingsno = 1;
        let nonmatchingsno = 1;
        const toBeLoadedListWithMatchingRoute = [];
        const toBeLoadedListWithNonMatchingRoute = [];
        const toBeLoadedListWithNoRouteInfo = [];
        this.response.data.unLoadShipmentList.forEach(element => {

          if (element.routeMatches) {
            element['checkBox'] = true;
            element['sno'] = matchingsno++;
            toBeLoadedListWithMatchingRoute.push(element);

          } else {
            element['checkBox'] = false;
            //Do not Consider shipments without routing info for validation
            if (element.shipmentRoutingInfo != null) {
              toBeLoadedListWithNonMatchingRoute.push(element);
              this.nonMatchingRoutePresent = true;
              element['sno'] = nonmatchingsno++;
            } else {
              toBeLoadedListWithNoRouteInfo.push(element);
            }
          }

        });
        if (this.nonMatchingRoutePresent) {
          this.form.controls['toBeLoadedListWithMatchingRoutes'].patchValue(toBeLoadedListWithMatchingRoute);
          this.form.controls['toBeLoadedListWithNonMatchingRoutes'].patchValue(toBeLoadedListWithNonMatchingRoute);
          this.form.controls['toBeLoadedListWithNoRouteInfo'].patchValue(toBeLoadedListWithNoRouteInfo);
          this.routingInfoWindow.open();
        } else {
          this.onAmendFlight();
        }
        this.form.controls['flightToDisplay'].patchValue(this.form.controls['newflightKey'].value + '-' + NgcUtility.getTenantConfiguration().airportCode + '-' + this.form.controls['newsegment'].value);

      }
    });
  }

  closeRoutingInfoWindow() {
    this.routingInfoWindow.close();
  }

  onCancel(event) {
    this.navigateHome();
  }

}

