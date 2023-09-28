const { ccclass, property } = cc._decorator;

window["gameStart"] = () => {
  console.log("gameStart");
};
window["gameClose"] = () => {
  console.log("gameClose");
};

@ccclass
export default class Main extends cc.Component {
  @property(cc.Node)
  finger: cc.Node = null;
  @property(cc.Node)
  leftNodes: cc.Node = null;
  @property(cc.Node)
  googlePlayBtn: cc.Node = null;
  @property(cc.Node)
  appStoreBtn: cc.Node = null;
  @property(cc.Node)
  mainContent: cc.Node = null;
  @property(cc.Animation)
  loadingAnim: cc.Animation = null;
  @property(cc.Label)
  categoryTitle: cc.Label = null;

  @property(cc.Node)
  titleBox: cc.Node = null;

  @property(cc.Node)
  downloadBtn: cc.Node = null;
  @property(cc.Node)
  downloadBtn2: cc.Node = null;

  @property(cc.Node)
  congratulation: cc.Node = null;

  @property(cc.Node)
  imgGrid: cc.Node = null;

  @property(cc.Node)
  selectedBox: cc.Node = null;

  @property(cc.Node)
  indicators: cc.Node = null;

  @property(cc.SpriteFrame)
  whiteCircle: cc.SpriteFrame = null;
  @property(cc.Node)
  bottomNodes: cc.Node = null;

  @property([cc.SpriteFrame])
  firstGroup: cc.SpriteFrame[] = [];
  @property([cc.SpriteFrame])
  secondGroup: cc.SpriteFrame[] = [];
  @property([cc.SpriteFrame])
  thirdGroup: cc.SpriteFrame[] = [];

  _round: number = 0;
  contentAnim: cc.Animation = null;
  canClick: boolean = false;
  _isLandscape: boolean = false;
  _targetIndex: number[] = [0, 3, 3];

  _titleList: string[] = ["Style", "Theme", "Pose"];

  onLoad(): void {
    this.onGameReady();
    this._init();
    cc.view.setResizeCallback(this._onScreenChanged.bind(this));
    this._onScreenChanged();
    this.contentAnim = this.getComponent(cc.Animation);
  }
  _onScreenChanged() {
    var rect = cc.game.canvas.getBoundingClientRect();
    var landscape = false; // 判断是否是横屏
    if (rect.width > rect.height) {
      landscape = true;
    }
    this._isLandscape = landscape;
    let canvas = this.getComponent(cc.Canvas);
    if (landscape) {
      this._onLandscape(canvas);
    } else {
      this._onPortrait(canvas);
    }
  }
  /**横屏设置 */
  _onLandscape(canvas: cc.Canvas) {
    canvas.designResolution = new cc.Size(1280, 720);
    canvas.fitHeight = false;
    canvas.fitWidth = true;
    let size = cc.view.getVisibleSize();
    let leftNodesScale = size.height > 720 ? 1 : size.height / 720;
    this.leftNodes.setScale(leftNodesScale);
    this.leftNodes.setPosition(size.width / 4, 0);
    let mainContentScale = size.height > 1280 ? 1 : size.height / 1280;
    this.mainContent.setScale(mainContentScale);
    let posx = size.width / 4;
    this.mainContent.setPosition(posx, 0);
    this.node.getChildByName("vbg").active = false;
    this.node.getChildByName("hbg").active = true;

    // 隐藏 下载按钮，下移
    this.bottomNodes.getChildByName("downloadBtn").opacity = 0;
    this.bottomNodes.getChildByName("indicators").active = true;
    // this.bottomNodes.setPosition(-727);
    // let bottomWidget = this.bottomNodes.getComponent(cc.Widget);
    // bottomWidget.bottom = -86;
    // bottomWidget.updateAlignment();
  }
  /**竖屏设置 */
  _onPortrait(canvas: cc.Canvas) {
    canvas.designResolution = new cc.Size(720, 1280);
    canvas.fitHeight = true;
    canvas.fitWidth = false;
    let size = cc.view.getVisibleSize();
    this.leftNodes.setScale(0);
    let maxHeight = size.height;
    this.mainContent.setScale(
      Math.min(
        size.width / this.mainContent.width,
        maxHeight / this.mainContent.height,
      ),
    );
    // this.mainContent.setScale(size.width >= 720 ? 1 : size.width / 720);
    this.mainContent.setPosition(0, 0);
    this.node.getChildByName("vbg").active = true;
    this.node.getChildByName("hbg").active = false;
    if (this._round === 3) {
      this.bottomNodes.getChildByName("downloadBtn").opacity = 255;
      this.bottomNodes.getChildByName("indicators").active = false;
      // 显示 下载按钮，上移
      // this.bottomNodes.setPosition(-628);
      // this.bottomNodes.getComponent(cc.Widget).bottom = 15;
    } else {
      // this.bottomNodes.getComponent(cc.Widget).bottom = 10;
      this.bottomNodes.getChildByName("downloadBtn").opacity = 0;
      this.bottomNodes.getChildByName("indicators").active = true;
      // 隐藏 下载按钮，下移
      // this.bottomNodes.getComponent(cc.Widget).bottom = -86;
      // console.log("隐藏 下载按钮，下移");
    }
    // this.bottomNodes.getComponent(cc.Widget).updateAlignment();
  }

