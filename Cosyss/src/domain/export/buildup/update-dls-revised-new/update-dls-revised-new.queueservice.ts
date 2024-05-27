import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {
    BaseResponse,
    RestService,
    BaseService,
    BaseRequest,
    TrackRestCallProgress,
    TrackProgress
} from "ngc-framework";
import { EXP_ENV, EXPBU_ENV, CARGO_MESSAGING_ENV } from "../../../../environments/environment";
import { Subject, Observable } from "rxjs";

export class PendingRequest {
    subscription: Subject<any>;
    request: any;
    eventCall: any;

    constructor(request: any, subscription: Subject<any>, eventCall: string) {
        this.subscription = subscription;
        this.request = request;
        this.eventCall = eventCall;
    }
}

export abstract class CheckForm {
    public abstract checkFormOnSave();
}

@Injectable()
export class UpdateDlsReviedNewService {
    private requests$ = new Subject<any>();
    private queue: PendingRequest[] = [];
    private checkForm: CheckForm;
    constructor(private restService: RestService) { }

    setCheckForm(checkForm) {
        this.checkForm = checkForm;
    }

    private execute(requestData) {
        if (requestData.eventCall === 'onTabOut') {
            //One can enhance below method to fire post/put as well. (somehow .finally is not working for me)
            const req = this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateuldlistontab, requestData.request)
                .subscribe((res: any) => {
                    const sub = requestData.subscription;
                    sub.next(res);
                    this.queue.shift();
                    if (res.data && res.data.messageList.length < 1 && res.data.dls.messageList.length < 1 && res.data.dls.uldTrolleyList[0].messageList.length < 1) {

                    } else {
                        for (const eachRow of this.queue) {
                            if (eachRow.eventCall === 'onSave') {
                                eachRow.eventCall = 'noSave'
                            }
                        }
                    }
                    this.startNextRequest();
                });
        } else if (requestData.eventCall === 'onSave') {
            const saveDLS = this.checkForm.checkFormOnSave();
            this.updateuldlistonSave(saveDLS).subscribe(res => {
                const sub = requestData.subscription;
                sub.next(res);
                this.queue.shift();
            });
        } else {
            this.queue.shift();
            const sub: Subject<any> = requestData.subscription;
            sub.complete();
        }
    }

    public addRequestToQueue(request: any, eventCall) {
        const sub = new Subject<any>();
        const pendingRequest = new PendingRequest(request, sub, eventCall);

        this.queue.push(pendingRequest);
        if (this.queue.length === 1) {
            this.startNextRequest();
        }
        return sub;
    }

    @TrackRestCallProgress()
    public addRequestToQueueOnSave(request: any, eventCall) {
        const sub = new Subject<any>();
        const pendingRequest = new PendingRequest(request, sub, eventCall);

        this.queue.push(pendingRequest);
        if (this.queue.length === 1) {
            this.startNextRequest();
        }
        return sub;
    }

    private startNextRequest() {
        // get next request, if any.
        if (this.queue.length > 0) {
            this.execute(this.queue[0]);
        }
    }

    @TrackRestCallProgress()
    public updateuldlistonSave(requestData: any) {
        return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateuldlistonSave, requestData);
    }

}