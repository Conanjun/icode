IDMark_A = "_a";
//搜索
$('.search-addSrc').on('click', function() {
  listBrunch();
});
$('.search-input-addSrc').on('click', function() {
  return false;
});

//ENTER
$(document).on('keyup', function(e) {
  var $activeEl = $(document.activeElement);
  if ($activeEl.is('.search-input-addSrc') && (e.keyCode == 13 || e.keyCode == 108)) {
    $('.search-addSrc').trigger('click');
  }
});
var setting = {
  data: {
    simpleData: {
      enable: true,
      idKey: "Id",
      pIdKey: "ParentId",
      rootPId: 0
    },
    key: {
      name: "Name"
    }
  },
  view: {
    selectedMulti: false,
    showIcon: false
  },
  async: {
    enable: true,
    /*
			黄世鹏
			修改：接口重构，pageListClasses改为listClasses，参数mode改为m
		 */
    url: "../../classes/listClasses?m=0&pageSize=1000",
    autoParam: ["id"],
    dataFilter: ajaxDataFilter
  },
  callback: {
    onClick: function(e, treeId, treeNode) {
      var ZTree = $.fn.zTree.getZTreeObj("treeClasses"),
        Nodes = ZTree.getSelectedNodes();
      //有问题？？？
      if (Nodes.length == 0) {
        yunNotyError("请先选择一个节点");
      }
      $('.classifyName').val(Nodes[0].Name);
      $('#groupId').val(Nodes[0].Id);
      $('#hideClassifyId').val(Nodes[0].Id);
      if (treeNode) {
        $('.branchSearch input[name=groupId]').val(treeNode.Id);
        listBrunch(1);
      }
    },
    beforeClick: zTreeBeforeClick,
    onAsyncSuccess: function(event, treeId, treeNode, msg) {
      var ZTreeSuccess = $.fn.zTree.getZTreeObj(treeId);
      var nodes = ZTreeSuccess.getNodes();
      if (nodes.length > 0) {
        ZTreeSuccess.selectNode(nodes[0]);
      }
    }
  }
};

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
  //return !treeNode.isParent;//当是父节点 返回false 不让选取
  if (treeNode.isParent == true) {
    $('.branchSearch input[name=isLeaf]').val(0);
  } else {
    $('.branchSearch input[name=isLeaf]').val(1);
  }
}

//格式化一步获取的json数据
function ajaxDataFilter(treeId, parentNode, responseData) {
  if (responseData) {
    responseData.list.push({
      Id: 0,
      ParentId: 0,
      Name: "全部分类",
      open: true
    });
    return responseData.list;
  }
  return responseData;
}

// 修改主干词
function submitfn(){
  if($("#marked").val()==$('#editWords').val().trim()){
    $('#editMainWordModal').modal('hide')
  }else{
    $('#editMainWordForm').submit()     
  }
}




//添加主干词表单提交
function doAddBrunch() {
  $.ajax({
    type: 'get',
    datatype: 'json',
    cache: false,
    //不从缓存中去数据
    url: encodeURI('../../brunchWords/editBrunchWordsInfo'),
    //data:encodeURI(tempcontent),
    data: $("#addMainWordForm").serialize(),
    success: function(data) {
      if (data.status == 0) {
        yunNoty(data);
        $('#addMainWordModal').modal('hide');
        var page = $('#pageList .active a').html();
        listBrunch(page);
      } else {
        yunNoty(data);
      }
    }
  });
}

//修改主干词表单提交
function saveBrunch() {
  $.ajax({
    type: 'post',
    datatype: 'json',
    cache: false,
    //不从缓存中去数据
    url: encodeURI('../../brunchWords/editBrunchWordsInfo'),
    data: $("#editMainWordForm").serialize(),
    success: function(data) {
      if (data.status == 0) {
        yunNoty(data);
        $('#editMainWordModal').modal('hide');
        var page = $('#pageList .active a').html();
        listBrunch(page);
      } else {
        yunNoty(data);
      }
    }
  });
}

