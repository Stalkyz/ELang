/*
 * Declaration de variables pour la video
 */

var taille = 400;
var firstPlay = true;
var boolPP = false; // true = play; false = pause
var pierre;
var video;

/*
 * Kind principal
 */

enyo.kind({
	name: "enyo.sample.FittableAppLayout3",
	kind: "FittableColumns",
	classes: "enyo-fit",
	components: [
	    //Kind du corps du site
		{kind: "FittableRows", classes: "corps", fit: true, components:[
 		{fit: true,
 			classes: "fittable-sample-fitting-color",
			components: [
			        //{kind: "video", classes: "video"}
			    {tag:'video src="/test/source/test.mp4" width="600" height="338" controls autobuffer ', id:"test"}
			]},			
			{classes: "exercice fittable-sample-shadow3", 
			components: [
			  //{kind: "exercice", classes: "exercice"},
			    {kind: "onyx.InputDecorator", classes: "input",
			    components: [
				    {kind: "onyx.Input", placeholder: "Enter text here", onchange:"inputChanged"}
			    ]},
			    {kind: "onyx.Button", classes: "bouton"},
			]},
			{name: "lightPopup", classes: "popup", kind: "onyx.Popup", centered: true, floating: true, onHide: "popupHidden", scrim: true,
			components: [
			    {kind: "onyx.Spinner", classes: "onyx-light"},{content: "In Progress"}
			]}
		]},		
		//Kind du menu deroulant droit
		{kind: "FittableRows", classes: "menu", components: [
			{fit: true},
			{kind: "enyo.sample.ListBasicSample", draggable:false, allowHtml:true, classes: "chapitre"},
			]}
	],
	mouseDown: function(inSender, inEvent) {
		inEvent.preventDefault();
	},
	dragStart: function(inSender, inEvent) {
		if (inEvent.horizontal) {
			// Prevent drag propagation on horizontal drag events
			return true;
		}
	},
	showPopup: function(inSender) {
	var p = this.$[inSender.popup];
	if (p) {
		p.show();
	}
	},
	showPopupAtEvent: function(inSender, inEvent) {
		var p = this.$[inSender.popup];
		if (p) {
			p.showAtEvent(inEvent);
		}
	},
	popupHidden: function() {
		// FIXME: needed to hide ios keyboard
		document.activeElement.blur();
		if(this.$.modalPopup.showing) {   // Refocus input on modal
			enyo.job("focus", this.$.input.bindSafely("focus"), 500);
		}
	},
	popupShown: function() {
		// FIXME: does not focus input on android.
		this.$.input.focus();
		enyo.job("focus", this.$.input.bindSafely("focus"), 500);
	},
	closeModalPopup: function() {
		this.$.modalPopup.hide();
	}
});

/*
 * Menu deroulant
 */

enyo.kind({
	name: "enyo.sample.ListBasicSample",
	classes: "list-sample enyo-fit",
	components: [
		{name: "list", kind: "List", count: 15, multiSelect: false,fit:true, draggable:false, classes: "enyo-fit list-sample-list", onSetupItem: "setupItem", components :[
			{name: "item", classes: "list-sample-item enyo-border-box", components: [
				{name: "index", classes: "list-sample-index"},
				{name: "name"}
			]}
		]}
	],
	names: [],
	setupItem: function(inSender, inEvent) {
		/* global makeName */
		// this is the row we're setting up
		var i = inEvent.index;
		// make some mock data if we have none for this row
		if (!this.names[i]) {
			this.names[i] = "Piste "+i;
		}
		var n = this.names[i];
		var ni = ("00000000" + i).slice(-7);
		// apply selection style if inSender (the list) indicates that this row is selected.
		this.$.item.addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$.name.setContent(n);
	},
	mouseDown: function(inSender, inEvent) {
		inEvent.preventDefault();
	},
	dragStart: function(inSender, inEvent) {
		if (inEvent.horizontal) {
			// Prevent drag propagation on horizontal drag events
			return true;
		}
	}
});


/*
 * Lecteur video et barre de controle
 */

