/*
 *index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮
 */
UE.registerUI('wkflow', function (editor, uiName) {
	//创建dialog
	var dialog = new UE.ui.Dialog({
			//指定弹出层中页面的路径，这里只能支持页面,因为跟addCustomizeDialog.js相同目录，所以无需加路径
			iframeUrl: editor.options.UEDITOR_HOME_URL + 'dialogs/wflink/wflink.html',
			//需要指定当前的编辑器实例
			editor: editor,
			//指定dialog的名字
			name: '添加流程项',
			//dialog的标题
			title: "添加流程引导项",
			//指定dialog的外围样式
			cssRules: "width:600px;height:300px;",
			//如果给出了buttons就代表dialog有确定和取消
			buttons: [{
					className: 'edui-okbutton',
					label: '确定',
					onclick: function () {
						dialog.close(true);
					}
				}, {
					className: 'edui-cancelbutton',
					label: '取消',
					onclick: function () {
						dialog.close(false);
					}
				}
			]
		});

	//参考addCustomizeButton.js
	var btn = new UE.ui.Button({
			name: '添加流程引导',
			title: '关联流程项',
			//需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
			cssRules: 'background-position: -52px -76px;',
			onclick: function () {
				//渲染dialog
				dialog.render();
				dialog.open();
			}
		});
	return btn;
});

UE.registerUI('wfque', function (editor, uiName) {
	//创建dialog
	var dialog = new UE.ui.Dialog({
			//指定弹出层中页面的路径，这里只能支持页面,因为跟addCustomizeDialog.js相同目录，所以无需加路径
			iframeUrl: editor.options.UEDITOR_HOME_URL + 'dialogs/wfque/wflink.html',
			//需要指定当前的编辑器实例
			editor: editor,
			//指定dialog的名字
			name: '添加问题',
			//dialog的标题
			title: "添加标准问题",
			//指定dialog的外围样式
			cssRules: "width:800px;height:480px;",
			//如果给出了buttons就代表dialog有确定和取消
			buttons: [{
					className: 'edui-okbutton',
					label: '确定',
					onclick: function () {
						dialog.close(true);
					}
				}, {
					className: 'edui-cancelbutton',
					label: '取消',
					onclick: function () {
						dialog.close(false);
					}
				}
			]
		});

	//参考addCustomizeButton.js
	var btn = new UE.ui.Button({
			name: '添加标准问题',
			title: '关联标准问题',
			//需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
			cssRules: 'background-position: -30px -76px;',
			onclick: function () {
				//渲染dialog
				dialog.render();
				dialog.open();
			}
		});
	return btn;
});