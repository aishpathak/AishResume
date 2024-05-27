import { Component, OnInit, ɵConsole } from '@angular/core';
import {
  NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent,
  NgcUtility, NgcTabsComponent, PageConfiguration, NgcLOVComponent, NgcReportComponent
} from 'ngc-framework';

import { ImportService } from '../import.service';
import { ShipmentList, ShipmentListDetails, EccInboundResult, SearchInbound } from '../import.shared';
import { ShipmentDetails } from '../../export/export.sharedmodel';

@Component({
  selector: 'app-ecc-inbound-worksheet',
  templateUrl: './ecc-inbound-worksheet.component.html',
  styleUrls: ['./ecc-inbound-worksheet.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class EccInboundWorksheetComponent extends NgcPage {
  [x: string]: any;
  shipmentArrayData: any;
  displayData: boolean;
  hideCode: boolean = false;
  dataForParam: any;
  locationdropdownsourceparameters: any;
  delLocDropLst: any[];
  AgentCustomerId: any;
  
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  reportParameters: any = new Object();
  constructor(appZone: NgZone, appElement: ElementRef, 
    appContainerElement: ViewContainerRef, 
    private importService: ImportService,
    private router: Router, 
    private activatedRoute: ActivatedRoute) {
      super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    const request: any = new EccInboundResult();
    this.importService.SearchSystemParam(request).subscribe(data => {
      this.response = data.data[0].value;
    });
    const request1: any = new EccInboundResult();
    this.importService.fetchSystemParamECC(request1).subscribe(data => {
      this.response1 = data.data[0].value;
    });

    const navigatedData = this.getNavigateData(this.activatedRoute);
    if(navigatedData != null){
      this.Form.get("workingShift").setValue(navigatedData.workingShift);
      this.Form.get("date").setValue(navigatedData.date);
      this.Form.get("flightKey").setValue(navigatedData.flightNumber);
      this.Form.get("agentsearch").setValue(navigatedData.agentsearch);
      this.dataForParam = navigatedData.dataForParam;
      this.dataToParam = navigatedData.dataToParam;
      this.comTeamId = navigatedData.comTeamId;
      this.onSearch();
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.displayData = false;
  }

  @ViewChild('shipmentWindow') shipmentWindow: NgcWindowComponent;
  resp: any;
  arrayUser: any;
  index: any;
  dataControls: any;
  shipmentArray: any;
  idParameter: any;
  temp: any = new Array();
  disableButton: boolean = false;
  eofilterArray: any;
  eoSummary: any;
  rep: any;
  private Form: NgcFormGroup = new NgcFormGroup({
    workingShift: new NgcFormControl(),
    date: new NgcFormControl(),
    agent: new NgcFormControl(),
    agentsearch: new NgcFormControl(),
    plannedBy: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightHandledBy: new NgcFormControl(),
    teamName: new NgcFormControl(),
    eoArray: new NgcFormControl(),
    // authorizeTo: new NgcFormArray([
    //   new NgcFormGroup({
    //     authorize: new NgcFormControl(),
    //     userID: new NgcFormControl(),
    //   })
    // ]),
    shipmentList: new NgcFormArray([
      new NgcFormGroup({
        dateAta: new NgcFormControl(),
        add: new NgcFormControl(''),
        shipmentListDetails: new NgcFormArray([
          new NgcFormGroup({
            noShow: new NgcFormControl(),
            del: new NgcFormControl(''),
            sourceId: new NgcFormControl(),
            agentCustomerId: new NgcFormControl()
          })
        ]),
      })
    ]),
    shcList: new NgcFormArray([]),
    eqpOperator: new NgcFormArray([]),

  });

  checkCode(item, index, sindex) {


    this.Form.get(['shipmentList', sindex, 'shipmentListDetails', index, 'userid']).patchValue(item.code);

  }

  checkUserID(item, index) {
    this.Form.get(['authorizeTo', index, 'userID']).patchValue(item.desc);
  }

  onEdit(index) {
    this.shipmentWindow.open();
    this.shipmentArray = this.arrayUser.shipmentList[index];
    this.shipmentArrayData = this.shipmentArray.shipmentListDetails;
    this.shipmentArrayData.forEach(dataC => {
      //   dataC.flagCRUD = 'U';
      dataC.shcList.forEach(data => {
        if (data.shc != null)
          data.flagCRUD = 'U';
        else
          data.flagCRUD = 'C';
      });
    });


    this.shipmentArray.shipmentListDetails = this.shipmentArray.shipmentListDetails
      .map(function (shpObj) {
        for (let i = 0; i < 1; i++) {
          if (!shpObj.shcList[i]) {
            shpObj.shcList.push({ shc: '' });
          }
        }
        return shpObj;
      });
    this.Form.controls.ShipmentForm.patchValue(this.shipmentArray);
  }

  onSearch() {
    //    this.isTableFlg = false;

    const req: SearchInbound = new SearchInbound();
    req.workingShift = this.Form.get('workingShift').value;
    req.flightKey = this.Form.get('flightKey').value;
    req.date = this.Form.get('date').value;
    req.agent = this.AgentCustomerId;
    req.startsAt = this.dataForParam;
    req.endsAt = this.dataToParam;
    req.comTeamId = this.comTeamId;
    this.rep = req;
    this.importService.searchResult(req).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;
      this.worksheetData = this.resp.worksheetID;
      this.teamID = this.createSourceParameter(this.resp.comTeamId);

      this.arrayUser = this.resp;
      if (this.arrayUser) {

        this.arrayUser.shipmentList = this.arrayUser.shipmentList.map(function (shpObj) {
          shpObj.shipmentListDetails.forEach(obj => {
            if (obj.shcList != null) {
              obj.shcListDelimStr = obj.shcList
                .map(function (shipObj) { return shipObj.shc }).join(" ");
            }

          });
          return shpObj;
        });
        // this.eoSummary = [];
        this.arrayUser.shipmentList.forEach(element => {
          // if (element.agent != null) {
          //   this.locationdropdownsourceparameters = this.createSourceParameter(element.agent);
          //   this.retrieveDropDownListRecords('DELIVERY_LOCATION_ECCWORKSHEET', 'query', this.locationdropdownsourceparameters).subscribe(data => {
          //     console.log(data);
          //     if (data) {
          //       let sourceId: string = NgcUtility.createAndCacheSourceByObjectList(data);
          //       console.log(sourceId)
          //       element.sourceId = sourceId;
          //     }


          //   });
          // }
          element.shipmentListDetails.forEach(ele => {
            //     ele.eqpOperator.forEach(eleme => {
            //       if (this.eoSummary.indexOf(eleme.eo) == -1) {
            //         this.eoSummary.push(eleme.eo);
            //       }
            //     });


            if (ele.createdOn != null) {
              if (NgcUtility.dateDifference(NgcUtility.subtractDate(element.sta, this.response1, 'h'), (ele.createdOn)) < 0) {
                ele.lateBooking = 'Yes';

              }
            }
            else {
              ele.lateBooking = 'No';
            }
            // if (ele.agent != null) {
            //   this.locationdropdownsourceparameters = this.createSourceParameter(ele.agent);
            //   this.retrieveDropDownListRecords('DELIVERY_LOCATION_ECCWORKSHEET', 'query', this.locationdropdownsourceparameters).subscribe(data => {
            //     console.log(data);
            //     if (data) {
            //       let sourceId: string = NgcUtility.createAndCacheSourceByObjectList(data);
            //       console.log(sourceId)
            //       ele.sourceId = sourceId;
            //     }


            //   });
            // }



          });
          if (element.ata != null) {
            element.dateAta = element.ata;
          }

          //element.sourceId = null;
        });
        if (this.arrayUser.plannedBy) {
          this.arrayUser.plannedBy = this.arrayUser.plannedBy.split(",");
        }
        if (this.arrayUser.flightHandledBy) {
          this.arrayUser.flightHandledBy = this.arrayUser.flightHandledBy.split(",");
        }
        this.Form.controls['eoArray'].patchValue(this.arrayUser.eoSummary);
        this.Form.controls['plannedBy'].patchValue(this.arrayUser.plannedBy);
        this.Form.controls['flightHandledBy'].patchValue(this.arrayUser.flightHandledBy);
        this.arrayUser.shipmentList.forEach(element => {
          element.add = '';
        });
        this.Form.controls['shipmentList'].patchValue(this.arrayUser.shipmentList);

        let index = 0;
        this.arrayUser.shipmentList.forEach(element => {
          let subIndex = 0;
          element.shipmentListDetails.forEach(ele => {

            if (ele.status == "DELIVERED" || ele.noShow || ele.status == "HANDEDOVER") {
              this.Form.get(['shipmentList', index, 'shipmentListDetails', subIndex]).disable();

              this.Form.get(['shipmentList', index, 'shipmentListDetails', subIndex, 'del']).disable();

              this.Form.get(['shipmentList', index, 'shipmentListDetails', subIndex, 'select']).enable();
            }

            subIndex++;
          });
          index++;

        });
        this.Form.get('teamName').setValue(this.arrayUser.teamName);
        this.Form.get('workingShift').setValue(req.workingShift);
        this.arrayUser.date = NgcUtility.toDateFromLocalDate(this.arrayUser.date);


        this.Form.get('date').setValue(this.arrayUser.date);
        this.displayData = true;
        this.resetFormMessages();
      }
      else {
        this.showErrorStatus("import.err109");
      }
    })

  }


  delete(index, sindex) {
    this.showConfirmMessage('want.to.delete').then(fulfilled => {
      (<NgcFormArray>this.Form.get(['shipmentList', sindex, 'shipmentListDetails'])).markAsDeletedAt(index);
    })
  }


  public onBack(event) {    
    this.navigateBack(this.Form.getRawValue());
  }

  navigate(event) {
    let workingShift = this.Form.get("workingShift").value;
    let date = this.Form.get("date").value;
    let flightNumber = this.Form.get("flightKey").value;
    let agentsearch = this.Form.get("agentsearch").value;
    let countSelect = 0;
    let agent;
    let list = this.Form.get('shipmentList').value;
    list.forEach(element => {
      element.shipmentListDetails.forEach(ele => {
        if (ele.select) {
          countSelect++;
          agent = ele.agent;
        }
      });

    });
    if (countSelect > 1) {
      this.showErrorMessage('select.one.record');
    }
    else if (countSelect == 0) {
      this.showErrorMessage("select.record.to.navigate");
    }else{
      var dataToSend = {
        workingShift: workingShift,
        date: date,
        flightNumber:flightNumber,
        agentsearch:agentsearch,
        dataForParam:this.dataForParam,
        dataToParam:this.dataToParam,
        comTeamId:this.comTeamId,
        agent:agent
      }
      
      this.navigateTo(this.router, 'admin/maintainagentloc', dataToSend);
    }    
  }
  navigateDisplayFfm(event) {
    let workingShift = this.Form.get("workingShift").value;
    let date = this.Form.get("date").value;
    let flightNumber = this.Form.get("flightKey").value;
    let agentsearch = this.Form.get("agentsearch").value;
    let list = this.Form.get('shipmentList').value;    
    let flightKey;
    let counter = 0;
    list.forEach(element => {
        if (list.length > 0) {
            let select = false;
            //Get the shipment information
            element.shipmentListDetails.forEach(t => {
              if(t.select && !select){
                select = true;
              }
            });

            if (select) {
                flightKey = element.flightKey;
                counter = counter + 1;
            }
        }
    });
    if (counter == 0) {
        this.showErrorMessage('export.select.a.shipment');
        return;
    }else if(counter > 1){
        this.showErrorMessage('selectOneSM');
        return;            
    }

    var dataToSend = {
      workingShift: workingShift,
      date: date,
      flightNumber:flightNumber,
      flightKey:flightKey,
      agentsearch:agentsearch,
      flightDate:date,
      dataForParam:this.dataForParam,
      dataToParam:this.dataToParam,
      comTeamId:this.comTeamId
    }
    this.navigateTo(this.router, 'import/displayffm', dataToSend);
  }
  navigateBreakdownWorkingList(event) {
    let workingShift = this.Form.get("workingShift").value;
    let date = this.Form.get("date").value;
    let flightNumber = this.Form.get("flightKey").value;
    let agentsearch = this.Form.get("agentsearch").value;
    let list = this.Form.get('shipmentList').value;
    let flightKey;
    let counter = 0;
    list.forEach(element => {
        if (list.length > 0) {
            let select = false;
            //Get the shipment information
            element.shipmentListDetails.forEach(t => {
              if(t.select && !select){
                select = true;
              }
            });

            if (select) {
                flightKey = element.flightKey;
                counter = counter + 1;
            }
        }
    });
    if (counter == 0) {
        this.showErrorMessage('export.select.a.shipment');
        return;
    }else if(counter > 1){
        this.showErrorMessage('selectOneSM');
        return;            
    }

    var dataToSend = {
      workingShift: workingShift,
      date: date,
      flightNumber:flightNumber,
      agentsearch:agentsearch,
      dataForParam:this.dataForParam,
      dataToParam:this.dataToParam,
      comTeamId:this.comTeamId,
      shipmentData: {
        flightNumber:flightKey,
        flightDate:date
      }
    }
    this.navigateTo(this.router, 'import/breakdownworkinglist', dataToSend);
  }
  navigateCargoPreAnnouncementTable(event) {
    let workingShift = this.Form.get("workingShift").value;
    let date = this.Form.get("date").value;
    let flightNumber = this.Form.get("flightKey").value;
    let agentsearch = this.Form.get("agentsearch").value;
    let list = this.Form.get('shipmentList').value;
    let flightKey;
    let counter = 0;
    list.forEach(element => {
        if (list.length > 0) {
            let select = false;
            //Get the shipment information
            element.shipmentListDetails.forEach(t => {
              if(t.select && !select){
                select = true;
              }
            });

            if (select) {
                flightKey = element.flightKey;
                counter = counter + 1;
            }
        }
    });
    if (counter == 0) {
        this.showErrorMessage('export.select.a.shipment');
        return;
    }else if(counter > 1){
        this.showErrorMessage('selectOneSM');
        return;            
    }

    var dataToSend = {
      workingShift: workingShift,
      date: date,
      flightNumber:flightNumber,
      flight:flightKey,
      agentsearch:agentsearch,
      flightDate:date,
      dataForParam:this.dataForParam,
      dataToParam:this.dataToParam,
      comTeamId:this.comTeamId
    }
    this.navigateTo(this.router, 'import/preannouncement/CARGO', dataToSend);
  }
  navigateShipmentInfo(event) {
    let workingShift = this.Form.get("workingShift").value;
    let date = this.Form.get("date").value;
    let flightNumber = this.Form.get("flightKey").value;
    let agentsearch = this.Form.get("agentsearch").value;
    let countSelect = 0;
    let shipmentNumber;
    let shipmentType;
    let list = this.Form.get('shipmentList').value;
    list.forEach(element => {
      element.shipmentListDetails.forEach(ele => {
        if (ele.select) {
          countSelect++;
          shipmentNumber = ele.shipmentNumber;
          shipmentType = ele.shipmentType;
        }
      });

    });
    if (countSelect > 1) {
      this.showErrorMessage('select.one.record');
    }
    else if (countSelect == 0) {
      this.showErrorMessage("select.record.to.navigate");
    }
    else {
      var dataToSend = {
        workingShift: workingShift,
        date: date,
        flightNumber:flightNumber,
        agentsearch:agentsearch,
        shipmentNumber:shipmentNumber,
        shipmentType:shipmentType,
        dataForParam:this.dataForParam,
        dataToParam:this.dataToParam,
        comTeamId:this.comTeamId
      }
      this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', dataToSend);
    }

  }
  onSave($event) {
    const request1 = (<NgcFormGroup>this.Form).getRawValue();
    const request: EccInboundResult = request1;
    request1.worksheetID = this.worksheetData;
    request1.startsAt = this.dataForParam;
    request1.endsAt = this.dataToParam;
    request1.eoArray = null;
    request1.shipmentList.forEach(element => {
      element.ata = null;
    });
    if (request1.plannedBy) {
      request1.plannedBy = request1.plannedBy.join(",");
    }
    if (request1.flightHandledBy) {
      request1.flightHandledBy = request1.flightHandledBy.join(",");
    }
    request1.agentsearch = this.AgentCustomerId;
    this.importService.saveResult(request1).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();
      }

    },
      error => {
        this.showErrorMessage(error);
      });

  }

  noShow(item) {
    this.arr = this.Form.getRawValue().shipmentList;


    let index = 0;
    const shipments = this.Form.getRawValue().shipmentList;
    shipments.forEach(shipmentList => {
      let subIndex = 0;
      shipmentList.shipmentListDetails.forEach(details => {
        const shipment: NgcFormControl = this.Form.get(['shipmentList', index, 'shipmentListDetails', subIndex, 'shipmentNumber']) as NgcFormControl;
        const agent: NgcFormControl = this.Form.get(['shipmentList', index, 'shipmentListDetails', subIndex, 'agent']) as NgcFormControl;
        const status: NgcFormControl = this.Form.get(['shipmentList', index, 'shipmentListDetails', subIndex, 'status']) as NgcFormControl;
        let count = 0;
        if (details.select) {
          shipmentList.ata = NgcUtility.toDateFromLocalDate(shipmentList.ata).substr(0, 5);
          if (details.agent == null || details.agent == '') {
            this.showFormControlErrorMessage(agent, 'error.agent.cant.empty');
            count++;
          }          
          if (details.status !== null) {
            if (details.status !== '') {
              this.showFormControlErrorMessage(status, NgcUtility.translateMessage('error.no.show.shpmnt.status.cant.done',[details.status]));
              count++;
            }
          }

          if (count == 0) {
            this.Form.get(['shipmentList', index, 'shipmentListDetails', subIndex, 'noShow']).patchValue(true);
          }
        }
        subIndex++;
      })
      index++;
    })



  }
  onShipmentSelect(event, flightIndex, shipmentIndex) {
    const shipmentGroup: NgcFormGroup = this.Form.get(['shipmentList', flightIndex, 'shipmentListDetails', shipmentIndex]) as NgcFormGroup;
    //
    if (shipmentGroup && event.shipmentType) {
      shipmentGroup.get('shipmentType').setValue(event.shipmentType);
    }
    if (event.shipmentType == 'CBV' || event.shipmentType == 'UCB') {
      // console.log(this.Form.getRawValue().shipmentList[flightIndex].shipmentListDetails[shipmentIndex].shcList);

      let count = 0;
      this.Form.getRawValue().shipmentList[flightIndex].shipmentListDetails[shipmentIndex].shcList.forEach(element => {
        if (element.shc == 'COU') {
          count++;
        }

      });

      if (count == 0) {
        (shipmentGroup.get('shcList') as NgcFormArray).addValue([{ shc: 'COU' }]);
      }

    }
    else if (event.shipmentType == 'AWB') {

      let count1 = 0;
      this.Form.getRawValue().shipmentList[flightIndex].shipmentListDetails[shipmentIndex].shcList.forEach(element => {
        if (element.shc == 'RAC') {
          count1++;
        }

      });

      if (count1 == 0) {
        (shipmentGroup.get('shcList') as NgcFormArray).addValue([{ shc: 'RAC' }]);
      }
    }

  }
  public onAddRow(event) {
    (<NgcFormArray>this.Form.controls['authorizeTo']).addValue([
      {

        authorize: '',
        flagCRUD: 'C',
        userID: '',
      }
    ]);
  }
  public onAdd(index) {
    let value = this.Form.get(['shipmentList', index, 'shipmentListDetails', 0]).value;
    let operator = value.eqpOperator;
    (<NgcFormArray>this.Form.get(['shipmentList', index, 'shipmentListDetails'])).addValue([
      {
        select: false,
        shipmentNumber: '',
        colour: true,
        pieces: '',
        weight: '',
        agent: '',
        eqpOperator: operator,
        shipmentType: '',
        userid: '',
        uldnumber: '',
        AWBNumber: '',
        loadingAdivce: '',
        wareHouseLocation: '',
        deliveryLocation: '',
        remarks: '',
        status: '',
        noShow: false,
        flagMaintain: 'C',
        lateBooking: '',
        del: '',
        sourceId: '',
        agentCustomerId: '',
        flagCRUD: 'C',
        shcList: [

        ],
      }
    ]);

  }

  assignData(item) {
    console.log(item)
    this.dataForParam = item.parameter1;
    this.dataToParam = item.parameter2;
    this.comTeamId = item.parameter4;
  }

  addFlight(event) {
    // this.displayList = true;

    (<NgcFormArray>this.Form.get(['shipmentList'])).addValue([
      {
        flightKey: '',
        sta: '',
        eta: '',
        ata: '',
        bay: '',
        flightID: '',
        add: '',
        shipmentListDetails: [
          {
            select: false,
            del: '',
            shipmentNumber: '',
            pieces: '',
            weight: '',
            agent: '',
            eqpOperator: [],
            shipmentType: '',
            userid: '',
            uldnumber: '',
            AWBNumber: '',
            loadingAdivce: '',
            wareHouseLocation: '',
            deliveryLocation: '',
            remarks: '',
            status: '',
            noShow: false,
            flagMaintain: 'C',
            colour: true,
            lateBooking: '',
            sourceId: '',
            agentCustomerId: '',
            flagCRUD: 'C',
            shcList: [

            ],
          }
        ],
      }
    ]);
    // (this.form.get('flightList') as NgcFormArray).controls.forEach((flightGroup: NgcFormGroup) => {
    //   (flightGroup.get('shipmentList') as NgcFormArray).controls.forEach((shipmentGroup: NgcFormGroup) => {
    //     (shipmentGroup.get('shcList') as NgcFormArray).controls.forEach((shcGroup: NgcFormArray, index: number) => {

    //       const shc: NgcFormControl = shcGroup.get('shc') as NgcFormControl;
    //       if (index === 0) {
    //         shc.setValidators([Validators.required]);
    //       }
    //     });
    //   });
    // });
  }

  public onFlightKey(index, event) {
    const req: ShipmentList = new ShipmentList();
    req.flightDate = this.Form.get('date').value;
    req.agent = this.Form.get('agent').value;
    req.flightKey = event;
    req.checkFlag = true;
    //  req.origin = event;
    this.importService.searchFlight(req).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.data) {
        this.resp = data.data;
        this.Form.get(['shipmentList', index, 'sta']).setValue(this.resp.sta);
        this.Form.get(['shipmentList', index, 'eta']).setValue(this.resp.eta);
        this.Form.get(['shipmentList', index, 'ata']).setValue(this.resp.ata);
        this.Form.get(['shipmentList', index, 'bay']).setValue(this.resp.bay);
        this.Form.get(['shipmentList', index, 'flightID']).setValue(this.resp.flightID);
        this.Form.get(['shipmentList', index, 'shipmentListDetails']).enable();
        //  this.Form.get(['shipmentList', index, 'del']).enable();
        this.Form.get(['shipmentList', index, 'add']).enable();

      }
      else {


        if (data.data == null) {
          this.Form.get(['shipmentList', index, 'shipmentListDetails']).disable();
          this.Form.get(['shipmentList', index, 'shipmentListDetails']).disable();
          this.Form.get(['shipmentList', index, 'add']).disable();

          // (this.Form.get('shipmentList') as NgcFormArray).controls.forEach(element => {
          //   if ((element.get('flagCRUD')).value === 'C')
          //     element.get('del').disable();
          //   (element.get('shipmentList') as NgcFormArray).controls.forEach((group: NgcFormGroup) => {
          //     group.get('select').enable();

          //   });
          // });

        }

      }

    })
  }

  onPrintReport() {
    this.reportParameters = new Object();
    this.reportParameters.starttime = this.rep.startsAt;
    this.reportParameters.endtime = this.rep.endsAt;
    this.reportParameters.date = this.rep.date;
    if (this.rep.agent != null) {
      this.reportParameters.agent = this.rep.agent;
      this.reportParameters.flag = '1';
    } else {
      this.reportParameters.flag = '0';
    }
    console.log(this.reportParameters);
    //this.reportWindow.downloadReport();
    this.reportWindow.open();
  }

  //For the fix of  10934
  OnSelectAgentCode(event, flightIndex, shipmentIndex) {
    console.log(event.code, flightIndex, shipmentIndex);
    this.locationdropdownsourceparameters = this.createSourceParameter(event.param1);
    this.locationdropdownsourceparameters.parameter1 = event.param1;
    //  this.Form.get(['shipmentList', flightIndex, 'shipmentListDetails', shipmentIndex, 'agentCustomerId']).setValue(event.param1);
    this.retrieveDropDownListRecords('DELIVERY_LOCATION_ECCWORKSHEET', 'query', this.locationdropdownsourceparameters).subscribe(data => {
      console.log(data);
      if (data) {
        let sourceId: string = NgcUtility.createAndCacheSourceByObjectList(data);
        console.log(sourceId)
        this.Form.get(['shipmentList', flightIndex, 'shipmentListDetails', shipmentIndex, 'sourceId']).setValue(sourceId);
      }


    });
  }
  onSelectAgent(event) {
    this.AgentCustomerId = event.param1;
  }

}







