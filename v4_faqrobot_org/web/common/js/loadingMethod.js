   
    // btnDom               上传按钮的id或class
    // uploadUrl            上传excel的路径
    // getgetStatusUrl      获取上传进度的路径
    // tablefn              页面表格生成的函数名字符串
    // setintertime         获取进度的计时器间隔，不写为400ms
    function loadingfn(btnDom,uploadUrl,getgetStatusUrl,tablefn,setintertime){
        // 间隔时间
        var times=400
        if(setintertime){
          var times=setintertime
        }
        // 定义计时器
        var INTERVAL;
        // 进度条dom写入页面
        var jindutiaostr='<div id="exlProgress" style="position:fixed;z-index:99;top:0;right:0;background-color:rgba(0,0,0,0.4);width:100%;height:100%;display:none">';
            jindutiaostr+='<div style="width:329px;margin:25% auto;">';
            jindutiaostr+='<h4 style="text-align:center;color:#1296db;font-size:18px;font-family:'+'微软雅黑'+';text-shadow:1px 1px 2px  #FFFFFF;font-weight:700">Loading...</h4>';
            jindutiaostr+='<div class="progress progress-striped active" style="height:10px;background-color:#dadada;box-shadow:inset 0px 0px 3px lightgray;">';
            jindutiaostr+='<div class="progress-bar" style="background-color:#33b5e2"></div></div></div></div>';
        $("body").append(jindutiaostr)

        //上传
        $(function() {

          'use strict';
          // $('#exlfileupload').fileupload({
          $(btnDom).fileupload({
            // url: '../../WordDocExcel/importFile?mode=2',
            url: uploadUrl,
            dataType: 'json',
            pasteZone:$(btnDom),
            change: function(e, data) {
              
              var flag = true;
              $.each(data.files, function(index, file) {
                var str = file.name.substring(file.name.lastIndexOf(".") + 1);
                if (str == "xls" || str == "xlsx") {
                  flag = true;
                } else {
                  flag = false;
                  yunNotyError("请上传xls或xlsx格式的文件！");
                }
              });
              return flag;

            },
            done: function(e, data) {
              if (data.result.status == 0) {
                $('#exlProgress').show();
                yunNoty(data.result);
                INTERVAL = setInterval(confirmLoad,times)
              } else {
                yunNoty(data.result);
                $('#exlProgress').hide();
                $('#exlProgress .progress-bar').css('width', '0%');
                $('.fileinput-button').css('display', 'inline-block');
                $('.fileUpLoadingSign').css('display', 'none');
              }
            },
            // progressall: function(e, data) {
            //   var progress = parseInt(data.loaded / data.total * 100, 10);
            //   $('#exlProgress .progress-bar').css(
            //     'width',
            //     progress + '%'
            //   );
            // }
          }).bind('fileuploadstart', function(e) {
            $('.fileinput-button').css('display', 'none');
            $('.fileUpLoadingSign').css('display', 'inline-block');
            $('#exlProgress').show();
          }).bind('fileuploadstop', function(e) {
            // $('#exlProgress').hide();
            // clearInterval(INTERVAL);
            $('.fileinput-button').css('display', 'inline-block');
            $('.fileUpLoadingSign').css('display', 'none');
          });
        });


        //确认导入
        function confirmLoad(obj) {
          $.ajax({
            type: 'get',
            datatype: 'json',
            cache: false, //不从缓存中去数据
            url: encodeURI(getgetStatusUrl),
            success: function(data) {
              var progress=data.ProgressToKnowledge;
              if (data.ProgressToKnowledge == 100) {
                if (data.ErrorMsg != '') {
                  yunNoty({
                    status: 1,
                    message: data.ErrorMsg
                  });
                } else {
                  yunNoty({
                    status: 0,
                    message: '导入成功！'
                  });
                  //window.location.reload();
                }
                clearInterval(INTERVAL);
                $('#exlProgress .progress-bar').css(
                  'width',
                  progress + '%'
                )
                $('#exlProgress h4').text(
                  "Loading..."+progress + '%'
                ) 
                setTimeout(function(){
                  $('#exlProgress').hide();
                  $('#exlProgress .progress-bar').css('width', '0%');
                    eval(tablefn+"()") 
                },1000)
                       
              } else {    
                $('#exlProgress .progress-bar').css(
                  'width',
                  progress + '%'
                )
                $('#exlProgress h4').text(
                  "Loading..."+progress + '%'
                )   
              }
            },
            error:function(){
              clearInterval(INTERVAL);
              $('#exlProgress').hide();
              $('#exlProgress .progress-bar').css('width', '0%');
              eval(tablefn+"()")
            }
          });
        }

    }