sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/resource/ResourceModel"
], function(Object, ResourceModel){
    "use strict";

    return Object.extend("zmmo071101.model.OrderModel", {
        _OrderModel         :   {},
        SuccessStatus       :   "Success",
        ErrorStatus         :   "Error",
        _ResourceBundle:    new ResourceModel({
            bundleName:         "zmmo071101.i18n.i18n",
            supportedLocales:   [""],
            fallbackLocales:    ""
        }).getResourceBundle(),

        constructor : function(oModel){
            this._OrderModel    =   oModel;
        },

        getOrderData: function(oInputModel){
            var that = this;
            var oParameters = this.buildGetOrderParameter(oInputModel);

            return new Promise(function(resolve, reject){
                that._OrderModel.callFunction("/GetOrder", {
                    method          :   "GET",
                    urlParameters   :   oParameters,
                    success         :   function(oData) {
                        oInputModel.setOrderData(oData.GetOrder);

                        resolve({
                            status  :   that.SuccessStatus,
                            details :   oData.GetOrder
                        })
                    },
                    error           :   function(oError) {
                        reject({
                            status  :   that.ErrorStatus,
                            details :   oError
                        })
                    } 
                })
            });
        },

        buildGetOrderParameter: function(oInputModel){
            var oInputData = oInputModel.getData();

            return {
                "OrderNo"               :   ( !oInputData.ProductionOrder ? "" : oInputData.ProductionOrder),
                "RackNo"                :   ( !oInputData.RackNo ? "" : oInputData.RackNo),
                "TransportationType"    :   ( !oInputData.TransportationType ? "" : oInputData.TransportationType),
                "Flag"                  :   "X"
            }
        },

        getComponentData: function(oInputModel){
            var that = this;
            var oParameters = this.buildGetMaterialNameParameter(oInputModel);

            return new Promise(function(resolve, reject){
                that._OrderModel.callFunction("/GetMaterialName", {
                    method          :   "GET",
                    urlParameters   :   oParameters,
                    success         :   function(oData) {
                        oInputModel.setComponentData(oData.GetMaterialName);

                        resolve({
                            status  :   that.SuccessStatus,
                            details :   oData.GetMaterialName
                        })
                    },
                    error           :   function(oError) {
                        reject({
                            status  :   that.ErrorStatus,
                            details :   oError
                        })
                    } 
                })
            });
        },

        buildGetMaterialNameParameter: function(oInputModel){
            var oInputData = oInputModel.getData();

            return {
                "Material"               :   ( !oInputData.Component ? "" : oInputData.Component)
            }
        },

        // postScannedData:    function(oScannedData){
        //     var that = this;
        //     var oDataToBePosted =   this.prepareDataToBePosted(oScannedData);

        //     return new Promise(function(resolve, reject){
        //         that._OrderModel.create("/GoodsReceiptPCs", oDataToBePosted, {
        //             success : function(oData) {
        //                 resolve({
        //                     status  :   that.SuccessStatus,
        //                     details :   oData,
        //                     message :   that.getPostSuccessMessage(oData.MaterialDocumentNo)
        //                 })
        //             },
        //             error : function(oError) {
        //                 reject({
        //                     status  :   that.ErrorStatus,
        //                     details :   oError,
        //                     message :   that.getPostErrorMessage()
        //                 })
        //             }
        //         })
        //     })
        // },

        // prepareDataToBePosted:  function(oScannedData){
        //     return {
        //         TransactionId   :   "1",
        //         TransactionCode :   "ZMMO071_303",
        //         ToItems         :   this.appendToItems(oScannedData.ScannedData)
        //     }
        // },

        appendToItems: function(aScannedDataList){
            var aToItems    =   [];

            aScannedDataList.forEach(function(oScannedData){
                aToItems.push({
                    TransactionId   :   "1",
                    ItemNo          :   oScannedData.ItemNo.toString(),
                    Reject          :   ( oScannedData.Reject ? "X" : "" ),
                    Material        :   oScannedData.Material,
                    Plant           :   oScannedData.Plant,
                    StorageLocation :   oScannedData.StorageLocation,
                    Vendor          :   oScannedData.Vendor,
                    Count           :   oScannedData.Count.toString(),
                    OrderNo         :   oScannedData.OrderNo
                });
            });

            return aToItems;
        },

        getPostSuccessMessage: function(sMaterialDocumentNo) {
            return this._ResourceBundle.getText("post.Success", 
                                                [sMaterialDocumentNo]);
        },

        getPostErrorMessage: function(oInputData) {
            return this._ResourceBundle.getText("post.Error");
        },

        getVendorData: async function(oInputModel) {
            var that = this;
            var oParameters =   this.buildGetVendorDataParameter(oInputModel);

            if (oParameters) {

                return new Promise(function(resolve, reject){
                    that._OrderModel.callFunction("/GetVendorData", {
                        method          :   "GET",
                        urlParameters   :   oParameters,
                        success         :   function(oData){
                            oInputModel.setVendorData(oData.GetVendorData);

                            resolve({
                                status  :   that.SuccessStatus,
                                details :   oData.GetVendorData
                            })
                        },
                        error           :   function(oError){
                            reject({
                                status  :   that.ErrorStatus,
                                details :   oError
                            })
                        }
                    })
                });

            }
        },

        buildGetVendorDataParameter: function(oInputModel) {
            var oInputData = oInputModel.getData();

            if (oInputData.Vendor){
                return {
                    "Vendor"    :   oInputData.Vendor
                };
            }
        },

        getStandardPackingData: function(oInputModel) {
            var that = this;
            var oParameters =   this.buildGetStdPackingParameter(oInputModel);

            return new Promise(function(resolve, reject){
               that._OrderModel.callFunction("/GetStandardPacking", {
                    method          :   "GET",
                    urlParameters   :   oParameters,
                    success         :   function(oData){
                        oInputModel.setStandardPacking(oData.results);

                        resolve({
                            status  :   that.SuccessStatus,
                            details :   oData.results
                        })
                    },
                    error           :   function(oError){
                        reject({
                            status  :   that.ErrorStatus,
                            details :   oError
                        })
                    }
               })
            });
        },
        
        buildGetStdPackingParameter: function(oInputModel) {
            var oInputData = oInputModel.getData();

            return {
                "Material"              :   (!oInputData.Material? "" : oInputData.Material),
                "OrderNo"               :   (!oInputData.ProductionOrder? "" : oInputData.ProductionOrder),
                "RackId"                :   (!oInputData.RackID? "" : oInputData.RackID),
                "RackNo"                :   (!oInputData.RackNo? "" : oInputData.RackNo),
                "TransportationType"    :   (!oInputData.TransportationType? "": oInputData.TransportationType)
            };
        }
    });
});