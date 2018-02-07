/**
* jquery.face.js
* 
* Copyright (c) 2016/5/24 Han Wenbo
*
**/

;(function($, window, document, undefined) {
    var plugName = "face",
        defaults = {
            open: true,//默认开启功能
            src: 'src/yun/',//表情路径
            rowNum: 5,//每行最多显示数量，此属性不适用于常用语
            btnAttr: ['0px', '5px', '20px', '20px'],//[left bottom width height] 触发按钮相对targetEl的位置和宽高  要写单位
            ctnAttr: ['0px', '30px', '40px', '40px'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
            triggerEl: null,//触发按钮(不存在则自己生成，不要由a包裹)
            targetEl: null,//父级参照物(用于appendTo和定位)
            hideAdv: false,//是否隐藏广告
            advClass: 'FA_advCtn',//广告样式
            callback: function(data) {},//获取表情符后的回调函数
        };
    
    function Face($el, options) {
        this.plugName = plugName;
        this.$el = $el;
        this.prop = {};
        this.obj = {};
        this.$obj = {};
        this.defaults = defaults;
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Face.prototype = {
        init: function() {
            this.variable();//声明变量
            if(this.options.open) {
                this.baseProp();//$el的基础属性
                this.baseEl();//生成外边框
                this.event();//绑定事件
            }
        },
         //声明变量
         variable: function() {
            this.obj.face = {//表情包
                // '云问表情': [
                //     ['微笑', '/::)'],
                //     ['色', '/::B'],
                //     ['得意', '/:8-)'],
                //     ['流泪', '/::<'],
                //     ['害羞', '/::$'],
                //     ['闭嘴', '/::X'],
                //     ['发怒', '/::@'],
                //     ['呲牙', '/::D'],
                //     ['惊讶', '/::O'],
                //     ['难过', '/::('],
                //     ['酷', '/::+'],
                //     ['愉快', '/:,@-D'],
                //     ['流汗', '/::L'],
                //     ['奋斗', '/:,@f'],
                //     ['疑问', '/:?'],
                //     ['晕', '/:,@@'],
                //     ['委屈', '/:P-(']
                // ],
                '云问表情': [
                    ['[微笑]', '/::)'],
                    ['[色]', '/::B'],
                    ['[得意]', '/:8-)'],
                    ['[流泪]', '/::<'],
                    ['[害羞]', '/::$'],
                    ['[闭嘴]', '/::X'],
                    ['[发怒]', '/::@'],
                    ['[呲牙]', '/::D'],
                    ['[惊讶]', '/::O'],
                    ['[难过]', '/::('],
                    ['[酷]', '/::+'],
                    ['[愉快]', '/:,@-D'],
                    ['[流汗]', '/::L'],
                    ['[奋斗]', '/:,@f'],
                    ['[疑问]', '/:?'],
                    ['[晕]', '/:,@@'],
                    ['[委屈]', '/:P-(']
                ],
            }

            this.obj.maxNum_y = Math.ceil(this.obj.face['云问表情'].length/this.options.rowNum);//云问表情最大行数

            this.obj.showTip = false;//是否显示提示框
            this.obj.lastStrLen = 1;//
        },
        //基础属性
        baseProp: function() {
            this.prop.winW = $(window).width();
            this.prop.winH = $(window).height();

            this.prop.width = this.$el.width();
            this.prop.height = this.$el.height();
            this.prop.outerWidth = this.$el.outerWidth();
            this.prop.outerHeight = this.$el.outerHeight();

            this.prop.zIndex = this.$el.css('zIndex');

            this.prop.paddingLeft = parseInt(this.$el.css('paddingLeft'));
            this.prop.paddingTop = parseInt(this.$el.css('paddingTop'));
            this.prop.borderWidth = parseInt(this.$el.css('borderTopWidth'));

            this.prop.position = this.$el.position();
            this.prop.offset = this.$el.offset();

            this.prop.bottom = this.prop.winH - this.prop.offset.top;

            //是否rem
            this.prop.baseRem = parseInt($('html').css('fontSize'));
        },
        //生成触发按钮和表情框
        baseEl: function() {
            var This = this,
                isRem = false;

            //rem
            if(This.options.ctnAttr.join(',').indexOf('rem') != -1) {//rem
                isRem = true;
                
                for(var i=0; i<This.options.ctnAttr.length; i++) {
                    This.options.ctnAttr[i] = parseInt(parseFloat(This.options.ctnAttr[i]) * This.prop.baseRem);

                }
            }

            //触发按钮(可配置)
            if(this.options.triggerEl) {
                this.$obj.$FA_triBtn = this.options.triggerEl;
            }else {
                this.$obj.$FA_triBtn = $('<div class="FA_triBtn"></div>').css({
                    width: this.options.btnAttr[2],
                    height: this.options.btnAttr[3],
                }).appendTo(this.options.targetEl);

                //触发按钮定位
                this.$obj.$FA_triBtn.css({
                    left: this.options.btnAttr[0],
                    bottom: this.options.btnAttr[1],
                });
            }

            //背景框
            this.$obj.$FA_backCtn = $('<div class="FA_backCtn"></div>').hide().css({
            }).appendTo(this.options.targetEl);

            //滚动框
            this.$obj.$FA_ScrollCtn = $('<div class="FA_ScrollCtn"></div>').css({
                width: parseFloat(this.options.ctnAttr[2])*this.options.rowNum,
                height: parseFloat(this.options.ctnAttr[3])*4,
            }).appendTo(this.$obj.$FA_backCtn);

            //rem
            if(isRem) {//rem
                //背景框padding
                This.$obj.$FA_backCtn.css({
                    padding: (This.prop.baseRem - This.$obj.$FA_ScrollCtn.outerWidth())/2,
                });
            }

            //表情框
            this.$obj.$FA_faceCtn = $('<div class="FA_faceCtn"></div>').appendTo(this.$obj.$FA_ScrollCtn);

            //广告框
            this.$obj.$FA_advCtn = $('<div></div>').addClass(this.options.advClass).insertBefore(this.$obj.$FA_ScrollCtn);

            //关闭广告框
            this.$obj.$FA_closeAdvCtn = $('<div class="FA_closeAdvCtn" title="不再显示">×</div>').appendTo(this.$obj.$FA_advCtn);

            if(this.options.hideAdv) {//隐藏广告
                this.$obj.$FA_advCtn.hide();
            }

            this.obj.moodIndex = 0;
            for(var key in this.obj.face) {
                this.obj.moodIndex++;
                switch(key) {
                    case '云问表情':
                        var mood = this.obj.face[key],
                            html = '';
                        for(var i=0; i<this.options.rowNum*this.obj.maxNum_y; i++) {
                            var srcHtml = '',
                                title = '',
                                mark = '';

                            if(i < mood.length) {
                                srcHtml = '<img src="'+ this.options.src + i +'.png">';
                                title = mood[i][0];
                                mark = mood[i][1];
                            }
                            html += '<div class="FA_moodCtn" title="'+ title +'" mark="'+ title +'" group="'+ key +'"><div class="FA_srcCtn" style="width: '+ parseInt(this.options.ctnAttr[2]) +'px; height: '+ parseInt(this.options.ctnAttr[3]) +'px">'+ srcHtml +'</div></div>';
                            // html += '<div class="FA_moodCtn" title="'+ title +'" mark="'+ title +'" group="'+ key +'"><div class="FA_srcCtn" style="width: '+ parseInt(this.options.ctnAttr[2]) +'px; height: '+ parseInt(this.options.ctnAttr[3]) +'px">'+ srcHtml +'</div></div>';
                        }
                        this.$obj.$FA_faceCtn.append(html);
                        break;
                }

            }


            //背景框定位
            this.$obj.$FA_backCtn.css({
                left: this.options.ctnAttr[0],
                bottom: this.options.ctnAttr[1],
            });

            //提示表情滚动框
            this.$obj.$FA_tipScrollCtn = $('<div class="FA_tipScrollCtn"></div>').css({
                width: this.options.ctnAttr[2]+50,
                height: this.options.ctnAttr[3]*4,
            }).appendTo('body');

            var $allMood = $('.FA_moodCtn[group=云问表情]').clone();

            $allMood.each(function() {
                var mark = $(this).attr('mark');

                $(this).find('.FA_srcCtn').css({
                    textIndent: 5,
                    textAlign: 'left',
                    width: This.options.ctnAttr[2]+50,
                }).find('img').after('<span>'+ mark +'</span>');
            });

            //提示表情框
            this.$obj.$FA_tipMoodCtn = $('<div class="FA_tipMoodCtn"></div>').append($allMood).appendTo(this.$obj.$FA_tipScrollCtn);

            //计算文字框
            this.$obj.$FA_countLenCtn = $('<div class="FA_countLenCtn"></div>').css({
                width: this.prop.width,
                height: this.prop.height,
                left: this.prop.offset.left+15,
                bottom: this.prop.bottom-this.prop.outerHeight-30,
                padding: this.prop.paddingTop +'px '+ this.prop.paddingLeft +'px',
                border: this.prop.borderWidth +'px solid blue',
                opacity: 0,
                zIndex: -999,
            }).hide().appendTo('body');

            //计算文字标识符
            this.$obj.$FA_markPos = $('<span class="FA_markPos"></span>').css({
            }).appendTo(this.$obj.$FA_countLenCtn);

        },
        //绑定事件
        event: function() {
            var This = this;

            //调用滚动插件(表情框)
            This.obj.scrollbar = This.$obj.$FA_ScrollCtn.scrollbar({
            });
            This.$obj.$FA_tipScrollCtn.hide();//调用滚动插件后才能隐藏

            //选择表情
            This.options.targetEl.on('click.FA', '.FA_moodCtn', function() {
                var val = This.$el.val(),
                    cursortPos = MN_Base.getCursortPos(This.$el[0]),
                    fromVal = val.substr(0, cursortPos),
                    toVal = val.substr(cursortPos, val.length-1),
                    mark = $(this).attr('mark');

                This.$el.val(fromVal + mark + toVal);
                MN_Base.setCaretPos(This.$el[0], cursortPos+mark.length);
                This.options.callback(This.$el.val());
                This.$obj.$FA_backCtn.hide();
            });
            
            //初始化切换按钮状态
            $('.FA_switchBtn').eq(0).addClass('FA_switchBtn_focus').siblings().removeClass('FA_switchBtn_focus');

            //点击切换
            $('body').on('click.FA', '.FA_switchBtn', function() {
                $(this).addClass('FA_switchBtn_focus').siblings().removeClass('FA_switchBtn_focus');
                if($(this).is('.FA_switchBtn_1')) {//云问表情
                    This.obj.scrollbar.scrollTo(This.obj.top1);
                }
            });

            //显隐
            $(document).on('click.FA', function(e) {
                if(e.target == This.$obj.$FA_triBtn[0]) {
                    $('[FA-src]').each(function() {//避免首次加载表情文件
                        $(this).attr('src', $(this).attr('FA-src')).removeAttr('FA-src');
                    });

                    This.$obj.$FA_backCtn.stop().show();

                    // This.obj.scrollbar.update();
                    // This.obj.scrollbar.scrollTo('top');

                    //显示后才能获取top
                    This.obj.top1 = 0;
                }else if($(e.target).is(This.$obj.$FA_backCtn) || $(e.target).parents('.FA_backCtn')[0]) {
                    return false;
                }else {
                    This.$obj.$FA_backCtn.stop().hide();
                }
            });

            //关闭广告
            This.$obj.$FA_closeAdvCtn.on('click.FA', function() {
                This.$obj.$FA_advCtn.stop().fadeOut();
            });

            This.$el.on('keydown.FA', function(e) {
                if(e.keyCode == 8) {
                    This.obj.bindInput = false;
                }else {
                    This.obj.bindInput = true;
                }
            });
        },
        update: function() {
            // this.obj.scrollbar.update();
        },
    }

    $.fn.extend({
        face: function(options) {
            return new Face($(this), options);
        }
    })
})(jQuery, window, document);
