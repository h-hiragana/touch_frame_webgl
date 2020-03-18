var touchFrameDomain = "https://h-hiragana.github.io/touch_frame_webgl/";

// JQuery
var jquery = document.createElement('script');
jquery.src = "https://code.jquery.com/jquery-3.4.1.js";
document.head.appendChild(jquery);

// Fontawesome
var fontawesome = document.createElement('link');
fontawesome.href = "https://use.fontawesome.com/releases/v5.6.1/css/all.css";
fontawesome.rel = "stylesheet";
document.head.appendChild(fontawesome);

// UnityLoader
var unityLoader = document.createElement('script');
unityLoader.src = touchFrameDomain + "Build/UnityLoader.js";
document.head.appendChild(unityLoader);

// Fontawesome
var css = document.createElement('link');
css.href = touchFrameDomain + "style.css";
css.rel = "stylesheet";
document.head.appendChild(css);

window.onload = function() {

  // Touch Frame View
  $("#touch-frame").append(`
    <div class='unity-content'>
      <div id='unity'></div>
      <div id='uniry-canvas'>
        <div class='background-button'></div>
        <div class='prev-button fas fa-chevron-left'></div>
        <div class='next-button fas fa-chevron-right'></div>
        <div class='loading-content'>
          <div id='unity-loading-text' class='loading-text'>NOW LOADING</div>
        </div>
        <div class='progress-content'>
          <div class='progress'>
            <div id='unity-progress-bar' class='progress-bar bg-info' role='progressbar'></div>
          </div>
        </div>
      </div>
    </div>`);

    // AR Modal View
    $('body').append(`
      <div id="ar-modal-1" class="ar-modal">
        <a rel="ar" href="img/1/3d.usdz">
          <img class="modal-image shadow" src="img/1/img.png">
        </a>
      </div>

      <div id="ar-modal-2" class="ar-modal">
        <a rel="ar" href="img/2/3d.usdz">
          <img class="modal-image shadow" src="img/2/img.png">
        </a>
      </div>

      <div id="ar-modal-3" class="ar-modal">
        <a rel="ar" href="img/3/3d.usdz">
          <img class="modal-image shadow" src="img/3/img.png">
        </a>
      </div>`);

  // Unity
  UnityLoader.SystemInfo.mobile = false;
  var unityInstance = UnityLoader.instantiate("unity", touchFrameDomain + "Build/webgl.json", {
    onProgress: function (unity, progress) {
      $("#unity-progress-bar").width((progress * 100) + "%");
    },
    Module: {
      TOTAL_STACK: 6 * 1024 * 1024,
      onRuntimeInitialized: function () {
        $("#uniry-canvas").children(".progress-content").fadeOut(0.2 * 1000);
      }
    }
  });

  // AR Modal
  $("#uniry-canvas").children(".background-button").on("click", function () {
    // Current ID
    unityInstance.SendMessage('Controllers', 'GetCurrentId');
  });

  // Prev Button
  $(".prev-button").on("click", function () {
    $("#uniry-canvas").children(".loading-content").fadeIn(0.2 * 1000);
    unityInstance.SendMessage('Controllers', 'OnPrevButtonClick');
  });

  // Next Button
  $(".next-button").on("click", function () {
    $("#uniry-canvas").children(".loading-content").fadeIn(0.2 * 1000);
    unityInstance.SendMessage('Controllers', 'OnNextButtonClick');
  });
};

/*
Loaded
*/

function onLoaded() {
  $("#uniry-canvas").children(".loading-content").fadeOut(0.2 * 1000);
}

function setCurrentId(id) {
  // Open
  openARLink("ar-modal-" + id);
}

/*
AR Modal
*/

function openARLink(modalId) {
  // オーバーレイ用の要素を追加
  $('body').append('<div class="modal-overlay"></div>');
  // オーバーレイをフェードイン
  $('.modal-overlay').fadeIn('slow');

  // モーダルコンテンツのIDを取得
  var modal = '#' + modalId;
  // モーダルコンテンツの表示位置を設定
  modalResize();
  // モーダルコンテンツフェードイン
  $(modal).fadeIn('slow');

  // 「.modal-overlay」あるいは「.modal-close」をクリック
  $('.modal-overlay, .modal-close').off().click(function () {
    // モーダルコンテンツとオーバーレイをフェードアウト
    $(modal).fadeOut('slow');
    $('.modal-overlay').fadeOut('slow', function () {
      // オーバーレイを削除
      $('.modal-overlay').remove();
    });
  });

  // リサイズしたら表示位置を再取得
  $(window).on('resize', function () {
    modalResize();
  });

  // モーダルコンテンツの表示位置を設定する関数
  function modalResize() {
    // ウィンドウの横幅、高さを取得
    var w = $(window).width();
    var h = $(window).height();

    // モーダルコンテンツの表示位置を取得
    var x = (w - $(modal).outerWidth(true)) / 2;
    var y = (h - $(modal).outerHeight(true)) / 2;

    // モーダルコンテンツの表示位置を設定
    $(modal).css({
      'left': x + 'px',
      'top': y + 'px'
    });
  }
}
