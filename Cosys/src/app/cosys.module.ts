/**
 * Application Root Module
 *
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, IterableDiffers } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { EventManager } from '@angular/platform-browser';
// Core
import {
  NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
  NewHTTPService, NewHTTPServiceFactory,
  HTTPInterceptorService,
  RestService,
  NewRestServiceFactory,
  EventService, ErrorHandlerService,
  BrowserEventManager,
  AuthGuardService, AccessGuardService,
  GlobalPropertyName, NgcApplicationModule,
  UIDefaults, NgcIterableDifferProviderFactory,
  NgcDynamicCSSComponent
} from 'ngc-framework';
// Application
import { AuthApplication } from './auth/auth.component';
import { CosysApplication } from './cosys/cosys.component';
import { CosysRoutingModule } from '../shared/cosys.route.module';
// Environment/Configuration
import { Environment, CFG_ENV, RPT_ENV, WH_ENV, ADM_ENV, PLATFORM_ENV } from '../environments/environment';
import { ForgotPasswordModule } from '../domain/auth/forgotpassword/forgotpassword.component';
import { ChangePasswordModule } from '../domain/auth/changepassword/changepassword.component';

/**
 * Cosys Root Module
 */
@NgModule({
  declarations: [
    AuthApplication, CosysApplication
  ],
  entryComponents: [NgcDynamicCSSComponent],
  imports: [
    CommonModule, BrowserAnimationsModule,
    ReactiveFormsModule, HttpClientJsonpModule, HttpClientModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    CosysRoutingModule, ForgotPasswordModule, ChangePasswordModule
  ],
  exports: [
  ],
  providers: [
    HttpClient, {
      provide: NewHTTPService, useFactory: NewHTTPServiceFactory, deps: [HttpClient]
    }, {
      provide: RestService, useFactory: NewRestServiceFactory, deps: [NewHTTPService]
    }, {
      provide: HTTP_INTERCEPTORS, useClass: HTTPInterceptorService, multi: true
    },
    EventService,
    AuthGuardService, AccessGuardService, {
      provide: ErrorHandler, useClass: ErrorHandlerService
    }, {
      provide: EventManager, useClass: BrowserEventManager
    }, {
      provide: IterableDiffers, useFactory: NgcIterableDifferProviderFactory
    }
  ],
  bootstrap: [AuthApplication, CosysApplication]
})
export class CosysRootModule extends NgcApplicationModule {

  /**
   * Initialize
   */
  constructor() {
    super();
    // Configure Application
    this.configure();
  }

