window.onload = function() {

  // Unity
  UnityLoader.SystemInfo.mobile = false;
  var unityInstance = UnityLoader.instantiate("unity", "https://touch-frame.s3-ap-northeast-1.amazonaws.com/demo/webgl/Build/webgl.json", {
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
