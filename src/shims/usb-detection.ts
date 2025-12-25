import { isElectron } from "src/utils/running-context";

type USBMonitorEvent = 'remove' | 'change';
export class usbDetect {
  static _listeners: {change: Function[]; remove: Function[]} = {
    change: [],
    remove: [],
  };
  static shouldMonitor = false;
  static hasMonitored = false;
  static timer: NodeJS.Timeout | null = null; // 定时器引用

  static startMonitoring() {

    if(isElectron)
    {
        
      // 启动定时器（每 1000ms 跑一次）
      if (!this.timer) {
        this.timer = setInterval(() => {
          usbDetect.on_usb_detection_TimerTick();
        }, 1000);
      }
    }
    else
    {
      this.shouldMonitor = true;
      console.log("startMonitoring------------------------------");
      if (!this.hasMonitored && navigator.hid) {
        navigator.hid.addEventListener('connect', usbDetect.onConnect);
        navigator.hid.addEventListener('disconnect', usbDetect.onDisconnect);
      }
    }


  }
  static stopMonitoring() {
    if(isElectron)
    {
      
    }
    else
    {
      this.shouldMonitor = false;
    }
  }
  private static onConnect = ({device}: HIDConnectionEvent) => {
    console.log('Detected Connection');
    if (usbDetect.shouldMonitor) {
      usbDetect._listeners.change.forEach((f) => f(device));
    }
  };
  private static onDisconnect = ({device}: HIDConnectionEvent) => {
    console.log('Detected Disconnection');
    if (usbDetect.shouldMonitor) {
      usbDetect._listeners.change.forEach((f) => f(device));
      usbDetect._listeners.remove.forEach((f) => f(device));
    }
  };
  static on(eventName: USBMonitorEvent, cb: () => void) {
    this._listeners[eventName] = [...this._listeners[eventName], cb];
  }
  static off(eventName: USBMonitorEvent, cb: () => void) {
    this._listeners[eventName] = this._listeners[eventName].filter(
      (f) => f !== cb,
    );
  }




  
  /** ✅ 定时器回调函数（你可以在这里写辑） */
  private static on_usb_detection_TimerTick() {

  }
}
