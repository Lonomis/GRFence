sap.ui.define([
    'sap/ui/base/Object',
    'sap/ui/model/json/JSONModel'
], function(Object, JSONModel) {
    'use strict';
    return Object.extend("zmmo071101.model.InputModel",{
        _oModel : {},

        constructor :   function(){

            this._oModel = new JSONModel(this.getInitialData());
            this._oModel.setDefaultBindingMode("TwoWay");
        },

        getInitialData : function(){
            return {
                ProductionOrder         :   "",
                TransportationType      :   "",
                RackNo                  :   "",
                Material                :   "",
                Plant                   :   "",
                WBS                     :   "",
                ProductionVersion       :   "",
                RackID                  :   "",
                Count                   :   0,
                StorageLocation         :   "",
                Reject                  :   "",
                Vendor                  :   "",
                VendorName              :   ""
            }
        },

        setModel    :   function(oView, sModelName){
            oView.setModel(this._oModel, sModelName);
        },

        getData     :   function(){
            return this._oModel.getData();
        },
        
        setData     :   function(oInputdata){
            var oData = this.getInitialData();

            oData.ProductionOrder       =   oInputdata.ProductionOrder;
            oData.TransportationType    =   oInputdata.TransportationType;
            oData.RackNo                =   oInputdata.RackNo;
            oData.Material              =   oInputdata.Material;
            oData.Plant                 =   oInputdata.Plant;
            oData.WBS                   =   oInputdata.WBS;
            oData.ProductionVersion     =   oInputdata.ProductionVersion;
            oData.RackID                =   oInputdata.RackID;
            oData.Count                 =   oInputdata.Count;
            oData.StorageLocation       =   oInputdata.StorageLocation;
            oData.Reject                =   oInputdata.Reject;
            oData.Vendor                =   oInputdata.Vendor;
            oData.VendorName            =   oInputdata.VendorName;

            this._oModel.setData(oData);
        },

        clearData : function(){
            this._oModel.setData(this.getInitialData());
        },

        setOrderFromBarcode : function(oResult) {
            this.clearOrderData();
            var oInputData	=	this.getData();

            oInputData.ProductionOrder		=   oResult.ProductionOrder;
            oInputData.TransportationType   =   oResult.TransportationType;
            oInputData.RackNo               =   oResult.RackNo;
            this.setData(oInputData);
        },
        
        setSlocFromBarcode : function(oResult) {
            var oInputData  =   this.getData();

            oInputData.StorageLocation      =   oResult.StorageLocation;
            this.setData(oInputData);
        },

        refresh :   function(bForceUpdate){
            this._oModel.refresh(bForceUpdate);
        },

        setVendorData: function(oResult) {
            var oData = this.getData();

            oData.VendorName    =   oResult.details.VendorName;

            this.setData(oData);
        },

        clearVendorData: function(){
            var oData   =   this.getData();

            oData.VendorName    =   "";

            this.setData(oData);
        },

        clearOrderData: function(){
            var oData   =   this.getData();

            oData.Material              =   "";
            oData.Plant                 =   "";
            oData.WBS                   =   "";
            oData.ProductionVersion     =   "";
            oData.RackID                =   "";
            oData.StorageLocation       =   "";

            this.setData(oData);
        }
        
    });
});