  /**
   * Configure Application
   */
  private configure() {
    this.setProperty(GlobalPropertyName.IS_PRODUCTION_MODE, Environment.production);
    this.setProperty(GlobalPropertyName.APPLICATION_THEME, Environment.theme);
    this.setProperty(GlobalPropertyName.APPLICATION_VERSION, Environment.applicationVersion);
    this.setProperty(GlobalPropertyName.BUILD_PACKAGE_FILE_CONTENT, Environment.buildPackageContent);
    this.setProperty(GlobalPropertyName.APPLICATION_ID, (<any>Environment).applicationId ? (<any>Environment).applicationId : 'COSYS');
    this.setProperty(GlobalPropertyName.UI_GRIDS, UIDefaults.GRID_SYSTEM_GRIDS);
    this.setProperty(GlobalPropertyName.UI_HTML_BODY_OVERFLOW, false);
    this.setProperty(GlobalPropertyName.APPLICATION_ROUTER_OUTLETS, 0);
    this.setProperty(GlobalPropertyName.APPLICATION_INSTRUMENTATION_KEY, (<any>Environment).instrumentationKey);
    // Service URL
    this.setProperty(GlobalPropertyName.BASE_SERVICE_URL, CFG_ENV.serviceBaseURL);
    // Environement URL for Profile
    this.setProperty(GlobalPropertyName.ENVIRONMENT_URL, "/configuration/environment/system/properties");
    this.setProperty(GlobalPropertyName.PROFILE_ENVIRONMENT_PROPERTY_NAME, "spring.profiles.active");
    // Cache Service URL
    this.setProperty(GlobalPropertyName.ACL_CACHE_SERVICE_URL, ADM_ENV.serviceBaseURL + ADM_ENV.accessControlList);
    this.setProperty(GlobalPropertyName.GLOBAL_I18N_SERVICE_URL, CFG_ENV.serviceBaseURL + CFG_ENV.i18nGlobalListURL);
    this.setProperty(GlobalPropertyName.USER_PROFILE_SERVICE_URL, CFG_ENV.serviceBaseURL + CFG_ENV.userProfileURL);
    this.setProperty(GlobalPropertyName.MENU_FUNCTION_SERVICE_URL, CFG_ENV.serviceBaseURL + CFG_ENV.menuFunctionListURL);
    this.setProperty(GlobalPropertyName.USER_FAVOURITE_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).userFavouriteURL);
    // Control Data URL
    this.setProperty(GlobalPropertyName.AUTOCOMPLETE_SERVICE_URL, CFG_ENV.serviceBaseURL + CFG_ENV.autoCompleteURL);
    this.setProperty(GlobalPropertyName.DROPDOWN_SERVICE_URL, CFG_ENV.serviceBaseURL + CFG_ENV.dropDownListURL);
    this.setProperty(GlobalPropertyName.DROPDOWN_QUERY_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).dropDownQueryListURL);
    this.setProperty(GlobalPropertyName.LOV_SERVICE_URL, CFG_ENV.serviceBaseURL + CFG_ENV.LOVURL);
    this.setProperty(GlobalPropertyName.SYSTEM_PARAMETER_URL, CFG_ENV.serviceBaseURL + CFG_ENV.systemParameterURL);
    // this.setProperty(GlobalPropertyName.BEAN_META_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).beanMetaURL);
    this.setProperty(GlobalPropertyName.HELP_BASE_API_URL, (<any>Environment).helpAPIURL);
    this.setProperty(GlobalPropertyName.UI_URI_MAPPING_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).uiURIMappingsURL);
    // this.setProperty(GlobalPropertyName.SERVICE_URI_MAPPING_COLLECT_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).serviceURIMappingURL);
    this.setProperty(GlobalPropertyName.CAPTCHA_LOAD_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).captchaLoadURL);
    this.setProperty(GlobalPropertyName.CAPTCHA_VALIDATE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).captchaValidateURL);
    // Message
    this.setProperty(GlobalPropertyName.MESSAGE_BASE_URL, (<any>RPT_ENV).serviceBaseURL);
    this.setProperty(GlobalPropertyName.MESSAGE_ENDPOINT_URI, (<any>RPT_ENV).messageEndpoint);
    this.setProperty(GlobalPropertyName.NOTIFICATION_TOPIC_URI, (<any>RPT_ENV).notificationTopic);
    this.setProperty(GlobalPropertyName.NOTIFICATION_DESTINATION_URI, (<any>RPT_ENV).notificationDestination);
    this.setProperty(GlobalPropertyName.CHAT_TOPIC_URI, (<any>RPT_ENV).chatTopic);
    this.setProperty(GlobalPropertyName.CHAT_DESTINATION_URI, (<any>RPT_ENV).chatDestination);
    // Business Component URL
    this.setProperty(GlobalPropertyName.FLIGHT_AUTOCOMPLETE_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).flightAutoCompleteURL);
    this.setProperty(GlobalPropertyName.FLIGHT_INFO_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).flightInfoURL);
    this.setProperty(GlobalPropertyName.REPORT_SERVICE_URL, RPT_ENV.serviceBaseURL + (<any>RPT_ENV).reportURL);
    // this.setProperty(GlobalPropertyName.TERMS_AND_CONDITION_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).termsAndConditionURL);
    this.setProperty(GlobalPropertyName.FILE_UPLOAD_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).fileUploadURL);
    this.setProperty(GlobalPropertyName.MULTI_FILE_UPLOAD_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).multiFileUploadURL);
    this.setProperty(GlobalPropertyName.MULTI_FILE_DOWNLOAD_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).multiFileDownloadURL);
    this.setProperty(GlobalPropertyName.FILE_DOWNLOAD_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).fileDownloadURL);
    this.setProperty(GlobalPropertyName.FILE_DELETE_SERVICE_URL, CFG_ENV.serviceBaseURL + (<any>CFG_ENV).fileDeleteURL);
    this.setProperty(GlobalPropertyName.WH_LOCATION_DROPDOWN_SERVICE_URL, WH_ENV.serviceBaseURL + (<any>WH_ENV).fetchWareHouseLocations);
    this.setProperty(GlobalPropertyName.MOVABLE_STORAGE_LOCATION_URL, WH_ENV.serviceBaseURL + (<any>WH_ENV).movableStorageLocationURL);
    // Date/Time Format
    this.setProperty(GlobalPropertyName.DATE_TIME_FORMAT, (<any>Environment).dateTimeFormat);
    this.setProperty(GlobalPropertyName.DATE_FORMAT, (<any>Environment).dateFormat);
    this.setProperty(GlobalPropertyName.TIME_FORMAT, (<any>Environment).timeFormat);
    // Enable Currency
    this.setProperty(GlobalPropertyName.CURRENCY_SYMBOL, ((<any>Environment).currencySymbol ? (<any>Environment).currencySymbol : '₹'));
    // Update Currency Decimal Digits
    this.setProperty(GlobalPropertyName.CURRENCY_DECIMAL_DIGITS, ((<any>Environment).currencyDecimalDigits ? (<any>Environment).currencyDecimalDigits : 2));
    // Update Currency Decimal Digits
    this.setProperty(GlobalPropertyName.DECIMAL_DIGITS, ((<any>Environment).decimalDigits ? (<any>Environment).decimalDigits : 2));
    // Local Date Auto Conversion (Don't Enable Anymore; Server Side Fix has been Done)
    this.setProperty(GlobalPropertyName.ENABLE_AUTO_LOCAL_DATE_CONVERSION, false);
    // I18N Debug Symbol
    this.setProperty(GlobalPropertyName.I18N_DEBUG_SYMBOL, (<any>Environment).i18NDebugSymbol);
    // Enable Authorization Header
    this.setProperty(GlobalPropertyName.ENABLE_AUTH_HEADER, true);
    // Disable With Credentials
    this.setProperty(GlobalPropertyName.DISABLE_WITH_CREDENTIALS, true);
    // Enable Auth User Type
    this.setProperty(GlobalPropertyName.ENABLE_USER_TYPE, (<any>Environment).enableUserType);
    // Enable Vertical Alignment
    this.setProperty(GlobalPropertyName.DEFAULT_VERTICAL_ALIGNMENT, (<any>Environment).columnVerticalAlignment);
    // Enable Function Level Cache Clear
    this.setProperty(GlobalPropertyName.ENABLE_FUNCTION_LEVEL_CACHE_CLEAR, ((<any>Environment).enableFunctionLevelCacheClear === true ? true : false));
    // Enable No Cache URL
    this.setProperty(GlobalPropertyName.ENABLE_NO_CACHE_URL, ((<any>Environment).enableNoCacheURL === false ? false : true));
    // Enable Guard
    this.setProperty(GlobalPropertyName.ENABLE_GUARD, ((<any>Environment).enableGuard === true || Environment.production === true ? true : false));
    // Enable Access Control
    this.setProperty(GlobalPropertyName.ENABLE_ACCESS_CONTROL, ((<any>Environment).enableAccessControl === true || Environment.production === true ? true : false));
    // Enable Bind Error
    this.setProperty(GlobalPropertyName.ENABLE_BIND_ERROR, (<any>Environment).enableBindError === true ? true : false);
    // Enable Upper Case
    this.setProperty(GlobalPropertyName.ENABLE_INPUT_UPPERCASE, ((<any>Environment).enableInputUpperCase === false ? false : true));
    // Input Height
    this.setProperty(GlobalPropertyName.INPUT_HEIGHT, (<any>Environment).inputHeight);
    // Default Terminal
    this.setProperty(GlobalPropertyName.DEFAULT_TERMINAL, ((<any>Environment).defaultTerminal ? (<any>Environment).defaultTerminal : ''));
    // Pre Load
    this.setProperty(GlobalPropertyName.PRE_LOAD_LOV_SOURCE_IDS, ((<any>Environment).lovPreLoadIds ? (<any>Environment).lovPreLoadIds : []));
    this.setProperty(GlobalPropertyName.PRE_LOAD_DROP_DOWN_SOURCE_IDS, ((<any>Environment).dropDownPreLoadIds ? (<any>Environment).dropDownPreLoadIds : []));
    // Show New Window On Title Bar
    this.setProperty(GlobalPropertyName.SHOW_NEW_WINDOW_ON_TITLE_BAR, true);
    // Warning Message
    this.setProperty(GlobalPropertyName.RELOAD_PAGE_WARNING_MESSAGE, ((<any>Environment).clearWarningMessage ? (<any>Environment).clearWarningMessage : null));
    this.setProperty(GlobalPropertyName.CANCEL_PAGE_WARNING_MESSAGE, ((<any>Environment).cancelWarningMessage ? (<any>Environment).cancelWarningMessage : null));
    this.setProperty(GlobalPropertyName.FUNCTION_NAVIGATION_WARNING_MESSAGE, ((<any>Environment).functionNavigationWarningMessage ? (<any>Environment).functionNavigationWarningMessage : null));
    // Access Control Excluded URLs
    this.setProperty(GlobalPropertyName.ACCESS_CONTROL_EXCLUDED_URLS, (<any>Environment).excludedUrls);
    // Enable Auto Print
    this.setProperty(GlobalPropertyName.ENABLE_AUTO_PRINT, true);
    // Application Configuration
    this.setProperty(GlobalPropertyName.TENANT_APPLICATION_CONFIG_URL, PLATFORM_ENV.serviceBaseURL + (<any>PLATFORM_ENV).applicationConfigUrl);
    // Theme Format & Style
    this.setProperty(GlobalPropertyName.TENANT_THEME_CSS_URL, PLATFORM_ENV.serviceBaseURL + (<any>PLATFORM_ENV).tenantThemeUrl);
    // Config Drop Down URL
    this.setProperty(GlobalPropertyName.DROPDOWN_CONFIG_SERVICE_URL, PLATFORM_ENV.serviceBaseURL + (<any>PLATFORM_ENV).configDropDownUrl);
    // Ignore I18N
    // this.setProperty(GlobalPropertyName.I18N_IGNORE_CASE, true);
    // Enable Feature
    this.setProperty(GlobalPropertyName.ENABLE_FEATURE_LIST, true);
    // Enable Entity Attribute
    this.setProperty(GlobalPropertyName.ENABLE_ENTITY_LIST, true);
    // Enable Theme
    this.setProperty(GlobalPropertyName.ENABLE_TENANT_THEME, true);
    // Enable HTTP Request Id
    this.setProperty(GlobalPropertyName.ENABLE_HTTP_REQUEST_ID, true);
    // Enable HTTP Locale
    this.setProperty(GlobalPropertyName.ENABLE_HTTP_LOCALE, true);
    // Enable Screen Id
    this.setProperty(GlobalPropertyName.ENABLE_HTTP_SCREEN_ID, true);
  }
}
