import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef,
  ViewChild, HostListener,
  Input, SimpleChanges
} from '@angular/core';
import {
  NgcPage,
  PageConfiguration,
  NgcFormGroup,
  NgcFormControl,
  NgcFormArray,
  NgcUtility,
  NgcWindowComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomACESService } from '../customs.service';
import { CustomsHouseSearchModel, CustomsHouseModel } from '../customs.sharedmodel';


@Component({
  selector: 'app-maintain-hawb-list',
  templateUrl: './maintain-hawb-list.component.html',
  styleUrls: ['./maintain-hawb-list.component.scss']
})





@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: false
})
export class MaintainHawbListComponent extends NgcPage {

  constructor(
    private houseService: CustomACESService,
    private router: Router,
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  @ViewChild('houseInformationWindow')
  private houseInformationWindow: NgcWindowComponent;

  private maintainHAWBList: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    flightATA: new NgcFormControl(),
    hawbCount: new NgcFormControl(),
    awbPieces: new NgcFormControl(),
    awbWeight: new NgcFormControl(),
    manifestPieces: new NgcFormControl(),
    manifestWeight: new NgcFormControl(),
    fhlPieces: new NgcFormControl(),
    fhlweight: new NgcFormControl(),
    status: new NgcFormControl(),

    customsHouse: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        sno: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        natureOfGoods: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        latestCC: new NgcFormControl(),
        latestCcFlightNoDate: new NgcFormControl(),
        piecesWeight: new NgcFormControl()
      })
    ])
  });

  customsHouseSearchRequest = new CustomsHouseSearchModel();
  response: any;

  // screen size for the houseinformation window
  screenWidth: number;
  screenHeight: number;

  // data to be forwarded to window or next screen
  forwardedData: CustomsHouseModel;

  showAsPopup = false;
  isFhlButtonDisabled = false


  ngOnInit() {
    super.ngOnInit();

    this.setScreenSize();

    if (this.getNavigateData(this.activatedRoute)) {
      this.customsHouseSearchRequest = this.getNavigateData(this.activatedRoute);
      this.onSearch();
    }

  }


  /**
   * method to retrieve the house list information 
   * 
   * @param event 
   */
  onSearch(event?) {
    this.maintainHAWBList.get('shipmentNumber').patchValue(this.customsHouseSearchRequest.awbNumber);
    this.maintainHAWBList.patchValue(this.customsHouseSearchRequest);
    this.houseService.getCustomsHouseList(this.customsHouseSearchRequest).subscribe(data => {
      if (data.messageList) {
        if (data.messageList[0].code) {
          this.showErrorStatus(data.messageList[0].code);
        }
        else {
          this.showErrorMessage(data.messageList[0].message)
        }
        return;
      }
      this.response = data;

      if (this.response.data.flightATA) {
        this.response.data.flightATA = NgcUtility.getTimeAsString(NgcUtility.getDateTimeByAnyFormat(this.response.data.flightATA));
      }

      let houseList = this.response.data.customsHouse;
      let index = 1;
      houseList.forEach(element => {
        element.sno = index++;
        element.select = false;
        element.latestCcFlightNoDate = element.latestCcFlightKey + '/' + (NgcUtility.getDateAsString(NgcUtility.getDateTimeByAnyFormat(element.latestCcFlightDate)).toUpperCase());
      });
      this.maintainHAWBList.reset();

      if (this.response.data.shipmentStatus == "Disabled") {
        this.isFhlButtonDisabled = true;
      } else {
        this.isFhlButtonDisabled = false;
      }

      this.maintainHAWBList.patchValue(this.response.data);
      this.maintainHAWBList.get('customsHouse').patchValue(houseList);


      // this.showSuccessStatus('g.completed.successfully');
    })
  }

  /**
   * Method to navigate previous screen.
   * This Method will be called on click of cancel
   */
  onCancel() {
    let forwardData = { flightId: this.customsHouseSearchRequest.flightId }
    this.navigateBack(forwardData);
  }

  /**
   * Method to Populate an empty House Form to add new House information
   * This method will be called on click of 'Add FHL' button  
   */
  addFhl() {
    this.forwardedData = new CustomsHouseModel();
    this.forwardedData.masterAwbId = this.response.data.shipmentId;
    this.forwardedData.awbNumber = this.response.data.shipmentNumber;
    this.openHouseInformationWindow();
  }

  /**
   * Method to set forwardedData value to get house information on house info popup
   * This Method will be called on click of HouseNo link click and populate the house info popup
   * @param event 
   */
  onLinkClick(event) {
    this.forwardedData = event.record;
    this.openHouseInformationWindow();
  }

  /**
   * Method to open houseInformationWindow
   */
  openHouseInformationWindow() {
    this.houseInformationWindow.open();
  }

  /**
   * Method to close houseInformationWindow
   */
  closeHouseInformationWindow() {
    this.houseInformationWindow.close();
  }

  /**
   * Update screen size variable dynamically 
   * 
   * @param event 
   */
  @HostListener('window:resize', ['$event'])
  setScreenSize(event?) {
    this.screenHeight = (window.innerHeight * 0.85);
    this.screenWidth = window.innerWidth;
  }

}
