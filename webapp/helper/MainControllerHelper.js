sap.ui.define([
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/library",
    "sap/ui/model/ValidateException",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/type/Integer"
], function(BusyIndicator, library, ValidateException, ResourceModel, Integer) {
    'use strict';

    return ({
        _MessageType:   library.MessageType,
        _ValueState:    library.ValueState,
        _ResourceBundle:    new ResourceModel({
            bundleName:         "zmmo071101.i18n.i18n",
            supportedLocales:   [""],
            fallbackLocales:    ""
        }).getResourceBundle(),

        getOrderData :   async function(oOrderModel, oInputModel) {
            try {
                BusyIndicator.show(0);
                await oOrderModel.getOrderData(oInputModel);
                BusyIndicator.hide();
            } catch {
                BusyIndicator.hide();
            }
       },
       
       openSlocSearchDialog : function(oSlocDialog, oView){
            oSlocDialog.openDialog(oView);
       },

       clearMessages : function(oMessageStrip, oMessagePopover, oInputModel) {
            oInputModel.refresh(true);
            oMessageStrip.clearMessageStrip();
            oMessagePopover.removeAllMessages();

       },

       validateRequiredFields : function(oMessagePopover){
            var aRequiredFields         = this.getFields('[data-required="true"]');
            var aMessages               = [];
            var aViolation              = [];
            var sMessage                = "";

            aRequiredFields.forEach((requiredField)=>{
                let oField = sap.ui.getCore().byId(requiredField.id);
                if (oField.getValue && !oField.getValue()) {
                    sMessage = this._ResourceBundle.getText("validate.required", [requiredField.name]);
                    aMessages.push(sMessage);
                    aViolation.push("required");
                    oMessagePopover.addMessage(sMessage, this._MessageType.Error);

                    this.setValueState(oField, this._ValueState.Error, sMessage);
                } else {
                    this.setValueState(oField, this._ValueState.None, "");
                }
            });

            if (aMessages.length > 0) {
                throw new ValidateException(this.combineMessages(aMessages), aViolation);
            }
       },

       validateRequiredFieldsOrder : function(oMessagePopover){
            var aRequiredFields         = this.getFields('[data-requiredOrder="true"]');
            var aMessages               = [];
            var aViolation              = [];
            var sMessage                = "";

            aRequiredFields.forEach((requiredField)=>{
                let oField = sap.ui.getCore().byId(requiredField.id);
                if (oField.getValue && !oField.getValue()) {
                    sMessage = this._ResourceBundle.getText("validate.required", [requiredField.name]);
                    aMessages.push(sMessage);
                    aViolation.push("required");
                    oMessagePopover.addMessage(sMessage, this._MessageType.Error);

                    this.setValueState(oField, this._ValueState.Error, sMessage);
                } else {
                    this.setValueState(oField, this._ValueState.None, "");
                }
            });

            if (aMessages.length > 0) {
                throw new ValidateException(this.combineMessages(aMessages), aViolation);
            }
       },

       setValueState : function(oField, sValueState, sMessage) {
            if(oField.setValueState){
                oField.setValueState(sValueState);
                oField.setValueStateText(sMessage);
            }        
       },

       validateValue : function(oMessagePopover){
            this.validateCountField(oMessagePopover);
       },

       validateCountField : function(oMessagePopover){
            var sCountFieldName         =  this._ResourceBundle.getText("count");
            var aCountFields            =  this.getFields('[data-name="' + sCountFieldName +'"]');
            var aMessages               = [];
            var aViolation              = [];
            var sMessage                = "";
            var oInteger                = new Integer({},{
                minimum : 1,
                maximum : 99
            })

            aCountFields.forEach((countField)=>{
                let oField = sap.ui.getCore().byId(countField.id);
                if (oField.getValue && oField.getValue()){
                    try {
                        oInteger.validateValue(oField.getValue());
                        this.setValueState(oField, this._ValueState.None, "");
                    } catch (oError) {
                        sMessage = oError.message;
                        aMessages.push(sMessage);
                        aViolation = oError.aViolation;
                        oMessagePopover.addMessage(sMessage, this._MessageType.Error);

                        this.setValueState(oField, this._ValueState.Error, sMessage);
                    }
                }
            });

            if (aMessages.length > 0) {
                throw new ValidateException(this.combineMessages(aMessages), aViolation);
            }
       },

       resetInputValueState: function(){
            var aRequiredFields         = this.getFields('[data-required="true"]');

            aRequiredFields.forEach((requiredField)=>{
                let oField = sap.ui.getCore().byId(requiredField.id);
                this.setValueState(oField, this._ValueState.None, "");
            });
       },
       
       getFields : function(sSelector){
            var aRequireFieldId = [];

            $(sSelector).each(function(){
                aRequireFieldId.push({
                    id    : $(this).context.id,
                    name  : ($(this).context.attributes["data-name"].value? $(this).context.attributes["data-name"].value : "")
                });
            });

            return aRequireFieldId;
       },
       
       getVendorData: async function(oOrderModel, oInputModel) {
            oInputModel.clearVendorData();
            try {
                    BusyIndicator.show(0);
                    await oOrderModel.getVendorData(oInputModel);               
                    BusyIndicator.hide(0);
                } catch (oError) {
                    BusyIndicator.hide(0);
                }
       },

       goToComponent: async function(oOrderModel, oInputModel, oScreenManager) {
           oInputModel.clearOrderData();
           oInputModel.clearVendorData();
           oInputModel.clearStandardPacking();

           try {
                BusyIndicator.show(0);
                await oOrderModel.getOrderData(oInputModel);
                await oOrderModel.getVendorData(oInputModel);
                await oOrderModel.getStandardPackingData(oInputModel);
                oScreenManager.loadFragment("Component");
                BusyIndicator.hide();
           } catch (oError) {
                BusyIndicator.hide();
                throw oError;
           }
       },

       combineMessages : function(aMessages) {
		    if (aMessages.length === 1) {
			    return aMessages[0];
		    } else {
			    return aMessages.join(". ") + ".";
		    }
        },
        
        saveComponent: async function(oOrderModel, oInputModel, oMessagePopover) {

            try {
                BusyIndicator.show(0);
                await oOrderModel.getComponentData(oInputModel);
                oInputModel.validateComponent();
                oInputModel.appendComponentData();
                BusyIndicator.hide();
            } catch (oError) {
                BusyIndicator.hide();
                oMessagePopover.addMessage(oError, this._MessageType.Error);
            }
        }
    });
});