enyo.kind({
	name: "video",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", content: "Video"},
		{kind: "elang.Video", name : "video", source:["C:\wamp\www\test\source\test.mp4"], sstitre : ["arduino-en.vtt"], width: taille},
		{kind: "onyx.Slider", name:"pierre", style: "display : none", lockBar: true, value: 0, onChange:"sliderVideoChanged"},
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.Button", content: "<<", ontap: "prev"},
			{kind: "onyx.Button", name:"PP", content: "Play", ontap: "PP"},
			{kind: "onyx.Button", content: "Stop", ontap: "stop"},
			{kind: "onyx.Button", content: ">>", ontap: "next"},
			{kind: "onyx.Button", content: "v+", ontap: "volplus"},
			{kind: "onyx.Button", content: "v-", ontap: "volmoins"},
			{kind: "onyx.Button", content: "v off", ontap: "voloff"},
			{kind: "onyx.Slider", style: "width: 50px",min:0, max:1, lockBar: true, value: 0.7, onChange:"sliderChanged"}
		]}
	],
	PP: function(){
		boolPP = !boolPP;
		if(boolPP){
			this.play();
			this.$.PP.setContent("Pause");
		}else{
			this.pause();
			this.$.PP.setContent("Play");
		}
	},
	play: function() {
		if(firstPlay){
			this.$.pierre.setMax(this.$.video.getMaxDuration());
			this.$.pierre.setStyle("width: "+(taille-40)+"px");
			firstPlay = !firstPlay;
			pierre = this.$.pierre.getAttribute('id');
			video = this.$.video.getId();
			setInterval(function(){
				document.getElementById(pierre).childNodes[0].style.width = 
					((document.getElementById(video).currentTime/document.getElementById(video).duration)*100)+
					"%";
				document.getElementById(pierre).childNodes[2].style.left = 
					((document.getElementById(video).currentTime/document.getElementById(video).duration)*100)+
					"%";
			},(this.$.video.getMaxDuration()/taille));
		}
		this.$.video.play();
	},
	pause: function() {
		this.$.video.pause();
	},
	stop: function() {
		this.$.video.stop();
		if(boolPP){
			boolPP = false;
			this.$.PP.setContent("Play");
		}
	},
	prev: function() {
		if(!firstPlay){
			this.$.video.prev();
		}
	},
	next: function(){
		if(!firstPlay){
			this.$.video.next();
		}
	},
	volplus: function(){
		this.$.video.volPlus();
	},
	volmoins: function(){
		this.$.video.volMoins();
	},
	voloff: function(){
		this.$.video.volOff();
	},
	sliderChanged: function(inSender, inEvent) {
		this.$.video.setVolum(inSender.getValue());
	},
	sliderVideoChanged: function(inSender, inEvent) {
		enyo.log(inSender.getValue());
		this.$.video.setCurrentTime(inSender.getValue());
	},
	create: function(){
		this.inherited(arguments);
	}
});

enyo.kind({
	name:"elang.Video",
	published:{
		source : [],
		sstitre : [],
		width : 200
	},
	components:[
		{
			name: "html",
			tag: "video",
			content: "Your user agent does not support the HTML5 Video element."
		}
	],
	/*function control*/
	play: function() {
		document.getElementById(this.$.html.getAttribute('id')).play();
	},
	pause: function() {
		document.getElementById(this.$.html.getAttribute('id')).pause();
	},	
	stop: function() {
		document.getElementById(this.$.html.getAttribute('id')).pause();
		document.getElementById(this.$.html.getAttribute('id')).currentTime = 0 ;	
	},
	/***/
	
	/*button duration*/
	prev: function(){
		document.getElementById(this.$.html.getAttribute('id')).currentTime -= 1;
	},
	next: function(){
		document.getElementById(this.$.html.getAttribute('id')).currentTime += 1;
	},
	/***/
	
	/*button volum*/
	volPlus: function(){
		document.getElementById(this.$.html.getAttribute('id')).volume += 0.1;
	},
	volMoins: function(){
		document.getElementById(this.$.html.getAttribute('id')).volume -= 0.1;
	},
	volOff: function(){
		document.getElementById(this.$.html.getAttribute('id')).volume = 0;
	},	
	/***/
	
	/*slider volum*/
	setVolum: function(value) {
		document.getElementById(this.$.html.getAttribute('id')).volume = value;
	},
	/***/
	
	/*slider duration*/
	setCurrentTime: function(value) {
		if(value < document.getElementById(this.$.html.getAttribute('id')).duration){
			document.getElementById(this.$.html.getAttribute('id')).currentTime = value;
		}
	},
	getCurrentTime: function() {
		return document.getElementById(this.$.html.getAttribute('id')).currentTime;
	},
	getMaxDuration : function(){
		return document.getElementById(this.$.html.getAttribute('id')).duration;
	},
	/***/
	
	/*util*/
	getId: function() {
		return this.$.html.getAttribute('id');
	},
	/***/
	
	/*function init*/
	create : function(){
		this.inherited(arguments);
		this.$.html.setAttribute("width",this.width);
		for(var sour in this.source){
			this.$.html.createComponent({
				tag: "source",
				attributes:{src:this.source[sour]}
			});
		}
		for(var sour in this.sstitre){
			this.$.html.createComponent({
				tag: "track",
				attributes:{
					kind:"captions",
					src:this.sstitre[sour],
					type:"text/vtt",
					srclang:"en",
					label:"English Subtitles"
				}
			});
		}
	}
	/***/
});

/*
 * Exercice
 */

