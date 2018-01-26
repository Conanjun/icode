;(function ($) {
    $.fn.drilldownSeries = function (options) {
        var defaults = {divName: 'container', divTitle: 'faqrobot', divSubtitle: 'iyunwen.com', seriesName: '根分类'}
        // Extend our default options with those provided.
        var opts = $.extend(defaults, options)
        // Our plugin implementation code goes here.
        var classes = []
        var countlist = []
        var drilldownSeries = []
        var rootList = []//根分类
        var classesMap = {}//类别的map集合，以类的ID为key
        var parentsIdMap = {}//parentId的map集合，以parentId为key
        var totalNum = 0
        var resultData = {}
        $.getJSON(opts.path, function (json) {
            if (json.status != 0) {
                yunNoty(json)
            }
            classes = json.classList
            countlist = json.countList

            /**
             遍历classes获取classMap和parentIdMap
             */
            $.each(classes, function (i, item) {
                if (opts.idFlag != '' && parseInt(opts.idFlag) == item.Id) {
                    classes[i].ParentId = -1
                }
                if (item.ParentId == null | item.ParentId == 0) {
                    item.ParentId = -1
                }
                var has = item.Id in classesMap
                var hasParends = item.ParentId in parentsIdMap
                if (!has) {
                    classesMap[item.Id] = item
                }
                if (!hasParends) {
                    parentsIdMap[item.ParentId] = item
                }
            })

            //构造drilldown的map，此时类别的占比是初始化为0
            var drilldownMap = {}
            $.each(classes, function (i, item) {
                var has = item.ParentId in drilldownMap
                if (!has) {
                    var seconditem = {}
                    seconditem.id = item.ParentId + ''
                    seconditem.name = classesMap[item.ParentId].Name
                    seconditem.data = []
                    seconditem.data.push(getItemsData(item, 0))
                    drilldownMap[item.ParentId] = seconditem
                } else {
                    drilldownMap[item.ParentId].data
                        .push(getItemsData(item, 0))
                }
            })

            // var  drilldownSeries = [];
            for (var key in drilldownMap) {
                drilldownSeries.push(drilldownMap[key])
            }

            //根据具体的类获取dirlldown中一项data,flag = 0时y初始化为0，为1获取实际值
            function getItemsData (item, flag) {
                var dataItem = {}
                if (flag == 0) {
                    dataItem.name = item.Name
                    dataItem.y = 0
                } else if (flag == 1) {
                    dataItem.y = map_value[item.Id] / totalNum * 100
                    dataItem.name = item.Name
                        + '<br>' + options.words + '<span style="color:red;">[</span>'
                        + map_value[item.Id]
                        + '<span style="color:red;">]</span>'
                }
                dataItem.id = item.Id
                dataItem.drilldown = item.Id + ''
                return dataItem
            }

            /*
             *初始化类别占比的map集合
             */
            var map_value = {}

            //查出所有的叶子节点,赋值为0
            $.each(classes, function (i, item) {
                var has = item.Id in parentsIdMap
                if (!has) {
                    map_value[item.Id] = 0
                }
            })
            //赋值已有的子类的数值
            $.each(countlist, function (i, item) {
                var has = item.Id in map_value
                if (has) {
                    map_value[item.Id] = parseInt(item.Value)
                } else if (item.Id == -100) {
                    //alert("提示：这个类别Id下面没有问题！");
                } else {
                    //alert('分类错误');
                }
            })

            /*
               遍历drilldownSeries中的数据项，
                根据以后的叶子节点的统计数量，统计出非叶子结点的数量，直到真剩下根节点
             */
            while (drilldownSeries.length > 1) {

                for (var i = 0; i < drilldownSeries.length; i++) {//遍历drilldown数组
                    var item = drilldownSeries[i]

                    var flag_allVaule = true
                    var count_value = 0
                    //遍历每一项项中data数组
                    for (var m = 0; m < item.data.length; m++) {
                        var item1 = item.data[m]
                        //如果该项在map_vlaue中，则进行叠加，否则跳出继续下一个item
                        var has = item1.id in map_value

                        if (!has) {
                            flag_allVaule = false
                            break
                        }
                        count_value = count_value + map_value[item1.id]
                    }
                    //将新查询到的值加入到map_value中，从dilldownSeries中移除一项
                    if (flag_allVaule) {
                        //统计这个类的总数
                        map_value[item.id] = count_value

                        drilldownSeries.splice(i, 1)
                    }
                }
            }

            //遍历classes获取根分类以及分类的总数
            $.each(classes, function (i, item) {
                var newItem = {}
                if (item.ParentId != item.Id
                    && (item.ParentId == -1 | item.ParentId == null | item.ParentId == 0)) {
                    newItem.name = item.Name
                        + '<br>' + options.words + '<span style="color:red;">[</span>'
                        + map_value[item.Id]
                        + '<span style="color:red;">]</span>'
                    newItem.y = map_value[item.Id]
                    newItem.drilldown = item.Id + ''
                    totalNum += newItem.y
                    rootList.push(newItem)
                }
            })
            //计算根分类的占比
            $.each(rootList, function (i, item) {
                item.y = item.y / totalNum * 100
            })

            /**
             获取到完整的map_value后重新构造dirlldownMap和drilldownSeries
             */
            drilldownMap = {}
            $.each(classes, function (i, item) {
                var has = item.ParentId in drilldownMap
                if (!has) {
                    var seconditem = {}
                    seconditem.id = item.ParentId + ''
                    seconditem.name = classesMap[item.ParentId].Name
                    seconditem.data = []
                    seconditem.data.push(getItemsData(item, 1))
                    drilldownMap[item.ParentId] = seconditem
                } else {
                    drilldownMap[item.ParentId].data.push(getItemsData(item, 1))
                }
            })

            drilldownSeries = []
            for (var key in drilldownMap) {
                drilldownSeries.push(drilldownMap[key])
            }
            /**
             * highcharts图表展示
             */
            $(opts.divName).highcharts(
                {
                    chart: {
                        type: 'pie'
                    },
                    colors: [
                        '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                        '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                        '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                        '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                    ],
                    title: {
                        text: opts.divTitle
                    },
                    subtitle: {
                        text: opts.divSubtitle
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}: {point.y:.2f}%'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>占{point.y:.2f}%</b><br/>'
                    },
                    series: [{
                        name: opts.seriesName,
                        colorByPoint: true,
                        data: rootList
                    }],
                    drilldown: {
                        series: drilldownSeries
                    }
                })

        })

    }

})(jQuery)

