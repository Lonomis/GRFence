sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "zmmo071101/type/Quantity",
    "zmmo071101/model/InputModel",
    "zmmo071101/model/OrderModel",
    "zmmo071101/model/SlocModel",
    "zmmo071101/model/ScannedDataModel",
    "zmmo071101/screenManager/ScreenManager",
    "zmmo071101/messagePopover/MessagePopover",
    "zmmo071101/barcodeScanner/BarcodeScanner",
    "zmmo071101/messageStrip/MessageStrip",
    "zmmo071101/helper/MainControllerHelper",
    "zmmo071101/slocDialog/SlocDialog"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	/**
	 * @param {typeof sap.ui.core.BusyIndicator} BusyIndicator
	 */
	/**
	 * @param {typeof zmmo071101.type.Quantity} Quantity
	 */
	/**
	 * @param {typeof zmmo071101.model.InputModel} InputModel
	 */
	/**
	 * @param {typeof zmmo071101.model.OrderModel} OrderModel
	 */
	/**
	 * @param {typeof zmmo071101.model.SlocModel} SlocModel
	 */
	/**
	 * @param {typeof zmmo071101.model.ScannedDataModel} ScannedDataModel
	 */
	/**
	 * @param {typeof zmmo071101.screenManager.ScreenManager} screenManager
	 */
	/**
	 * @param {typeof zmmo071101.messagePopover.MessagePopover} MessagePopover
	 */
	/**
	 * @param {typeof zmmo071101.barcodeScanner.BarcodeScanner} BarcodeScanner
	 */
	/**
	 * @param {typeof zmmo071101.messageStrip.MessageStrip} MessageStrip
	 */
	/**
	 * @param {typeof zmmo071101.helper.MainControllerHelper} MainControllerHelper
	 */
	/**
	 * @param {typeof zmmo071101.slocDialog.SlocDialog} SlocDialog
	 */
    function (Controller, BusyIndicator, Quantity, InputModel,
              OrderModel, SlocModel, ScannedDataModel,
              ScreenManager, MessagePopover, BarcodeScanner,
              MessageStrip, MainControllerHelper, SlocDialog) {
		"use strict";

		return Controller.extend("zmmo071101.controller.MainView", {
            quantityType: Quantity,

			onInit: async function () {
                //Instantiate Input Model
                this.InputModel =   new InputModel();
                this.InputModel.setModel(this.getView(), "input");

                //Instantiate Order Model
                this.OrderModel = new OrderModel(this.getView().getModel());

                //Instantiate Storage Location Model
                this.SlocModel = new SlocModel(this.getView().getModel(), this.getView(), "sloc");

                //Instantiate Scanned Data Model
                this.ScannedDataModel = new ScannedDataModel(this.getView(), "scannedData");

                //Instantiate ScreenManager
                this.ScreenManager = new ScreenManager(this.getView(), this.getView().byId("contentVBox"), "fragment", this);
                await this.ScreenManager.loadFragment("Init");
                
                //Instantiate Barcode Scanner
                this.BarcodeScanner = new BarcodeScanner();
                this.BarcodeScanner.setStatusModel(this.getView());

                //Instantiate Sloc Dialog
                this.SlocDialog = new SlocDialog(this.InputModel, this.SlocModel);

                //Instantiate Message Popover
                this.MessagePopover = new MessagePopover(this.getView());
                this.MessagePopover.setMessageModel(this.getView());

                //Instantiate Message Strip
                this.MessageStrip = new MessageStrip(this.getView().byId("messageStripArea"));       
            },
            
            onMessagePopover: function(oEvent){
                var oButtonPopover  =   this.getView().byId("messagePopOverButton");

                this.MessagePopover.openMessagePopover(oButtonPopover, oEvent);
            },

            onGetData: function() {
                try {
                    MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                    this.InputModel.clearOrderData();
                    MainControllerHelper.validateRequiredFieldsOrder(this.MessagePopover);
                    MainControllerHelper.getOrderData(this.OrderModel, this.InputModel);
                } catch (oError) {

                }
            },

            onCancel: function(){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                this.InputModel.clearData();
            },

			onSLocSearch: function(oEvent){
				MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
				MainControllerHelper.openSlocSearchDialog(this.SlocDialog,
														  this.getView());
            },
            
            onGetVendorData: function(oEvent){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                MainControllerHelper.getVendorData(this.OrderModel, this.InputModel);
            },

            onNext: function(oEvent){
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                MainControllerHelper.validateRequiredFields(this.MessagePopover);
                MainControllerHelper.getVendorData(this.OrderModel, this.InputModel);
                MainControllerHelper.goToComponent(this.OrderModel, this.InputModel, this.ScreenManager);
            },

            onScanSloc: async function(oEvent){
				MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
				this.InputModel.clearData();

				try{
					var oResult 	= 	await this.BarcodeScanner.scanSloc();
					this.InputModel.setSlocFromBarcode(oResult.details);
				} catch (oError) {
					
				}                
            },

            onScanOrder: async function(oEvent){
				MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
				this.InputModel.clearData();

				try{
					var oResult 	= 	await this.BarcodeScanner.scanOrder();
					this.InputModel.setOrderFromBarcode(oResult.details);
				} catch (oError) {
					
				}                
            },

            onBack: function(oEvent) {
                MainControllerHelper.clearMessages(this.MessageStrip, this.MessagePopover, this.InputModel);
                this.ScreenManager.loadFragment("Init");
            }
		});
	});
