require(["dragList"], function(_dragList){
	_dragList.init($("#list"));
	_dragList.insert("Opera", 0);
	_dragList.insert("Firefox", 0);
	_dragList.insert("Chrome", 0);
	_dragList.insert("Safari", 0);
	_dragList.insert("Netscape", 0);
	_dragList.insert("Internet Explorer", 0);
	_dragList.startEdit();
});
