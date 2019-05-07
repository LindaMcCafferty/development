var reqBy = aa.env.getValue("RequestedBy");
var ftpSite = aa.env.getValue("ftpSitePath");
var agencyName = aa.env.getValue("theFtpName");
var ftpPassword = aa.env.getValue("theFtpPassword");

var theDate = new Date();
theDate.getDate();

var theDirectoryName = "C:/Temp/RowStatus";  //create unique directory name...so csv file gets overwritten

var result = "0"; // success

try {
	var getResult = aa.cap.getByAppType("Permits", "ROW", null, null);
	if (getResult.getSuccess()) 
	{
		var list = getResult.getOutput();

		var message = "RECORDID" + "," + "ACCELAID" + "," + "APPSTATUS" + "," + "APPNAME" + "," + "APPTYPE" + "," + "OWNER" + "," + "CANAL 1" + "," + "ID 1" + "," + "ID 2" + "," + "ID 3" + "," + "File Date" + '\n';

		for (var I in list) 
		{
			if (!list[I].getCapID().getCustomID().contains("EST"))
			{   
                theCapID = list[I].getCapID()
			    theCap = aa.cap.getCap(theCapID).getOutput();
				theCapStatus = list[I].getCapStatus()
				
                capDetail = aa.cap.getCapDetail(theCapID).getOutput();
                theID1 = capDetail.getID1();
                theID2 = capDetail.getID2();
                theID3 = capDetail.getID3();
				
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
					
				//Application Primary Owner
				theOwner = null
				appOwnerResult = aa.owner.getOwnerByCapId(theCapID );
					if (appOwnerResult.getSuccess()) 
					{
						theOwnerObject = appOwnerResult.getOutput();
						for (theIndex in theOwnerObject) 
						{
							if (theOwnerObject[theIndex].getPrimaryOwner() == "Y") 
							{
								theOwner = theOwnerObject[theIndex].getOwnerFullName().replace(",", " ");
								//theOwner.replace(",", " ")
								break;
							}								
						}
					}
					else {theOwner = null}

				//Application Specific --- Custom Fields
				Canal_1 = null;
				appSpecInfoResult = aa.appSpecificInfo.getByCapID(theCapID );
					if (appSpecInfoResult.getSuccess())
					{
						var fAppSpecInfoObj = appSpecInfoResult.getOutput();

						for (var loopk in fAppSpecInfoObj)
						{ 
							if (fAppSpecInfoObj[loopk].getCheckboxDesc() == "Adjacent LWDD Canal (1)")
							{
                                                              //if canal field is not null (empty)
                                                               if (fAppSpecInfoObj[loopk].getChecklistComment() != null)
                                                               {					 
                                                                  //remove trailing white space
                                                                  Canal_1 = (fAppSpecInfoObj[loopk].getChecklistComment().trim());
								break;
                                                               }
							}
						}	
					}
				fileDateObj = theCap.getFileDate();
				fileDate = fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
				
				message+= list[I].getCapID().getCustomID().toString() + "," + list[I].getCapID() + "," + theCapStatus + "," + theAppName + "," + theAppType + "," + theOwner + "," + Canal_1 + "," + theID1 + "," + theID2 + "," + theID3 + "," + fileDate + '\n';
			}   
		}      
	} 
	else 
	{
		var message = "Failed!  error " + getResult.getErrorMessage();
	}

	aa.util.deleteFile(theDirectoryName + "/ROW_PMT_INFO.CSV");
	
	fileObj = aa.util.writeToFile(message, theDirectoryName + "/ROW_PMT_INFO.CSV");

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