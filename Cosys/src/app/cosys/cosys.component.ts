/**
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { Component, NgZone, ElementRef, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../auth/auth.service';
// Application
import {
  NgcApplication, CacheService, UserProfile, UserFavourite,
  NgcFormGroup, NgcFormControl, GlobalPropertyName, GlobalBroadcastEvents, BroadcastEvent,
  EventSubject, MessageType, CacheServiceEvents, NotificationMessage, StatusMessage, SystemBroadcastEvents,
  NgcMessageNotificationComponent, MenuItem, CodeDescriptionPair, NgcInputComponent,
  RestService, RestServiceEvents, NgcLoaderComponent, NgcScrollPanel, NgcWHLocationComponent,
  NgcWindowComponent, BusinessBroadcastEvents, NgcUtility, NgcFormArray
} from 'ngc-framework';
import { I18NLabels, I18NLabelsSaveRequest } from '../cosys.model';
// Environment/Configuration
import { Environment } from '../../environments/environment';

declare let $: any;

/**
 * Application
 */
@Component({
  selector: 'cosys-root',
  templateUrl: './cosys.html',
  styleUrls: ['./cosys.scss'],
  providers: [CacheService, AuthenticationService]
})
export class CosysApplication extends NgcApplication {
  private applicationId: string;
  private eventTracker: number = 0;
  private menuSource: Array<MenuItem> = new Array<MenuItem>();
  private searchSource: Array<any> = new Array<any>();
  private favourites: Array<UserFavourite> = new Array<UserFavourite>();
  private cacheSubscription: Subscription;
  private lastSearch: string;
  private headerClasses: string;
  private footerClasses: string;
  private routerOutletContainerClasses: string;
  private routerOutletBodyClasses: string;
  private totalPendingRestCalls: number = 0;
  private totalPendingServiceRequests: number = 0;
  private notificationMessageCount: number = 0;
  private status: string;
  private statusType: string;
  private localizationFilterSource: string[];
  // Outlets
  private routerOutletNames: Array<string> = [];
  //
  private helpViewVisible: boolean = false;
  private chatViewVisible: boolean = false;
  private messageViewVisible: boolean = false;
  private developerViewVisible: boolean = false;
  private stickyNoteViewVisible: boolean = false;
  //
  private isAnyMessage: boolean = false;
  private handlingArea: any;
  private resp: any;
  //
  @ViewChild('searchFunction')
  private searchFunction: NgcInputComponent;
  @ViewChild('pageLoader')
  private pageLoader: NgcLoaderComponent;
  @ViewChild('navigationLoader')
  private navigationLoader: NgcLoaderComponent;
  @ViewChild('progressLoader')
  private progressLoader: NgcLoaderComponent;
  @ViewChild('statusGrawl')
  private notificationRef: NgcMessageNotificationComponent;
  @ViewChild('chatGrawl')
  private chatNotificationRef: NgcMessageNotificationComponent;
  @ViewChild(NgcScrollPanel)
  private pageContainer: NgcScrollPanel;
  @ViewChild(NgcWHLocationComponent)
  private whLocation: NgcWHLocationComponent;
  @ViewChild('changePasswordWindow')
  private changePasswordWindow: NgcWindowComponent;
  @ViewChild('handlingAreaWindow')
  private handlingAreaWindow: NgcWHLocationComponent;
  @ViewChild('localeUpdateWindow')
  private localeUpdateWindow: NgcWindowComponent;

  // Root Form
  private form: NgcFormGroup = new NgcFormGroup({
    handlingArea: new NgcFormControl(),
    userLoginCode: new NgcFormControl(),
    userFullName: new NgcFormControl(),
    userShortName: new NgcFormControl(),
    tenantId: new NgcFormControl(),
    terminalId: new NgcFormControl(),
    customerId: new NgcFormControl(),
    loginTime: new NgcFormControl(),
    searchBy: new NgcFormControl()
  });

  private loginForm: NgcFormGroup = new NgcFormGroup({
    tenantId: new NgcFormControl('SIN'),
    handlingArea: new NgcFormControl(),
    newPassword: new NgcFormControl('', Validators.required),
    userId: new NgcFormControl('', Validators.required),
    confirmPassword: new NgcFormControl('', Validators.required),
    currentPassword: new NgcFormControl('', Validators.required),
    password: new NgcFormControl('', Validators.required)
  });

