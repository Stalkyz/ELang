enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", content: "Hello Test"},
		{kind: "onyx.MenuDecorator",components: [
			{content: "Selection chapitres" ,
			style:  "background-color: purple; color: #F1F1F1; "},
			{kind: "onyx.Menu",components: [
				{content: "Chapitre 1"},
				{content: "Chapitre 2"},
				{classes: "onyx-menu-divider"},
				{content: "Label", classes: "onyx-menu-label"},
				{content: "3"},
			]}
		]}

	],
	helloWorldTap: function(inSender, inEvent) {
		this.$.main.addContent("The button Checked was tapped.<br/>");
	}
	,
	menuShow: function(inSender, inEvent) {
		this.$.main.addContent("The button Checked was tapped.<br/>");
	},
	showAtEvent: function(inEvent, inOffset)
	{
		this.$.main.addContent("The button Checked was tapped.<br/>");
	}
});