import { BaseRequest } from "ngc-framework";

export class TransferByCarrierSearch extends BaseRequest {
    transferringCarrier: any = null;
    onwardCarrier: any = null;
    transferByCarrierList: Array<TransferByCarrier> = null;
    uldNumber: any = null;
}

export class TransferByCarrier extends BaseRequest {
    select: any = null;
    to: any = null;
    awbNumber: any = null;
    awbDate: any = null;
    flightId: any = null;
    flight: any = null;
    date: any = null;
    handler: any = null;
    origin: any = null;
    destination: any = null;
    pieces: any = null;
    weight: any = null;
    weightCode: any = null;
    natureOfGoods: any = null;
    piecesInventory: any = null;
    awbDestination: any = null;
    shc: any = null;
    barecodeInd: any = null;
    readyToTransfer: any = null;
    weightInventory: any = null;
}

export class TRMByAWBSearch extends BaseRequest {
    trmNumber: any = null;
    issueDateFrom: any = null;
    issueDateTo: any = null;
    carrierCodeFrom: any = null;
    carrierCodeTo: any = null;
    airlineNumber: any = null;
    printerName: any = null;
    shipmentNumber: any = null;
    flightKey: any = null;
    flightDate: any = null;
    awbList: Array<TranshipmentTransferManifestByAWB> = null;
}


export class TranshipmentTransferManifestByAWB extends BaseRequest {
    select = false;
    carrierCodeFrom = null;
    carrierCodeTo = null;
    trmNumber = null;
    transTransferManifestByAwbId = null;
    handlingTerminalCode = null;
    airlineNumber = null;
    issuedBy = null;
    issuedDate = null;
    cancellationReason = null;
    cancelledBy = null;
    finalizedFlag = null;
    finalizedBy = null;
    finalizedDate = null;
    printedFlag = null;
    printedBy = null;
    printedDate = null;
    rePrintedFlag = null;
    rePrintedBy = null;
    rePrintedDate = null;
    createdBy = null;
    printerName = null;
    awbInfoList: Array<TranshipmentTransferManifestByAWBInfo> = null;
    freightOutAwb = null;
    allowFreightOutAwb = null;
    routingErrorPrompt = null;
    allowRoutingErrorPrompt = null;
    // cargoRetreived = null;
}

export class TranshipmentTransferManifestByAWBInfo extends BaseRequest {
    select = false;
    transTransferManifestByAwbId = null;
    transTransferManifestByAWBInfoId = null;
    inboundFlightId = null;
    inboundFlightNumber = null;
    inboundFlightDate = null;
    inboundFlightHandler = null;
    origin = null;
    awbDestination = null;
    destination = null;
    pieces = null;
    weight = null;
    weightUnitCode = null;
    natureOfGoodsDescription = null;
    remarks = null;
    shipmentNumber = null;
    shipmentDate = null;
    shcs = null;
    recievingCarrier = null;
    inventoryPieces = null;
    inventoryWeight = null;
    shcList: Array<TranshipmentTransferManifestByAWBSHC> = null;
}

export class TranshipmentTransferManifestByAWBSHC extends BaseRequest {
    transTransferManifestByAWBInfoId = null;
    specialHandlingCode = null;
    transTransferManifestByAWBInfoSHCId = null;
}