var reqBy = aa.env.getValue("RequestedBy");
var reqDate = new Date();
reqDate.getDate();
var result = "0"; // success

try {
	var getResult = aa.cap.getByAppType("Permits", "ROW", null, null);
	if (getResult.getSuccess()) {
		var list = getResult.getOutput();
		var message = "Number of Permit Records = " + list.length + " Requested by " + reqBy + " on " + reqDate + "<BR>";
	for (var I in list) {
             message+= list[I].getCapID().getCustomID() + "," + "<BR>";
             }
         } else {
		var message = "Failed!  error " + getResult.getErrorMessage();
	}
} catch (err) {
	message = "ERROR " + err;
}


aa.env.setValue("ScriptReturnCode", result);
aa.env.setValue("ScriptReturnMessage", message);