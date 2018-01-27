(function($){	
	$(document).ready(function(){	
		//模糊查询模块
		var queryAnswer = function(){
			$.ajax({
				url:'QuestionHk/doFindQueList',
				type:'post',
				data:{
					type:1,
					webId:73,
					answer:$.trim($(".mui-input").val()),
					pageSize:5,
					pageNo:1
				},
				dataType:'json',
				cache:false,
				success:function(data){
					if(data.status != 0){
						return;
					}else{
						var table = document.body.querySelector('.cell');
						if(data.list.List != null && data.list.List.length > 0){
							for(var i = 0;i<data.list.List.length;i++){
								var li = document.createElement('li');
								li.className = 'mui-table-view-cell question';
								li.innerHTML = '<div class="border-bottom">'+
											   '<h4 class="txt" questionId="'+data.list.List[i].Id+'">'+data.list.List[i].Id+'. '+data.list.List[i].Question+'</h4>'+
							            	   '<span class="ispan">创建：'+data.list.List[i].UserName+'</span><span class="ispan ml">分类：'+data.list.List[i].GroupName+'</span>'+
							            	   '<span class="img"><img src="images/bad.png" class="img2 bad"  cId="'+data.list.List[i].Id+'" ><i>'+(data.list.List[i].Hits)+'</i></span>'+
											   '<span class="img"><img src="images/good.png" class="img1 good"  zId="'+data.list.List[i].Id+'" dataGood="'+data.list.List[i].Usefull+'"><i>'+(data.list.List[i].Usefull)+'</i></span>'+
											   '<span class="img"><img src="images/eye.png" class="img3 eye"  eId="'+data.list.List[i].Id+'" ><i>'+(data.list.List[i].Useless)+'</i></span>'+
											   '</div>';
								table.appendChild(li);	
							}
							
						}
						
					}
				},
				error:function(){
					alert("queryAnswer error");
				}
			});
		};
		
		var queryQuestion = function(){
			$.ajax({
				url:'QuestionHk/doFindQueList',
				type:'post',
				data:{
					type:1,
					webId:73,
					question:$.trim($(".mui-input").val()),
					pageSize:5,
					pageNo:1
				},
				dataType:'json',
				cache:false,
				success:function(data){
					if(data.status != 0){
						return;
					}else{
						var table = document.body.querySelector('.cell');
						if(data.list.List != null && data.list.List.length > 0){
							for(var i = 0;i<data.list.List.length;i++){
								var li = document.createElement('li');
								li.className = 'mui-table-view-cell question';
								li.innerHTML = '<div class="border-bottom">'+
											   '<h4 class="txt" questionId="'+data.list.List[i].Id+'">'+data.list.List[i].Id+'. '+data.list.List[i].Question+'</h4>'+
							            	   '<span class="ispan">创建：'+data.list.List[i].UserName+'</span><span class="ispan ml">分类：'+data.list.List[i].GroupName+'</span>'+
							            	   '<span class="img"><img src="images/bad.png" class="img2 bad"  cId="'+data.list.List[i].Id+'" ><i>'+(data.list.List[i].Hits)+'</i></span>'+
											   '<span class="img"><img src="images/good.png" class="img1 good"  zId="'+data.list.List[i].Id+'" dataGood="'+data.list.List[i].Usefull+'"><i>'+(data.list.List[i].Usefull)+'</i></span>'+
											   '<span class="img"><img src="images/eye.png" class="img3 eye"  eId="'+data.list.List[i].Id+'" ><i>'+(data.list.List[i].Useless)+'</i></span>'+
											   '</div>';
								table.appendChild(li);	
							}
							
						}
						
					}
				},
				error:function(){
					alert("queryAnswer error");
				}
			});
		};
		
		//选择框区分选择的内容
		
		$(".col1").change(function(){
			if($(".col1").val()=='问题'){
				$('li.question').remove();//删除默认出现的数据
				$(".query").on("tap",queryQuestion);
			}
			if($(".col1").val()=='答案'){
				$('li.question').remove();//删除默认出现的数据
				$(".query").on("tap",queryAnswer);
			}
		});
		
	});
})(jQuery);