function WorkFlow() {
    this.init();
}
(function() {
    var pages = [],
		panels = [],
		selectedItem = null,
		pageNumber = 1;
		totlePages = null;
    WorkFlow.prototype = {
        total: 70,
        pageSize: 10,
        pageNum: '',
        solutionId: "",
        playerUrl: "",

        init: function() {
            var me = this;
            domUtils.on($G("J_searchName"), "keyup",
            function(event) {
                var e = window.event || event;
                if (e.keyCode == 13) {
                    me.dosearch();
                }
            });
            domUtils.on($G("J_searchBtn"), "click",
            function() {
                me.dosearch();
            });
        },
        callback: function(data) {
            var me = this;
            if (data.status == 0) {
                me.data = data;
                setTimeout(function() {
                    $G('J_resultBar').innerHTML = me._renderTemplate(data);
                },
                300);
            } else {
                alert("获取信息错误");
            }

        },
        dosearch: function(pageType) {
            var me = this,
				url = '';
			switch(pageType) {
				case 1:
					if(pageNumber>1)pageNumber -= 1;
					break;
				case 2:
					if(totlePages && pageNumber<totlePages)pageNumber += 1;
					break;
				case 3:
					var newNumber = null;
					if(document.getElementById("pageNum")) newNumber = document.getElementById("pageNum").value;
					if(isNaN(newNumber) || !/^[1-9][0-9]*$/.test(newNumber) || newNumber<1 || newNumber>totlePages){;}else{pageNumber=newNumber};
					break;
			}
            selectedItem = null;
            var key = $G('J_searchName').value;
			var dataJSON = {
				pageSize: me.pageSize,
				question: '',
				info: '',
				content: ''
			}
			if(me.solutionId != '') {
				dataJSON.solutionId = me.solutionId;
			}
			switch($G('searchsub').value) {
				case '1':
					dataJSON.question = key;
					break;
				case '2':
					dataJSON.info = key;
					break;
				case '3':
					dataJSON.content = key;
					break;
			}
			if($G('searchRange').value == 2) {
				url = '/flowItem/findAll';
			} else {
				url = '/flowItem/findFlowItemsById';
				dataJSON.content = key;
			}
			dataJSON.pageNum = pageNumber;
            me._sent(dataJSON, url, pageType);
        },
        doselect: function(i) {
            var me = this;
            if (typeof i == 'object') {
                selectedItem = i;
            } else if (typeof i == 'number') {
                selectedItem = me.data.list[i];
            }
        },
        onpageclick: function(id) {
            var me = this;
            for (var i = 0; i < pages.length; i++) {
                $G(pages[i]).className = 'pageoff';
                $G(panels[i]).className = 'paneloff';
            }
            $G('page' + id).className = 'pageon';
            $G('panel' + id).className = 'panelon';
        },
        listenTest: function(elem) {
            var me = this,
            view = $G('J_preview'),
            is_play_action = (elem.className == 'm-try'),
            old_trying = me._getTryingElem();

            if (old_trying) {
                old_trying.className = 'm-try';
                view.innerHTML = '';
            }
            if (is_play_action) {
                elem.className = 'm-trying';
                view.innerHTML = me._buildMusicHtml(me._getUrl(true));
            }
        },
        _sent: function(dataJSON, url) {
            var me = this;
            $G('J_resultBar').innerHTML = '<div class="loading"></div>';
            //这里开始写搜索的过程
            ajax.request(url, {
                //请求方法。可选值： 'GET', 'POST'，默认值是'POST'
                method: 'GET',
                //超时时间。 默认为5000， 单位是ms
                timeout: 1000000,
                //是否是异步请求。 true为异步请求， false为同步请求
                async: true,
                //请求携带的数据。如果请求为GET请求， data会经过stringify后附加到请求url之后。
                data: dataJSON,
                //请求成功后的回调， 该回调接受当前的XMLHttpRequest对象作为参数。
                onsuccess: function(xhr) {
                    var data = eval('(' + xhr.responseText + ')');
                    me.callback(data);
                },
                //请求失败或者超时后的回调。
                onerror: function(xhr) {
                    alert('获取流程数据出错');
                }
            });
            return;

        },
        _removeHtml: function(str) {
            var reg = /<\s*\/?\s*[^>]*\s*>/gi;
            return str.replace(reg, "");
        },
        _getUrl: function(isTryListen) {
            var me = this;
            var param = 'from=tiebasongwidget&url=&name=' + encodeURIComponent(me._removeHtml(selectedItem.title)) + '&artist=' + encodeURIComponent(me._removeHtml(selectedItem.author)) + '&extra=' + encodeURIComponent(me._removeHtml(selectedItem.album_title)) + '&autoPlay=' + isTryListen + '' + '&loop=true';
            return me.playerUrl + "?" + param;
        },
        _getTryingElem: function() {
            var s = $G('J_listPanel').getElementsByTagName('span');

            for (var i = 0; i < s.length; i++) {
                if (s[i].className == 'm-trying') return s[i];
            }
            return null;
        },
        _buildMusicHtml: function(playerUrl) {
            var html = '<embed class="BDE_try_Music" allowfullscreen="false" pluginspage="http://www.macromedia.com/go/getflashplayer"';
            html += ' src="' + playerUrl + '"';
            html += ' width="1" height="1" style="position:absolute;left:-2000px;"';
            html += ' type="application/x-shockwave-flash" wmode="transparent" play="true" loop="false"';
            html += ' menu="false" allowscriptaccess="never" scale="noborder">';
            return html;
        },
        _byteLength: function(str) {
            return str.replace(/[^\u0000-\u007f]/g, "\u0061\u0061").length;
        },
        _getMaxText: function(s) {
            var me = this;
            s = me._removeHtml(s);
            if (me._byteLength(s) > 15) return s.substring(0, 15) + '...';
            if (!s) s = "&nbsp;";
            return s;
        },
        _rebuildData: function(data) {
            var me = this,
            newData = [],
            d = me.pageSize,
            itembox;
            for (var i = 0; i < data.length; i++) {
                if ((i + d) % d == 0) {
                    itembox = [];
                    newData.push(itembox)
                }
                itembox.push(data[i]);
            }
            return newData;
        },
        _renderTemplate: function(data) {
            var me = this;
			pageNumber = data.currentPage;
			totlePages = data.totlePages;
            if (data.list.length == 0) return '<div class="empty">流程项为空</div>';
            var s = [],
				p = [];
            s.push('<div id="J_listPanel" class="listPanel">');
            p.push('<div class="page">');
            s.push('<div class="m-box">');
			if(data.currentPage) {
				s.push('<div class="m-h"><span class="m-t-t">标准问题</span><span class="m-t-t">流程项描述信息</span></div>');
				for (var j = 0, tmpObj; tmpObj = data.list[j++];) {
					s.push('<label for="' + j + '" class="m-m">');
					s.push('<input type="radio" id="' + j + '" name="sth" class="m-l" onclick="workflow.doselect(' + ((j - 1)) + ')"/>');
					s.push('<span class="m-t-l" title="'+tmpObj.Question+'">' + me._getMaxText(tmpObj.Question) + '</span><span class="m-t-l" title="'+tmpObj.Info+'">' + me._getMaxText(tmpObj.Info) + '</span>');
					s.push('</label>');
				}
			} else {
				s.push('<div class="m-h"><span class="m-t">流程项描述信息</span></div>');
				for (var j = 0, tmpObj; tmpObj = data.list[j++];) {
					s.push('<label for="' + j + '" class="m-m">');
					s.push('<input type="radio" id="' + j + '" name="sth" class="m-l" onclick="workflow.doselect(' + ((j - 1)) + ')"/>');
					s.push('<span class="m-t" title="'+tmpObj.Info+'">' + me._getMaxText(tmpObj.Info) + '</span>');
					s.push('</label>');
				}
			}

            s.push('</div>');
            s.push('</div>');
			if(data.currentPage) {
				p.push('<div><button class="btn btn-xs btn-primary" onclick="workflow.dosearch(1)">上一页</button>&nbsp;<button class="btn btn-xs btn-primary" onclick="workflow.dosearch(2)">下一页</button>&nbsp;第' + data.currentPage + '页，共' + data.totlePages + '页&nbsp;<input name="pageNum" id="pageNum" type="text" class="form-control" style="width: 33px;display: inline-block;height: 24px;line-height: 24px;padding: 0 4px;" />&nbsp;<button class="btn btn-xs btn-primary" onclick="workflow.dosearch(3)">跳转</button></div>');
			}
            s.push('</div>');
            p.push('</div>');
            return s.join('') + p.join('');
        },
        exec: function() {
            var me = this;
            if (selectedItem == null) return;
            $G('J_preview').innerHTML = "";
            return selectedItem;
        }
    };
})();


