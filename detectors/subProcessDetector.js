const { exec } = require('child_process');

function getActiveItermTabProcess() {
  return new Promise((resolve) => {
    const script = `
      tell application "iTerm2"
        if (count of windows) > 0 then
          tell current window
            tell current tab
              tell current session
                get tty
              end tell
            end tell
          end tell
        end if
      end tell
    `;
    
    exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
      if (error) {
        console.error('AppleScript error:', error);
        console.error('AppleScript stderr:', stderr);
        resolve(null);
        return;
      }
      
      if (!stdout.trim()) {
        console.log('No TTY returned from iTerm2');
        resolve(null);
        return;
      }
      
      const tty = stdout.trim();
      console.log('TTY:', tty);
      
      exec(`ps -t ${tty} -o comm=`, (psError, psStdout, psStderr) => {
        if (psError) {
          console.error('ps error:', psError);
          console.error('ps stderr:', psStderr);
          resolve(null);
          return;
        }
        
        if (!psStdout.trim()) {
          console.log('No output from ps command');
          resolve(null);
          return;
        }
        
        const processes = psStdout.trim().split('\n');
        const foregroundProcess = processes[processes.length - 1].trim();
        console.log('Processes:', processes);
        console.log('Foreground process:', foregroundProcess);
        
        if (foregroundProcess.includes('vim') || foregroundProcess.includes('nvim') || foregroundProcess.includes('vi')) {
          resolve(foregroundProcess);
        } else {
          resolve(null);
        }
      });
    });
  });
}

module.exports = {
  getActiveItermTabProcess
};
