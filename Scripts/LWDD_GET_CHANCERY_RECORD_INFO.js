var reqBy = aa.env.getValue("RequestedBy");
var ftpSite = aa.env.getValue("ftpSitePath");
var agencyName = aa.env.getValue("theFtpName");
var ftpPassword = aa.env.getValue("theFtpPassword");

var theDate = new Date();
theDate.getDate();

var theDirectoryName = "C:/Temp/chParcels";  //create unique directory name...so csv file gets overwritten
var result = "0"; // success

try {	
    var getResult = aa.cap.getByAppType("ChanceryReview", "NA", null, null);
	if (getResult.getSuccess()) 
	{
        var list = getResult.getOutput();

		var message = "RECORDID" + "," + "ACCELAID" + "," + "APPSTATUS" + "," + "APPNAME" + "," + "APPTYPE" + "," + "OWNER" + "," + "CANAL 1" + "," + "PARCEL" + '\n';
		for (var I in list) 
		{
			if (!list[I].getCapID().getCustomID().contains("EST"))
			{   
				theCapID = null;
                                theCapID = list[I].getCapID();
				theCap = null;
			        theCap = aa.cap.getCap(theCapID).getOutput();
				theCapStatus = null;
				theCapStatus = list[I].getCapStatus();
				
				//Application Name
				theAppName = null;
			    theAppNameResult = theCap.getSpecialText();
                if (theAppNameResult)
                {theAppName = theAppNameResult.replace(",", " ")}
				else (theAppName = null)
					
				//Application Type
				theAppType = null;
				appTypeResult = theCap.getCapType();
					if (appTypeResult)
					{
						appTypeString = appTypeResult.toString();
						appTypeArray = appTypeString.split("/");
						theAppType = appTypeArray[2]
					}
					else (theAppType = null)
					
				//Application Primary Owner
				theOwner = null;
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
						var AppSpecInfoObj = appSpecInfoResult.getOutput();

						for (var theValue in AppSpecInfoObj)
						{ 
							if (AppSpecInfoObj[theValue].getCheckboxDesc() == "Adjacent LWDD Canal (1)")
							{
								Canal_1 = AppSpecInfoObj[theValue].getChecklistComment();
								break;
							}
						}	
					}

				capParcelResult = aa.parcel.getParcelandAttribute(theCapID,null);
					if (capParcelResult.getSuccess())
					{
						var Parcels = capParcelResult.getOutput().toArray();
						for (zz in Parcels)
						{
							var parcelNum = Parcels[zz].getParcelNumber().toString();
							var cleanParcel = parcelNum.replace("-", "");
						}
					}

				message+= list[I].getCapID().getCustomID().toString() + "," + list[I].getCapID() + "," + theCapStatus + "," + theAppName + "," + theAppType + "," + theOwner +  "," + Canal_1 +  "," + cleanParcel  + '\n';
			}   
		}      	
	}
		else 
	{
		var message = "Failed!  error " + getResult.getErrorMessage();
	}

	aa.util.deleteFile(theDirectoryName + "/ACCELA_CHANCERY_INFO.CSV");
	fileObj = aa.util.writeToFile(message, theDirectoryName + "/ACCELA_CHANCERY_INFO.CSV");
	if (fileObj) 
	{
		ftpResult = aa.util.ftpUpload(ftpSite, "21", agencyName, ftpPassword, "accela_extracts", fileObj);
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
//aa.env.setValue("ScriptReturnMessage", message);  //to print to screen, message);  //to print to screen