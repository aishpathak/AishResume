/**
 * @copyright SATS Singapore 2017-18
 */
// Core
import { BaseRequest, BaseResponse, BaseResponseData, BaseBO } from 'ngc-framework';

export class EAcceptanceSearchRequest extends BaseRequest {
    public serviceNo: string;
    public awbNo: string;
    public awbDate: string;
}

export class EAcceptanceSearchResultBO extends BaseBO {
    public selectFlag: boolean;
    public awbNo: string;
    public dest: string;
    public carr: string;
    public firstOffPt: string;
    public pcs: number;
    public wt: number;
    public nog: string;
    public rcar: string;
    public awbChargeCode: string;
    public fwb: boolean;
    public eawb: boolean;
    public rcarKcToTarget: boolean;
    public awbReceived: boolean;
    public pouch: boolean;
    public scInd: boolean;
    public status: string;
}

export class EAcceptanceSearchResponseData extends BaseResponseData {
    public serviceNo: string;
    public agentCode: string;
    public agentName: string;
    public serviceCreateDate: string;
    public contractorIC: string;
    public contractorName: string;
    public resultList: Array<EAcceptanceSearchResultBO>;

    /**
     * Initialize
     */
    constructor() {
        super();
        this.resultList = new Array<EAcceptanceSearchResultBO>();
    }
} 
