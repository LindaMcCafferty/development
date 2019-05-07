var reqBy = aa.env.getValue("RequestedBy");
var ftpSite = aa.env.getValue("ftpSitePath");
var agencyName = aa.env.getValue("theFtpName");
var ftpPassword = aa.env.getValue("theFtpPassword");

var theDirectoryName = "C:/Temp/RowStatus";  //create unique directory name...so csv file gets overwritten

var result = "0"; // success

try {
	var getResult = aa.cap.getByAppType("Permits", "ROW", null, null);
	if (getResult.getSuccess()) 
	{
		var list = getResult.getOutput();

		var message = "DOCUMENT NAME" + '\n';
		for (var I in list) 
		{
			if (!list[I].getCapID().getCustomID().contains("EST"))
			{   
                theCapID = list[I].getCapID()
			    theCap = aa.cap.getCap(theCapID).getOutput();
				theCapStatus = list[I].getCapStatus()
				
					var docsList= new Array();
					var DOCUMENT_NAME = null;
					
                    theDocResult = aa.document.getCapDocumentList(theCapID, "ADMIN")

                    if (theDocResult.getSuccess())
                    {
                      docsList= theDocResult.getOutput()
 
                         for (theIndex in docsList)
                         {    	
			DOCUMENT_NAME += docsList[theIndex].docName.toString() + '\n';
                         }                    
                     }
				message+= DOCUMENT_NAME;
			}   
		}      
	} 
	else 
	{
		var message = "Failed!  error " + getResult.getErrorMessage();
	}
	aa.util.deleteFile(theDirectoryName + "/ROW_DOCUMENTS.CSV");
	fileObj = aa.util.writeToFile(message, theDirectoryName + "/ROW_DOCUMENTS.CSV");

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