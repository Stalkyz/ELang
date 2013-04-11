enyo.kind({
	name: "enyo.sample.ListBasicSample",
	classes: "list-sample enyo-fit",
	components: [
		{name: "list", kind: "List", count: 20, multiSelect: false,fit:true, draggable:false, classes: "enyo-fit list-sample-list", onSetupItem: "setupItem", components :[
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
			this.names[i] = "chapitre"+i;
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

enyo.kind({
	name: "enyo.sample.FittableAppLayout3",
	kind: "FittableColumns",
	classes: "enyo-fit",
	components: [
		{kind: "FittableRows", fit: true, components: [
			{fit: true, classes: "fittable-sample-fitting-color"},
			{classes: "fittable-sample-shadow3", style: "height: 30%; position: relative;"},
			{kind: "onyx.Toolbar", components: [
				{kind: "onyx.Button", content: "1"}
			]}
		]},
		{kind: "FittableRows", classes: "fittable-sample-shadow", style: "width: 30%; position: relative;", components: [
			{fit: true},
			{kind: "enyo.sample.ListBasicSample", draggable:false,allowHtml:true},
			{kind: "onyx.Toolbar", components: [
				{kind: "onyx.Button", content: "2"}
			]}
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
	}
});