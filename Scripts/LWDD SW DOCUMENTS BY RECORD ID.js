var reqBy = aa.env.getValue("RequestedBy");
var ftpSite = aa.env.getValue("ftpSitePath");
var agencyName = aa.env.getValue("theFtpName");
var ftpPassword = aa.env.getValue("theFtpPassword");

var theDate = new Date();
theDate.getDate();

var theDirectoryName = "C:/Temp/RowStatus";  //create unique directory name...so csv file gets overwritten

var result = "0"; // success

try {
	var getResult = aa.cap.getByAppType("Permits", "Surface Water", null, null);
	if (getResult.getSuccess()) 
	{
		var list = getResult.getOutput();

		var message = "RECORDID" + ", " + "APPSTATUS" + ", " + "APPNAME" + ", " + "DOCUMENT 1" + ", " + "DOCUMENT 2" + ", " + "DOCUMENT 3" +  ", " + "DOCUMENT 4" +  ", " + "DOCUMENT 5" +  ", " + "DOCUMENT 6" + '\n';
		for (var I in list) 
		{
			if (!list[I].getCapID().getCustomID().contains("EST"))
			{   
                theCapID = list[I].getCapID()
			    theCap = aa.cap.getCap(theCapID).getOutput();
				theCapStatus = list[I].getCapStatus()
				
				//Application Name
				theAppName = null
			    theAppNameResult = theCap.getSpecialText()
                if (theAppNameResult)
                {theAppName = theAppNameResult.replace(",", " ")}
				else (theAppName = null)
					
				//Application Type
				theAppType = null
				appTypeResult = theCap.getCapType();
					if (appTypeResult)
					{
						appTypeString = appTypeResult.toString();
						appTypeArray = appTypeString.split("/");
						theAppType = appTypeArray[2]
					}
					else (theAppType = null)
					
					var docsList= new Array();
					var DOCUMENT_1 = null;
					var DOCUMENT_2 = null;
					var DOCUMENT_3 = null;
					var DOCUMENT_4 = null;
					var DOCUMENT_5 = null;
					var DOCUMENT_6 = null;
                    theDocResult = aa.document.getCapDocumentList(theCapID, "ADMIN")

                    if (theDocResult.getSuccess())
                    {
                      docsList= theDocResult.getOutput()
 
                         for (theIndex in docsList)
                         {    
                            DOCUMENT_1 = null;
							DOCUMENT_2 = null;
							DOCUMENT_3 = null;
							DOCUMENT_4 = null;
							DOCUMENT_5 = null;
							DOCUMENT_6 = null;
						  if (theIndex == 0) {DOCUMENT_1 = docsList[theIndex].docName.toString();}
						  else if (theIndex == 1) {DOCUMENT_2 = docsList[theIndex].docName.toString();} 
                          else if (theIndex == 2) {DOCUMENT_3 = docsList[theIndex].docName.toString();} 
                          else if (theIndex == 3) {DOCUMENT_4 = docsList[theIndex].docName.toString();} 
						  else if (theIndex == 4) {DOCUMENT_5 = docsList[theIndex].docName.toString();} 
						  else if (theIndex == 5) {DOCUMENT_6 = docsList[theIndex].docName.toString();} 
                         }                    
                     }

				message+= list[I].getCapID().getCustomID().toString() + ", " + theCapStatus + ", " + theAppName + ", " + DOCUMENT_1 + ", " + DOCUMENT_2 +  ", " + DOCUMENT_3 +  ", " + DOCUMENT_4 +  ", " + DOCUMENT_5 +  ", " + DOCUMENT_6 + '\n';
			}   
		}      
	} 
	else 
	{
		var message = "Failed!  error " + getResult.getErrorMessage();
	}
	aa.util.deleteFile(theDirectoryName + "/SW_DOCUMENTS.CSV");
	fileObj = aa.util.writeToFile(message, theDirectoryName + "/SW_DOCUMENTS.CSV");

	if (fileObj) 
	{
	ftpResult = aa.util.ftpUpload(ftpSite, "21", agencyName, ftpPassword, "accela_extracts", fileObj);
		if (ftpResult.getSuccess()) 
		{
		//outSuccess = true
		//logDebug("Successfully transferred file to ftp.accela.com");
		}
	}
	else 
	{
    	logDebug(ftpResult.getErrorType() + ": " + ftpResult.getErrorMessage());
	}
}
 catch (err) 
{
	message = "ERROR " + err;
}


aa.env.setValue("ScriptReturnCode", message);  
aa.env.setValue("ScriptReturnMessage", message);  //to print to screen, message);  //to print to screen