  _setGridImgs(assets: cc.SpriteFrame[]) {
    if (assets.length !== this.imgGrid.children.length) return;
    for (let i = 0; i < this.imgGrid.children.length; i++) {
      let item = this.imgGrid.children[i];
      let img = item.children[0].getComponent(cc.Sprite);
      img.spriteFrame = assets[i];
    }
  }
  _init() {
    this._setGridImgs(this.firstGroup);
    this.selectedBox.children.map((child) => {
      child.scale = 0;
    });
    this.categoryTitle.string = this._titleList[0];
    this.congratulation.opacity = 0;
  }

  start() {
    this.fadeIn();
    this.imgGrid.on(cc.Node.EventType.TOUCH_END, this._onClickImg.bind(this));
    this.googlePlayBtn.on(
      cc.Node.EventType.TOUCH_END,
      this._onClickGoogle.bind(this),
    );
    this.appStoreBtn.on(
      cc.Node.EventType.TOUCH_END,
      this._onClickAppStore.bind(this),
    );
    this.downloadBtn.on(
      cc.Node.EventType.TOUCH_END,
      this._onClickDownload.bind(this),
    );
    this.downloadBtn2.on(
      cc.Node.EventType.TOUCH_END,
      this._onClickDownload.bind(this),
    );
  }
  onDestroy(): void {
    this.imgGrid.off(cc.Node.EventType.TOUCH_END);
  }

  fadeIn() {
    this.contentAnim.playAdditive("fadeIn");
  }
  fadeOut() {
    this.contentAnim.playAdditive("fadeOut");
  }

  _onClickDownload() {
    try {
      window.install && window.install();
    } catch (error) {}
  }
  _onClickGoogle() {
    // window.location.href =
    //   "https://play.google.com/store/apps/details?id=com.ai.polyverse.spell";
    window.open(
      "https://play.google.com/store/apps/details?id=com.ai.polyverse.spell",
    );
  }
  _onClickAppStore() {
    // window.location.href =
    //   "https://apps.apple.com/us/app/spellai-ai-art-maker/id6446022340";
    window.open(
      "https://apps.apple.com/us/app/spellai-ai-art-maker/id6446022340",
    );
  }

  onFadeInEnd() {
    // 获取指定的图片位置
    let target = this.imgGrid.children[this._targetIndex[this._round]];
    let tempPos = target.parent.convertToWorldSpaceAR(target.position);
    let targetPos = this.finger.parent.convertToNodeSpaceAR(tempPos);
    cc.tween(this.finger)
      .to(0.5, {
        opacity: 255,
        position: cc.v3(targetPos.x, targetPos.y),
      })
      .call(() => {
        this.canClick = true;
      })
      .start();
  }

  onFadeOutEnd() {
    this._onNextRound();
  }

  _onNextRound() {
    this._round++;
    let index = this._round > 2 ? 2 : this._round;
    this.categoryTitle.string = this._titleList[index];
    this.indicators.children[index].getComponent(cc.Sprite).spriteFrame =
      this.whiteCircle;
    if (this._round < 3) {
      this._setGridImgs(this._round == 1 ? this.secondGroup : this.thirdGroup);
      this.fadeIn();
    }
    this._tryShowResult();
  }

  async _onClickImg() {
    if (!this.canClick) return;
    this.canClick = false;
    cc.tween(this.finger)
      .to(0.3, { opacity: 0 })
      .call(() => {
        this.finger.setPosition(0, 0);
      })
      .start();
    let selectedItem = this.selectedBox.children[this._round];
    cc.tween(selectedItem).to(0.2, { scale: 1 }).start();
    this.fadeOut();
  }
  async _tryShowResult() {
    if (this._round < 3) return;
    this.loadingAnim.play();
    this.scheduleOnce(() => {
      this.loadingAnim.stop();
      this.titleBox.active = false;
      this.imgGrid.active = false;
      if (this._isLandscape == false) {
        // 如果是竖屏
        this.indicators.active = false;
        this.bottomNodes.getChildByName("downloadBtn").opacity = 255;
        // this.bottomNodes.getComponent(cc.Widget).bottom = 15;
        // this.bottomNodes.getComponent(cc.Widget).updateAlignment();
        // console.log("main content scale", this.mainContent.scale);
        let screen = cc.view.getVisibleSize();
        let maxHeight = screen.height;
        // console.log("main content height", this.mainContent.height);
        // console.log("宽度倍数", screen.width / this.mainContent.width);
        // console.log("高度倍数", maxHeight / this.mainContent.height);
        this.mainContent.setScale(
          Math.min(
            screen.width / this.mainContent.width,
            maxHeight / this.mainContent.height,
          ),
        );
      }
      cc.tween(this.congratulation).to(0.4, { opacity: 255 }).start();
      this.onGameEnd();
    }, 2);
  }

  onGameReady() {
    try {
      window.gameReady && window.gameReady();
    } catch (error) {}
  }
  onGameEnd() {
    try {
      window.gameEnd && window.gameEnd();
    } catch (error) {}
  }
}