  private localeForm: NgcFormGroup = new NgcFormGroup({
    filter: new NgcFormControl(''),
    exactFilter: new NgcFormControl(false),
    localeList: new NgcFormArray([])
  });
  // for containing media wiki url
  mediaWikiUrl: string;

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   * @param appComponentResolver Component Resolver Factory
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    appComponentResolver: ComponentFactoryResolver,
    private cacheService: CacheService, private restService: RestService,
    private router: Router, private activatedRouter: ActivatedRoute,
    private authService: AuthenticationService) {
    //
    super(appZone, appElement, appContainerElement, appComponentResolver);
  }

  /**
   * On Initialization
   */
  public ngOnInit(): void {
    // Must Call
    super.ngOnInit();
    // Subscribe System Events
    this.subscribeSystemEvents();
    this.applicationId = this.getProperty(GlobalPropertyName.APPLICATION_ID);
    // Initialize Outlets
    this.initializeOutlets();
  }

  /**
   * On Destroy
   */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
    // Unsubscribe
    if (this.cacheSubscription) {
      this.cacheSubscription.unsubscribe();
    }
  }

  /////////////////////////////////////////////////////////////////////

  /**
   * Initialize Outlets
   */
  private initializeOutlets() {
    let routerOutlets: number = this.getProperty(GlobalPropertyName.APPLICATION_ROUTER_OUTLETS);
    //
    if (routerOutlets === undefined || routerOutlets === null) {
      routerOutlets = 0;
    }
    // Create Router Outlet Names
    if (routerOutlets > 0) {
      for (let routeIndex = 0; routeIndex <= routerOutlets; routeIndex++) {
        this.routerOutletNames.push(String(routeIndex));
      }
    }
  }

  /**
   * Focus to Router Outlet
   *
   * @param outletIndex Outlet Index
   */
  public onTab(outletIndex: number): void {
    this.raiseEvent(EventSubject.ROUTER_OUTLET_NOTIFICATION, SystemBroadcastEvents.ROUTER_OUTLET_NAVIGATION, null, null, { outlet: outletIndex });
  }

  /**
   * Subscribe Events
   */
  public subscribeSystemEvents() {
    // Subscribe System/Config/Notify Events
    this.subscribeEvents(EventSubject.SYSTEM);
    this.subscribeEvents(EventSubject.CONFIGURATION);
    this.subscribeEvents(EventSubject.NOTIFICATION);
    this.subscribeEvents(EventSubject.BUSINESS);
    // Subscribe Restful Notification Events
    this.subscribeRestfulNotificationEvents();
    // Subscribe Cache Reload Events
    this.subscribeCacheServiceEvents();
  }

  /**
   * Subscribe Restful Notification Events
   */
  private subscribeRestfulNotificationEvents() {
    this.restService.getRestEventObserver().subscribe((event: BroadcastEvent) => {
      switch (event.eventId) {
        case RestServiceEvents.GET_BEGIN:
        case RestServiceEvents.POST_BEGIN:
          this.totalPendingRestCalls++;
          break;
        case RestServiceEvents.GET_SUCCESS:
        case RestServiceEvents.POST_SUCCESS:
          break;
        case RestServiceEvents.GET_FAILURE:
        case RestServiceEvents.POST_FAILURE:
          this.notifyOnRestFailure(event);
          break;
        case RestServiceEvents.GET_END:
        case RestServiceEvents.POST_END:
          this.totalPendingRestCalls = this.totalPendingRestCalls < 1 ? 0 : this.totalPendingRestCalls - 1;
          break;
      }
    });
  }

  /**
   * Subscribe Cache Service Events
   */
  private subscribeCacheServiceEvents() {
    if (this.cacheSubscription) {
      this.cacheSubscription.unsubscribe();
    }
    // Subscribe & Handle Event
    this.cacheSubscription = this.cacheService.getObserver().subscribe(event => {
      switch (event.eventId) {
        case CacheServiceEvents.RELOAD_USER_PROFILE_DATA:
          let userInfo: UserProfile = this.getUserProfile();
          let userFavourites: Array<UserFavourite> = this.getUserFavourites();
          // If User Profile Available
          if (userInfo) {
            this.form.patchValue(userInfo);
          }
          // If User Favourites Available
          if (userFavourites) {
            this.favourites = userFavourites;
          }
          this.sendSystemNotification(SystemBroadcastEvents.USER_PROFILE_RELOADED);
          break;
        case CacheServiceEvents.RELOAD_ACCESS_CONTROL_LIST:
          this.sendSystemNotification(SystemBroadcastEvents.ACL_RELOADED);
          break;
        case CacheServiceEvents.RELOAD_GLOBAL_I18N_LIST:
          this.sendSystemNotification(SystemBroadcastEvents.I18N_RELOADED);
          break;
        case CacheServiceEvents.RELOAD_MENU_FUNCTION_LIST:
          this.createSearchFunctionSource(event.data);
          break;
      }
    });
  }

  /**
   * Handle Component Event Raised by Another Component
   *
   * @param event Event
   */
  protected handleEvent(event: BroadcastEvent): void {
    switch (event.subject) {
      case EventSubject.SYSTEM_NOTIFICATION:
        this.handleSystemNotification(event);
        break;
      case EventSubject.PAGE_NOTIFICATION:
        this.handlePageNotification(event);
        break;
      case EventSubject.NOTIFICATION:
        this.handleNotification(event);
        break;
      case EventSubject.BUSINESS:
        this.handleBusinessEvents(event);
        break;
      default:
        super.handleEvent(event);
        break;
    }
  }

  /**
   * Handle System Notification
   *
   * @param event Event
   */
  private handleSystemNotification(event: BroadcastEvent): void {
    switch (event.eventId) {
      case SystemBroadcastEvents.AUTH_DONE:
        this.onAuthenticationComplete(event);
        break;
      case SystemBroadcastEvents.USER_PROFILE_RELOAD_REQUIRED:
        this.reloadUserProfile();
        break;
      case SystemBroadcastEvents.HELP_REQUIRED:
        this.onHelp();
        break;
      case SystemBroadcastEvents.F3_REQUIRED:
        this.searchFunction.focus();
        break;
      case SystemBroadcastEvents.F4_REQUIRED:
        this.onMessage();
        break;
      case SystemBroadcastEvents.F5_REQUIRED:
        this.onChat();
        break;
      case SystemBroadcastEvents.LOGOUT_REQUIRED:
        this.onLogout(null);
        break;
      case SystemBroadcastEvents.SERVICE_REQUESTED:
        this.handleServiceRequestStart(event);
        break;
      case SystemBroadcastEvents.SERVICE_COMPLETED:
        this.handleServiceRequestCompletion(event);
        break;
      case SystemBroadcastEvents.PAGE_INIT_STARTED:
        this.handlePageInitializeStart();
        break;
      case SystemBroadcastEvents.PAGE_INIT_COMPLETED:
        this.handlePageInitializeCompletion();
        break;
      case SystemBroadcastEvents.APPLICATION_NAVIGATION:
        this.updateApplicationStatusMessage((<any>event.data).desc);
        break;
      default:
        super.handleEvent(event);
        break;
    }
  }

  /**
   * Handle Business Events
   *
   * @param event Event
   */
  private handleBusinessEvents(event: BroadcastEvent) {
    switch (event.eventId) {
      case BusinessBroadcastEvents.WAREHOUSE_EVENT:
        this.form.get('tenantId').setValue(this.getTenantId());
        this.form.get('terminalId').setValue(event.data.terminalId);
        break;
    }
  }

  /**
   * Handle Notification
   *
   * @param event Event
   */
  private handleNotification(event: BroadcastEvent): void {
    // Handle Notifications
    switch (event.eventId) {
      case GlobalBroadcastEvents.STATUS:
        this.updateApplicationStatus(event);
        break;
      case GlobalBroadcastEvents.NOTIFY:
        this.updateApplicationMessage(event);
        break;
      default:
        super.handleEvent(event);
        break;
    }
  }

  /**
   * Handle Page Notification
   *
   * @param event Event
   */
  private handlePageNotification(event: BroadcastEvent): void {
    switch (event.eventId) {
      case SystemBroadcastEvents.PAGE_TITLE_INITIALIZED:
        this.updateApplicationStatusMessage(event.data);
        break;
      case SystemBroadcastEvents.PAGE_TITLE_DESTROYED:
        this.updateApplicationStatusMessage(event.data);
        break;
      case SystemBroadcastEvents.PAGE_NAVIGATION_START:
        this.handlePageModuleInitializeStart();
        break;
      case SystemBroadcastEvents.PAGE_NAVIGATION_END:
        this.handlePageModuleInitializeCompletion();
        break;
      default:
        super.handleEvent(event);
    }
  }

  /**
   * Notify On Rest Call Failure
   *
   * @param event Event
   */
  private notifyOnRestFailure(event: BroadcastEvent) {
    const data: any = event.data;
    const notifyMessage: NotificationMessage = new NotificationMessage(MessageType.ERROR,
      `<span class='ui-rest-error-notification-title'>Service Failure:</span>
              <span class='ui-rest-error-notification-url'>${data.url}</span>
              <span class='ui-rest-error-notification-message'>${data.info}</span>`, new Date());
    // Send Notification Message Upon Rest Failure
    this.sendNotificationMessage(notifyMessage);
  }

  /**
   * Handle Page Initialization Start
   */
  private handlePageInitializeStart() {
    // Don't Start Progress Until it is Ready
    if (!this.pageLoader) {
      return;
    }
    // Reset Service Request Count to Zero
    this.totalPendingServiceRequests = 0;
    // Open the Progress Loader
    this.pageLoader.open();
  }

  /**
   * Handle Page Initialization Completion
   */
  private handlePageInitializeCompletion() {
    // Don't Start Progress Until it is Ready
    if (!this.pageLoader) {
      return;
    }
    // Close the Progress Loader
    this.pageLoader.close();
  }

  /**
   * Handle Page/Module Load on Navigation Start
   */
  private handlePageModuleInitializeStart() {
    // Don't Start Progress Until it is Ready
    if (!this.navigationLoader) {
      return;
    }
    // Reset Service Request Count to Zero
    this.totalPendingServiceRequests = 0;
    // Open the Progress Loader
    this.navigationLoader.open();
  }

  /**
   * Handle Page/Module Load on Navigation Completion
   */
  private handlePageModuleInitializeCompletion() {
    // Don't Start Progress Until it is Ready
    if (!this.navigationLoader) {
      return;
    }
    // Close the Progress Loader
    this.navigationLoader.close();
  }

  /**
   * Handle Service Request Start
   */
  private handleServiceRequestStart(event: BroadcastEvent) {
    // Don't Start Progress Until it is Ready
    if (!this.progressLoader) {
      return;
    }
    this.totalPendingServiceRequests++;
    // Open the Progress Loader
    this.progressLoader.trackType = "Service";
    this.progressLoader.trackId = event.data ? event.data.name : 'Service.Unknown';
    this.progressLoader.open();
  }

  /**
   * Handle Service Request Completion
   */
  private handleServiceRequestCompletion(event: BroadcastEvent) {
    // Don't Start Progress Until it is Ready
    if (!this.progressLoader) {
      return;
    }
    this.totalPendingServiceRequests--;
    // Close the Progress Loader
    if (this.totalPendingServiceRequests <= 0) {
      this.totalPendingServiceRequests = 0;
      this.progressLoader.trackType = "Service";
      this.progressLoader.trackId = event.data ? event.data.name : 'Service.Unknown';
      this.progressLoader.close();
    }
  }

  /**
   * On Authentication Complete
   *
   * @param authorizationId Authorization Id
   */
  private onAuthenticationComplete(event: BroadcastEvent) {
    // Load Cache
    this.reloadCache();
    // Update UI
    this.updateUI(this.theme);
    // Keep Track Value Change - Problem Fix
    this.keepTrackValueChange();
    // Responsive Menu - Problem Fix
    this.patchForMenuByResponsiveChange();
    // Change Password
    this.changePassword(event);
    // Fetching media wiki url saved while login
    this.mediaWikiUrl = AuthenticationService.mediaWikiUrl;
  }

  /**
   * Change Password
   */
  private changePassword(event: BroadcastEvent) {
    if ((Environment as any).enableAuthentication === false) {
      // Do Nothing
    } else if (!this.isNewWindow()) {
      // let eachHandlingArea = [];
      if (event.data.handlingArea) {
        this.handlingArea = [];
        for (let eachHandlingArea of event.data.handlingArea) {
          eachHandlingArea = Number(eachHandlingArea);
          this.handlingArea.push(eachHandlingArea);
        }
      }
      if (this.changePasswordWindow) {
        this.loginForm.get('userId').setValue(event.data.userId);
        if (event.data && event.data.passwordChangeFlag === false) {
          this.changePasswordWindow.open();
        } else {
          this.changePasswordWindow.close();
          this.openWHLocation();
        }
      } else {
        this.changePasswordWindow.close();
        this.openWHLocation();
      }
    }
  }

  /**
   * Open WH Location
   */
  private openWHLocation() {
    setTimeout(() => {
      if (this.handlingAreaWindow) {
        this.handlingAreaWindow.open();
      }
    }, 1000);
  }

  /**
   *
   */
  private onChangePasswordSave(event) {
    const request = this.loginForm.getRawValue();
    if (!this.validatePassword(request.newPassword)) {
      this.showErrorStatus('ERR-49');
      return;
    }
    if (!this.validatePassword(request.confirmPassword)) {
      this.showErrorStatus('ERR-49');
      return;
    }
    if (request.newPassword === request.confirmPassword) {

      this.authService.changePassword(request).subscribe(
        data => {
          this.resp = data.data;
          if (this.resp) {
            console.log('response---------' + this.resp);
            if (this.resp.messageList.length > 0) {
              let obh = this.resp.messageList[0];
              let code = obh['code'];
              this.showErrorMessage(code);
              return;
            } else {
              //this.change.emit(7);
              this.changePasswordWindow.close();
              this.showMessage("Password Changed Succesfully. Please login with new password").then(() => {

                // Remove Authorization Token
                this.updateAuthorizationToken(null);
                // Clear Cache
                this.clearCache();
                // Navigtate to Base URL
                this.navigateHome();
              });
            }
          }
        },
        error => { this.showErrorStatus('ERR-53'); }
      );
    } else {
      this.showErrorStatus("ERR-135");
    }
  }

  /**
   *
   */
  private onChangePasswordCancel(event) {
    this.changePasswordWindow.close();
  }


  /**
   * Create Search Function Source
   *
   * @param menuFunctionList Menu Function List
   */
  private createSearchFunctionSource(menu: any) {
    let menuFunctionList: Array<MenuItem> = null;
    const isOLDMenu: boolean = (menu && menu.menuList) ? true : false;
    const isNewMenu: boolean = (menu && menu.childs) ? true : false;
    // Update Menu Source
    if (isOLDMenu) {
      menuFunctionList = this.createNewMenuListFromOldMenuList(menu.menuList);
    } else if (isNewMenu) {
      menuFunctionList = menu.childs;
    }
    if (menuFunctionList) {
      this.menuSource = menuFunctionList;
    } else {
      this.menuSource = new Array<MenuItem>();
    }
    // Create Data Source for Search Function
    if (this.menuSource) {
      // Populate Records for Search Function
      let records: Array<CodeDescriptionPair> = this.retrieveMenuFunctionList(menuFunctionList);
      // Create Data Source
      this.searchSource = records;
    }
  }

  /**
   * Create New Menu List from Old Menu List
   *
   * @param menu Menu Data
   */
  private createNewMenuListFromOldMenuList(menu: any[]): Array<MenuItem> {
    let menuList: Array<MenuItem> = new Array<MenuItem>();
    //
    if (menu && menu.length > 0) {
      menu.forEach((menuItem: any) => {
        let newMenuItem: MenuItem = new MenuItem();
        // Set Values
        newMenuItem.screenCode = menuItem.functionId;
        newMenuItem.screenDesc = menuItem.title;
        newMenuItem.screenUrl = menuItem.url;
        // If Child Exists
        if (menuItem.subMenuList) {
          // Add it to Parent
          newMenuItem.childs = this.createNewMenuListFromOldMenuList(menuItem.subMenuList);
        }
        // Add it to List
        menuList.push(newMenuItem);
      });
    }
    //
    return menuList;
  }

  /**
   * Retreive Menu Functions for Search Function
   *
   * @param menuList Menu List
   */
  private retrieveMenuFunctionList(menuList: Array<MenuItem>): Array<CodeDescriptionPair> {
    let functionList: Array<CodeDescriptionPair> = new Array<CodeDescriptionPair>();
    //
    menuList.forEach((menuItem: MenuItem) => {
      if (!menuItem.childs || menuItem.childs.length == 0) {
        let codeDesc: CodeDescriptionPair = new CodeDescriptionPair();
        //
        codeDesc.code = menuItem.screenCode;
        codeDesc.desc = menuItem.screenDesc;
        //
        functionList.push(codeDesc);
      } else {
        // Retrieve it From Child
        let returnList = this.retrieveMenuFunctionList(menuItem.childs);
        // Append to Function List
        functionList = functionList.concat(returnList);
      }
    });
    return functionList;
  }

  /**
   * Retreive Menu Function
   *
   * @param functionName Function Name
   */
  private retrieveMenuFunction(functionName: string): MenuItem {
    if (!functionName) {
      return null;
    }
    return this.retrieveMenuFunctionFromList(functionName, this.menuSource);
  }

  /**
   * Retreive Menu Function for Search Function
   *
   * @param functionName Function Name
   * @param menuList Menu List
   */
  private retrieveMenuFunctionFromList(functionName: string, menuList: Array<MenuItem>): MenuItem {
    let menuFunction: MenuItem = null;
    //
    if (!menuList) {
      return null;
    }
    try {
      menuList.forEach((menuItem: MenuItem) => {
        if (!menuItem.childs || menuItem.childs.length === 0) {
          // Function Name Or Function Code Match (Full Match)
          if (menuItem.screenDesc && menuItem.screenDesc.trim().toUpperCase() === functionName.trim().toUpperCase()) {
            menuFunction = menuItem;
          }
          else if (menuItem.screenCode && menuItem.screenCode.trim().toUpperCase() === functionName.trim().toUpperCase()) {
            menuFunction = menuItem;
          }
          // If Found, Don't Continue
          if (menuFunction) {
            throw Error('No Error');
          }
        } else {
          // Retrieve it From Child
          let menuFunctionItem = this.retrieveMenuFunctionFromList(functionName, menuItem.childs);
          //
          if (menuFunctionItem) {
            menuFunction = menuFunctionItem;
          }
        }
      });
    } catch (e) { }
    //
    return menuFunction;
  }

  /**
   * Update Application Message
   *
   * @param event Event
   */
  private updateApplicationMessage(event: BroadcastEvent) {
    const message: NotificationMessage = event.data;
    // Update Message Count
    this.notificationMessageCount++;
    // Update Status
    if (message) {
      this.statusType = message.type;
      this.status = message.message;
    }
  }

  /**
   * Update Application Message
   *
   * @param message Message
   */
  private updateApplicationStatusMessage(message: string) {
    this.statusType = MessageType.INFO;
    this.status = this.getI18NValue(message);
  }

  /**
   * Update Application Status
   *
   * @param event Event
   */
  private updateApplicationStatus(event: BroadcastEvent) {
    if (event.data instanceof StatusMessage) {
      let status: StatusMessage = (<StatusMessage>event.data);
      //
      this.statusType = status.type;
      this.status = status.message;
      // Update Status Update Tracker
      this.eventTracker++;
      // Show Grawl Message
      switch (status.type) {
        case MessageType.SUCCESS:
          this.updateStatus("success", (<StatusMessage>event.data).message);
          break;
        case MessageType.WARNING:
          this.updateStatus("warning", (<StatusMessage>event.data).message);
          break;
        case MessageType.ERROR:
          this.updateStatus("error", (<StatusMessage>event.data).message);
          break;
        case MessageType.INFO:
          this.updateStatus("info", (<StatusMessage>event.data).message);
          break;
      }
      // Remove Status Message After Few Seconds
      setTimeout(() => {
        // Remove Status Message Only If there is No Update
        if (this.eventTracker == 1) {
          this.statusType = '';
          this.status = '';
        }
        this.eventTracker--;
      }, 10000);
    }
  }

  /**
   * Update Status
   *
   * @param type Type
   * @param message Message
   */
  private updateStatus(type: string, message: string): void {
    if (this.notificationRef && this.notificationRef.open) {
      this.notificationRef.open(type, message);
    }
  }

  /**
   * Show Chat Message
   *
   * @param message Message
   */
  private showChatMessage(message: any): void {
    if (this.chatNotificationRef && this.chatNotificationRef.open) {
      this.chatNotificationRef.open('chat', message.message);
    }
  }

  /**
   * Reload Cache
   */
  private reloadCache(): void {
    // User Profile
    this.reloadUserProfile();
    // i18n
    if (!this.cacheService.isI18NLoaded()) {
      this.cacheService.reloadGlobalI18NList();
    }
    // Access Control List
    this.cacheService.reloadAccessControlList();
    // Reload UI URI Mapping
    this.cacheService.reloadUIURIMappingList();
    // Menu Function List
    this.cacheService.reloadMenuFunctionList();
    // Pre Load LOV
    this.cacheService.preLoadLOVData();
    // Pre Load Drop Down
    this.cacheService.preLoadDropDownData();
    // Pre Load System Parameter
    this.cacheService.reloadSystemParameter();
  }

  /**
   * Reload User Profile
   */
  private reloadUserProfile() {
    this.cacheService.reloadUserProfile();
  }

  /**
   * On Favourite
   *
   * @param event Event
   * @param url URL
   */
  private onFavouriteClick(event, url: string) {
    // Open in Primary
    this.navigateToPrimary(this.router, url);
  }

  /**
   * On Search of Function
   *
   * @param event Event
   */
  private onSearchFunction(event): void {
    const searchFunctionText: string = this.searchFunction.value;
    // If Search Function Text is Available
    if (searchFunctionText) {
      // Find Menu Item for the Search Function
      const menuItem: MenuItem = this.retrieveMenuFunction(searchFunctionText);
      // Navigate to Menu URL
      if (menuItem && menuItem.screenUrl) {
        this.searchFunction.value = '';
        this.navigateToPrimary(this.router, menuItem.screenUrl);
      } else {
        this.showInfoStatus("Function Not Found");
      }
    }
  }

  /**
   * On Home
   */
  private onHome() {
    this.navigateHome();
  }

  /**
   * On Location
   */
  private onLocation() {
    if (this.whLocation) {
      this.whLocation.open();
    }
  }

  /**
   * Open New Window
   */
  private onNewWindow() {
    this.navigateToWindow("/", {});
  }

  /**
   * On Logout
   *
   * @param event Event
   */
  private onLogout(event) {
    // Remove Authorization Token
    this.updateAuthorizationToken(null);
    // Clear Cache
    this.clearCache();
    // Navigtate to Base URL
    this.navigateTo(this.router, "/");
    // Update Other Values
    this.notificationMessageCount = 0;
  }

  /**
   * On Clear Cache Click
   * 
   * @param event Event
   */
  private onClearCacheClick(event) {
    if (event) {
      event.stopPropagation();
    }
  }

  /**
   * On Clear Cache
   * 
   * @param event Event
   */
  private onClearCache(event) {
    if (event) {
      if (event.stopPropagation) {
        event.stopPropagation();
      }
      if (event.checked) {
        // Enable Function Level Cache Clear
        this.setProperty(GlobalPropertyName.ENABLE_FUNCTION_LEVEL_CACHE_CLEAR, true);
        // Clear Now
        this.clearCache();
      } else {
        this.setProperty(GlobalPropertyName.ENABLE_FUNCTION_LEVEL_CACHE_CLEAR, false);
      }
    }
  }

  /**
   * On Theme
   *
   * @param theme Theme
   */
  private onTheme(theme) {
    // Update Theme in Application Property
    this.setProperty(GlobalPropertyName.APPLICATION_THEME, theme);
    // Raise System Notification to Reload Theme
    this.sendSystemNotification(SystemBroadcastEvents.THEME_RELOADED);
  }

  /**
   * On Theme Change
   *
   * @param newTheme New Theme
   */
  public onThemeChange(newTheme?: string): void {
    this.updateUI(newTheme);
  }

  /**
   * Update UI
   *
   * @param newTheme New Theme
   */
  private updateUI(newTheme?: string) {
    const tenantId: string = NgcUtility.getTenantId();
    //
    if (newTheme === undefined) {
      this.headerClasses = "navbar navbar-light d-flex flex-row float-left header";
      this.footerClasses = "footer";
      this.routerOutletContainerClasses = "container-fluid container-fluid-container";
      this.routerOutletBodyClasses = "container-fluid container-fluid-body";
    } else {
      this.headerClasses = `navbar navbar-light d-flex flex-row float-left header header-${tenantId} header-${newTheme}`;
      this.footerClasses = `footer footer-${tenantId} footer-${newTheme}`;
      this.routerOutletContainerClasses = `container-fluid container-fluid-container container-fluid-container-${tenantId} container-fluid-container-${newTheme}`;
      this.routerOutletBodyClasses = `container-fluid container-fluid-body container-fluid-${tenantId} container-fluid-${newTheme} container-fluid-body-${tenantId} container-fluid-body-${newTheme}`;
    }
  }

  /**
   * On Chat
   */
  private onHelp() {
    console.log(`Help ${this.helpViewVisible}`)
    this.helpViewVisible = !this.helpViewVisible;
  }

  /**
   * On Chat
   */
  private onChat() {
    console.log(`Chat ${this.chatViewVisible}`)
    this.chatViewVisible = !this.chatViewVisible;
    this.isAnyMessage = false;
  }

  /**
   * On Notification
   */
  private onMessage() {
    console.log(`Message ${this.messageViewVisible}`)
    this.messageViewVisible = !this.messageViewVisible;
  }

  /**
   * On Development Tool
   */
  private onDevelopmentTool() {
    this.developerViewVisible = !this.developerViewVisible;
  }

  /**
   * On Sticky Note
   */
  private onStickyNote() {
    this.stickyNoteViewVisible = !this.stickyNoteViewVisible;
  }

  /**
   * PATCH OR FIXES
   */

  /**
   * Keep Track Value Change
   *
   * @todo It is a Fix for Two Controls with Same Form Control Name Binding
   */
  private keepTrackValueChange(): void {
    this.form.valueChanges.subscribe(data => {
      if (data.searchBy !== this.lastSearch) {
        this.lastSearch = data.searchBy;
        this.form.controls["searchBy"].setValue(this.lastSearch);
      }
    });
  }

  /**
   * Align the Menu to Display the Full Content on Screen
   *
   * @todo It is a Fix for non alignment of menu
   */
  private patchForMenuByResponsiveChange() {
    // Problem: Menu is not visible fully due to positioning of the menu
    $(document).on('shown.bs.dropdown', '#menuByResponsiveness', function () {
      var menu = $(this).find('.dropdown-menu');
      var menuLeft = menu.offset().left;
      var menuWidth = menu.outerWidth();
      var documentWidth = $(document).outerWidth();
      // Adjust Menu X Position
      if (NgcUtility.isRTLEnabled()) {
        menu.offset({ 'left': 0 });
      } else {
        if ((menuLeft + menuWidth) > documentWidth) {
          menu.offset({ 'left': documentWidth - menuWidth });
        }
      }
    });
  }

  /**
   * Properties
   */

  /**
   * Window Height
   */
  private get windowHeight() {
    return $(window).height();
  }

  /**
   * Header Height
   */
  private get headerHeight() {
    return 50;
  }

  /**
   * Scroll Panel Height
   */
  private get footerHeight() {
    return 30;
  }

  /**
   * Scroll Panel Height
   */
  private get scrollPanelHeight() {
    // Reduce Header + Footer Height
    return ($(window).height() - (this.headerHeight + this.footerHeight));
  }

  /**
   * Scroll Panel Width
   */
  private get scrollPanelWidth() {
    return $(window).width();
  }

  /**
   * Application Version
   */
  private get version() {
    return this.getProperty(GlobalPropertyName.APPLICATION_VERSION);
  }

  /**
   * Application Profile
   */
  private get profile() {
    const profile: string = this.getProperty(GlobalPropertyName.APPLICATION_PROFILE);
    //
    return profile ? profile.toUpperCase() : 'DEV';
  }

  /**
   * User Photo
   */
  private get userPhoto() {
    const userProfile: UserProfile = this.getUserProfile();
    //
    return userProfile ? userProfile.userPhotograph : null;
  }

  /**
   * Gets Locale
   */
  public getLocale(): string {
    return this.getProperty(GlobalPropertyName.APPLICATION_LOCALE);
  }

  /**
   * Gets Locales
   */
  public getLocales(): any[] {
    return NgcUtility.getTenantLanguages();
  }

  /**
 * On I18N Update
 */
  private onI18NUpdate() {
    const i18nLabels: I18NLabels = new I18NLabels();
    //
    i18nLabels.locale = this.getLocale();
    i18nLabels.labels = this.getApplicationLabels();
    // Auto Complete for Localization Filter
    this.localizationFilterSource = i18nLabels.labels;
    this.localeForm.get('filter').setValue('');
    //
    this.authService.fetchI18NLabels(i18nLabels).subscribe((response: any) => {
      (<NgcFormArray>this.localeForm.get(['localeList'])).patchValue(response.data);
      // Open Window
      this.localeUpdateWindow.open();
    });
  }

  /**
   * Save Localization Data
   */
  private saveLocale(event) {
    let req: I18NLabelsSaveRequest = new I18NLabelsSaveRequest();
    //
    req.locale = this.getLocale();
    req.labels = (<NgcFormArray>this.localeForm.get(['localeList'])).getRawValue();
    //
    this.authService.saveI18NLabels(req).subscribe((response: any) => {
      this.showSuccessStatus("status.Success");
    })
  }

  /**
   * Filter Locale
   */
  private filterLocale(): void {
    const i18nLabels: I18NLabels = new I18NLabels();
    const exactFilter: boolean = this.localeForm.get('exactFilter').value;
    const filter: string = this.localeForm.get('filter').value;
    //
    i18nLabels.locale = this.getLocale();
    //
    if (exactFilter) {
      i18nLabels.labels = [filter];
    } else {
      i18nLabels.labels = this.getApplicationLabels().filter((label: string) => {
        return label && filter && label.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) > -1;
      });
    }
    // Auto Complete for Localization Filter
    this.localizationFilterSource = i18nLabels.labels;
    //
    this.authService.fetchI18NLabels(i18nLabels).subscribe((response: any) => {
      (<NgcFormArray>this.localeForm.get(['localeList'])).patchValue(response.data);
    });
  }

  /**
   * Clear Filter
   */
  private clearFilter(): void {
    const i18nLabels: I18NLabels = new I18NLabels();
    // Reset
    this.localeForm.get('filter').setValue(null);
    this.localeForm.get('exactFilter').setValue(false);
    //
    i18nLabels.locale = this.getLocale();
    i18nLabels.labels = this.getApplicationLabels();
    // Auto Complete for Localization Filter
    this.localizationFilterSource = i18nLabels.labels;
    //
    this.authService.fetchI18NLabels(i18nLabels).subscribe((response: any) => {
      (<NgcFormArray>this.localeForm.get(['localeList'])).patchValue(response.data);
    });
  }

  /**
   * On Language Change
   * 
   * @param locale Language Code
   */
  private onLanguageChange(locale: any) {
    this.setProperty(GlobalPropertyName.APPLICATION_LOCALE, locale.locale);
    // Retrieve Locale Specific Data
    this.retrieveLocaleSpecificI18NData();
  }

  /**
   * Retrieve Locale Specific I18N Data
   */
  private retrieveLocaleSpecificI18NData(): void {
    if (this.cacheService) {
      this.cacheService.reloadGlobalI18NList();
    }
  }

  /**
   * Validate Password
   */
  private validatePassword(password) {
    let patt = new RegExp("^(?=.*[A-Z])(?=.*[`~!@#$%^&_-])(?=.*[0-9])(?=.*[a-z])(?=\\S+$).{8,}$");
    return patt.test(password);
  }

  onHandlingArea(event) {
  }

  onChangePasswordClose(event) {
    this.changePasswordWindow.close();
  }

  notifyChatMessage(event) {
    this.isAnyMessage = true;
    this.showChatMessage(event);
  }
  onPasswordChange() {
    let changepass = "changepass";
    this.navigateTo(this.router, "/auth/changepassword", changepass);

  }
}
