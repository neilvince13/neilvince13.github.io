(function () {
    var myConnector = tableau.makeConnector();
	
// Init function for connector, called during every phase
	myConnector.init = function(initCallback) {
		tableau.authType = tableau.authTypeEnum.basic;
		tableau.username = 'tableautraining@dbgurus.com.au';
		tableau.password = 'dbg2022';
		initCallback();
	}
	
    myConnector.getSchema = function (schemaCallback) {
    var cols = [{
        id: "Country",
         dataType: tableau.dataTypeEnum.string
    }, {
        id: "Type",
        //alias: "magnitude",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "Title",
        //alias: "title",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "Sub_Title",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "Information",
        dataType: tableau.dataTypeEnum.string
    }];

    var tableSchema = {
        id: "tdbFeed",
        alias: "IND Status Report Records",
        columns: cols
     };

    schemaCallback([tableSchema]);
};

	myConnector.getData = function(table, doneCallback) {
    $.getJSON("http://localhost:8889/dev.thedatabase.net/api/accounts/27277/tables/7936/records", function(resp) {
        var feat = resp.features,
            tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = feat.length; i < len; i++) {
            tableData.push({
				"Country": feat[i].Country,
				"Type": feat[i].Type,
				"Title": feat[i].Title,
				"Sub_Title": feat[i].Sub_Title,
				"Information": feat[i].Information
            });
        }

        table.appendRows(tableData);
        doneCallback();
    });
};

    tableau.registerConnector(myConnector);
	
	$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "TDB Feed";
        tableau.submit();
    });
});
})();