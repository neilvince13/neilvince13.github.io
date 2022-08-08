(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();
	
	// Init function for connector, called during every phase
	myConnector.init = function(initCallback) {
		tableau.authType = tableau.authTypeEnum.basic;
		tableau.username = 'tableautraining@dbgurus.com.au';
		tableau.password = 'dbg2022';
		initCallback();
	}
	
    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
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

    // Download the data
    myConnector.getData = function(table, doneCallback) {		
		$.ajax({
		url: "https://neilvince13.github.io/dev.thedatabase.net/api/accounts/27277/tables/7936/records",
		type: "GET",
		dataType: "json",
		beforeSend: function (xhr){
			xhr.setRequestHeader("Authorization", "Basic " + btoa("tableautraining@dbgurus.com.au" + ":" + "dbg2022")); 
		},
		success: function (result){
				var feat = [],
					len,
					tableData = [];
					
					feat.push(result)
					
					len = feat[0].Total
					
					// Iterate over the JSON object
				for (var i = 0; i < len; i++) {
					tableData.push({
						"Country": feat[0].Data[i].Country,
						"Type": feat[0].Data[i].Type,
						"Title": feat[0].Data[i].Title,
						"Sub_Title": feat[0].Data[i].Sub_Title,
						"Information": feat[0].Data[i].Information
					});
				}

				table.appendRows(tableData);
				doneCallback();
			}
		});
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "TDB Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();