//列出主干词表格
function listBrunch(pageNo) {
  //不勾选全选
  $('.select_rows').iCheck('uncheck');
  if (!pageNo) pageNo = 1;
	$('#brunchList').tableAjaxLoader2(5);
  $.ajax({
    type: 'get',
    datatype: 'json',
    cache: false,
    //不从缓存中去数据
    url: encodeURI('../../brunchWords/listBrunchWords?pageSize=' + 10 + '&pageNo=' + pageNo + '&word=' + $('.search-input-addSrc').val()),
    data: $('.branchSearch').serialize(),
    success: function(data) {
      if (data.status == 0) {
        if (data.list == undefined) {
          $('#brunchList').find('tbody').html('<tr><td colspan=\"5\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
          $('#pageList').html('');
          return;
        }
        if (data.list.length > 0) {
          var html = "";
          for (var i = 0; i < data.list.length; i++) {
            html += "<tr id=\"list-tr-" + data.list[i].Id + "\">";
            html += "<td><input type=\"checkbox\" name=\"ckb\" class=\"select_row\" value=\"" + data.list[i].Id + "\" /></td>";
            html += "<td>" + data.list[i].Words + "</td>";
            if (data.list[i].Level == null) {
              html += "<td>&nbsp;</td>";
            } else if (data.list[i].Level == '0') {
              html += "<td>高级</td>";
            } else if (data.list[i].Level == '1') {
              html += "<td>一般</td>";
            }
            html += "<td>" + data.list[i].AddUserName + "</td>";
            html += "<td><a href=\"javascript:;\" class=\"sepV_a\" title=\"Edit\" onclick=\"repBrunch(this); $('#tlmePicker2').iCheck('uncheck');\" rel=\"" + data.list[i].GroupId + "\" srel=\"" + data.list[i].Level + "\"><i class=\"glyphicon glyphicon-pencil\" title=\"编辑\"></i></a>&nbsp;&nbsp;";
            html += "<a href=\"javascript:;\" class=\"m-del\" rel=\"" + data.list[i].Id + "\"><i class=\"glyphicon glyphicon-trash\" title=\"删除\"></i></a></td>";
            html += "</tr>";
          }
          $('#brunchList').find('tbody').html(html);

          // 批量删除按钮
          $("#mul-del").removeClass("btn-primary").addClass("btn-default").attr("disabled",true)
          $(".select_rows,.select_row").on("ifChanged",function(){
              if($(".select_row:checked").length>0){
                $("#mul-del").removeClass("btn-default").addClass("btn-primary").attr("disabled",false)
              }else{
                  $("#mul-del").removeClass("btn-primary").addClass("btn-default").attr("disabled",true)
              }
            })
          $('.m-del').on('click',function(){
            var self = this;
            $(self).adcCreator(function() {
              delById(self, '../../brunchWords/deleteBrunchWordsById', listBrunch, 'pageList');
            });
          });
          //不勾选全选
          $('.select_rows').iCheck('uncheck');
          $('.select_row').on('ifUnchecked',
            function() {
              $('.select_rows').iCheck('uncheck');
            });
          //初始化ickeck
          $('input.select_row').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue',
            cursor: true
          });
          //下面开始处理分页
          var options = {
            data: [data, 'list', 'total'],
            currentPage: data.currentPage,
            totalPages: data.totlePages,
            onPageClicked: function(event, originalEvent, type, page) {
              listBrunch(page);
            }
          };
          setPage('pageList', options);
        } else {
          $('#brunchList').find('tbody').html('<tr><td colspan=\"5\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
          $('#pageList').html('');
        }
      } else {
        yunNoty(data);
      }
    }
  });
}

//填写修改主干词表单
function repBrunch(obj) {
  var getid = $(obj).parents('tr').children('td').find('input[name=ckb]').val();
  //var getid=$("#list-tr- input[name=ckb]").val();
  $('#editWords').val($(obj).parents('tr').children('td').eq(1).html());
  $('#hideId').val(getid);
  $('#editMainWordForm input[name=groupId]').val($(obj).attr('rel'));
  $('#editMainWordForm input[name=level]').val($(obj).attr('srel'));
  $("#editMainWordModal").modal('show');
  $("#marked").val($("#editWords").val())
}

$("#editMainWordModal").on('hide.bs.modal', function () {
  $("#marked").val("")
})


// var INTERVAL;
$(document).ready(function() {
  App.init();
  icheckBindInit();
  $('#mul-del').on('click', function() {
    $(this).adcCreator(function() {
      selectDel('','../../brunchWords/deleteBrunchWords',listBrunch,'pageList')
    });
  });
  //角色ztree滚动条
//$('.treeDivLeft').slimScroll({
//  height: '600px'
//});
  $.fn.zTree.init($("#treeClasses"), setting, []);
  $('#addMainWordForm').validate({
    submitHandler: doAddBrunch
  });
  $('#editMainWordForm').validate({
    submitHandler: saveBrunch
  });
  //生效时间
  $(".form_datetime").datetimepicker({
    language: "zh-CN",
    format: "yyyy-mm-dd hh:ii",
    autoclose: true,
    todayBtn: true,
    minuteStep: 10,
    startDate: new Date(),
    initialDate: new Date()
  });
  $('#tlmePicker').iCheck('uncheck');
  //清空表单  添加主干词
  $('#addMainWordModal').on('hidden.bs.modal', function() {
    $('#addMainWordForm input[name=words]').val('');
    $('#tlmePicker').iCheck('uncheck');
    $('#DelClassModal').modal('hide');
  })
  $('#editMainWordModal').on('hidden.bs.modal', function() {
    $('#editMainWordModal input').val('');
  });
  //清空表单 修改主干词
  //$('#editMainWordForm').on('hidden.bs.modal', function() {
  //  $('#editMainWordForm input[name=words]').val('');
  //  $('#tlmePicker2').iCheck('uncheck');
  //  $('#DelClassModal2').modal('hide');
  //})

  listBrunch();

  //控制添加主干词表单datetimepicker的显示
  $('#tlmePicker').on('ifChecked', function() {
    $('#dateTimeSelT').show();
    $('#addMainWordForm [name=StartTime]').val('');
    $('#addMainWordForm [name=EndTime]').val('');
  }).on('ifUnchecked', function() {
    $('#dateTimeSelT').hide();
  });
  $.ajax({
    type: 'get',
    datatype: 'json',
    cache: false, //不从缓存中去数据
    url: encodeURI('../../User/findRolesByUserId'),
    success: function(data) {
      if (data.level) {
        for (var i = 0; i < data.list.length; i++) {
          $('#divnotrole').append('<input name="somerole" value="' + data.list[i].Id + '" id="bbb' + data.list[i].Id + '" type="checkbox"><label for="bbb' + data.list[i].Id + '" style="display: inline-block;padding:0 5px;margin-bottom:0">' + data.list[i].Name + '</label>');
        }
        $('#divnotshow').show();
      }
    }
  });
});
// 进度条函数
loadingfn('#exlfileupload','/BrunchWords/importBrunchWords','../../BrunchWords/getStatus','listBrunch')