const fs = require('node:fs').promises;
const path = require('node:path');
const os = require('node:os');

const DATA_DIR = path.join(os.homedir(), '.config', 'KeyBingingRecall');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

function getDataFilePath(bundleId, subProcess = null) {
  if (subProcess) {
    return path.join(DATA_DIR, `${bundleId}_${subProcess}.json`);
  }
  return path.join(DATA_DIR, `${bundleId}.json`);
}

async function readKeybindings(bundleId, subProcess = null) {
  const filePath = getDataFilePath(bundleId, subProcess);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function writeKeybindings(bundleId, keybindings, subProcess = null) {
  await ensureDataDir();
  const filePath = getDataFilePath(bundleId, subProcess);
  await fs.writeFile(filePath, JSON.stringify(keybindings, null, 2), 'utf8');
}

async function getAllKeybindingFiles() {
  try {
    const files = await fs.readdir(DATA_DIR);
    return files.filter(f => f.endsWith('.json'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

module.exports = {
  readKeybindings,
  writeKeybindings,
  getAllKeybindingFiles,
  getDataFilePath,
  DATA_DIR
};