$G('searchsub').value = '2';
$G('searchRange').onchange=function(){
	if($G('searchRange').value=='2') {
		$G('todisabled1').style.display = 'block';
		$G('todisabled2').style.display = 'block';
	} else {
		$G('todisabled1').style.display = 'none';
		$G('todisabled2').style.display = 'none';
		$G('searchsub').value = '2';
	}
}

var workflow = new WorkFlow;
workflow.solutionId = editor.options.solutionId ? editor.options.solutionId:'';

var range = editor.selection.getRange(),
	link = range.collapsed ? editor.queryCommandValue("link") : editor.selection.getStart(),
	url,
	text = $G('text'),
	rangeLink = domUtils.findParentByTagName(range.getCommonAncestor(), 'a', true),
	orgText,
	link = domUtils.findParentByTagName(link, "a", true);
if (link) {
    url = utils.html(link.getAttribute('_href') || link.getAttribute('href', 2));
    if (rangeLink === link && !link.getElementsByTagName('img').length) {
        text.removeAttribute('disabled');
        orgText = text.value = link[browser.ie ? 'innerText': 'textContent'];
    } else {
        text.setAttribute('disabled', 'true');
        text.value = '仅支持选中一个跳转';
    }
} else {
    if (range.collapsed) {
        text.removeAttribute('disabled');
        text.value = '';
    } else {
        text.setAttribute('disabled', 'true');
        text.value = '仅支持选中一个跳转';
    }

}

