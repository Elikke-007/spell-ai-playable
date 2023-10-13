import { appStoreUrl, googlePlayUrl } from "./main"

const { ccclass, property } = cc._decorator

export class IEvent {
  static GAME_READY = "game_ready"
  static GAME_END = "game_end"
  static CLICK_DOWNLOAD = "click_download"
}

@ccclass
export default class ChannelManager extends cc.Component {
  protected onEnable(): void {
    this.node.on(IEvent.GAME_READY, this.onGameReady.bind(this))
    this.node.on(IEvent.GAME_END, this.onGameEnd.bind(this))
    this.node.on(IEvent.CLICK_DOWNLOAD, this.onDownload.bind(this))
  }
  protected onDisable(): void {
    this.node.off(IEvent.GAME_READY, this.onGameReady)
    this.node.off(IEvent.GAME_END, this.onGameEnd)
    this.node.off(IEvent.CLICK_DOWNLOAD, this.onDownload)
  }

  onGameReady() {
    try {
      console.log("game ready")
      window.gameReady && window.gameReady()
    } catch (error) {}
  }
  onGameEnd() {
    try {
      console.log("game end")
      window.gameEnd && window.gameEnd()
    } catch (error) {}
  }
  onDownload() {
    console.log("click download")
    // MTG 渠道
    ChannelMintegral.onDownload()
    // APP LOVIN 渠道
    ChannelAppLovin.onDownload()
    // unity
    ChannelUnity.onDownload()
    // TikTok
    ChannelTikTok.onDownload()
    // ironSource
    ChannelIronSource.onDownload()
  }
}

class ChannelUnity {
  static onDownload() {
    try {
      var userAgent = navigator.userAgent || navigator.vendor
      var url = appStoreUrl
      var android = googlePlayUrl
      if (/android/i.test(userAgent)) {
        url = android
      }
      mraid && mraid.open(url)
    } catch (err) {}
  }
}
class ChannelMintegral {
  static onDownload() {
    try {
      window.install && window.install()
    } catch (error) {}
  }
}
class ChannelAppLovin {
  static onDownload() {
    try {
      mraid && mraid.open?.call(this)
    } catch (error) {}
  }
}
class ChannelTikTok {
  static onDownload() {
    try {
      window.openAppStore && window.openAppStore()
    } catch (error) {}
  }
}
class ChannelIronSource {
  static onDownload() {
    try {
      dapi.openStoreUrl()
    } catch (error) {}
  }
}
