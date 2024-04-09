import { IEvent } from "./ChannelManager";
const { ccclass, property } = cc._decorator;

export const googlePlayUrl =
  "https://play.google.com/store/apps/details?id=com.ai.polyverse.spell.pro";
export const appStoreUrl =
  "https://apps.apple.com/us/app/spellai-ai-art-maker/id6446022340";
@ccclass
export default class Main extends cc.Component {
  @property(cc.Label)
  stepLabel: cc.Label = null;
  @property(cc.Node)
  portraitNode: cc.Node = null;
  @property(cc.Node)
  landscapeNode: cc.Node = null;
  @property(cc.Node)
  finger: cc.Node = null;
  @property(cc.Node)
  leftNodes: cc.Node = null;
  @property(cc.Node)
  googlePlayBtn: cc.Node = null;
  @property(cc.Node)
  appStoreBtn: cc.Node = null;
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
  _targetIndex: number[] = [0, 5, 3];

  _titleList: string[] = ["Select a style", "Select a theme", "Select a pose"];

  onLoad(): void {
    this._init();
    cc.view.setResizeCallback(this._onScreenChanged.bind(this));
    this._onScreenChanged();
    this.contentAnim = this.getComponent(cc.Animation);
    let texture = this.downloadBtn
      .getComponent(cc.Sprite)
      .spriteFrame.getTexture();
    texture.packable = false;
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
    this.landscapeNode.active = true;
    let size = cc.view.getVisibleSize();
    // console.log("横屏尺寸", size)
    this._changeMainContent();
    let leftNodesScale = Math.min(size.height / 720, 1);
    this.leftNodes.setScale(leftNodesScale);
    this.leftNodes.setPosition(size.width / 4, 0);
    this._setBottomNodes();
    let mainContent = this.portraitNode.getChildByName("mainContent");
    const conScale = size.height / ((1280 - 80) * mainContent.scale);
    this.congratulation.setScale(conScale);
    let marginTop =
      (size.height -
        (this.bottomNodes.height - 79) * mainContent.scale -
        this.congratulation.height *
          mainContent.scale *
          this.congratulation.scale) /
      2;
    let posY = (size.height / 2 - marginTop) / mainContent.scale;
    this.congratulation.setPosition(0, posY);
  }
  /**竖屏设置 */
  _onPortrait(canvas: cc.Canvas) {
    canvas.designResolution = new cc.Size(720, 1280);
    this.landscapeNode.active = false;
    let size = cc.view.getVisibleSize();
    // console.log("竖屏尺寸", size)
    this._changeMainContent();
    this._setBottomNodes();
    this.congratulation.setScale(1);
    const posY =
      640 - (1280 - this.bottomNodes.height - this.congratulation.height) / 2;
    this.congratulation.setPosition(0, posY);
  }

  _changeMainContent() {
    let size = cc.view.getVisibleSize();
    let mainContent = this.portraitNode.getChildByName("mainContent");
    if (this._isLandscape) {
      mainContent.setScale(Math.min(size.height / 1280, size.width / 2 / 640));
      mainContent.setPosition(size.width / 4, 0);
      this.portraitNode.getChildByName("vbg").opacity = 0;
    } else {
      const scale = Math.min(
        size.width / mainContent.width,
        size.height / mainContent.height
      );
      mainContent.setScale(scale);
      mainContent.setPosition(0, 0);
      this.portraitNode.getChildByName("vbg").opacity = 255;
    }
  }

  _setBottomNodes() {
    let posY: number = this._calcBottomNodesPosY();
    let btn = this.bottomNodes.getChildByName("downloadBtn");
    if (this._isLandscape) {
      // 横屏
      btn.opacity = 0;
    } else {
      // 竖屏
      if (this._round === 3) {
        btn.opacity = 255;
      } else {
        btn.opacity = 0;
      }
    }
    this.bottomNodes.setPosition(0, posY);
  }
  _calcBottomNodesPosY() {
    let size = cc.view.getVisibleSize();
    let posY: number = 0;
    if (this._isLandscape) {
      // 横屏
      posY =
        -1280 / 2 - this.bottomNodes.getChildByName("downloadBtn").height - 8;
    } else {
      // 竖屏
      if (this._round === 3) {
        posY = -Math.max(1280, size.height) / 2 + 10;
      } else {
        posY =
          -Math.max(1280, size.height) / 2 -
          this.bottomNodes.getChildByName("downloadBtn").height -
          8;
      }
    }
    return posY;
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
    this.stepLabel.string = `Step 1`;
    this.congratulation.opacity = 0;
  }

  start() {
    this.node.emit(IEvent.GAME_READY);
    this.fadeIn();
    this.imgGrid.on(cc.Node.EventType.TOUCH_END, this._onClickImg.bind(this));
    this.googlePlayBtn.on(
      cc.Node.EventType.TOUCH_END,
      this._onClickGoogle.bind(this)
    );
    this.appStoreBtn.on(
      cc.Node.EventType.TOUCH_END,
      this._onClickAppStore.bind(this)
    );
    this.downloadBtn.on(
      cc.Node.EventType.TOUCH_END,
      this._onClickDownload.bind(this)
    );
    this.downloadBtn2.on(
      cc.Node.EventType.TOUCH_END,
      this._onClickDownload.bind(this)
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
    this.node.emit(IEvent.CLICK_DOWNLOAD);
  }
  _onClickGoogle() {
    window.open(googlePlayUrl);
  }
  _onClickAppStore() {
    window.open(appStoreUrl);
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
    this.stepLabel.string = `Step${index + 1}`;
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
      this.imgGrid.active = false;
      if (this._isLandscape == false) {
        // 如果是竖屏
        this.bottomNodes.getChildByName("downloadBtn").opacity = 255;
        cc.tween(this.bottomNodes)
          .to(0.4, { y: this._calcBottomNodesPosY() })
          .delay(0.5)
          .start();
      }
      cc.tween(this.congratulation).to(0.4, { opacity: 255 }).start();
      this.node.emit(IEvent.GAME_END);
    }, 1);
  }
}