enyo.kind({
	name: "exercice",
	kind: enyo.Control,
	tag: 'div',
    
	//Call at first
    create: function() {
    	this.inherited(arguments);	
    	this.replaceTexte();
    	this.createComponent ( { kind: "enyo.Button", content: "Correct", ontap: "corriger" 	} );
    	this.createComponent ( { kind: "enyo.Button", content: "Show errors", ontap: "error" 	} );
    },

    //Call when tap on the button "Corriger"
    //display the correct words into the inputs
    //Send a response to the server (true or false)
    corriger: function() {
    	var request = new enyo.Ajax({
    		url: "returnResponse.php", //URL
    		method: "GET", //options are "GET" or "POST"
    		handleAs: "text", //options are "json", "text", or "xml"
    	});	

    request.response(enyo.bind(this, "processResponseCorrect")); //tells Ajax what the callback function is
    request.go({e:this.getNumExoFromURL()}); //makes the Ajax call with parameters
    },
    
    processResponseCorrect: function(inRequest, inResponse) {
        if (!inResponse) { //if there is nothing in the response then return early.
        	alert('There is a problem, please try again...');
        	return;
        }
        var reponse = enyo.json.parse(inResponse);
        for (var k=0; k<reponse.length; k++) { //k is index of input too (same as j)
        	var input = enyo.dom.byId("exercice_input_"+k);
        	if(input.value == reponse[k]) {
        		input.className = "enyo-input texteGreen";
        	}
        	else {
        		input.value = reponse[k];
        		input.className = "enyo-input texteRed";
        	}
        	
        }
        
        var request = new enyo.Ajax({
    		url: "returnResponse.php", //URL
    		method: "GET", //options are "GET" or "POST"
    		handleAs: "text", //options are "json", "text", or "xml"
    	});	
        //Say to the bdd if the student cliqued on the "Correct" button
        request.go({r:true}); //makes the Ajax call with parameters
      },
    
    //Call when tap on the button "Afficher Erreurs"
    error: function() {
    	var j = 0; //id of inputs
		var texte = this.getReponseExo();
			texte = texte.split(' ');
		var strRequete = "";
		
		for(var i=0; i<texte.length; i++) {
			if(texte[i].indexOf("[") !== -1 && texte[i].indexOf("]") !== -1) {
				texte[i] = texte[i].substring(1, texte[i].length-1);
				var input = enyo.dom.byId("exercice_input_"+j);
				strRequete = strRequete + input.value + "_";
				j = j+1;
			}
		}
		var request = new enyo.Ajax({
	    		url: "tabCompareAnswers.php", //URL
	    		method: "GET", //options are "GET" or "POST"
	    		handleAs: "text", //options are "json", "text", or "xml"
	    	});	

        request.response(enyo.bind(this, "processResponseError")); //tells Ajax what the callback function is
        request.go({e:this.getNumExoFromURL(), a:strRequete}); //makes the Ajax call with parameters
    },
      
    //call at the ajax request
      processResponseError: function(inRequest, inResponse) {
        if (!inResponse) { //if there is nothing in the response then return early.
        	alert('There is a problem, please try again...');
        	return;
        }
        var reponse = enyo.json.parse(inResponse);
        for (var k=0; k<reponse.length; k++) { //k is index of input too (same as j)
        	var input = enyo.dom.byId("exercice_input_"+k);
        	if(reponse[k] == true) {
        		input.className = "enyo-input texteGreen";
        	}
        	else {
        		input.className = "enyo-input texteRed";
        	}
        }
      },	    
    
    //call at the "create" method
	replaceTexte: function() {
		var j = 0; //id of inputs
		var texte = this.getReponseExo();
		texte = texte.split(' ');

		for(var i=0; i<texte.length; i++) {
			if(texte[i].indexOf("[") !== -1 && texte[i].indexOf("]") !== -1) {
				this.createComponent( { kind: "enyo.Input",
										name: "input_"+j,
										style: "width:"+texte[i].length*7+"px",
										onchange: "inputChange",
										selectOnFocus: true } );
				j = j + 1;
			}
			else {
				this.createComponent( { tag: "span",
										name: "texte_"+i,
										content: texte[i] + " " } );
			}
		}
	},
	
	//Return the id of exercise
	getNumExoFromURL: function() {
		//var URL = document.URL;
		return "4HmGTykL7bENJcvxOr3X";
	},
	
	inputChange: function(inSender, inEvent) {
		inSender.setAttribute("class", "enyo-input inputDefault");
	},
	
	//Return a string that represents the answer of the exercise
	getReponseExo: function () {
		var file = "exercice_" + this.getNumExoFromURL() + ".xml";
		
		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else {// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		xmlhttp.open("GET", "data/" + file, false);
		xmlhttp.send();
		xmlDoc=xmlhttp.responseXML;
		
		var exercice = xmlDoc.getElementsByTagName("exercice");
		var texte = exercice[0].getElementsByTagName("texte")[0].childNodes[0].nodeValue;
		return texte;
	}
});
