$(document).mousedown(function(event) {
    if(!$(event.target).closest('.ms-options-wrap').length && !$(event.target).closest('#search_loading_modal').length)
		closeMS();
});
function closeMS(){
	$.ui.dialog.prototype._focusTabbable=_focusTabbable;
	$('.ms-options-wrap > .ms-options:visible').css('margin-top','-1000000px');
}
var msSelectedOptions={};
var generateMS=function(config){
	var id=config.id,fieldName=config.fieldName?config.fieldName:"",isAllOpt=config.isAllOpt?true:false,
	isAddOpt=config.isAddOpt?true:false,isDisableOther=config.isDisableOther?config.isDisableOther:"",reuseID=config.reuseID?config.reuseID:""
	,filterBy=config.filterBy?config.filterBy:"*";

	$("#"+id)
	.addClass("ms-options-wrap")
	.addClass("custom-ms").attr({
		style:'display:inline-block;position:relative;',
		fieldName:fieldName,
		isAllOpt:config.isAllOpt,
		totalCnt:0,
		onBeforeOpen:config.onBeforeOpen?config.onBeforeOpen:"true",
		isDisableOther:isDisableOther,
		addChar:(config.addChar?config.addChar:""),
		addCharLength:(config.addCharLength?config.addCharLength:0),
		onchangemethod:config.onchange,
		onchkchgmethod:config.checkChangeMethod,
		onunchkchgmethod:config.uncheckChangeMethod,
		reuseID:reuseID,
		addopt:isAddOpt
	});
	var htmlstr='',isDomAlreadyLoaded=$('#opt_win_'+id).length>0;
	if(!config.isNotClearOldValue) msSelectedOptions[id]={};
	htmlstr=htmlstr+('<button type="button" class="over-flow" id="'+id+'_label" title="Select '+fieldName+'">Select '+fieldName+'</button>');		
	$("#"+id).html(htmlstr);
	if(reuseID){
		$("#ms_ul_"+reuseID+" :checkbox").prop("checked",false);
		preSelectMS(id,reuseID,config.data?config.data:[]);
		updateMSLabel(id,reuseID);
	}
//adding new item
/*
$('#'+id+'_add_new_itm_id').on('keydown',function(event){
if(event.which == 13 || event.keyCode == 13){
var selectedId=$(this).attr('id').replace('_add_new_itm_id','');
$("#ms_ul_"+selectedId+" li:eq(0)").after($(newMSItem($(this).val(),$(this).val(),true,selectedId)));
msSelectedOptions[selectedId][$(this).val()]=$(this).val();
$(this).val("");
updateMSLabel(selectedId);
event.preventDefault();
return false;
}
});
*/
	$('#'+id+'_label').on('click',function(){
		showBlockLoading();
		closeMS();
		var thisObj=this,thisId=$(this).attr('id').replace('_label','');
		var onBeforeOpen=$('#'+thisId).attr("onBeforeOpen");
		$.ui.dialog.prototype._focusTabbable=$.noop;
		var reuseID=$('#'+thisId).attr("reuseID");
		setTimeout(function(){
			if(reuseID){
				$("#ms_ul_"+reuseID).attr("disabled",false);
				$("#ms_ul_"+reuseID+" :checkbox:checked,#ms_allul_"+reuseID+" :checkbox").prop("checked",false);
				if(msSelectedOptions[thisId] && msSelectedOptions[thisId]['-all-'])
					toggleAllOpt(thisId,true,reuseID);
				else
					preSelectMS(thisId,reuseID,_.clone(_.keys(msSelectedOptions[thisId])));
				updateMSLabel(thisId,reuseID);
				$('#ms_ul_'+reuseID).attr('selectedid',thisId);
				$('#opt_win_'+reuseID).attr('reuseID',thisId);
				$('#ms_ul_'+reuseID).parent().scrollTop('0');
			}else{
				reuseID=thisId;
				$('#ms_ul_'+reuseID).attr('selectedid',thisId);
			}
			if($("#opt_win_"+reuseID+" .ms-search :input").val(""))
				$("#opt_win_"+reuseID+" .ms-search :input").val("").trigger("keyup");

			var openMsOpt=function(){
				$('#opt_win_'+reuseID).offset({
				top:$("#"+thisId).offset().top+$("#"+thisId).outerHeight()+
				//40+
				($("#add_item_div_"+thisId+" > [type='text']").is(":visible")?26:0),
				left:$("#"+thisId).offset().left});
				$('#opt_win_'+reuseID+' .ms-options').css('margin-top','0px');
				$('#opt_win_'+thisId+'1 .ms-options').css('margin-top','0px').width($('#opt_win_'+reuseID+' .ms-options').width());
				$.ui.dialog.prototype._focusTabbable=$.noop;
				setTimeout(function(){hideBlockLoading();},100);
			}
			if(onBeforeOpen=="true") openMsOpt();
			else eval(onBeforeOpen);
		},100);
	});
	var maxHeight=config.maxHeight?config.maxHeight:'210px;';
	htmlstr='';
	config.ulClass=config.ulClass?config.ulClass:"font-bold";
	htmlstr=htmlstr+'<div class="ms-options-wrap" id="opt_win_'+id+'" reuseid="'+id+'">';
	htmlstr=htmlstr+'<div class="ms-options" style="min-height:auto;margin-top:-1000000px;">';
	htmlstr=htmlstr+('<div class="ms-search"><input placeholder="Search here..." onkeyup="updateMSOptions(this,\''+id+'\',\''+filterBy+'\')" maxlength="10"></div>');
	htmlstr=htmlstr+('<p class="ms-select-container" style="float:left;display:block;margin-bottom:0px;margin-top:0px;background:#708187;font-size:12px;width:calc(100% - 20px);">');
	htmlstr=htmlstr+('<span class="ms-selectall global" style="color:white;padding-left:4px;padding-right:6px;" onclick="selectAllMSOpt(\''+id+'\',\''+reuseID+'\')">Select All</span>');
	htmlstr=htmlstr+('<span class="ms-selectall clearAll" style="color:white;background:#3C3C3C;border:1px solid #7f9db9;" onclick="unSelectAllMSOpt(\''+id+'\',\''+reuseID+'\')">Clear All</span>');
	if(isAddOpt)
		htmlstr=htmlstr+('<a class="ms-add-item" style="float:right;padding-right:5px;color:white;cursor:pointer;" onclick="addTextToOpt(\''+id+'\')"><i class="fa fa-plus-circle">Add</i></a>');
	htmlstr=htmlstr+('</p>');
	htmlstr=htmlstr+'<img src="/ftc/public/staticContent/images/popclose.gif" alt="Close" class="selection-confirmation" style="display:block;cursor:pointer;" title="close" onclick="closeMS()">';
	htmlstr=htmlstr+'<div class="ms-options-wrap ms-options-wrap-2">';
	++autoNum;
	if(isAllOpt)
		htmlstr=htmlstr+'<div><ul style="font-weight:bold;list-style-type:none;margin-top:0px;margin-bottom:0px;padding-left:0px;column-count:1;column-gap:0px;" id="ms_allul_'+id+'" child_id="ms_ul_'+id+'" selectedId="'+id+'" isall="true"><li isall="true" title="all '+fieldName.toLowerCase()+'" style="background:#b7b2b2;"><label><input type="checkbox" onclick="toggleAllOpt($(\'#opt_win_'+id+'\').attr(\'reuseID\'),this.checked,\''+id+'\');clickMSOpt(this);" value="-all-" title="All '+fieldName+'" id="ms-opt-'+(autoNum)+'" >All '+fieldName+'</label></li><ul></div>';

	htmlstr=htmlstr+'<div style="overflow:auto;max-height:'+maxHeight
	+';" class="ms-option"><ul style="list-style-type:none;margin-top:0px;margin-bottom:0px;padding-left:0px;column-count:1;column-gap:0px;" id="ms_ul_'+
	id+'" selectedId="'+id+'" class="'+(config.ulClass)+'">';
	++autoNum;
	/*if(isAllOpt)
		htmlstr=htmlstr+'<li isall="true" title="all '+fieldName.toLowerCase()+'"><label style="padding-left:21px;"><input type="checkbox" onclick="toggleAllOpt($(\'#opt_win_'+id+'\').attr(\'reuseID\'),this.checked,\''+id+'\');clickMSOpt(this);" value="-all-" title="All '+fieldName+'" id="ms-opt-'+(autoNum)+'">All '+fieldName+'</label></li>';
	*/
	htmlstr=htmlstr+'</ul></div></div>';
	htmlstr=htmlstr+'</div>';
	htmlstr=htmlstr+'</div>';
	if(!isDomAlreadyLoaded)
		$("body").append(htmlstr);
	if(config.callBack)
	if(typeof config.callBack==="function")
		if(config.callBackParam)
			config.callBack(config.callBackParam);
		else
			config.callBack();
	else if(typeof config.callBack === "string" || config.callBack instanceof String)
		eval(config.callBack);
}
function toggleAllOpt(idd,isChecked,isCalled){
	var reuseID;
	if(isCalled)
		reuseID=isCalled;
	else
		reuseID=$("#"+idd).attr("reuseID");
	if(!reuseID) reuseID=idd;
	if(isChecked){
		$('#ms_ul_'+reuseID+' :checkbox:checked').prop('checked',false);
		//var allLabelText=$('#ms_ul_'+reuseID+' li').filter("[isall='true']").attr('disabled',false).find(":checkbox").
		//prop('checked',true).parent().text();
		msSelectedOptions[idd]={};
		msSelectedOptions[idd]['-all-']="All "+$("#"+idd).attr("fieldName");
	}else{
		msSelectedOptions[idd]={};
		delete msSelectedOptions[idd]['-all-'];
	}
	$("#ms_allul_"+reuseID).find(":checkbox").prop("checked",isChecked);
	$('#ms_ul_'+reuseID).attr('disabled',isChecked);
	//$('#ms_ul_'+reuseID+' li').find(":checkbox:disabled").prop('disabled',false);
	updateMSLabel(idd,reuseID);
	//$('#ms_ul_'+reuseID+' :checkbox').prop({'disabled':isChecked,checked:false}).filter("[value='-all-']").prop({'disabled':false,checked:isChecked});
}
function toggleAddText(selectedId){
	$("#add_item_div_"+selectedId).toggle();
	$('#opt_win_'+selectedId).offset({
	top:$("#"+selectedId).offset().top+$("#"+selectedId).outerHeight()+40+($("#add_item_div_"+selectedId+" > [type='text']").is(":visible")?26:0),
	left:$("#"+selectedId).offset().left});
	$("#add_item_div_"+selectedId+" > [type='text']").focus();
}
function updateMSOptions(thisObj,selectedId,filterBy){//search box
	var searchText=$(thisObj).val().toLowerCase(),event=this.event;
	filterBy=filterBy?filterBy:"*";
	if(searchText==""){
		$("#ms_ul_"+selectedId+" li").removeClass("notshow");
		return;
	}
	if(event && (event.which == 13 || event.keyCode == 13)){
		var reuseid = $(thisObj).closest('.ms-options-wrap').attr('reuseid');
		if(reuseid && $("#"+reuseid).attr("addopt")=="true"){
			addTextToOpt(selectedId);
			return;
		}
	}
	if(searchText==$(thisObj).attr("lastSearch")) return true;
	$(thisObj).attr("lastSearch",searchText);
	searchText=searchText.replace("'","\\\'");
	$("#ms_ul_"+selectedId+" li").not("[title"+filterBy+"='"+(searchText)+"']").addClass("notshow");
	$("#ms_ul_"+selectedId+" li").filter("[title"+filterBy+"='"+(searchText)+"']").removeClass("notshow");
}
function selectAllMSOpt(selectedId){//adding all items
	var reuseCallerID=$('#opt_win_'+selectedId).attr('reuseID');
	if(!reuseCallerID) reuseCallerID=selectedId;
	var checkedItems=$("#ms_ul_"+selectedId+" li").not(".notshow").find(":checkbox");
	if(checkedItems.length>500){
		closeMS();
		showErrorMessage("Please select 500 or lesser individual "+$('#'+reuseCallerID).attr('fieldName')+"!",function(){$('#'+reuseCallerID+"_label").trigger("click");});
		return;
	}
	showBlockLoading();
	setTimeout(function(){
		var cb=checkedItems;//$("#ms_ul_"+selectedId+" li").not(".notshow").find(":checkbox");
		for(var i=0;i<cb.length;i++)
			msSelectedOptions[reuseCallerID][cb[i].value]=$(cb[i]).parent().text();
		if(msSelectedOptions[reuseCallerID]['-all-']){
			delete msSelectedOptions[reuseCallerID]['-all-'];
			$('#ms_allul_'+selectedId).find(":checkbox").prop('checked',false);//toggleAllOpt(selectedId,false);
			$('#ms_ul_'+selectedId).attr('disabled',false);
		}
		var onchangemethod=$('#'+reuseCallerID).attr("onchangemethod");
		var onchkchgmethod=$('#'+reuseCallerID).attr("onchkchgmethod");
		var isDisableOther=$("#"+reuseCallerID).attr('isDisableOther');

		if(onchkchgmethod && onchkchgmethod!="undefined") eval(onchkchgmethod);
		else if(onchangemethod && onchangemethod!="undefined") eval(onchangemethod);
		if(isDisableOther) $("#ms_ul_"+isDisableOther+" li").find(":checkbox:checked").prop('disabled',true);
		setTimeout(function(){hideBlockLoading();},200);

		updateMSLabel(reuseCallerID,selectedId);
	},200);
	//if($('#ms_ul_'+selectedId+' li').not(".notshow").filter("[isall='true']").length==0)
	checkedItems.prop("checked",true);
}
function populateMSOptions(selectedId){
	msSelectedOptions[selectedId]={};
	if($("#ms_allul_"+selectedId+" :checkbox").prop("checked"))
		msSelectedOptions[selectedId]['-all-']="All "+$("#"+selectedId).attr("fieldname");
	else
		$("#ms_ul_"+selectedId+" li").find(":checkbox:checked").each(function(){
			msSelectedOptions[selectedId][$(this).val()]=$(this).parent().text();
		});
}
function prepopulateMSOptions(selectedId){populateMSOptions(selectedId);}
//removing all items
function unSelectAllMSOpt(selectedId){
	var reuseCallerID=$('#opt_win_'+selectedId).attr('reuseID');
	if(!reuseCallerID) reuseCallerID=selectedId;
	setTimeout(function(){
		//var isAllOptFound=false;
		$("#ms_ul_"+selectedId+" :checkbox:checked").closest("li:not(.notshow) :checkbox").each(function(){
			//if(isAllOptFound) return;
			var val=$(this).prop("checked",false).val();
			//if(val=="-all-")isAllOptFound=true;
			delete msSelectedOptions[reuseCallerID][val];
		});
		//if(isAllOptFound)
		//	toggleAllOpt(reuseCallerID,false,selectedId);
		var onchangemethod=$('#'+reuseCallerID).attr("onchangemethod");
		var onunchkchgmethod=$('#'+reuseCallerID).attr("onunchkchgmethod");
		var isDisableOther = $("#"+reuseCallerID).attr('isDisableOther');
		if(onunchkchgmethod && onunchkchgmethod!="undefined") eval(onunchkchgmethod);
		else if(onchangemethod && onchangemethod!="undefined") eval(onchangemethod);
		if(isDisableOther) $("#ms_ul_"+isDisableOther+" li").find(":checkbox").prop('disabled',false);
		updateMSLabel(reuseCallerID,selectedId);
	},200);
	//if($('#ms_ul_'+reuseID+' li').not(".notshow").filter("[isall='true']").length==0)
	//$("#ms_ul_"+selectedId+" li").not(".notshow").find(":checkbox").prop("checked",false);
}
function fullResetMsOpt(selectedId,isDisableFlag){
	if(!_.isArray(selectedId))selectedId=[selectedId];
	for(var i=0;i<selectedId.length;i++){
		$("#ms_ul_"+selectedId[i]+" li :checkbox:checked,#ms_allul_"+selectedId[i]+" :checkbox").prop("checked",false);
		msSelectedOptions[selectedId[i]]={};
		$("#"+selectedId[i]+"_label").html("Select "+$('#'+selectedId[i]).attr('fieldName')).attr('title',"Select "+$('#'+selectedId[i]).attr('fieldName'));
		if(isDisableFlag)
			$("#ms_ul_"+selectedId[i]+" li").attr("disabled",false);
	}
}
function preSelectMS(selectedId,reuseID,preSelectedList){
	if(!reuseID)reuseID=selectedId;
	if(preSelectedList && preSelectedList.length){
		htmlString="";
		for(var i=0;i<preSelectedList.length;i++){
			var v=preSelectedList[i];
			var filterCode=(v.toLowerCase()).replace("'","\\\'");
			var selc=$("#ms_ul_"+reuseID+" li").filter("[title^='"+(filterCode)+" - ']").find(":checkbox");
			if(selc && selc.length==1){
				selc.prop("checked",true);
			}else{
				selc=$("#ms_ul_"+reuseID+" li").filter("[title='"+(filterCode)+"']").find(":checkbox");
				if(selc.length==0)
					htmlString=htmlString+(newMSItem(v,(v?v:""),true,selectedId));
				else
					selc.prop("checked",true);
			}
		}
	}
}
//adding / removing items
function clickMSOpt(thisObj){
	var upGrandParent=$(thisObj).parent().parent().parent();
	var reuseID=upGrandParent.attr("selectedId");
	var isAll=upGrandParent.attr("isall");
	isAll=isAll=="true"?true:false;
	var chgFld="";
	if(!isAll)
		chgFld=upGrandParent.attr('id').replace('ms_ul_','');
	else
		chgFld=upGrandParent.attr('child_id').replace('ms_ul_','');
	var isDisableOther=$("#"+reuseID).attr('isDisableOther');
	var onchangemethod=$('#'+reuseID).attr("onchangemethod");
	var onchkchgmethod=$('#'+reuseID).attr("onchkchgmethod");
	var onunchkchgmethod=$('#'+reuseID).attr("onunchkchgmethod");

	if($(thisObj).prop("checked")){
		if(!msSelectedOptions[reuseID]) msSelectedOptions[reuseID]={};
		msSelectedOptions[reuseID][$(thisObj).val()]=$(thisObj).parent().text();
		if(isDisableOther) $("#ms_ul_"+isDisableOther+" li").find("[value='"+$(thisObj).val()+"']").prop('disabled',true);
		if(onchkchgmethod && onchkchgmethod!="undefined") eval(onchkchgmethod);
		else if(onchangemethod && onchangemethod!="undefined") eval(onchangemethod);
	}else{
		delete msSelectedOptions[reuseID][$(thisObj).val()];
		if(isDisableOther) $("#ms_ul_"+isDisableOther+" li").find("[value='"+$(thisObj).val()+"']").prop('disabled',false);
		if(onunchkchgmethod && onunchkchgmethod!="undefined") eval(onunchkchgmethod);
		else if(onchangemethod && onchangemethod!="undefined") eval(onchangemethod);
	}
	updateMSLabel(reuseID,chgFld);
}
function newMSItem(key,value,isChecked,selectedId,customAttrs){
	autoNum=autoNum+1;
	if(!customAttrs)
		customAttrs="";
	isChecked=isChecked?true:false;
	return '<li '+(key=='-all-'?' isall="true" ':'')+' title="'+(value.toLowerCase())+'" addednew><label style="padding-left:21px;"><input type="checkbox" value="'+key+'" '+customAttrs+' id="ms-opt-'+(autoNum)+'" onclick="clickMSOpt(this)" '+(isChecked?'checked':'')+'>'+value+'</label></li>'
}
function updateMSLabel(selecter,reuseId){
	var arry=[],contructBtn=function(arry){
		var str=arry.toString();
		return ((str.length+4)>totaldisplaychar)?(str.length+' Selected.'):str;
	};
	if(!reuseId) reuseId=selecter;
	if(msSelectedOptions[selecter] && msSelectedOptions[selecter]['-all-']){
		var fieldNm="All "+$('#'+selecter).attr('fieldName')+" Selected.";
		$("#"+selecter+"_label").html(fieldNm).attr('title',fieldNm);
		return;
	}
	var checkedOpt=$("#ms_ul_"+reuseId+" li :checkbox:checked"),checkedOptLength=checkedOpt.length;
	if(checkedOptLength==0){
		$("#"+selecter+"_label").html("Select "+$('#'+selecter).attr('fieldName')).attr('title',"Select "+$('#'+selecter).attr('fieldName'));
		return;
	}else if(checkedOptLength>totaldisplaychar){
		$("#"+selecter+"_label").html(checkedOpt.length+' Selected.').attr('title',checkedOpt.length+' Selected.');
		if(checkedOptLength<=30){
			$.each(checkedOpt,function(index,item){ arry.push($(item).parent().text());});
			$("#"+selecter+"_label").attr('title',arry.toString());
		}
	}else{
		$.each(checkedOpt,function(index,item){ arry.push($(item).parent().text());});
		$("#"+selecter+"_label").html(arry.toString()).attr('title',arry.toString());
	}
}
function addTextToOpt(selectedId){
	var reuseID=$("#ms_ul_"+selectedId).attr("selectedid");
	if(!reuseID) reuseID=selectedId;
	var addText=$.trim($("#opt_win_"+selectedId).find(".ms-search :text").val()),isErr=false;
	if(addText){
		if($("#"+reuseID).attr('addChar')=='number' && isNaN(addText)){
			showErrorMessage('Please enter valid '+$("#"+reuseID).attr('fieldName'),
			function(){
				$('#opt_win_'+selectedId+' .ms-search').find(':input').val(addText).trigger('keyup');
				$("#"+reuseID+"_label").trigger('click');
			});
			return;
		}
		if($("#"+reuseID).attr('addCharLength')){
			if(addText.length > Number($("#"+reuseID).attr('addCharLength'))){
				showErrorMessage('Please enter valid '+$("#"+reuseID).attr('fieldName')
				,function(){
					$("#"+reuseID+"_label").trigger('click');
				});
				return;
			}
		}
		addText=addText.toUpperCase();
		//$("#ms_ul_"+selectedId+" li:eq(0)").after($(newMSItem(addText,addText,true,selectedId)));
		$("#ms_ul_"+selectedId).prepend($(newMSItem(addText,addText,true,selectedId)));
		msSelectedOptions[reuseID][addText]=addText;
		updateMSLabel(reuseID,selectedId);
		$("#opt_win_"+selectedId).find(".ms-search :text").val("");
		updateMSOptions($("#opt_win_"+selectedId).find(".ms-search :text"),selectedId);
		var isDisableOther=$("#"+reuseID).attr('isDisableOther');
		//if(isDisableOther) $("#ms_ul_"+isDisableOther+" li:eq(0)").after($(newMSItem(addText,addText,false,isDisableOther,' disabled="disabled" ')));
		if(isDisableOther)
			$("#ms_ul_"+isDisableOther).prepend($(newMSItem(addText,addText,false,isDisableOther,' disabled="disabled" ')));
	}
}
