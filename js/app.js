/*
 1. 鼠标移入显示,移出隐藏
 目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
 2. 鼠标移动切换二级导航菜单的切换显示和隐藏
 3. 输入搜索关键字, 列表显示匹配的结果
 4. 点击显示或者隐藏更多的分享图标
 5. 鼠标移入移出切换地址的显示隐藏
 6. 点击切换地址tab

 7. 鼠标移入移出切换显示迷你购物车
 8. 点击切换产品选项 (商品详情等显示出来)

 9. 点击向右/左, 移动当前展示商品的小图片
 10. 当鼠标悬停在某个小图上,在上方显示对应的中图
 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
 */

/*
1. 对哪个/些元素绑定什么监听?
2. 对哪个/些元素进行什么DOM操作?
 */
$(function () {
  showhide()
  hoverSubMenu()
  search()
  share()
  address()
  clickTabs()
  hoverMiniCart()
  clickProductTabs()
  moveMiniImg()
  hoverMiniImg()
  bigImg()
  /*
 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
 */
  function bigImg() {
    let $mediumimg = $('#mediumImg');
    let $mask = $('#mask');
    let $maskTop = $('#maskTop');
    let $largeImgContainer = $('#largeImgContainer');
    let $loading = $('#loading');
    let $largeImg = $('#largeImg');
    let maskwidth = $mask.width();
    let maskheight = $mask.height();
    let maskTopWidth = $maskTop.width();
    let maskTopheight = $maskTop.height();
    // 进入模块遮罩层
    $maskTop.hover(function () {
      // 进入 动态响应大图
      $mask.show();
      let src = $mediumimg.attr('src').replace('-m.', '-l.');
      $largeImg.attr('src', src);
      $largeImgContainer.show();
      $largeImg.on('load', function () {
        // 大图图片已获得宽度和高度
        let largeWidth = $largeImg.width();
        let largeHeight = $largeImg.height();
        // 给$largeImgContainer设置容器大小
        $largeImgContainer.css({
          width: largeWidth / 2,
          height: largeHeight / 2
        })
        $largeImg.show();
        $loading.hide();
        $maskTop.mousemove(function (event) {
          // 移动小黄块的left和top，根据比例显示大图中的相应位置
          let left = 0;
          let top1 = 0;
          // 鼠标在小黄块的中间位置
          // 鼠标距离左侧的距离-元素的宽度的一半
          let evLeft = event.offsetX;
          let eventTop = event.offsetY;
          left = evLeft - maskwidth / 2;
          top1 = eventTop - maskheight / 2;
          // 小黄块要在masktop中显示
          // left在[0, maskTopWidth-maskWidth]
          if (left < 0) {
            left = 0;
          } else if (left > maskTopWidth - maskwidth) {
            left = maskTopWidth - maskwidth
          }
          // top在[0, maskTopHeight-maskHeight]
          if (top1 < 0) {
            top1 = 0
          } else if (top > maskTopheight - maskheight) {
            top1 = maskTopheight - maskheight
          }
          //给$mask重新定位
          $mask.css({
            left: left,
            top: top1
          })
          /*2. 移动大图*/
          // 得到大图的坐标
          left = -left * largeWidth / maskTopWidth
          top1 = -top1 * largeHeight / maskTopheight
          // 设置大图的坐标
          $largeImg.css({
            left: left,
            top: top1
          })
        })
      })
    }, function () {
      $mask.hide();
      $largeImgContainer.hide();
      $largeImg.hide();

    })
  }
  /*
 10. 当鼠标在中图上移动时，显示对应的中图
 */
  function hoverMiniImg() {
    $('#icon_list>li').hover(function () {
      let $img = $(this).children();
      $img.addClass('hoveredThumb');
      // 显示对应的中图
      let src = $img.attr('src').replace('.jpg', '-m.jpg');
      // 把底下的是src的值赋值到上面去
      $('#mediumImg').attr('src', src);
    }, function () {
      $(this).children().removeClass('hoveredThumb');
    })
  }
  /*
 9. 点击向右/左, 移动当前展示商品的小图片
 */
  function moveMiniImg() {
    let $as = $('#preview>h1>a');
    let $backward = $as.first();
    let $forward = $as.last();
    let $ul = $('#icon_list');
    let show_count = 5;
    let imgcount = $ul.children('li').length;
    let moveCount = 0;//移动的次数，向左为负，向右为正
    let liwidth = $ul.children(':first').width();
    // 初始化更新
    // 向右按钮被解封
    if (imgcount > show_count) {
      $forward.attr('class', 'forward');
    }
    $forward.click(function () {
      // 判断是否需要移动，如果不需要则直接移出
      if (moveCount === imgcount - show_count) {
        return
      }
      moveCount++;
      // 初始化向左按钮
      $backward.attr('class', 'backward');
      // 如果已经到底顶峰点需封印向右按钮
      if (moveCount === imgcount - show_count) {
        $forward.attr('class', 'forward_disabled')
      }
      $ul.css({
        left: -moveCount * liwidth
      })
    });
    // 给向左的按钮绑定监听事件
    $backward.click(function () {
      if (moveCount === 0) {
        return
      };
      moveCount--;
      $forward.attr('class', 'forward');
      if (moveCount === 0) {
        $backward.attr('class', 'backward_disabled');
      }
      $ul.css({
        left: -moveCount * liwidth
      })
    })

  }
  /*
 8. 点击切换产品选项 (商品详情等显示出来)
 */
  function clickProductTabs() {
    let $lis = $('#product_detail>ul>li');
    let $contents = $('#product_detail>div:gt(0)');
    $lis.click(function () {
      $lis.removeClass('current');
      $(this).addClass('current');
      //隐藏所有的内容
      $contents.hide();
      let index = $(this).index();
      $contents[index].style.display = 'block';

    })
  }
  /*
 7. 鼠标移入移出切换显示迷你购物车
 */
  function hoverMiniCart() {
    $('#minicart').hover(function () {
      $(this).addClass('minicart');
      $(this).children(':last').show();
    }, function () {
      $(this).removeClass('minicart');
      $(this).children(':last').hide();
    })
  }
  /*
 6. 点击切换地址tab
 */
  function clickTabs() {
    $('#store_tabs>li').click(function () {
      $('#store_tabs>li').removeClass('hover');
      $(this).addClass('hover');
    })
  }
  /*
 5. 鼠标移入移出切换地址的显示隐藏
 */
  function address() {
    // 修改选择器的的写法
    let $select = $('#store_select');
    $select.hover(function () {
      $select.children(':gt(0)').show();
    }, function () {
      // 用子代选择器比id选择器写的代码量更少
      // $('#store_content').hide();
      // $('#store_close').hide();
      $select.children(':gt(0)').hide();
    }).children(':last').click(function () {
      $select.children(':gt(0)').hide()
    })
  }
  /*
   4. 点击显示或者隐藏更多的分享图标
   */
  function share() {
    let isshow = false;
    let $parent = $('#shareMore').parent();
    // prev的排列顺序是从离得最近的元素开始算起的
    let $as = $('#shareMore').prevAll('a:lt(2)');
    let $b = $('#shareMore').children();
    $('#shareMore').click(function () {
      if (isshow) {//去关闭
        isshow = false;
        $parent.css('width', '155px');
        $as.css('display', 'none');
        $b.removeClass('backword');
      } else {//去打开
        isshow = true;
        $parent.css('width', '200px');
        $as.css('display', 'block');
        $b.addClass('backword');
      }

    })
  }
  /*
 3. 输入搜索关键字, 列表显示匹配的结果
 */
  function search() {
    $('#txtSearch').on('focus keyup', function () {
      let txt = $(this).val();
      if (txt) {
        $('#search_helper').show();
      }
      // 链式结构
    }).blur(function () {
      $('#search_helper').hide();
    })
  }
  /*
  2. 鼠标移动切换二级导航菜单的切换显示和隐藏
  */

  function hoverSubMenu() {
    $('#category_items>div').hover(function () {
      $(this).children(':last').show();
    }, function () {
      $(this).children(':last').hide();
    });
  }
  /*
  1. 鼠标移入显示,移出隐藏
  目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
  */
  function showhide() {
    // hover使用的时候必须是在一起的
    $('[name=show_hide]').hover(function () {//显示
      let id = '#' + this.id + '_items';
      $(id).show();
    }, function () {//隐藏
      let id = '#' + this.id + '_items';
      $(id).hide();
    })

  }

})