const { exec } = require('child_process');

function getActiveAppInfo() {
  return new Promise((resolve, reject) => {
    const script = 'tell application "System Events" to tell first application process whose frontmost is true to return name & "|" & bundle identifier';
    exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(new Error(stderr));
        return;
      }
      const output = stdout.trim();
      const parts = output.split('|');
      if (parts.length === 2) {
        resolve({
          name: parts[0].trim(),
          bundleId: parts[1].trim()
        });
      } else {
        reject(new Error('Could not parse active window info'));
      }
    });
  });
}

module.exports = {
  getActiveAppInfo
};
