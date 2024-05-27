import { BaseRequest, BaseResponse, BaseBO, BaseResponseData } from 'ngc-framework';

export class PresortingRequest extends BaseRequest {

    public officeId: string;
    public awbId: string;
    public awbNo: string;

    public documentStatus: string;
    public copyNo: string;
    public pigeonHoleLocationId: string;
    public flightPouchId: string;
    public checkBox: boolean;

    public locationName: string;
    public modifiedBy: string;

}

export class PresortingResultBO extends BaseRequest {
    public awbNo: string;
    public copy: string;
    public locationId: string;
    public locationName: string;
    public groupId: string;
    public groupName: string;
}

export class PresortingResponse extends BaseResponseData {

    public preSorting: PresortingResultBO;

}

export class GetRegionRequest extends BaseRequest {
    public officeId: string;
}

export class FetchRegionBO extends BaseRequest {
    public groupId: string;
    public groupName: string;
    public officeId: string;
    public officeName: string;
}

export class FetchRegionResponse extends BaseResponseData {
    public regionList: Array<FetchRegionBO>;
}
