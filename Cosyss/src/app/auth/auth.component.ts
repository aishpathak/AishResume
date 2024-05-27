/**
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { Component, NgZone, ElementRef, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// Application
import {
  NgcWindowComponent, NgcApplication, AuthorizationToken, NgcFormControl, NgcFormGroup, SystemBroadcastEvents,
  NgcUtility, DateTimeKey, CacheService, CacheServiceEvents, EventSubject, GlobalPropertyName, BroadcastEvent
} from 'ngc-framework';
// Environment/Configuration
import { Environment } from '../../environments/environment';
import { AuthenticationService } from './auth.service';
//import { User } from './auth.service';
import { ChangepasswordComponent } from '../../domain/auth/changepassword/changepassword.component';
import { Subscription } from 'rxjs';
import { ApplicationConstants, ApplicationType } from '../cosys.model';
import { element } from 'protractor';

/**
 * Authentication
 */
@Component({
  selector: 'auth-root',
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
  providers: [CacheService, AuthenticationService]
})
export class AuthApplication extends NgcApplication {
  @ViewChild('forgotPass') forgotPass: NgcWindowComponent;
  @ViewChild('changePass') changePass: NgcWindowComponent;
  @ViewChild('changePassScreen') changePassScreen: ChangepasswordComponent;
  //
  private cacheSubscription: Subscription;
  private PasswordChangeFlag: any;
  private handlingArea: any;
  private returnFlag: any;
  private forgotWindowCloseFlag: boolean = true;
  private changePWDWindowCloseFlag: boolean = true;
  private staffIdFromfp: any;
  private initUrl: string;
  public isSSO: boolean = false;
  public isArchival: boolean = false;
  public isShowMultiTenant: boolean = true;
  objectWithUrl: any = [];

  private defaultTenant = 'SIN';
  private readonly defaultLocale = 'en_US';

  // Root Form
  private loginForm: NgcFormGroup = new NgcFormGroup({
    tenantId: new NgcFormControl(this.defaultTenant),
    locale: new NgcFormControl(this.defaultLocale),
    newPassword: new NgcFormControl('', Validators.required),
    userId: new NgcFormControl('COSYS', Validators.required),
    confirmPassword: new NgcFormControl('', Validators.required),
    currentPassword: new NgcFormControl('', Validators.required),
    password: new NgcFormControl('Cosys@123', Validators.required),
    changePassword: new NgcFormControl()
  });

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   * @param appComponentResolver Component Resolver Factory
   */
  constructor(appZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef,
    appComponentResolver: ComponentFactoryResolver,
    private cacheService: CacheService,
    private authService: AuthenticationService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    //
    super(appZone, appElement, appContainerElement, appComponentResolver);
    // Init Url
    this.initUrl = window.location.href;
  }

  /**
   * On Initialization
   */
  public ngOnInit(): void {
    // Must Call
    super.ngOnInit();
    // Verify for Archival
    this.verifyForArchival();
    // Fetch All tenant function call
    this.showTenants(this.isArchival);
    // Retrieve SSO Token
    this.retrieveSSOToken();
    // Update Tenant Specific Data
    this.updateTenantSpecificData();
    // Retrieve SSO Token
    this.retrieveSSOToken();
    // Verify Token
    if (!this.verifyTokenForNewWindow()) {
      // Listen for Tenant Change
      this.listenForTenantChange();
      // Listen for Locale Change
      this.listenForLocaleChange();
      // Subscribe for I18N Load
      this.subscribeI18NLoadEvents();
    }
  }

