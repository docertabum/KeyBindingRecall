const { getActiveAppInfo } = require('../detectors/activeAppDetector');
const { getActiveItermTabProcess } = require('../detectors/subProcessDetector');
const windowService = require('./windowService');
const keybindingDataService = require('./keybindingDataService');

async function detectActiveApp() {
  try {
    const appInfo = await getActiveAppInfo();
    const info = { ...appInfo, subProcess: null, keybindings: null };
    
    if (appInfo.name.includes('iTerm')) {
      const subProcess = await getActiveItermTabProcess();
      if (subProcess) {
        info.subProcess = subProcess;
        info.keybindings = await keybindingDataService.readKeybindings(appInfo.bundleId, subProcess);
      }
    } else {
      info.keybindings = await keybindingDataService.readKeybindings(appInfo.bundleId);
    }
    
    return info;
  } catch (error) {
    console.error('Error detecting active app:', error);
    throw error;
  }
}

function startDetection(interval = 500) {
  setInterval(async () => {
    try {
      const appInfo = await detectActiveApp();
      windowService.sendToRenderer('active-window', appInfo);
    } catch (error) {
      console.error('Error in detection loop:', error);
    }
  }, interval);
}

module.exports = {
  detectActiveApp,
  startDetection
};
