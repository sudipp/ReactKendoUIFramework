    const Module1Service = {
        transport: {
            read: {
                url: "https://demos.telerik.com/kendo-ui/service/Products",
                dataType: "jsonp"
            },
            update: {
                url: "https://demos.telerik.com/kendo-ui/service/Products/Update",
                dataType: "jsonp"
            },
            destroy: {
                url: "https://demos.telerik.com/kendo-ui/service/Products/Destroy",
                dataType: "jsonp"
            },
            create: {
                url: "https://demos.telerik.com/kendo-ui/service/Products/Create",
                dataType: "jsonp"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return {
                        models: kendo.stringify(options.models)
                    };
                }
            }
        },
        batch: true,
        pageSize: 20,
        schema: {
            data: function (data) {
                var dbdata = data.map(dataItem => Object.assign({
                    IsSelectable: true
                }, dataItem));
                return dbdata;
            },
            total: function (data) {
                return data.length;
            },
            model: {
                id: "ProductID",
                fields: {
                    ProductID: {
                        editable: false,
                        nullable: true
                    },
                    ProductName: {
                        validation: {
                            required: true
                        }
                    },
                    UnitPrice: {
                        type: "number",
                        validation: {
                            required: true,
                            min: 1
                        }
                    },
                    Discontinued: {
                        type: "boolean"
                    },
                    UnitsInStock: {
                        type: "number",
                        validation: {
                            min: 0,
                            required: true
                        }
                    }
                }
            }
        }
    };

    export default Module1Service
