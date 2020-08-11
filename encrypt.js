const fs=require("fs"), ini=require("ini");
const toGo="abcdefghijklmnopqrstuvwxyz";
const fileToEncrypt="impeach.txt";

/****
* how to use:
* 
* Configuration:
* set encrypt.js into the desired mode by commenting it in and all others out (modes:whipser,lightbringer,polka,dyingReality,asciiTester,testEncrypt)
* set the encryption keys up for the relevant mode (dual modes: keys d and j, polykey modes: seperate out keys with spaces inside of dj)
* if decrypting, ensure the slices are stored in files formatted as KEYGOESHERE.txt
* 
* Use:
* >node encrypt.js
* 
*see console output for further instructions on the output
*
*/



	/****************
	*	 DUAL KEY	*
	*	FUNCTIONS	*
	****************/
//var d="";
//var j="";
//whipser(d,j);
//lightbringer(d,j);



	/****************
	*	 POLYKEY	*
	*	FUNCTIONS	*
	****************/
var dj=" nick is a node";
//polka(dj);
dyingReality(dj);



	/****************
	*	DEBUGGING	*
	*	FUNCTIONS	*
	****************/
//asciiTester();
//testEncrypt();



	/****************
	*	 PRIMARY	*
	*	FUNCTIONS	*
	****************/


//generates two encrypted Raid0 copies of `canvas1.txt` and console.logs visually decrypted and recombined halves but creates no permanent decrypted record. Encrypted copies are saved
function whisper(k1,k2){
	var x = fs.readFileSync("canvas1.txt").toString();
	console.log(x.substring(0,200));

	var modulo0="";
	var modulo1="";
	for(var i=0;i<x.length;i+=2){
		modulo0+=x.charAt(i);
	}
	modulo0=encrypt(modulo0,k1);
	for(var i=1;i<x.length;i+=2){
		modulo1+=x.charAt(i);
	}
	modulo1=encrypt(modulo1,k2);

	console.log("\n\n\nModulo 0:");
	console.log(modulo0.substring(0,400));
	console.log("\n\n\nModulo 1:");
	console.log(modulo1.substring(0,400));
	
	write(modulo0,k1);
	write(modulo1,k2);
	
	decryptVerification(decrypt(modulo0,k1),decrypt(modulo1,k2));
}

//generates strPhrase.length encrypted Raid0 style slices of fileToEncrypt and console.logs visually decrypted and recombined slices but creates no permanent decrypted record. Encrypted copies are saved
function polka(strPhrase){
	var spliceKeys=cleanPhrase(strPhrase).split(" ");
	
	var x = fs.readFileSync(fileToEncrypt).toString();
	console.log("Accepted file: "+fileToEncrypt);
	console.log(reasonable(x));
	console.log("Encrypting "+fileToEncrypt+" with \'"+strPhrase+"\' across "+spliceKeys.length+" files...\n\n\n");

	for(var key in spliceKeys){
		console.log("\n\nModulo "+key+":");
		key-=1;
		key+=1;
		
		var encrypted="";
		for(var i=key;i<x.length;i+=spliceKeys.length){
			encrypted+=x.charAt(i);
			//console.log("innermost for loop of polka splicekey\t"+ key+" iteration\t"+i);
		}
		console.log("compiled slice:\t"+spliceKeys[key] +"\tlength: "+encrypted.length);
		console.log("Spliced:\t"+reasonable(encrypted));
		
		
		
		encrypted=encrypt(encrypted,spliceKeys[key]);	
		console.log("Encrypted:\t"+reasonable(encrypted));
		
		write(encrypted,spliceKeys[key]);
	}
	
	//complexDecryptVerification(decrypt,   (modulo0,k1),decrypt(modulo1,k2));
	
	
}


//decrypts X keys into a single file with the order rearranged given by the input string
function dyingReality(dj){
	var slits=[];
	var keys=cleanPhrase(dj).split(" ");
	for(var key in keys){
		slits.push(decrypt(fs.readFileSync(keys[key]+".txt").toString(),keys[key]));
	}
	
	var omega="";
	for(var i=0;i<slits[0].length;i+=1){
		omega+=carrots(i,slits);
	}
	console.log("\n\n\nDecryption test:\n");
	console.log(reasonable(omega));
	write(omega,"synthesis");
}

