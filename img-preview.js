/**
 * 
 * @authors zhazhjie (zhazhjie@vip.qq.com)
 * @date    2018-05-12 15:32:18
 * @version 1.0
 */
(function(global, factory) {
  typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.imgPreview = factory());
})(window, function() {
  try {
    require('./velocity.min.js');
  } catch (e) {}
  var imgPreview = {};
  imgPreview.getPos = function(obj) {
    var l = 0,
      t = 0;
    var w = obj.offsetWidth;
    var h = obj.offsetHeight;
    while (obj) {
      l += obj.offsetLeft - obj.scrollLeft;
      t += obj.offsetTop - obj.scrollTop;
      obj = obj.offsetParent;
    }
    // t -= document.documentElement.scrollTop;
    this.data = {
      width: w + 'px',
      height: h + 'px',
      left: l + 'px',
      top: t + 'px'
    }
  }
  imgPreview.getEl = function(id) {
    return document.getElementById(id);
  }
  imgPreview.createEl = function(el) {
    var div = document.createElement('div');
    var html = `<div id="img-pre-wrap" style="width:100%;height:100%;position:fixed;top:0;left:0;z-index:998"><div id="img-modal" style="background:rgba(0, 0, 0, 0.3);width:100%;height:100%;opacity:0;"></div><img id="img-pre" src="${el.src}" style="cursor:zoom-out;position:fixed; z-index:999;width:${this.data.width};height:${this.data.height};top:${this.data.top};left:${this.data.left};"></div>`;
    div.innerHTML = html;
    document.body.appendChild(div);
    div.addEventListener('click', this.hideImg.bind(this), false);
  }
  imgPreview.showImg = function(el) {
    document.body.style.overflow = 'hidden';
    this.getPos(el);
    if (this.getEl('img-pre-wrap')) {
      var wrap = this.getEl('img-pre-wrap');
      wrap.style.display = 'block';
      var img = this.getEl('img-pre');
      img.src = el.src;
      img.style.width = this.data.width;
      img.style.height = this.data.height;
      img.style.top = this.data.top;
      img.style.left = this.data.left;
    } else {
      this.createEl(el);
    }
    var img = this.getEl('img-pre');
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    var nr = w / h;
    var W = document.documentElement.clientWidth;
    var H = document.documentElement.clientHeight;
    var sr = W / h;
    if (w > W - 40 && nr >= sr) {
      w = W - 40;
      h = w / nr;
    } else if (w > W - 40 && nr < sr) {
      h = H - 40;
      w = h * nr;
    }
    if (h > H - 40) {
      h = H - 40;
      w = h * nr;
    }
    var t = (H - h) / 2;
    var l = (W - w) / 2;
    Velocity(img, {
      top: t,
      left: l,
      width: w,
      height: h
    }, {
      duration: 300
    })
    Velocity(this.getEl('img-modal'), {
      opacity: 1
    }, {
      duration: 300
    })
  }
  imgPreview.hideImg = function() {
    //console.log(this)
    document.body.style.overflow = '';
    var img = this.getEl('img-pre');
    var modal = this.getEl('img-modal');
    Velocity(img, this.data, {
      duration: 300,
      complete: () => {
        var wrap = this.getEl('img-pre-wrap');
        wrap.style.display = 'none';
      }
    })
    Velocity(modal, {
      opacity: 0
    }, {
      duration: 300
    })
  }
  imgPreview.install = function(Vue) {
    Vue.directive('img-preview', {
      bind: (el, binding)=>{
        el.style.cursor = 'zoom-in';
        el.addEventListener('click', () => { this.showImg(el) }, false)
      }
    })
  }
  return imgPreview;
})
