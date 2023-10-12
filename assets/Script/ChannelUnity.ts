
export default class ChannelUnity {
    gameStart:()=>void
    constructor(gameStart:()=>void){
        this.gameStart = gameStart
    }
  start(): boolean {
    try {
      if (!mraid) return false
      if (mraid.getState() === "loading") {
        // If the SDK is still loading, add a listener for the 'ready' event:
        mraid.addEventListener("ready", this.onSdkReady.bind(this))
        // Otherwise, if the SDK is ready, execute your function:
      } else {
        this.onSdkReady()
      }
    } catch (error) {
      return false
    }
  }
  onSdkReady() {
    try {
      if (!mraid) return
      mraid.addEventListener("viewableChange", this.viewableChangeHandler.bind(this))
      // The isViewable method returns whether the ad container is viewable on the screen.
      if (mraid.isViewable()) {
        // If the ad container is visible, play the ad:
        this.gameStart()
      }
    } catch (error) {}
  }
  viewableChangeHandler(viewable: boolean) {}
  onDownload(){
    try{
        var userAgent = navigator.userAgent || navigator.vendor;
        var url = 'https://apps.apple.com/us/app/spellai-ai-art-maker/id6446022340'; 
        var android ='https://play.google.com/store/apps/details?id=com.ai.polyverse.spell'; 
        if (/android/i.test(userAgent)) { 
            url = android; 
        }
        if(!mraid) return
        mraid.open()
    }
  }
}
