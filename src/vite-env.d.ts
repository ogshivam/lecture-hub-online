
// Extend the Document interface to include browser-specific fullscreen properties
interface Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  
  webkitExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  msExitFullscreen?: () => void;
}

// Extend HTMLElement interface similarly
interface HTMLElement {
  webkitRequestFullscreen?: () => void;
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
}
