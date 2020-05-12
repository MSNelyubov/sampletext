var timed=null;

function onClick(){
	var x=document.getElementById("time").value;

	//redundancy ftw
	clearInterval(timed);
	timed=setInterval(function(){
		var time=parseTime(document.getElementById("time").value);
		var d=time.dec();
		if(d)
			return document.getElementById("time").value=d;
		alarm();
		clearInterval(timed);
		timed=null;
	}, 1000);
}

class Countdown {
	constructor(seconds){
		this.h=Math.floor(seconds/3600);
		this.m=Math.floor((seconds/60)%60);
		this.s=Math.floor(seconds%60);
	}
	//parses a ##h##m##s string
	static parseHMString(str){
		var obj=new Countdown(0);
		var h=str.includes("h"),
			m=str.includes("m"),
			s=str.includes("s");
		if(h){
			obj.h=str.substring(0,str.indexOf("h"))-0;
		}
		if(m){
			obj.m=str.substring(h?str.indexOf("h")+1:0,str.indexOf("m"))-0;
		}
		if(s){
			obj.s=str.substring(m?str.indexOf("m")+1:h?str.indexOf("h")+1:0,str.indexOf("s"));
		}
		if(obj.getSec)
			return obj;
		return null;
	}
	//parses a ##:##:## string to Countdown
	static fromString(tbp){
		tbp= tbp.trim().split(":");
		if(tbp.length!=3)
			return null;
		var thi=new Countdown(1);
		thi.h=tbp[0];
		thi.m=tbp[1];
		thi.s=tbp[2];
		return thi;
	}
	//decrements time by a second
	dec(){
		if(this.h==0 && this.m==0 &&this.s==0){
			return null;
		}
		this.s--;
		if(this.s==-1){
			this.s+=60;
			this.m-=1;
		}
		if(this.m==-1){
			this.m+=60;
			this.h-=1;
		}
		if(this.h<0)
			return null;
		return this;
	}
	//returns null on error, Countdown object when successful
	toString(){
		return this.h+":"+this.m+":"+this.s;
	}
	//as seconds
	getSec(){
		return this.h*3600+this.m*60+this.s;
	}
}
//returns Countdown object
function parseTime(input){
	
	//assume proper as it will be after the first second
	var tried=Countdown.fromString(input);
	if(tried)
		return tried;
	//try seconds
	if(input == (input-0)){
		return new Countdown(input);
	}
	input=input.toLowerCase();
	if(input.includes("h")||input.includes("m")||input.includes("s"))
		tried=Countdown.parseHMString(input);
	if(tried)
		return tried;
	
}