//recombines 
function lightbringer(k1,k2){
	var uno = decrypt(fs.readFileSync(k1+".txt").toString(),k1);
	var duo = decrypt(fs.readFileSync(k2+".txt").toString(),k2);
	
	var sigma="";

	for(var i=0;i<uno.length;i+=1){
		sigma+=uno.charAt(i)+duo.charAt(i);
	}
	console.log("\n\n\nDecryption test:\n");
	console.log(reasonable(sigma));
	write(sigma,"output");
}

function carrots(i, stacks){
	var slice="";
	for(var s in stacks){
		slice+=stacks[s].charAt(i);
	}
	return slice;
}

function decryptVerification(modulo0,modulo1){
	var sigma="";

	for(var i=0;i<modulo0.length;i+=1){
		sigma+=modulo0.charAt(i)+modulo1.charAt(i);
	}

	console.log("\n\n\nDecryption test:\n");
	console.log(sigma.substring(0,200));

}


	/****************
	*	ENCRYPTION	*
	*	  HELPERS	*
	****************/


function decrypt(toDecrypt,key){
	var decrypted="";
	var modulator=0;
	for(var i=0;i<toDecrypt.length;i++){
		if(toGo.includes(toDecrypt.charAt(i).toLowerCase())){
			decrypted+=String.fromCharCode(unspoof(toDecrypt.charAt(i),key.charAt(modulator)));
			modulator= (1+modulator)%key.length;
		}else{
		decrypted+=toDecrypt.charAt(i);
		}
	}
	return decrypted;
}

function encrypt(toEncrypt,key){
	var encrypted="";
	var modulator=0;
	for(var i=0;i<toEncrypt.length;i++){
		if(toGo.includes(toEncrypt.charAt(i).toLowerCase())){
			encrypted+=String.fromCharCode(spoof(toEncrypt.charAt(i),key.charAt(modulator)));
			modulator= (1+modulator)%key.length;
		}else{
		encrypted+=toEncrypt.charAt(i);
		}
	}
	return encrypted;
}

function unspoof(base,mod){
	var m = mod.toLowerCase().charCodeAt(0)-97;
	var b = base.charCodeAt(0);
	//Upper case
	if(b<95){
		if(b-m<65){
			return b-m+26;
		}else{
			return b-m;
		}
	}else{
		if(b-m<97){
			return b-m+26;
		}else{
			return b-m;
		}
	}

}

//return moded char string
function spoof(base,mod){
	var m = mod.toLowerCase().charCodeAt(0)-97;
	var b = base.charCodeAt(0);
	//Upper case
	if(b<95){
		if(b+m>90){
			return b+m-26;
		}else{
			return b+m;
		}
	}else{
		if(b+m>122){
			return b+m-26;
		}else{
			return b+m;
		}
	}
}
//sanitizes a string to only contain a-z + " "
function cleanPhrase(str){
	var clean = "";
	str=str.toLowerCase();
	for(var i=0;i<str.length;i++){
		if((toGo+" ").includes(str.charAt(i))){
			clean+=str.charAt(i);
		}
	}
	
	return clean.replace("  "," ").trim();
}
	/****************
	*	UTILITIES	*
	****************/

//returns a reasonable portion of the string to be printed
function reasonable(str){
	if(str.length>200){
		return str.substring(0,200)+".... 200/"+str.length;
	}
	return str;
}

function write(cont,name){

	fs.writeFile(name+'.txt', cont, (err) => {
		// throws an error, you could also catch it here
		if (err) throw err;
		// success case, the file was saved
		console.log(name+'.txt saved!');
});

}
	
	/****************
	*    TESTING	*
	****************/

function testEncrypt(){
	var en = encrypt("tHERE ONCE WAAAas a Hero___:! named ragnar the red.","rengar");
	console.log(en);
	console.log(decrypt(en,"rengar"));
}

function asciiTester(){
	for(var i=0;i<26;i++){
		console.log(toGo.charAt(i)+": "+ toGo.charCodeAt(i)+",\t"+toGo.toUpperCase().charAt(i)+": "+ toGo.toUpperCase().charCodeAt(i)+"");
	}
}