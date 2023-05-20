export {};

declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI) => void;
  }
}

interface IFrameAPI {
  createController(): void;
}

interface EmbedController{
  
}