  /**
   * On Destroy
   */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /* 
  * Fetch All tenants on login
  */
  showTenants(isArchivalFlag) {
    const request = {
      archival: isArchivalFlag
    }
    this.authService.fetchTenants(request).subscribe(items => {
      this.objectWithUrl = items.data.dataList;
      if (this.initUrl) {
        const url1 = require('url');
        const address = this.initUrl;
        let urlObject = url1.parse(address, true);
        this.checkUrlObject(urlObject);
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
        if (event.eventId === SystemBroadcastEvents.LOGGEDOUT) {
          this.loginForm.reset();
          this.loginForm.get('tenantId').setValue(this.defaultTenant);
          this.loginForm.get('locale').setValue(this.defaultLocale);
        }
        break;
    }
  }

  public getAuthTenantId() {
    return this.loginForm.get('tenantId').value;
  }

  /**
   * Subscribe I18N Cache Service Events
   */
  private subscribeI18NLoadEvents() {
    if (this.cacheSubscription) {
      this.cacheSubscription.unsubscribe();
    }
    // Subscribe & Handle Event
    this.cacheSubscription = this.cacheService.getObserver().subscribe(event => {
      if (this.isAuthorized()) {
        return;
      }
      switch (event.eventId) {
        case CacheServiceEvents.RELOAD_GLOBAL_I18N_LIST:
          this.sendSystemNotification(SystemBroadcastEvents.I18N_RELOADED);
          break;
      }
    });
  }

  /**
   * Retrieve Application Theme
   */
  private retrieveInitialData(): void {
    if (this.cacheService) {
      this.cacheService.reloadApplicationTheme();
      this.cacheService.reloadGlobalI18NList();
    }
  }

  /**
   * Verify for Archival
   */
  public verifyForArchival(): boolean {
    // Live
    this.setProperty(ApplicationConstants.APPLICATION_TYPE, ApplicationType.LIVE);
    //
    if (this.initUrl) {
      const url: string = this.initUrl.replace('\\', '/') + '/';
      const baseUrl: string = NgcUtility.getBaseHRef();
      const archivalUrl: string = `${baseUrl}archival/`;
      const archivalDirectUrl: string = `${baseUrl}directlogin/archival/`;
      const index: number = url.indexOf(archivalUrl);
      const indexDirectUrl: number = url.indexOf(archivalDirectUrl);
      //
      if (index > 0 || indexDirectUrl > 0) {
        this.isArchival = true;
        this.setProperty(ApplicationConstants.APPLICATION_TYPE, ApplicationType.ARCHIVAL);
      }
    }
    return false;
  }

  /**
   * Retrieve SSO Token
   */
  public retrieveSSOToken(): boolean {
    if (this.initUrl) {
      const url: string = this.initUrl.replace('\\', '/');
      const ssoUrl: string = '/cosys/io/ssologin/';
      const index: number = url.indexOf(ssoUrl);
      //
      if (index > 0) {
        let id: string = url.substring(index + ssoUrl.length);
        let splits: string[] = id.split('/');
        //
        if (splits.length > 1) {
          this.isSSO = true;
          // Get the Authorization Token
          this.authService.loginSSO(id).subscribe(response => {
            if (response) {
              if ((response as any).tokenId) {
                const authToken: AuthorizationToken = new AuthorizationToken();
                // Update Token Data (TODO! To Change the Logic Once the API is Ready)
                authToken.authorizationId = (response as any).tokenId;
                authToken.tenantId = this.getTenantId();
                authToken.userId = (response as any).userLoginCode;
                authToken.expiryTime = NgcUtility.addDate(new Date(), 3, DateTimeKey.HOURS);
                authToken.isSSO = true;
                // Notify Application On Authentication Token Update
                this.notifyApplicationOnAuthentication(authToken);
                this.isSSO = true;
              } else {
                this.isSSO = false;
              }
            }
          }, error => {
            console.log(error);
            this.isSSO = false;
          });
        }
      }
    }
    return false;
  }

  /**
   * Verify Token for New Window
   */
  private verifyTokenForNewWindow() {
    // Check & Update Single Page State
    const isNewWindow: boolean = this.checkAndUpdateSinglePageState(this.activatedRoute);
    //
    if (isNewWindow) {
      // Fetch Stored Token
      const authToken: AuthorizationToken = this.getStoredAuthorizationToken();
      // If Auth Token is Available & If It's a New Window
      if (authToken) {
        // Update Locale
        if (authToken.locale) {
          this.loginForm.get('locale').setValue(authToken.locale);
          this.setProperty(GlobalPropertyName.APPLICATION_LOCALE, authToken.locale);
          this.setProperty(GlobalPropertyName.DEFAULT_TERMINAL, authToken.terminalId);
          this.setProperty(GlobalPropertyName.DEFAULT_SECTOR, authToken.sectorId);
        }
        this.async(() => {
          // Notify Application On Authentication Token Update
          this.notifyApplicationOnAuthentication(authToken);
        });
        return true;
      }
    }
    return false;
  }

  /**
   * Listen for Tenant Change
   */
  private listenForTenantChange() {
    // Listen
    this.loginForm.get('tenantId').valueChanges.subscribe(() => {
      this.updateTenantSpecificData();
    });
  }

  /**
   * Listen for Locale Change
   */
  private listenForLocaleChange() {
    // Listen
    this.loginForm.get('locale').valueChanges.subscribe(() => {
      this.updateLocaleSpecificData();
    });
  }

  /**
   * Update Tenant Specific Data
   */
  private updateTenantSpecificData() {
    // Update Tenant Id
    this.updateTenantId(this.loginForm.get('tenantId').value);
    // Retrieve Initial Data
    this.retrieveInitialData();
  }

  /**
 * Update Locale Specific Data
 */
  private updateLocaleSpecificData() {
    // Update Locale
    this.setProperty(GlobalPropertyName.APPLICATION_LOCALE, this.loginForm.get('locale').value);
    // Update Tenant Id
    this.updateTenantId(this.loginForm.get('tenantId').value);
    // Retrieve Initial Data
    this.retrieveInitialData();
  }

  public onLogin(event) {
    const loginrequest = this.loginForm.getRawValue();
    const loginRequest = loginrequest;
    let authToken: AuthorizationToken = new AuthorizationToken();
    if ((Environment as any).enableAuthentication === false) {
      // Update Token Data (TODO! To Change the Logic Once the API is Ready)
      authToken.authorizationId = '' + (Math.random() * 100000000000000000);
      authToken.tenantId = this.getTenantId();
      authToken.userId = this.loginForm.get('userId').value;
      authToken.expiryTime = NgcUtility.addDate(new Date(), 3, DateTimeKey.HOURS);
      // Notify Application On Authentication Token Update
      this.notifyApplicationOnAuthentication(authToken);
    } else if (loginRequest.userId != null && loginRequest.password != null && loginRequest.password != '') {
      this.authService.validateUserLogin(loginRequest).subscribe(response => {

        const responseBody: any = (response as any).body;
        if (!this.showResponseErrorMessages(responseBody)) {
          if (responseBody) {
            delete responseBody.data.tenantId;
            this.loginForm.patchValue(responseBody.data);
            //
            if (this.loginForm.get('isvalid').value) {
              if (responseBody.data.passwordChangeFlag && responseBody.data.passwordChangeDateLeftCount <= 10 && responseBody.data.passwordChangeDateLeftCount > 0) {
                //this.login.close();
                this.showConfirmMessage('CFM-1' + ' ' + responseBody.data.passwordChangeDateLeftCount + ' ' + 'DAYS. DO YOU WANT TO CHANGE THE PASSWORD?').then(fulfilled => {
                  this.changePassword();
                }).catch(reason => {
                  this.proceedWithLogin(response);
                });
              } else if (responseBody.data.passwordChangeFlag && (responseBody.data.passwordChangeDateLeftCount == 0 || responseBody.data.passwordChangeDateLeftCount < 0)) {
                this.changePassword();
              }
              else if (this.loginForm.get('changePassword').value) {
                this.changePassword();
              }
              else {
                this.proceedWithLogin(response);
              }
            }
            else {
              this.showErrorMessage("ERR-1");
              //this.show
            }
          }
        }
      }, (error) => {
        this.showErrorMessage(error);
      });
    }
    // }
    else {
      this.showErrorStatus('ERR-2');
    }


  }

  public reset(event) {
    this.loginForm.reset();
  }

  public proceedWithLogin(response) {
    /*
     * Form reset After successful login 
     */
    this.loginForm.get('password').setValue(null);

    let authToken: AuthorizationToken = new AuthorizationToken();
    const token: string = (response as any).headers.get("X-Authorization-Id");
    const responseBody: any = (response as any).body;
    // if (response && response.data.returnFlag) {
    this.handlingArea = responseBody.data.handlingArea;
    this.returnFlag = responseBody.data.returnFlag;
    this.PasswordChangeFlag = responseBody.data.passwordChangeFlag;
    // Update Token Data (TODO! To Change the Logic Once the API is Ready)
    authToken.authorizationId = token ? token : '' + (Math.random() * 100000000000000000);
    authToken.tenantId = this.getTenantId();
    authToken.userId = this.loginForm.get('userId').value;
    authToken.expiryTime = NgcUtility.addDate(new Date(), 3, DateTimeKey.HOURS);
    // Notify Application On Authentication Token Update
    this.notifyApplicationOnAuthentication(authToken);
  }


  /**
   * Notify Application On Authentication
   *
   * @param authToken Authorization Token
   */
  private notifyApplicationOnAuthentication(authToken: AuthorizationToken) {
    // Update to Application Cache
    this.updateAuthorizationToken(authToken);
    // Raise Event to Cosys NG Application to Notify to Start Application

    this.sendSystemNotification(SystemBroadcastEvents.AUTH_DONE, null, null, {
      userId: authToken.userId,
      handlingArea: this.handlingArea,
      returnFlag: this.returnFlag,
      passwordChangeFlag: this.PasswordChangeFlag
    });
  }
  public forgotPassword() {
    //this.changePass.close();
    //this.login.close();
    this.forgotWindowCloseFlag = false;
    this.forgotPass.open();
  }
  public changePassword() {
    this.changePWDWindowCloseFlag = false;
    this.changePass.open();
  }
  closeForgetPassworkWindow() {
    this.forgotPass.close();
  }
  closeChangePassworkWindow() {
    this.changePass.close();
  }

  onForgotCloseWindow() {
    this.forgotWindowCloseFlag = true;
  }

  onChangePWDCloseWindow() {
    this.changePWDWindowCloseFlag = true;
  }
  staffId(data) {
    console.log("staff id is : " + data);
    this.staffIdFromfp = data;

  }


  forgetpasswordSubmitted(data) {
    console.log("from forget password parent: " + data);
    if (data == true) {
      this.changePassword();
    }
  }

  /*
  * on click of any tenant logo for login
  * called while login through a configured url for any tenant
  */
  showSingleTenant(tenantValue) {
    this.isShowMultiTenant = false;
    this.defaultTenant = tenantValue.tenantId;
    this.loginForm.get('tenantId').setValue(tenantValue.tenantId);
    // Media Wiki URL fetching while selecting a tenant
    const drsSite = tenantValue.urlDetails.filter(ele => (ele.urlType.toUpperCase() === 'DRSSITE'.toUpperCase()))[0];
    const drsApi = tenantValue.urlDetails.filter(ele => (ele.urlType.toUpperCase() === 'DRSAPI'.toUpperCase()))[0];
    AuthenticationService.mediaWikiUrl = {
      drsSite: drsSite ? drsSite.url : '' + drsSite ? drsSite.uri : '',
      drsApi: drsApi ? drsApi.url : '' + drsApi ? drsApi.uri : ''
    }
  }

  /* 
  * on click of All Tenants Link
  */
  showAllTenantsLogo() {
    this.isShowMultiTenant = true;
    this.defaultTenant = null;
    this.loginForm.get('tenantId').setValue(null);
  }

  /* 
  * Mainly used while login through configured URL for any tenant
  */
  checkUrlObject(event): any {
    let isSelected: boolean = false;
    this.objectWithUrl.forEach(element => {
      if (element.urlDetails && element.urlDetails.length > 0 && !isSelected) {
        element.urlDetails.forEach(urlObject => {
          if (urlObject.urlType.toUpperCase() == 'login'.toUpperCase()
            && event.hostname.includes(urlObject.url) && !isSelected) {
            this.showSingleTenant(element);
            isSelected = true;
          }
        }
        );
      }
    })
    if (!isSelected) {
      this.objectWithUrl.forEach(element => {
        if (element.urlDetails && element.urlDetails.length > 0 && !isSelected) {
          element.urlDetails.forEach(urlObject => {
            if (urlObject.urlType.toUpperCase() == 'login'.toUpperCase() && !isSelected) {
              if (event.hostname.includes(urlObject.url) || (urlObject.uri ==
                event.pathname.slice(event.pathname.length - urlObject.uri.length))) {
                this.showSingleTenant(element);
                isSelected = true;
              }
            }
          });
        }
      })
    }
  }

}
