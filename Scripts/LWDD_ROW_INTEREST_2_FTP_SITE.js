var reqBy = aa.env.getValue("RequestedBy");
var ftpSite = aa.env.getValue("ftpSitePath");
var agencyName = aa.env.getValue("theFtpName");
var ftpPassword = aa.env.getValue("theFtpPassword");

var theDate = new Date();
theDate.getDate();

var theDirectoryName = "C:/Temp/roiParcels";  //create unique directory name...so csv file gets overwritten
var result = "0"; // success

try {	
    var getResult = aa.cap.getByAppType("ROWInterest", "NA", null, null);
	if (getResult.getSuccess()) 
	{
        var list = getResult.getOutput();

		var message = "RECORDID" + "," + "PARCEL_NUMBER" + "," + "ACCELAID" +"," + "APPSTATUS" +'\n';

        	for (var I in list) 
		{
		      if (!list[I].getCapID().getCustomID().contains("EST"))
	              {
			theCapID = list[I].getCapID();				
			var capParcelResult = aa.parcel.getParcelandAttribute(theCapID,null);
			if (capParcelResult.getSuccess())
			{
				var Parcels = capParcelResult.getOutput().toArray();

				for (zz in Parcels)
				{
					var parcelNum = Parcels[zz].getParcelNumber().toString();
					if (!parcelNum.contains("XX"))			//ignore fake parcel numbers with "XX"
					{
						if (!parcelNum.contains("xx"))		//ignore fake parcel numbers with "xx"
						{
						var cleanParcel = parcelNum.replace("-", "");
						message+= list[I].getCapID().getCustomID().toString() + "," + cleanParcel + "," + theCapID +  "," + list[I].getCapStatus().toString() + '\n';
						}  //if (!parcelNum.contains("xx"))
					} // if (!parcelNum.contains("XX"))
				} // for (zz in Parcels)
			} // if (capParcelResult.getSuccess())
		} //  if (!list[I].getCapID().getCustomID().contains("EST"))
            }	// for (var I in list)	
	} // if (getResult.getSuccess())
		else 
	{
		var message = "Failed!  error " + getResult.getErrorMessage();
	}

	aa.util.deleteFile(theDirectoryName + "/ACCELA_RW_INTERESTS.CSV");
	fileObj = aa.util.writeToFile(message, theDirectoryName + "/ACCELA_RW_INTERESTS.CSV");
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
aa.env.setValue("ScriptReturnMessage", message);  //to print to screen, message);  //to print to screen