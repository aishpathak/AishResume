import { BaseRequest, BaseResponseData, BaseBO } from 'ngc-framework';

export class OuthouseAcceptance extends BaseRequest {
  flight: string;
  fromDate: string;
  toDate: string;
  dispatchNumber: string;
  carrierCode: string;
  emailId: any;
}

export class AcceptedMailDispatch extends BaseRequest {
  dnNumber: string;
  totalPieces: number;
  BigDecimal: string;
  select: boolean;
  doNumber: string;
  deliveredBit: number;
  acceptedMailDispatchDetails: Array<AcceptedMailDispatchDetails>;
}

export class AcceptedMailDispatchDetails extends BaseRequest {
  flightKey: string;
  flightDate: string;
  weight: string;
  storeLocation: string;
  rnRemarks: string;
  status: string;
  mailBagNumber: string;
  pieces: number;
  receptacleNumber: string;
  lastBagIndicator: number;
  generatedDoNumber: string;
}
export class MailOuthouseAcceptanceRequest extends BaseRequest {
  customerName: string;
  customerCode: string;
  customerId: number;
  shipmentType: string;
  totalPieces: number;
  totalWeight: number;
  shipmentId: number;
  dnNumber: string;
  dnOrigin: string;
  dnDestination: string;
  carrierCode: string;
  storeLocation: string;
  warehouseLocation: string;
  dnRemarks: string;
  originOfficeExchange: string;
  mailBagMailCategory: string;
  mailBagMailSubcategory: string;
  mailBagDispatchYear: number;
  mailBagRegisteredIndicator: number;
  destinationOfficeExchange: string;
  mailNumber: string;
  bookingId: number;
  paFlightId: string;
  paFlightKey: string;
  paFlightDate: string;
  countryCode: String;
  mailOuthouseAcceptance: Array<MailOuthouseAcceptance>;
}

export class MailOuthouseAcceptanceDetails extends BaseRequest {
  customerCode: string;
  carrierCode: string;
  storeLocation: string;
  warehouseLocation: string;
}
export class MailOuthouseAcceptance extends BaseRequest {
  mailBagNumber: string;
  mailBagMailCategory: string;
  mailBagMailSubcategory: string;
  year: number;
  receptalNumber: number;
  pieces: number;
  weight: number;
  origin: string;
  destination: string;
  paFlightKey: string;
  dispatchNumber: string;
  lastBagIndicator: number;
  registeredIndicator: number;
  nextDestination: string;

}