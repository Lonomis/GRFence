sap.ui.define([
    'sap/ui/base/Object',
    'zmmo071101/control/BarcodeScannerControl'
], function(Object, BarcodeScannerControl) {
    'use strict';
    
    return Object.extend("zmmo071101.barcodeScanner.BarcodeScanner", {
        _sDialogTitle           :   "Enter Barcode Manually",
        SuccessStatus           :   "Success",
        ErrorStatus             :   "Error",
        CancelStatus            :   "Cancel",
        _StatusModelName        :   "barcode",

        constructor : function(){
            
        },

        setStatusModel : function(oView){
            oView.setModel(BarcodeScannerControl.getStatusModel(), this._StatusModelName);
        },
        
        scanOrder : function(){
            var that  = this;

            return new Promise(function(resolve, reject){
                BarcodeScannerControl.scan(
                    //Scan Successfully
                    function(oResult) {
                        if (oResult.text){
                            resolve({
                                status  :   that.SuccessStatus,
                                details :   {
                                    ProductionOrder     :   (oResult.text.length >= 12 ? oResult.text.substring(4,16) : oResult.text),
                                    TransportationType  :   (oResult.text.length >= 24 ? oResult.text.substring(24,24) : oResult.text),
                                    RackNo              :   (oResult.text.length >= 22 ? oResult.text.substring(22,23) : oResult.text)
                                }
                            });
                        } else {
                            resolve({
                                status  :   that.CancelStatus
                            })
                        }
                    }, 
                    //Scan Failure
                    function(sError) {
                        reject({
                            status  :   that.ErrorStatus,
                            details :   sError
                        });
                    }, 
                    //Live Update
                    function(oParams) {
                        //Do Nothing
                    },
                    that._sDialogTitle
                );
            });
        },

        scanSloc : function(){
            var that  = this;

            return new Promise(function(resolve, reject){
                BarcodeScannerControl.scan(
                    //Scan Successfully
                    function(oResult) {
                        if (oResult.text){
                            resolve({
                                status  :   that.SuccessStatus,
                                details :   {
                                    StorageLocation     :   (oResult.text.length >= 1 ? oResult.text.substring(1,4) : oResult.text)
                                }
                            });
                        } else {
                            resolve({
                                status  :   that.CancelStatus
                            })
                        }
                    }, 
                    //Scan Failure
                    function(sError) {
                        reject({
                            status  :   that.ErrorStatus,
                            details :   sError
                        });
                    }, 
                    //Live Update
                    function(oParams) {
                        //Do Nothing
                    },
                    that._sDialogTitle
                );
            });
        }
        
    });
});