/**
 *
 * @authors zhazhjie (zhazhjie@vip.qq.com)
 * @date    2018-05-12 15:32:18
 * @version 1.0
 */
(function (global, factory) {
  typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.imgPreview = factory());
})(window, function () {
  var imgPreview = {};
  var params = {};

  function getEl(id) {
    return document.getElementById(id);
  }

  function createEl(el) {
    var wrapper = document.createElement('div');
    wrapper.id = 'img-preview-wrapper';
    wrapper.style = 'width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:9998;overflow:auto;';
    var modal = document.createElement('div');
    modal.id = 'wrapper-modal';
    modal.style = 'position:fixed;background:rgba(0, 0, 0, 0.3);width:100%;height:100%;opacity:0;transition:all .3s;';
    wrapper.appendChild(modal);
    var img = document.createElement('img');
    img.id = 'img-preview';
    img.src = el.src;
    img.style = 'cursor:zoom-out;position:absolute;transition:all .3s;';
    setImgSize(img,params);
    wrapper.appendChild(img);
    document.body.appendChild(wrapper);
    wrapper.addEventListener('click', hideImg);
    return img;
  }

  function setImgSize(img, data) {
    img.style.width = data.width + 'px';
    img.style.height = data.height + 'px';
    img.style.top = data.top + 'px';
    img.style.left = data.left + 'px';
  }

  function showImg(e) {
    document.body.style.overflow = 'hidden';
    params = this.getBoundingClientRect();
    var wrapper = getEl('img-preview-wrapper');
    var img = getEl('img-preview');
    if (wrapper) {
      wrapper.style.display = 'block';
      img.src = this.src;
      setImgSize(img, params);
    } else {
      img = createEl(this);
    }
    var margin = 40;
    var imgWidth = img.naturalWidth || img.offsetWidth;
    var imgHeight = img.naturalHeight || img.offsetHeight;
    var imgRatio = imgWidth / imgHeight;
    var winWidth = window.innerWidth - margin;
    var winHeight = window.innerHeight - margin;
    var winRatio = winWidth / winHeight;
    if (imgWidth > winWidth  && imgRatio >= winRatio) {
      imgWidth = winWidth;
      imgHeight = imgWidth / imgRatio;
    } else if (imgWidth > winWidth && imgRatio < winRatio) {
      imgHeight = winHeight;
      imgWidth = imgHeight * imgRatio;
    }
    if (imgHeight > winHeight) {
      imgHeight = winHeight;
      imgWidth = imgHeight * imgRatio;
    }
    var top = (winHeight - imgHeight) / 2 + margin / 2;
    var left = (winWidth - imgWidth) / 2 + margin / 2;
      setImgSize(img, {
        width: imgWidth,
        height: imgHeight,
        top: top,
        left: left
      });
      getEl('wrapper-modal').style.opacity = 1;
  }

  function hideImg() {
    //console.log(this)
    document.body.style.overflow = '';
    setImgSize(getEl('img-preview'), params);
    getEl('wrapper-modal').style.opacity = 0;
    setTimeout(function () {
      getEl('img-preview-wrapper').style.display = 'none';
    }, 300)
  }

  imgPreview.install = function (Vue) {
    Vue.directive('img-preview', {
      bind: (el, binding) => {
        el.style.cursor = 'zoom-in';
        el.addEventListener('click', showImg)
      }
    })
  };
  return imgPreview;
});
