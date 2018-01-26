function showStyle(json) {
	/*展示标准问和相似问*/
	$('#formatQue').html('<small style="position:relative;bottom:10px">标准问题</small>'+(json.StandardQuestionCount?json.StandardQuestionCount:'0')+'</div>');
	$('#simiQue').html('<small style="position:relative;bottom:10px">相似问题</small>'+(json.SimilarityQuestionCount?json.SimilarityQuestionCount:'0')+'</div>');
	$('#allQue').html('<small style="margin-top:23px;position" >问题总数</small>'+(json.QuestionCount?json.QuestionCount:'0')+'</div>');
	
	var visitCount = json.visitCount == null ? 0 : json.visitCount;
	var chatCount = json.chatCount == null ? 0 : json.chatCount;
	var existSolutionCount = json.existSolutionCount == null ? 0 : json.existSolutionCount;
	var allSolutionCount = json.allSolutionCount == null ? 0 : json.allSolutionCount;

	var percent = existSolutionCount/allSolutionCount*100;

	var jsonCount = new CountUp("userCount", 0, visitCount, 0, 2.5);
	jsonCount.start();
	jsonCount = new CountUp("botCount", 0, chatCount, 0, 2.5);
	jsonCount.start();

	if(percent > 75) {
		$('#baseCount').addClass('progress-bar-warning');
	}
	if(percent > 90) {
		$('#baseCount').removeClass('progress-bar-warning').addClass('progress-bar-danger');
	}
	$('#baseCount').css('width', percent + '%');
	$('#baseCount').html(percent.toFixed(2) + '%');

	if(json.serviceData) {
		var myChart1 = echarts.init(document.getElementById('main'), 'macarons');
		var option = {
			tooltip: {
				trigger: 'item',
				formatter: "{b}: {c}"
			},
			legend: {
				data: ['直接回答', '理解回答', '引导未确认', '引导确认', '未知问题'],
			},
			series: [
				{
					name:'机器人回答匹配率',
					type:'pie',
					center: ['50%', '55%'],
					radius: ['45%', '60%'],
					label: {
						normal: {
							show: true,
							formatter: "{b} \n {d}%",
							textStyle: {
								fontSize: '12'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data:[
						{value:(json.serviceData.HourDtAns||0), name:'直接回答'},
						{value:(json.serviceData.HourGusAns||0), name:'理解回答'},
						{value:(json.serviceData.HourUnconfirmed||0), name:'引导未确认'},
						{value:(json.serviceData.HourSgsSuc||0), name:'引导确认'},
						{value:(json.serviceData.HourUnAns||0), name:'未知问题'}
					]
				}
			]
		};
		myChart1.hideLoading();
		myChart1.setOption(option);
	} else {
		var myChart11 = echarts.init(document.getElementById('main'), 'macarons');
		myChart11.hideLoading();
		myChart11.setOption({
			series: [{
				name:'机器人回答匹配率',
				type:'pie',
				radius: ['50%', '70%'],
				data:[{
					value:0, name:'暂无数据！'
				}]
			}]
		});
	}

	if(json.chatLog) {
		var myChart2 = echarts.init(document.getElementById('mainLine'), 'macarons');
		var hour = [];
		var oldC = [];
		var newC = [];
		var tmpH = '';
		for(var i=0; i < json.chatLog.length; i++) {
			if(json.chatLog[i].Hour < 10) {
				tmpH = '0' + json.chatLog[i].Hour + ':00';
			} else {
				tmpH = json.chatLog[i].Hour + ':00';
			}
			hour.push(tmpH);
			oldC.push(json.chatLog[i].OldCount);
			newC.push(json.chatLog[i].NewCount);
		}
		var option = {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['新用户咨询量','老用户咨询量']
			},
			// toolbox: {
			// 	feature: {
			// 		saveAsImage: {}
			// 	}
			// },
			xAxis: {
				type: 'category',
				name:'时间',
				boundaryGap: false,
				data: hour
			},
			yAxis: {
				type: 'value',
				name:'咨询次数',
				minInterval:1,
				axisLabel: {
					formatter: '{value} 次'
				}
			},
			series: [
				{
					name:'新用户咨询量',
					type:'line',
					data:newC
				},{
					name:'老用户咨询量',
					type:'line',
					data:oldC
				}
			]
		};
		myChart2.hideLoading();
		myChart2.setOption(option);
	}
	$(window).resize(function() {
		$(myChart1).resize();
		$(myChart2).resize();
	});
}