$focus($G("href"));

function handleDialogOk() {

    var temp1 = $G('text').value.replace(/^\s+|\s+$/g, '');
    if (temp1) {

        //检查有没有选择流程项
        var select = workflow.exec();
        var flowId;
        if (select && select.Id) {
            $G("msg").innerHTML = "";
            flowId = select.Id;
        } else {
            workflow.dosearch();
            //$G("msg").innerHTML = "<span style='color: red'>"+lang.httpPrompt+"</span>";
            return false;
        }

        var obj = {
            'href': 'javascript:void(0);',
            'class': 'wflink',
            'rel': flowId,
            'name': 'wfl_' + flowId,
            'title': '点击查看具体信息',
            '_href': 'javascript:void(0);'
            //'onclick':'gotoFlow('+flowId+');'
        };
        //修改链接内容的情况太特殊了，所以先做到这里了
        //todo:情况多的时候，做到command里
        /*if (orgText && text.value != orgText) {
            link[browser.ie ? 'innerText': 'textContent'] = obj.textValue = text.value;
            range.selectNode(link).select()
        }
        if (range.collapsed) {
            obj.textValue = text.value;
        }*/
        editor.execCommand('link', utils.clearEmptyAttrs(obj));
        dialog.close();
    }
}
dialog.onok = handleDialogOk;
//$G('href').onkeydown = function(evt) {
//    evt = evt || window.event;
//    if (evt.keyCode == 13) {
//        handleDialogOk();
//        return false;
//    }
//};

function hrefStartWith(href, arr) {
    href = href.replace(/^\s+|\s+$/g, '');
    for (var i = 0,
    ai; ai = arr[i++];) {
        if (href.indexOf(ai) == 0) {
            return true;
        }
    }
    return false;
}
domUtils.on(window, 'load', function() {
    workflow.dosearch();
});