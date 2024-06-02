sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("empappui.empappui.controller.Main", {
            onInit: function () {

            },

            handleAddEmployee : function(){
                var oView = this.getView();
                
                var data = {
                    "id" : "",
                    "name" : "",
                    "company" : ""
                };
                var jsonModel = new JSONModel(data);
                this.getView().setModel(jsonModel, "oAddModel");

                if(!this._oAddEmployeeDialog){
                    this._oAddEmployeeDialog = Fragment.load({
                        id: oView.getId(),
                        name: "empappui.empappui.fragments.AddEmployee",
                        controller: this
                    }).then(function(oDialog){
                        oDialog.setModel(oView.getModel("oAddModel"), "oAddModel");
                        return oDialog;
                    });
                }
                this._oAddEmployeeDialog.then(function(oDialog){
                    oDialog.open();
                }.bind(this));
            },

            handleEdiEmployee : function(oEvent){
                var oView = this.getView();  
                var itemData = oEvent.getSource().getBindingContext().getObject();
                    var data = {
                        "id" : itemData.EmployeeID,
                        "name" : itemData.EmployeeName,
                        "company" : itemData.CompanyName,
                        "ID" : itemData.ID
                    };
                var jsonModel = new JSONModel(data);
                this.getView().setModel(jsonModel, "oEditModel");

                if(!this._oEditEmployeeDialog){
                    this._oEditEmployeeDialog = Fragment.load({
                        id: oView.getId(),
                        name: "empappui.empappui.fragments.EditEmployee",
                        controller: this
                    }).then(function(oDialog){
                        oDialog.setModel(oView.getModel("oEditModel"), "oEditModel");
                        return oDialog;
                    });
                }
                this._oEditEmployeeDialog.then(function(oDialog){
                    oDialog.open();
                }.bind(this));
            },

            handleChange : function(oEvent){
                var sValue = oEvent.getParameter("value");
                oEvent.getSource().setValue(sValue);
                //this.getView().getModel("oAddModel").updateBindings();
            },

            addEmployee : function(){
                var oModel = this.getOwnerComponent().getModel();
                var data = this.getView().getModel("oAddModel").getData();
                var oEntry = {
                    "EmployeeID": data.id,
                    "EmployeeName" : data.name,
                    "CompanyName" : data.company
                };
                oModel.create("/Employee", oEntry,{
                    success : function(oData, oResponse){
                        MessageToast.show("Success");
                        this.cancelAddEmployee();
                    }.bind(this),
                    error : function(oError){
                        MessageBox.error("Error");
                    }
                })
            },

            editEmployee : function(){
                var oModel = this.getOwnerComponent().getModel();
                var data = this.getView().getModel("oEditModel").getData();
                var oEntry = {
                    "EmployeeID": data.id,
                    "EmployeeName" : data.name,
                    "CompanyName" : data.company
                };
                oModel.update("/Employee(" + data.ID + ")", oEntry,{
                    success : function(oData, oResponse){
                        MessageToast.show("Updated");
                        this.cancelEditEmployee();
                    }.bind(this),
                    error : function(oError){
                        MessageBox.error("Error");
                    }
                })
            },

            handleDeleteEmployee : function(oEvent){
                var oModel = this.getOwnerComponent().getModel();
                var data = oEvent.getSource().getBindingContext().getObject();
                MessageBox.warning("Are you sure you want to delete the Employee?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (sAction) {
                        oModel.remove("/Employee(" + data.ID + ")",{
                            success : function(oData, oResponse){
                                MessageToast.show("Deleted");
                                
                            }.bind(this),
                            error : function(oError){
                                MessageBox.error("Error");
                            }
                        })
                        MessageToast.show("Employee: " + data.EmployeeName + "is deleted");
                    }
                });



                
            },


            cancelAddEmployee : function(){
                this._oAddEmployeeDialog.then(function(oDialog){
                    oDialog.close();
                }.bind(this));
            },

            cancelEditEmployee : function(){
                this._oEditEmployeeDialog.then(function(oDialog){
                    oDialog.close();
                }.bind(this));
            }
        });
    });
