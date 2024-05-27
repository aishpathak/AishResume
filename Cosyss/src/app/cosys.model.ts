import { BaseRequest, BaseResponse, BaseBO } from "ngc-framework";

export enum ApplicationType {
    LIVE = 1, ARCHIVAL = 2
}

export const ApplicationConstants = {
    APPLICATION_TYPE: "AppType"
}

export class I18NLabels extends BaseRequest {
    locale: string;
    labels: string[];
}

export class I18NLabelsResponseData extends BaseBO {
    locale: string;
    type: string;
    code: string;
    labelEnglish: string;
    labelCurrentLanguage: string;
}

export class I18NLabelsResponse extends BaseResponse<I18NLabelsResponseData> {
    type: string;
    code: string;
    labelEnglish: string;
    labelCurrentLanguage: string;
}

export class I18NLabelsSaveRequest extends BaseRequest {
    locale: string;
    labels: I18NLabelsResponseData[];
}