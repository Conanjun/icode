var datas = {"total":11,"totlePages":3,"currentPage":1
				,"list":{"PageSize":5,"StartIndex":0,"EndIndex":3,"Indexes":{}
				,"FullListSize":11,"SearchId":null,"IndexCountOnShow":7
				,"TotalCount":11,"StartIndexOnShow":1,"EndIndexOnShow":3
				,"ObjectsPerPage":5,"PageCount":3,"PageNumber":1,"SortCriterion":null
				,"NextIndex":2,"CurrentIndex":1
				,"List":[
				 {"GroupName":"青春卡","Hits":6,"AddUserName":"robot","Del":null,"sId":null,"GroupId":1110
				 ,"Useless":0,"Type":null,"AddUserId":3,"WebId":null,"Usefull":0,"Visibility":null,"Question":"我们能结束吗？","Id":null}
				,{"GroupName":"青春卡","Hits":0,"AddUserName":"robot","Del":null,"sId":null,"GroupId":1110
				,"Useless":0,"Type":null,"AddUserId":3,"WebId":null,"Usefull":0,"Visibility":null,"Question":"额呃呃呃","Id":null}
				,{"GroupName":"青春卡","Hits":0,"AddUserName":"robot","Del":null,"sId":null,"GroupId":1110
				,"Useless":0,"Type":null,"AddUserId":3,"WebId":null,"Usefull":0,"Visibility":null,"Question":"你喜欢我嘛","Id":null}
				,{"GroupName":"青春卡","Hits":0,"AddUserName":"robot","Del":null,"sId":null,"GroupId":1110
				,"Useless":0,"Type":null,"AddUserId":3,"WebId":null,"Usefull":0,"Visibility":null,"Question":"给爷笑一个/::D","Id":null}
				,{"GroupName":"青春卡","Hits":0,"AddUserName":"robot","Del":null,"sId":null,"GroupId":1110
				,"Useless":0,"Type":null,"AddUserId":3,"WebId":null,"Usefull":0,"Visibility":null,"Question":"你喜欢我","Id":null}
				]
				,"Items":[
				{"GroupName":"青春卡","Hits":6,"AddUserName":"robot","Del":null,"sId":null,"GroupId":1110
				,"Useless":0,"Type":null,"AddUserId":3,"WebId":null,"Usefull":0,"Visibility":null,"Question":"我们能结束吗？","Id":null}
				,{"GroupName":"青春卡","Hits":0,"AddUserName":"robot","Del":null,"sId":null,"GroupId":1110
				,"Useless":0,"Type":null,"AddUserId":3,"WebId":null,"Usefull":0,"Visibility":null,"Question":"额呃呃呃","Id":null}
				,{"GroupName":"青春卡","Hits":0,"AddUserName":"robot","Del":null,"sId":null,"GroupId":1110
				,"Useless":0,"Type":null,"AddUserId":3,"WebId":null,"Usefull":0,"Visibility":null,"Question":"你喜欢我嘛","Id":null}
				,{"GroupName":"青春卡","Hits":0,"AddUserName":"robot","Del":null,"sId":null,"GroupId":1110
				,"Useless":0,"Type":null,"AddUserId":3,"WebId":null,"Usefull":0,"Visibility":null,"Question":"给爷笑一个/::D","Id":null}
				,{"GroupName":"青春卡","Hits":0,"AddUserName":"robot","Del":null,"sId":null,"GroupId":1110
				,"Useless":0,"Type":null,"AddUserId":3,"WebId":null,"Usefull":0,"Visibility":null,"Question":"你喜欢我","Id":null}
				]
				,"First":0,"PreviousIndex":1},"message":"查询成功！","status":0
			};
			

//var refreshTest = function(){//测试的方法
//		if(datas.status != 0){
////			mui.toast(datas.message);//根据datas.status出现弹出框显示datas.message
//			return;
//		}else{
////			mui.toast(datas.message);//根据datas.status出现弹出框显示datas.message
////			var table = document.body.querySelector('.mui-table-view');
//			var table = document.body.querySelector('.cell');
//			if(datas.list.List != null && datas.list.List.length > 0){
//				for(var i = 0;i<datas.list.List.length;i++){
//					var li = document.createElement('li');
//					li.className = 'mui-table-view-cell question';
//					li.innerHTML = '<div class="border-bottom" >'+
//								   '<h4 class="txt">'+datas.list.List[i].AddUserId+'. '+datas.list.List[i].Question+'</h4>'+
//				            	   '<span class="ispan">创建：'+datas.list.List[i].AddUserName+i+'</span><span class="ispan ml">分类：'+datas.list.List[i].GroupName+'</span>'+
//				            	   '<span class="img"><img src="images/bad.png" class="img2" id="bad"><i>'+(datas.list.List[i].Hits)+'</i></span>'+
//								   '<span class="img"><img src="images/good.png" class="img1" id="good"><i>'+(datas.list.List[i].Usefull)+'</i></span>'+
//								   '<span class="img"><img src="images/eye.png" class="img3" id="eye"><i>'+(datas.list.List[i].Useless)+'</i></span>'+
//								   '</div>';
//				    table.appendChild(li);
//				}
//			}
//			
//		}
//	};