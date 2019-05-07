var reqBy = aa.env.getValue("RequestedBy");
var ftpSite = aa.env.getValue("ftpSitePath");
var agencyName = aa.env.getValue("theFtpName");
var ftpPassword = aa.env.getValue("theFtpPassword")

var theDate = new Date();
theDate.getDate();
//var theCurrentHour = theDate.getHours();
//var theCurrentMinute = theDate.getMinutes();
//var theDirectoryName = "C:/" + theCurrentHour + theCurrentMinute;

var theDay = theDate.getDay();
if (theDay == 0)       //Sunday
{ uniqueDirName = "Sunday" }
else if (theDay == 1)  //Monday
{ uniqueDirName = "Monday" }
else if (theDay == 2)  //Tuesday
{ uniqueDirName = "Tuesday" }
else if (theDay == 3)  //Wednesday
{ uniqueDirName = "Wednesday" }
else if (theDay == 4)  //Thursday
{ uniqueDirName = "Thursday" }
else if (theDay == 5)  //Friday
{ uniqueDirName = "Friday" }
else if (theDay == 6)  //Saturday
{ uniqueDirName = "Saturday" }

var theDirectoryName = "C:/Temp" + uniqueDirName;  //create unique directory name...so csv file gets overwritten

var result = "0"; // success

try {
	var getResult = aa.cap.getByAppType("Permits", "Surface Water", null, null);
	if (getResult.getSuccess()) 
	   {
		var list = getResult.getOutput();

		var message = "\"" + "RECORDID" + "\"" + " ," + "\"" + "ACCELAID" + "\"" + '\n';
	    for (var I in list) 
		 {
                   if (!list[I].getCapID().getCustomID().contains("EST"))
			{
			    theCapID = list[I].getCapID()
				var docsList= new Array();
				var hasDocuments = "No";
				theDocResult = aa.document.getCapDocumentList(theCapID, "ADMIN")
				if (theDocResult.getSuccess())
				{
					docsList= theDocResult.getOutput()
					hasDocuments = "Yes"
				}
			
				if (hasDocuments == "Yes")
				{
			 message+= " \"" + list[I].getCapID().getCustomID().toString() + "\"" + " ," + " \"" + list[I].getCapID() + "\"" + '\n';     
			}
                      }
               }
        } else 
		{
		var message = "Failed!  error " + getResult.getErrorMessage();
	    }
	
	  aa.util.deleteFile(theDirectoryName + "/ACCELA_SW_PERMITS.CSV");
          fileObj = aa.util.writeToFile(message, theDirectoryName + "/ACCELA_SW_PERMITS.CSV");

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
 catch (err) {
	message = "ERROR " + err;
}


aa.env.setValue("ScriptReturnCode", message);  
aa.env.setValue("ScriptReturnMessage", message);  //to print to screen