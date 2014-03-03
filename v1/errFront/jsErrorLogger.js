var jsErrorLogger = {
		
	init : function(params){
		this.errCount=10;
		this.url=params.ajaxURL;
		this.orig=params.origin;
		this.appId=params.appId || alert('Please specify the APP-ID');
		this.report=params.report || true;
		this.maxErs=params.maxErrors || 10;
		this.errors=[];
		//this.isIE67=($n.browser().name=='msie' && ($n.browser().version==7.0 || $n.browser().version==6.0))?true:false;
		this.errorDetect();
	},
	
	errorDetect : function(){window.onerror=function(msg,url,line){jsErrorLogger.logError(msg,url,line)}},
	
	logError : function (msg,url,line){
		var x,brw,errorList,arr='{',ua=navigator.userAgent,os,z;
		if (typeof msg !== "undefined" && this.errCount<=jsErrorLogger.maxErs) {
			this.errCount++;
			
			if(!url) url = location.href;
			
			//if(this.isIE67){brw=['name:'+$n.browser().name,'version:'+$n.browser().version]}
			//else{brw={name:$n.browser().name,version:$n.browser().version}}
			brw='{name:"'+$n.browser().name+'",version:"'+$n.browser().version+'"}';
			if(ua.match(/Win16/)) os='Windows 3.11';
			if(ua.match(/Windows 95/)||ua.match(/Win95/)||ua.match(/Windows_95/))os='Windows 95';
			if(ua.match(/Windows 98/)||ua.match(/Win98/))os='Windows 98';
			if(ua.match(/Windows NT 5.0/)||ua.match(/Windows 2000/))os='Windows 2000';
			if(ua.match(/Windows NT 5.1/)||ua.match(/Windows XP/))os='Windows XP';
			if(ua.match(/Windows NT 5.2/))os='Windows Server 2003';
			if(ua.match(/Windows NT 6.0/))os='Windows Vista';
			if(ua.match(/Windows NT 6.1/))os='Windows 7';
			if(ua.match(/Windows NT 6.2/))os='Windows 8';
			if(ua.match(/Windows NT 4.0/)||ua.match(/WinNT4.0/))os='Windows NT 4.0';
			if(ua.match(/Windows ME/))os='Windows ME';
			if(ua.match(/OpenBSD/))os='Open BSD';
			if(ua.match(/SunOS/))os='Sun OS';
			if(ua.match(/Linux/)||ua.match(/X11/))os='Linux';
			if(ua.match(/Mac_PowerPC/)||ua.match(/Macintosh/))os='Mac OS';
			if(ua.match(/QNX/))os='QNX';
			if(ua.match(/OS\/2/))os='OS/2';
			if(ua.match(/nuhk/)||ua.match(/Googlebot/)||ua.match(/Yammybot/)||ua.match(/Openbot/)||ua.match(/Slurp/)||ua.match(/MSNBot/)||ua.match(/Ask Jeeves\/Teoma/)||ua.match(/ia_archiver/))os='Search Bot';
			
			errorList={
				message: msg,
				url: encodeURIComponent(url),
				line: line,
				browser: brw,
				os : os || navigator.platform,
				screenResolution : screen.width+'x'+screen.height,
				dateTime : (new Date()),
				origin : encodeURIComponent(this.orig) || encodeURIComponent(document.location.href),
				appId : this.appId
			};
			
			for(x in errorList){
				if(x=='browser'){z=errorList[x]}else{z='"'+errorList[x]+'"'}
				arr+=x+':'+z+',';
			}
			arr=arr.substr(0,arr.lastIndexOf(','));
			arr+='}';
			
			//if(this.isIE67){this.errors=arr}
			//else{this.errors.push(errorList)}
			
			this.errors=arr;
		
			
			if(typeof console !== "undefined") console.log(this.errors);
			if(this.report) this.reportErrors();
		}
  	},
	
	reportErrors : function(){
		var xhr,data;(window.XMLHttpRequest)?xhr=new XMLHttpRequest():xhr=new ActiveXObject("Microsoft.XMLHTTP");
		if(this.errors.length > 0){
			//data = (this.isIE67)?this.errors:JSON.stringify(this.errors);
			data =this.errors;
			xhr.open('POST', this.url, true)
			//xhr.open('GET', this.url+'?loggedErrors='+data, true)
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send('loggedErrors='+data);
			//xhr.send();
			xhr.onreadystatechange = function(){
				(xhr.readyState == 4 && xhr.status==200) ? alert(xhr.responseText) : null;
				(xhr.readyState == 4 && xhr.status==404) ? alert('File not found - Error could not be logged') : null;
			};
			this.errors = [];
			this.errCount= 0;
		}
	}
}
jsErrorLogger.init({ajaxURL:'http://localhost:8080',origin:document.location.href,appId:1,maxErrors:10});