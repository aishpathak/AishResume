import { Router } from "@angular/router";
import { WarehouseService } from "./../../warehouse.service";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import {
  NgcPage,
  NgcContainer,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcWindowComponent,
  NgcUtility
} from "ngc-framework";

@Component({
  selector: "ngc-whs-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.scss"]
})
export class LocationComponent extends NgcPage {
  form = new NgcFormGroup({
    finalLocationsList: new NgcFormArray([]),
    whZone: new NgcFormControl(),
    temperatureRange: new NgcFormControl(),
    selectedLocationType: new NgcFormControl()
  });
  openAllocateTruckDock;
  @ViewChild("windowAllocateAgent")
  windowAllocateAgent: NgcWindowComponent;
  @ViewChild("windowAddDevice")
  windowAddDevice: NgcWindowComponent;
  @ViewChild("windowAllocateWorkStation")
  windowAllocateWorkStation: NgcWindowComponent;
  @ViewChild("windowSetAvailabilityDate")
  windowSetAvailabilityDate: NgcWindowComponent;
  @Input()
  locationList;
  currentLocationList = [];
  @Input()
  allParentsNames;
  @Input()
  allParentsIds;
  @Input()
  sector;
  @Input()
  parentConstraintName;
  @Input()
  parentConstraintId;
  @Output()
  fetchNewLocationList = new EventEmitter();
  totalOfLocations;
  sourceLocationsType;
  availabilityRequest;
  temperatureRangeHash = {};
  noOfColumns;
  noOfRows;
  truckDockPresent = false;
  finalLocationsList = [];
  // for pagination added fromSlice and toSlice
  fromSlice = 0;
  toSlice = 3;
  popUpWindowConfig = {
    allocateAgentToTruckDock: false,
    allocateWorkStationToAirside: false,
    addDevices: false,
    setUpDates: false
  };
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private service: WarehouseService,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.sourceLocationsType = NgcUtility.createAndCacheSourceByObjectList(this.readAllLocationType(this.locationList));
    this.truckDockPresent = this.isTruckDockPresent(this.locationList);
    // this.initialize();
    this.getTemperatureRangeHashTable();
  }

  getTemperatureRangeHashTable() {
    this.retrieveDropDownListRecords("Admin$TemperatureRange").subscribe(
      data => {
        console.log(data);
        data.forEach(eachRow => {
          this.temperatureRangeHash[eachRow.code] = eachRow.desc.replace(
            "Degree",
            ""
          );
          this.temperatureRangeHash[eachRow.code] = this.temperatureRangeHash[
            eachRow.code
          ].replace(" to ", "-");
        });
      }
    );
  }

  ngOnChanges(changes) {
    console.log(changes);
    let formRawValue = this.form.getRawValue();
    this.currentLocationList = this.filterLocationsListByType(
      this.locationList,
      formRawValue.selectedLocationType
    );
    this.initialize();
  }

  readAllLocationType(locationsList) {
    let locationTypes = [];
    let hash = {};
    locationTypes.push({
      desc: "All",
      code: "All"
    });
    for (let location of locationsList) {
      if (!hash[location.locationType]) {
        hash[location.locationType] = true;
        locationTypes.push({
          desc: location.locationType,
          code: location.locationType
        });
      }
    }
    return locationTypes;
  }

  filterLocationsListByType(locationsList, locationType) {
    let filteredLocationsList = [];
    for (let location of locationsList) {
      if (location.locationType === locationType) {
        filteredLocationsList.push(location);
      }
    }
    return filteredLocationsList;
  }

  onChangeLocationType(event) {
    console.log(event);
    let formRawValue = this.form.getRawValue();
    this.currentLocationList = this.filterLocationsListByType(
      this.locationList,
      formRawValue.selectedLocationType
    );
    this.initialize();
  }

  initialize() {
    console.log(JSON.stringify(this.currentLocationList));
    this.currentLocationList = this.currentLocationList.length
      ? this.currentLocationList
      : this.locationList;
    this.finalLocationsList = [];

    this.totalOfLocations = this.currentLocationList.length;
    if (this.totalOfLocations <= 16) {
      this.noOfColumns = this.totalOfLocations;
    } else {
      this.noOfColumns = 16;
    }
    this.noOfRows =
      this.totalOfLocations % this.noOfColumns === 0
        ? this.totalOfLocations / this.noOfColumns
        : this.totalOfLocations / this.noOfColumns + 1;
    this.noOfRows = Math.floor(this.noOfRows);
    let trackLocationList = 0;
    for (let i = 0; i < this.noOfRows; ++i) {
      let insideList = {
        innerList: []
      };
      this.finalLocationsList.push(insideList);
      for (let j = 0; j < this.noOfColumns; ++j) {
        if (trackLocationList < this.totalOfLocations) {
          this.finalLocationsList[i].innerList.push(
            this.currentLocationList[trackLocationList++]
          );
        } else {
          break;
        }
      }
      this.form.get(["finalLocationsList"]).patchValue(this.finalLocationsList);
    }
  }

  isTruckDockPresent(locationList) {
    for (let location of locationList) {
      if (location.locationType === "TRUCKDOCK") {
        return true;
      }
    }
    return false;
  }

  returnIconTypeOccupied(locationFormGroup) {
    var location = locationFormGroup.getRawValue();
    if (location.temperatureRange) {
      // console.log(location);
    }
    if (location.occupied) {
      return "storage";
    }
    return "nothing";
  }

  arrayOne(n) {
    return Array(n + 1);
  }

  returnIconTypeAvailable(locationFormGroup) {
    var location = locationFormGroup.getRawValue();
    // console.log(location);
    if (location.availableToUseFlag) {
      return "yesno";
      // return 'ban';
    }
    return "close";
  }

  returnIconTypeLock(locationFormGroup) {
    var location = locationFormGroup.getRawValue();
    // console.log(location);
    // lockedFlag
    if (location.lockedFlag) {
      return "lock";
    }
    return "unlock";
  }

  retrieveCharacter(charVal, index) {
    return String.fromCharCode(charVal.charCodeAt(0) + index);
  }

  onLock() {
    let request = this.onFormRequest("lock");
    // console.log(request);
    for (let location of request.locationsList) {
      location.columnName = "LockedFlag";
      location.columnValue = 1;
    }
    this.onChangeFlagsService(request);
  }

  onUnlock() {
    let request = this.onFormRequest("unlock");
    // console.log(request);
    for (let location of request.locationsList) {
      location.columnName = "LockedFlag";
      location.columnValue = 0;
    }
    this.onChangeFlagsService(request);
  }

  onSetUpDateRange(constructRequestParameter, columnValue) {
    let request = this.onFormRequest(constructRequestParameter);
    for (let location of request.locationsList) {
      location.columnName = "AvaibleToUseFlag";
      location.columnValue = columnValue;
    }
    //   this.popUpWindowConfig.setUpDates = true;
    // this.tempFunctionName = functionName;
    this.availabilityRequest = request;
    this.windowSetAvailabilityDate.open();
  }

  onConfirmDateRange(fromDate, toDate) {
    console.log(fromDate, toDate);
    if (!fromDate) {
      this.showInfoStatus('warehouse.fromdate.mandatory');
      return;
    }
    for (let location of this.availabilityRequest.locationsList) {
      location.availabilityDateFrom = fromDate;
      location.availabilityDateTo = toDate;
    }
    // this[this.tempFunctionName]();
    this.onChangeFlagsService(this.availabilityRequest);
    this.windowSetAvailabilityDate.close();
  }

  onMarkAvailable() {
    // let request = this.onFormRequest("markAvailable");
    // for (let location of request.locationsList) {
    //   location.columnName = "AvaibleToUseFlag";
    //   location.columnValue = 1;
    // }
    // this.onChangeFlagsService(request);
  }

  onMarkUnavailable() {
    // let request = this.onFormRequest("markUnavailable");
    // // console.log(request);
    // for (let location of request.locationsList) {
    //   location.columnName = "AvaibleToUseFlag";
    //   location.columnValue = 0;
    // }
    // this.onChangeFlagsService(request);
  }

  onConfirmMarkingAvailability() { }

  onChangeFlagsService(request) {
    this.service.updateLocationFlags(request).subscribe(resp => {
      // console.log(resp);
    });
  }

  onDeleteLocations() {
    let request: any = this.onFormRequest("delete");
    // onDeleteLocations
    request.whsSectorId = this.sector.whsSectorId;
    for (let location of request.locationsList) {
      location.flagCRUD = "D";
    }
    this.service.addLocations(request).subscribe(resp => {
      if (resp.data) {
        if (resp.data.messageList.length) {
          this.showResponseErrorMessages(resp.data.messageList[0]);
        } else {
          this.fetchNewLocationList.emit(resp.data.locationsList);
          this.showSuccessStatus("g.completed.successfully");
        }
      }
    });
  }

  onFormRequest(param1) {
    let formArrayRawValue = this.form.getRawValue().finalLocationsList;
    // console.log(formArrayRawValue);
    let response: any = {};
    response.locationsList = [];
    let i = 0;
    for (let eachRow of formArrayRawValue) {
      let j = 0;
      for (let location of eachRow.innerList) {
        if (location.select) {
          response.locationsList.push(location);
          if (param1 === "lock") {
            this.form
              .get(["finalLocationsList", i, "innerList", j, "lockedFlag"])
              .setValue(true);
          } else if (param1 === "unlock") {
            this.form
              .get(["finalLocationsList", i, "innerList", j, "lockedFlag"])
              .setValue(false);
          } else if (param1 === "markAvailable") {
            this.form
              .get([
                "finalLocationsList",
                i,
                "innerList",
                j,
                "availableToUseFlag"
              ])
              .setValue(true);
          } else if (param1 === "markUnavailable") {
            this.form
              .get([
                "finalLocationsList",
                i,
                "innerList",
                j,
                "availableToUseFlag"
              ])
              .setValue(false);
          }
          if (param1 !== "delete")
            this.form
              .get(["finalLocationsList", i, "innerList", j, "select"])
              .setValue(false);
        }
        ++j;
      }
      ++i;
    }
    return response;
  }

  onGetSelectedLocationList(value, fn) {
    let formArrayRawValue = this.form.getRawValue().finalLocationsList;
    // console.log(formArrayRawValue);
    let response: any = {};
    response.locationsList = [];
    let i = 0;
    for (let eachRow of formArrayRawValue) {
      let j = 0;
      for (let location of eachRow.innerList) {
        if (location.select) {
          response.locationsList.push(location);
          // this.form.get(['finalLocationsList', i, 'innerList', j, 'whZone']).setValue(
          //     this.form.get('whZone').value
          // );
          fn(value, i, j, location);
        }
        ++j;
      }
      ++i;
    }
    return response;
  }

  onShowDevices() {

  }

  onAddDevicesIcon(index, sindex) {
    (<NgcFormControl>this.form.get(['finalLocationsList', index, 'innerList', sindex,
      'select'])).setValue(true);
    this.onAddDevices();
  }

  onAddDevices() {
    this.popUpWindowConfig.addDevices = false;
    this.service.setAllParentsNames(this.allParentsNames);
    this.service.setAllParentsIds(this.allParentsIds);
    this.service.setSectorModel(this.sector);
    let formArrayRawValue = this.form.getRawValue().finalLocationsList;
    let fetchWhsLocationDeviceMappingRequest: any = {};
    fetchWhsLocationDeviceMappingRequest.locationsList = [];
    for (let eachRow of formArrayRawValue) {
      for (let location of eachRow.innerList) {
        if (location.select) {
          fetchWhsLocationDeviceMappingRequest.locationsList.push(location);
        }
      }
    }

    this.service
      .fetchWhsLocationDeviceMapping(fetchWhsLocationDeviceMappingRequest)
      .subscribe(
        resp => {
          if (resp.data) {
            const locationsList = [];
            let noOfDeviceSets = 0;
            let hashTable = {};
            for (const location of resp.data.locationsList) {
              const devicesList = [];
              for (const device of location.whsLocationDeviceMappingList) {
                devicesList.push({
                  whsLocationDeviceMappingId: device.whsLocationDeviceMappingId
                });
              }
              locationsList.push({
                whsLocationDeviceMappingList: devicesList
              });
            }
            for (let location of locationsList) {
              if (
                !hashTable[
                JSON.stringify(location.whsLocationDeviceMappingList)
                ]
              ) {
                ++noOfDeviceSets;
                hashTable[
                  JSON.stringify(location.whsLocationDeviceMappingList)
                ] = true;
              }
            }
            // alert(noOfDeviceSets);
            if (noOfDeviceSets === 1) {
              this.service.setdataToSetUpDevices(resp.data);
              // this.router.navigate(['warehouse', 'setupdevices']);
              setTimeout(() => {
                this.popUpWindowConfig.addDevices = true;
                this.windowAddDevice.open();
              }, 0);
            } else {
              this.showInfoStatus(
                "warehouse.location.samesetofdevice"
              );
            }
          } else {
          }
        },
        err => {
        }
      );
  }

  onAllocateAgentToTruckDock() {
    this.service.setAllParentsNames(this.allParentsNames);
    this.service.setAllParentsIds(this.allParentsIds);
    this.service.setSectorModel(this.sector);
    // this.router.navigate(['warehouse', 'allocatetruckdock']);
    this.popUpWindowConfig.allocateAgentToTruckDock = true;
    this.windowAllocateAgent.open();
  }

  onAllocateWorkStationToAirside() {
    this.service.setAllParentsNames(this.allParentsNames);
    this.service.setAllParentsIds(this.allParentsIds);
    this.service.setSectorModel(this.sector);
    // this.router.navigate(['warehouse', 'allocatetruckdock']);
    this.popUpWindowConfig.allocateWorkStationToAirside = true;
    this.windowAllocateWorkStation.open();
  }

  addToZone() {
    let request = this.onGetSelectedLocationList(
      this.form.get("whZone").value,
      (value, i, j, location) => {
        this.form
          .get(["finalLocationsList", i, "innerList", j, "whZone"])
          .setValue(value);
        location.whZone = value;
      }
    );
    // for (let location of request.locationsList) {
    //     location.whZone = this.form.get('whZone').value;
    // }
    this.service.updateZoneCodes(request).subscribe(
      resp => {
        if (resp.data) {
          this.showSuccessStatus("g.completed.successfully");
          console.log(resp);
        } else {
          this.showErrorStatus("warehouse.someexception.fromserver");
        }
      },
      err => {
        this.showErrorStatus("warehouse.unable.tocontactserver");
      }
    );
  }

  setTemperatureRange() {
    let request = this.onGetSelectedLocationList(
      this.form.get("temperatureRange").value,
      (value, i, j, location) => {
        this.form
          .get(["finalLocationsList", i, "innerList", j, "temperatureRange"])
          .setValue(value);
        location.temperatureRange = value;
      }
    );
    this.service.updateTemperatureRange(request).subscribe(
      resp => {
        if (resp.data) {
          this.showSuccessStatus("g.completed.successfully");
          console.log(resp);
        } else {
          this.showErrorStatus("warehouse.someexception.fromserver");
        }
      },
      err => {
        this.showErrorStatus("warehouse.unable.tocontactserver");
      }
    );
  }

  onPreviousNext(event) {
    if (event == 'next') {
      this.fromSlice += 3;
      this.toSlice += 3;
      this.retrieveCharacter('A', this.toSlice);
    } else {
      this.fromSlice -= 3;
      this.toSlice -= 3;
      this.retrieveCharacter('A', this.toSlice);
    }
  }
}
