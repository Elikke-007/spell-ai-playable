export default class ChannelIronSource {
//   gameStart: () => void
//   constructor(gameStart: () => void) {
//     this.gameStart = gameStart
//   }
//   start() {
//     window.addEventListener("load", () => {
//       try {
//         dapi.isReady() ? this.onReadyCallback() : dapi.addEventListener("ready", this.onReadyCallback.bind(this))
//       } catch (error) {}
//     })
//   }
//   onReadyCallback() {
//     dapi.removeEventListener("ready", this.onReadyCallback)
//     if (dapi.isViewable()) {
//       this.adVisibleCallback({ isViewable: true })
//     }

//     dapi.addEventListener("viewableChange", this.adVisibleCallback) //this event is used to know when the ad was visible/hidden
//     dapi.addEventListener("adResized", this.adResizeCallback) //this event is used recalculate ad UI items(mostly upon rotation)
//     dapi.addEventListener("audioVolumeChange", this.audioVolumeChangeCallback) //this event is used to get info about any volume state change
//   }
//   adVisibleCallback(event) {
//     console.log("isViewable " + event.isViewable)
//     if (event.isViewable){
//         this.gameStart()
//     }
//   }
//   adResizeCallback(event) {}
//   audioVolumeChangeCallback(volume) {
//     let isAudioEnabled = !!volume
//     if (isAudioEnabled) {
//       //START or turn on the sound(add your own code here)
//     } else {
//       //PAUSE the turn off the sound(add your own code here)
//     }
//   }
  static onDownload() {
    try {
      dapi.openStoreUrl()
    } catch (error) {}
  }
}
