/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ALLOWED_SCHEMES = exports.TRANSCRIPT_POLL_INTERVAL = exports.SEND_BUFFER_SECONDS = exports.TIME_BETWEEN_HEARTBEATS_MS = exports.AI_RECENT_PASTES_TIME_MS = exports.LogLevel = exports.COMMAND_STATUS_BAR_ENABLED = exports.COMMAND_STATUS_BAR_CODING_ACTIVITY = exports.COMMAND_PROXY = exports.COMMAND_LOG_FILE = exports.COMMAND_DISABLE = exports.COMMAND_DEBUG = exports.COMMAND_DASHBOARD = exports.COMMAND_CONFIG_FILE = exports.COMMAND_API_URL = exports.COMMAND_API_KEY = exports.COMMON_AI_EXTENSIONS = void 0;
exports.COMMON_AI_EXTENSIONS = [
    {
        name: 'claude',
        extensionIds: ['anthropic.claude-code'],
        transcriptLogGlobs: ['~/.claude/projects/*/*.jsonl'],
    },
    {
        name: 'codex',
        extensionIds: ['openai.chatgpt', 'openai.openai-gpt-vscode'],
        transcriptLogGlobs: ['~/.codex/sessions/**/rollout-*.jsonl'],
    },
    {
        name: 'copilot',
        extensionIds: ['github.copilot', 'github.copilot-chat'],
        transcriptLogGlobs: [],
    },
    {
        name: 'cursor',
        extensionIds: [],
        transcriptLogGlobs: [],
    },
    {
        name: 'gemini',
        extensionIds: [],
        transcriptLogGlobs: [],
    },
    {
        name: 'codeium',
        extensionIds: ['codeium.codeium'],
        transcriptLogGlobs: [],
    },
    {
        name: 'continue',
        extensionIds: ['continue.continue'],
        transcriptLogGlobs: [],
    },
    {
        name: 'cody',
        extensionIds: ['sourcegraph.cody-ai'],
        transcriptLogGlobs: [],
    },
    {
        name: 'supermaven',
        extensionIds: ['supermaven.supermaven'],
        transcriptLogGlobs: [],
    },
    {
        name: 'tabnine',
        extensionIds: ['tabnine.tabnine-vscode'],
        transcriptLogGlobs: [],
    },
    {
        name: 'vscode-ai-toolkit',
        extensionIds: ['ms-vscode.vscode-ai-toolkit'],
        transcriptLogGlobs: [],
    },
    {
        name: 'factory',
        extensionIds: [],
        transcriptLogGlobs: [],
    },
    {
        name: 'opencode',
        extensionIds: [],
        transcriptLogGlobs: [],
    },
    {
        name: 'openclaw',
        extensionIds: [],
        transcriptLogGlobs: [],
    },
];
exports.COMMAND_API_KEY = 'wakatime.apikey';
exports.COMMAND_API_URL = 'wakatime.apiurl';
exports.COMMAND_CONFIG_FILE = 'wakatime.config_file';
exports.COMMAND_DASHBOARD = 'wakatime.dashboard';
exports.COMMAND_DEBUG = 'wakatime.debug';
exports.COMMAND_DISABLE = 'wakatime.disable';
exports.COMMAND_LOG_FILE = 'wakatime.log_file';
exports.COMMAND_PROXY = 'wakatime.proxy';
exports.COMMAND_STATUS_BAR_CODING_ACTIVITY = 'wakatime.status_bar_coding_activity';
exports.COMMAND_STATUS_BAR_ENABLED = 'wakatime.status_bar_enabled';
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
exports.AI_RECENT_PASTES_TIME_MS = 500;
exports.TIME_BETWEEN_HEARTBEATS_MS = 120000;
exports.SEND_BUFFER_SECONDS = 30;
exports.TRANSCRIPT_POLL_INTERVAL = 30;
exports.ALLOWED_SCHEMES = ['file', 'vscode-chat-code-block', 'openai-codex', 'vscode-remote'];


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
const constants_1 = __webpack_require__(2);
class Logger {
    constructor(level) {
        this.setLevel(level);
    }
    getLevel() {
        return this.level;
    }
    setLevel(level) {
        this.level = level;
    }
    log(level, msg) {
        if (level >= this.level) {
            msg = `[WakaTime][${constants_1.LogLevel[level]}] ${msg}`;
            if (level == constants_1.LogLevel.DEBUG)
                console.log(msg);
            if (level == constants_1.LogLevel.INFO)
                console.info(msg);
            if (level == constants_1.LogLevel.WARN)
                console.warn(msg);
            if (level == constants_1.LogLevel.ERROR)
                console.error(msg);
        }
    }
    debug(msg) {
        this.log(constants_1.LogLevel.DEBUG, msg);
    }
    info(msg) {
        this.log(constants_1.LogLevel.INFO, msg);
    }
    warn(msg) {
        this.log(constants_1.LogLevel.WARN, msg);
    }
    warnException(msg) {
        if (msg.message !== undefined) {
            this.log(constants_1.LogLevel.WARN, msg.message);
        }
    }
    error(msg) {
        this.log(constants_1.LogLevel.ERROR, msg);
    }
    errorException(msg) {
        if (msg.message !== undefined) {
            this.log(constants_1.LogLevel.ERROR, msg.message);
        }
    }
}
exports.Logger = Logger;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WakaTime = void 0;
const tslib_1 = __webpack_require__(5);
const vscode = __webpack_require__(1);
const constants_1 = __webpack_require__(2);
const utils_1 = __webpack_require__(6);
class WakaTime {
    constructor(logger, config) {
        this.statusBar = undefined;
        this.statusBarTeamYou = undefined;
        this.statusBarTeamOther = undefined;
        this.lastHeartbeat = 0;
        this.lastDebug = false;
        this.lastCompile = false;
        this.lastAICodeGenerating = false;
        this.dedupe = {};
        this.debounceId = null;
        this.debounceMs = 50;
        this.AIDebounceId = null;
        this.AIdebounceMs = 1000;
        this.AIdebounceCount = 0;
        this.AIrecentPastes = [];
        this.fetchTodayInterval = 60000;
        this.lastFetchToday = 0;
        this.disabled = true;
        this.isCompiling = false;
        this.isDebugging = false;
        this.isAICodeGenerating = false;
        this.hasAICapabilities = false;
        this.teamDevsForFileCache = {};
        this.lastApiKeyPrompted = 0;
        this.heartbeats = [];
        this.lastSent = 0;
        this.linesInFiles = {};
        this.lineChanges = { ai: {}, human: {} };
        this.logger = logger;
        this.config = config;
    }
    initialize() {
        if (this.config.get('wakatime.debug') == 'true') {
            this.logger.setLevel(constants_1.LogLevel.DEBUG);
        }
        const extension = vscode.extensions.getExtension('WakaTime.vscode-wakatime');
        this.extension = (extension != undefined && extension.packageJSON) || { version: '0.0.0' };
        this.agentName = utils_1.Utils.getEditorName();
        this.hasAICapabilities = utils_1.Utils.checkAICapabilities();
        this.disabled = this.config.get('wakatime.disabled') === 'true';
        if (this.disabled) {
            this.dispose();
            return;
        }
        this.initializeDependencies();
    }
    dispose() {
        var _a, _b, _c, _d;
        this.sendHeartbeats();
        (_a = this.statusBar) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this.statusBarTeamYou) === null || _b === void 0 ? void 0 : _b.dispose();
        (_c = this.statusBarTeamOther) === null || _c === void 0 ? void 0 : _c.dispose();
        (_d = this.disposable) === null || _d === void 0 ? void 0 : _d.dispose();
    }
    initializeDependencies() {
        this.logger.debug(`Initializing WakaTime v${this.extension.version}`);
        const align = this.getStatusBarAlignment();
        const priority = this.getStatusBarPriority();
        this.statusBar = vscode.window.createStatusBarItem('com.wakatime.statusbar', align, priority + 2);
        this.statusBar.name = 'WakaTime';
        this.statusBar.command = constants_1.COMMAND_DASHBOARD;
        this.statusBarTeamYou = vscode.window.createStatusBarItem('com.wakatime.teamyou', align, priority + 1);
        this.statusBarTeamYou.name = 'WakaTime Top dev';
        this.statusBarTeamOther = vscode.window.createStatusBarItem('com.wakatime.teamother', align, priority);
        this.statusBarTeamOther.name = 'WakaTime Team Total';
        const showStatusBar = this.config.get('wakatime.status_bar_enabled');
        this.showStatusBar = showStatusBar !== 'false';
        const showStatusBarTeam = this.config.get('wakatime.status_bar_team');
        this.showStatusBarTeam = showStatusBarTeam !== 'false';
        this.setStatusBarVisibility(this.showStatusBar);
        this.updateStatusBarText('WakaTime Initializing...');
        this.checkApiKey();
        this.setupEventListeners();
        this.logger.debug('WakaTime initialized.');
        const showCodingActivity = this.config.get('wakatime.status_bar_coding_activity');
        this.showCodingActivity = showCodingActivity !== 'false';
        this.updateStatusBarText();
        this.updateStatusBarTooltip('WakaTime: Initialized');
        this.getCodingActivity();
    }
    updateStatusBarText(text) {
        if (!this.statusBar)
            return;
        if (!text) {
            this.statusBar.text = '$(clock)';
        }
        else {
            this.statusBar.text = '$(clock) ' + text;
        }
    }
    updateStatusBarTooltip(tooltipText) {
        if (!this.statusBar)
            return;
        this.statusBar.tooltip = tooltipText;
    }
    updateTeamStatusBarTextForCurrentUser(text) {
        if (!this.statusBarTeamYou)
            return;
        if (!text) {
            this.statusBarTeamYou.text = '';
        }
        else {
            this.statusBarTeamYou.text = text;
        }
    }
    updateStatusBarTooltipForCurrentUser(tooltipText) {
        if (!this.statusBarTeamYou)
            return;
        this.statusBarTeamYou.tooltip = tooltipText;
    }
    updateTeamStatusBarTextForOther(text) {
        if (!this.statusBarTeamOther)
            return;
        if (!text) {
            this.statusBarTeamOther.text = '';
        }
        else {
            this.statusBarTeamOther.text = text;
        }
    }
    updateStatusBarTooltipForOther(tooltipText) {
        if (!this.statusBarTeamOther)
            return;
        this.statusBarTeamOther.tooltip = tooltipText;
    }
    statusBarShowingError() {
        if (!this.statusBar)
            return false;
        return this.statusBar.text.indexOf('Error') != -1;
    }
    promptForApiKey(hidden = true) {
        let defaultVal = this.config.get('wakatime.apiKey') || '';
        if (utils_1.Utils.apiKeyInvalid(defaultVal))
            defaultVal = '';
        const promptOptions = {
            prompt: 'WakaTime Api Key',
            placeHolder: 'Enter your api key from https://wakatime.com/api-key',
            value: defaultVal,
            ignoreFocusOut: true,
            password: hidden,
            validateInput: utils_1.Utils.apiKeyInvalid.bind(this),
        };
        vscode.window.showInputBox(promptOptions).then((val) => {
            if (val != undefined) {
                const invalid = utils_1.Utils.apiKeyInvalid(val);
                if (!invalid)
                    this.config.update('wakatime.apiKey', val);
                else
                    vscode.window.setStatusBarMessage(invalid);
            }
            else
                vscode.window.setStatusBarMessage('WakaTime api key not provided');
        });
    }
    promptForApiUrl() {
        const defaultVal = this.config.get('wakatime.apiUrl') || '';
        const promptOptions = {
            prompt: 'WakaTime Api Url (Defaults to https://api.wakatime.com/api/v1)',
            placeHolder: 'https://api.wakatime.com/api/v1',
            value: defaultVal,
            ignoreFocusOut: true,
        };
        vscode.window.showInputBox(promptOptions).then((val) => {
            if (val) {
                this.config.update('wakatime.apiUrl', val);
            }
        });
    }
    promptForDebug() {
        let defaultVal = this.config.get('wakatime.debug') || '';
        if (!defaultVal || defaultVal !== 'true')
            defaultVal = 'false';
        const items = ['true', 'false'];
        const promptOptions = {
            placeHolder: `true or false (current value \"${defaultVal}\")`,
            value: defaultVal,
            ignoreFocusOut: true,
        };
        vscode.window.showQuickPick(items, promptOptions).then((newVal) => {
            if (newVal == null)
                return;
            this.config.update('wakatime.debug', newVal);
            if (newVal === 'true') {
                this.logger.setLevel(constants_1.LogLevel.DEBUG);
                this.logger.debug('Debug enabled');
            }
            else {
                this.logger.setLevel(constants_1.LogLevel.INFO);
            }
        });
    }
    promptToDisable() {
        const previousValue = this.disabled;
        let currentVal = this.config.get('wakatime.disabled');
        if (!currentVal || currentVal !== 'true')
            currentVal = 'false';
        const items = ['disable', 'enable'];
        const helperText = currentVal === 'true' ? 'disabled' : 'enabled';
        const promptOptions = {
            placeHolder: `disable or enable (extension is currently "${helperText}")`,
            ignoreFocusOut: true,
        };
        vscode.window.showQuickPick(items, promptOptions).then((newVal) => {
            if (newVal !== 'enable' && newVal !== 'disable')
                return;
            this.disabled = newVal === 'disable';
            if (this.disabled != previousValue) {
                if (this.disabled) {
                    this.config.update('wakatime.disabled', 'true');
                    this.logger.debug('Extension disabled, will not report code stats to dashboard');
                    this.dispose();
                }
                else {
                    this.config.update('wakatime.disabled', 'false');
                    this.initializeDependencies();
                }
            }
        });
    }
    promptStatusBarIcon() {
        let defaultVal = this.config.get('wakatime.status_bar_enabled') || '';
        if (!defaultVal || defaultVal !== 'false')
            defaultVal = 'true';
        const items = ['true', 'false'];
        const promptOptions = {
            placeHolder: `true or false (current value \"${defaultVal}\")`,
            value: defaultVal,
            ignoreFocusOut: true,
        };
        vscode.window.showQuickPick(items, promptOptions).then((newVal) => {
            if (newVal !== 'true' && newVal !== 'false')
                return;
            this.config.update('wakatime.status_bar_enabled', newVal);
            this.showStatusBar = newVal === 'true';
            this.setStatusBarVisibility(this.showStatusBar);
        });
    }
    promptStatusBarCodingActivity() {
        let defaultVal = this.config.get('wakatime.status_bar_coding_activity') || '';
        if (!defaultVal || defaultVal !== 'false')
            defaultVal = 'true';
        const items = ['true', 'false'];
        const promptOptions = {
            placeHolder: `true or false (current value \"${defaultVal}\")`,
            value: defaultVal,
            ignoreFocusOut: true,
        };
        vscode.window.showQuickPick(items, promptOptions).then((newVal) => {
            if (newVal !== 'true' && newVal !== 'false')
                return;
            this.config.update('wakatime.status_bar_coding_activity', newVal);
            if (newVal === 'true') {
                this.logger.debug('Coding activity in status bar has been enabled');
                this.showCodingActivity = true;
                this.getCodingActivity();
            }
            else {
                this.logger.debug('Coding activity in status bar has been disabled');
                this.showCodingActivity = false;
                if (!this.statusBarShowingError()) {
                    this.updateStatusBarText();
                }
            }
        });
    }
    openDashboardWebsite() {
        const apiUrl = this.getApiUrl();
        const dashboardUrl = utils_1.Utils.apiUrlToDashboardUrl(apiUrl);
        vscode.env.openExternal(vscode.Uri.parse(dashboardUrl));
    }
    checkApiKey() {
        this.hasApiKey((hasApiKey) => {
            if (!hasApiKey)
                this.promptForApiKey();
        });
    }
    hasApiKey(callback) {
        const apiKey = this.config.get('wakatime.apiKey') || '';
        callback(!utils_1.Utils.apiKeyInvalid(apiKey));
    }
    getStatusBarAlignment() {
        var _a;
        const align = (_a = this.config.get('wakatime.align')) !== null && _a !== void 0 ? _a : '';
        switch (align) {
            case 'left':
                return vscode.StatusBarAlignment.Left;
            case 'right':
                return vscode.StatusBarAlignment.Right;
            default:
                return vscode.StatusBarAlignment.Left;
        }
    }
    getStatusBarPriority() {
        const priority = this.config.get('wakatime.alignPriority');
        return typeof priority === 'number' ? priority : 1;
    }
    setStatusBarVisibility(isVisible) {
        var _a, _b, _c, _d, _f, _g;
        if (isVisible) {
            (_a = this.statusBar) === null || _a === void 0 ? void 0 : _a.show();
            (_b = this.statusBarTeamYou) === null || _b === void 0 ? void 0 : _b.show();
            (_c = this.statusBarTeamOther) === null || _c === void 0 ? void 0 : _c.show();
            this.logger.debug('Status bar icon enabled.');
        }
        else {
            (_d = this.statusBar) === null || _d === void 0 ? void 0 : _d.hide();
            (_f = this.statusBarTeamYou) === null || _f === void 0 ? void 0 : _f.hide();
            (_g = this.statusBarTeamOther) === null || _g === void 0 ? void 0 : _g.hide();
            this.logger.debug('Status bar icon disabled.');
        }
    }
    setupEventListeners() {
        const subscriptions = [];
        vscode.window.onDidChangeTextEditorSelection(this.onChangeSelection, this, subscriptions);
        vscode.workspace.onDidChangeTextDocument(this.onChangeTextDocument, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this.onChangeTab, this, subscriptions);
        vscode.window.tabGroups.onDidChangeTabs(this.onDidChangeTabs, this, subscriptions);
        vscode.workspace.onDidSaveTextDocument(this.onSave, this, subscriptions);
        vscode.workspace.onDidChangeNotebookDocument(this.onChangeNotebook, this, subscriptions);
        vscode.workspace.onDidSaveNotebookDocument(this.onSaveNotebook, this, subscriptions);
        vscode.tasks.onDidStartTask(this.onDidStartTask, this, subscriptions);
        vscode.tasks.onDidEndTask(this.onDidEndTask, this, subscriptions);
        vscode.debug.onDidChangeActiveDebugSession(this.onDebuggingChanged, this, subscriptions);
        vscode.debug.onDidChangeBreakpoints(this.onDebuggingChanged, this, subscriptions);
        vscode.debug.onDidStartDebugSession(this.onDidStartDebugSession, this, subscriptions);
        vscode.debug.onDidTerminateDebugSession(this.onDidTerminateDebugSession, this, subscriptions);
        this.disposable = vscode.Disposable.from(...subscriptions);
    }
    onDebuggingChanged() {
        this.logger.debug('onDebuggingChanged');
        this.updateLineNumbers();
        this.onEvent(false);
    }
    onDidStartDebugSession() {
        this.logger.debug('onDidStartDebugSession');
        this.isDebugging = true;
        this.isAICodeGenerating = false;
        this.updateLineNumbers();
        this.onEvent(false);
    }
    onDidTerminateDebugSession() {
        this.logger.debug('onDidTerminateDebugSession');
        this.isDebugging = false;
        this.updateLineNumbers();
        this.onEvent(false);
    }
    onDidStartTask(e) {
        this.logger.debug('onDidStartTask');
        if (e.execution.task.isBackground)
            return;
        if (e.execution.task.detail && e.execution.task.detail.indexOf('watch') !== -1)
            return;
        this.isCompiling = true;
        this.isAICodeGenerating = false;
        this.updateLineNumbers();
        this.onEvent(false);
    }
    onDidEndTask() {
        this.logger.debug('onDidEndTask');
        this.isCompiling = false;
        this.updateLineNumbers();
        this.onEvent(false);
    }
    onChangeSelection(e) {
        this.logger.debug('onChangeSelection');
        if (e.kind === vscode.TextEditorSelectionChangeKind.Command)
            return;
        this.updateLineNumbers();
        this.onEvent(false);
    }
    onChangeTextDocument(e) {
        var _a;
        this.logger.debug('onChangeTextDocument');
        if (utils_1.Utils.isAIChatSidebar((_a = e.document) === null || _a === void 0 ? void 0 : _a.uri)) {
            this.isAICodeGenerating = true;
            this.AIdebounceCount = 0;
        }
        else if (utils_1.Utils.isPossibleAICodeInsert(e)) {
            const now = Date.now();
            if (this.recentlyAIPasted(now) && this.hasAICapabilities) {
                this.isAICodeGenerating = true;
                this.AIdebounceCount = 0;
            }
            this.AIrecentPastes.push(now);
        }
        else if (utils_1.Utils.isPossibleHumanCodeInsert(e)) {
            this.AIrecentPastes = [];
            if (this.isAICodeGenerating) {
                this.AIdebounceCount++;
                clearTimeout(this.AIDebounceId);
                this.AIDebounceId = setTimeout(() => {
                    if (this.AIdebounceCount > 1) {
                        this.isAICodeGenerating = false;
                    }
                }, this.AIdebounceMs);
            }
        }
        else if (this.isAICodeGenerating) {
            this.AIdebounceCount = 0;
            clearTimeout(this.AIDebounceId);
            this.updateLineNumbers();
        }
        if (!this.isAICodeGenerating)
            return;
        this.onEvent(false);
    }
    onChangeTab(_e) {
        this.logger.debug('onChangeTab');
        this.isAICodeGenerating = false;
        this.updateLineNumbers();
        this.onEvent(false);
    }
    onDidChangeTabs(_e) {
        this.logger.debug('onDidChangeTabs');
        if (!this.isAICodeGenerating)
            return;
        this.updateLineNumbers();
        this.onEvent(false);
    }
    onSave(_e) {
        this.logger.debug('onSave');
        this.isAICodeGenerating = false;
        this.updateLineNumbers();
        this.onEvent(true);
    }
    onChangeNotebook(_e) {
        this.logger.debug('onChangeNotebook');
        this.updateLineNumbers();
        this.onEvent(false);
    }
    onSaveNotebook(_e) {
        this.logger.debug('onSaveNotebook');
        this.updateLineNumbers();
        this.onEvent(true);
    }
    updateLineNumbers() {
        var _a, _b, _c;
        const doc = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
        if (!doc)
            return;
        const file = utils_1.Utils.getFocusedFile(doc);
        if (!file)
            return;
        const current = doc.lineCount;
        if (this.linesInFiles[file] === undefined) {
            this.linesInFiles[file] = current;
        }
        const prev = (_b = this.linesInFiles[file]) !== null && _b !== void 0 ? _b : current;
        const delta = current - prev;
        const changes = this.isAICodeGenerating ? this.lineChanges.ai : this.lineChanges.human;
        changes[file] = ((_c = changes[file]) !== null && _c !== void 0 ? _c : 0) + delta;
        this.linesInFiles[file] = current;
    }
    onEvent(isWrite) {
        if (Date.now() - this.lastSent > constants_1.SEND_BUFFER_SECONDS * 1000) {
            this.sendHeartbeats();
        }
        clearTimeout(this.debounceId);
        this.debounceId = setTimeout(() => {
            if (this.disabled)
                return;
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const doc = editor.document;
                if (doc) {
                    const file = utils_1.Utils.getFocusedFile(doc);
                    if (!file) {
                        return;
                    }
                    if (this.currentlyFocusedFile !== file) {
                        this.updateTeamStatusBarFromJson();
                        this.updateTeamStatusBar(doc);
                    }
                    const time = Date.now();
                    if (isWrite ||
                        utils_1.Utils.enoughTimePassed(this.lastHeartbeat, time) ||
                        this.lastFile !== file ||
                        this.lastDebug !== this.isDebugging ||
                        this.lastCompile !== this.isCompiling ||
                        this.lastAICodeGenerating !== this.isAICodeGenerating) {
                        this.appendHeartbeat(doc, time, editor.selection.start, isWrite, this.isCompiling, this.isDebugging, this.isAICodeGenerating);
                        this.lastFile = file;
                        this.lastHeartbeat = time;
                        this.lastDebug = this.isDebugging;
                        this.lastCompile = this.isCompiling;
                        this.lastAICodeGenerating = this.isAICodeGenerating;
                    }
                }
            }
        }, this.debounceMs);
    }
    appendHeartbeat(doc, time, selection, isWrite, isCompiling, isDebugging, isAICoding) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const file = utils_1.Utils.getFocusedFile(doc);
            if (!file)
                return;
            if (isWrite && this.isDuplicateHeartbeat(file, time, selection))
                return;
            const now = Date.now();
            const heartbeat = {
                entity: file,
                time: now / 1000,
                is_write: isWrite,
                lineno: selection.line + 1,
                cursorpos: selection.character + 1,
                lines_in_file: doc.lineCount,
            };
            this.lineChanges = { ai: {}, human: {} };
            if (isDebugging) {
                heartbeat.category = 'debugging';
            }
            else if (isCompiling) {
                heartbeat.category = 'building';
            }
            else if (isAICoding) {
                heartbeat.category = 'ai coding';
            }
            else if (utils_1.Utils.isPullRequest(doc.uri)) {
                heartbeat.category = 'code reviewing';
            }
            if (heartbeat.ai_line_changes) {
                heartbeat.ai_line_changes = this.lineChanges.ai[file];
            }
            if (heartbeat.human_line_changes) {
                heartbeat.human_line_changes = this.lineChanges.human[file];
            }
            const project = this.getProjectName();
            if (project)
                heartbeat.alternate_project = project;
            const folder = this.getProjectFolder(doc.uri);
            if (folder && file.indexOf(folder) === 0) {
                heartbeat.project_root_count = this.countSlashesInPath(folder);
            }
            const language = this.getLanguage(doc);
            if (language)
                heartbeat.language = language;
            if (doc.isUntitled)
                heartbeat.is_unsaved_entity = true;
            this.logger.debug(`Appending heartbeat to local buffer: ${JSON.stringify(heartbeat, null, 2)}`);
            this.heartbeats.push(heartbeat);
            if (now - this.lastSent > constants_1.SEND_BUFFER_SECONDS * 1000) {
                yield this.sendHeartbeats();
            }
        });
    }
    sendHeartbeats() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.hasApiKey((hasApiKey) => {
                if (hasApiKey) {
                    this._sendHeartbeats();
                }
                else {
                    this.promptForApiKey();
                }
            });
        });
    }
    _sendHeartbeats() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.heartbeats.length === 0)
                return;
            this.lastSent = Date.now();
            const plugin = this.getPlugin();
            const payload = JSON.stringify(this.heartbeats.map((h) => {
                return Object.assign({ type: 'file', plugin }, h);
            }));
            this.heartbeats = [];
            this.logger.debug(`Sending heartbeats to API: ${JSON.stringify(payload)}`);
            const apiKey = this.config.get('wakatime.apiKey');
            const apiUrl = this.getApiUrl();
            const url = `${apiUrl}/users/current/heartbeats.bulk?api_key=${apiKey}`;
            try {
                const response = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Machine-Name': vscode.env.appHost,
                    },
                    body: JSON.stringify(payload),
                });
                const parsedJSON = yield response.json();
                if (response.status == 200 || response.status == 201 || response.status == 202) {
                    if (this.showStatusBar)
                        this.getCodingActivity();
                }
                else {
                    this.logger.warn(`API Error ${response.status}: ${parsedJSON}`);
                    if (response && response.status == 401) {
                        const error_msg = 'Invalid WakaTime Api Key';
                        if (this.showStatusBar) {
                            this.updateStatusBarText('WakaTime Error');
                            this.updateStatusBarTooltip(`WakaTime: ${error_msg}`);
                        }
                        this.logger.error(error_msg);
                        const now = Date.now();
                        if (this.lastApiKeyPrompted < now - 86400000) {
                            this.promptForApiKey(false);
                            this.lastApiKeyPrompted = now;
                        }
                    }
                    else {
                        const error_msg = `Error sending heartbeats (${response.status}); Check your browser console for more details.`;
                        if (this.showStatusBar) {
                            this.updateStatusBarText('WakaTime Error');
                            this.updateStatusBarTooltip(`WakaTime: ${error_msg}`);
                        }
                        this.logger.error(error_msg);
                    }
                }
            }
            catch (ex) {
                this.logger.warn(`API Error: ${ex}`);
                const error_msg = `Error sending heartbeats; Check your browser console for more details.`;
                if (this.showStatusBar) {
                    this.updateStatusBarText('WakaTime Error');
                    this.updateStatusBarTooltip(`WakaTime: ${error_msg}`);
                }
                this.logger.error(error_msg);
            }
        });
    }
    getCodingActivity() {
        if (!this.showStatusBar)
            return;
        const cutoff = Date.now() - this.fetchTodayInterval;
        if (this.lastFetchToday > cutoff)
            return;
        this.lastFetchToday = Date.now();
        this.hasApiKey((hasApiKey) => {
            if (!hasApiKey)
                return;
            this._getCodingActivity();
        });
    }
    _getCodingActivity() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Fetching coding activity for Today from api.');
            const apiKey = this.config.get('wakatime.apiKey');
            const apiUrl = this.getApiUrl();
            const url = `${apiUrl}/users/current/statusbar/today?api_key=${apiKey}`;
            try {
                const response = yield fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': this.agentName + '/' + vscode.version + ' vscode-wakatime/' + this.extension.version,
                    },
                });
                const parsedJSON = yield response.json();
                if (response.status == 200) {
                    this.config.get('wakatime.status_bar_coding_activity');
                    if (this.showStatusBar) {
                        if (parsedJSON.data)
                            this.hasTeamFeatures = parsedJSON.data.has_team_features;
                        let output = parsedJSON.data.grand_total.text;
                        if (this.config.get('wakatime.status_bar_hide_categories') != 'true' &&
                            parsedJSON.data.categories.length > 1) {
                            output = parsedJSON.data.categories.map((x) => x.text + ' ' + x.name).join(', ');
                        }
                        if (output && output.trim()) {
                            if (this.showCodingActivity) {
                                this.updateStatusBarText(output.trim());
                                this.updateStatusBarTooltip('WakaTime: Today’s coding time. Click to visit dashboard.');
                            }
                            else {
                                this.updateStatusBarText();
                                this.updateStatusBarTooltip(output.trim());
                            }
                        }
                        else {
                            this.updateStatusBarText();
                            this.updateStatusBarTooltip('WakaTime: Calculating time spent today in background...');
                        }
                        this.updateTeamStatusBar();
                    }
                }
                else {
                    this.logger.warn(`API Error ${response.status}: ${parsedJSON}`);
                    if (response && response.status == 401) {
                        const error_msg = 'Invalid WakaTime Api Key';
                        if (this.showStatusBar) {
                            this.updateStatusBarText('WakaTime Error');
                            this.updateStatusBarTooltip(`WakaTime: ${error_msg}`);
                        }
                        this.logger.error(error_msg);
                    }
                    else {
                        const error_msg = `Error fetching code stats for status bar (${response.status}); Check your browser console for more details.`;
                        this.logger.debug(error_msg);
                    }
                }
            }
            catch (ex) {
                this.logger.warn(`API Error: ${ex}`);
            }
        });
    }
    updateTeamStatusBar(doc) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.showStatusBarTeam)
                return;
            if (!this.hasTeamFeatures)
                return;
            if (!doc) {
                doc = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
                if (!doc)
                    return;
            }
            const file = utils_1.Utils.getFocusedFile(doc);
            if (!file) {
                return;
            }
            this.currentlyFocusedFile = file;
            if (this.teamDevsForFileCache[file]) {
                this.updateTeamStatusBarFromJson(this.teamDevsForFileCache[file]);
                return;
            }
            this.logger.debug('Fetching devs for currently focused file from api.');
            const apiKey = this.config.get('wakatime.apiKey');
            const apiUrl = this.getApiUrl();
            const url = `${apiUrl}/users/current/file_experts?api_key=${apiKey}`;
            const payload = {
                entity: file,
                plugin: this.agentName + '/' + vscode.version + ' vscode-wakatime/' + this.extension.version,
            };
            const project = this.getProjectName();
            if (!project)
                return;
            payload['project'] = project;
            const folder = this.getProjectFolder(doc.uri);
            if (!folder || file.indexOf(folder) !== 0)
                return;
            payload['project_root_count'] = this.countSlashesInPath(folder);
            try {
                const response = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': this.agentName + '/' + vscode.version + ' vscode-wakatime/' + this.extension.version,
                    },
                    body: JSON.stringify(payload),
                });
                const parsedJSON = yield response.json();
                if (response.status == 200) {
                    const devs = {
                        you: null,
                        other: null,
                    };
                    if (parsedJSON.data) {
                        const currentUser = parsedJSON.data.find((dev) => dev.user.is_current_user);
                        let topDev = parsedJSON.data[0];
                        if (topDev.user.is_current_user) {
                            if (parsedJSON.data.length > 1) {
                                topDev = parsedJSON.data[1];
                            }
                            else {
                                topDev = null;
                            }
                        }
                        devs.you = currentUser;
                        devs.other = topDev;
                        this.teamDevsForFileCache[file] = devs;
                    }
                    if (file !== this.currentlyFocusedFile)
                        return;
                    this.config.get('wakatime.status_bar_coding_activity');
                    if (this.showStatusBar) {
                        this.updateTeamStatusBarFromJson(devs);
                    }
                }
                else {
                    this.updateTeamStatusBarTextForCurrentUser();
                    this.updateTeamStatusBarTextForOther();
                    this.logger.warn(`API Error ${response.status}: ${parsedJSON}`);
                    if (response && response.status == 401) {
                        this.logger.error('Invalid WakaTime Api Key');
                    }
                    else {
                        const error_msg = `Error fetching devs for currently focused file (${response.status}); Check your browser console for more details.`;
                        this.logger.debug(error_msg);
                    }
                }
            }
            catch (ex) {
                this.logger.warn(`API Error: ${ex}`);
            }
        });
    }
    updateTeamStatusBarFromJson(jsonData) {
        if (!jsonData) {
            this.updateTeamStatusBarTextForCurrentUser();
            this.updateTeamStatusBarTextForOther();
            return;
        }
        const you = jsonData.you;
        const other = jsonData.other;
        if (you) {
            this.updateTeamStatusBarTextForCurrentUser('You: ' + you.total.text);
            this.updateStatusBarTooltipForCurrentUser('Your total time spent in this file');
        }
        else {
            this.updateTeamStatusBarTextForCurrentUser();
        }
        if (other) {
            this.updateTeamStatusBarTextForOther(other.user.name + ': ' + other.total.text);
            this.updateStatusBarTooltipForOther(other.user.long_name + '’s total time spent in this file');
        }
        else {
            this.updateTeamStatusBarTextForOther();
        }
    }
    recentlyAIPasted(time) {
        this.AIrecentPastes = this.AIrecentPastes.filter((x) => x + constants_1.AI_RECENT_PASTES_TIME_MS >= time);
        return this.AIrecentPastes.length > 3;
    }
    isDuplicateHeartbeat(file, time, selection) {
        let duplicate = false;
        const minutes = 30;
        const milliseconds = minutes * 60000;
        if (this.dedupe[file] &&
            this.dedupe[file].lastHeartbeatAt + milliseconds < time &&
            this.dedupe[file].selection.line == selection.line &&
            this.dedupe[file].selection.character == selection.character) {
            duplicate = true;
        }
        this.dedupe[file] = {
            selection: selection,
            lastHeartbeatAt: time,
        };
        return duplicate;
    }
    getLanguage(doc) {
        return doc.languageId || '';
    }
    getProjectName() {
        return vscode.workspace.name || '';
    }
    getProjectFolder(uri) {
        if (!vscode.workspace)
            return '';
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (workspaceFolder) {
            try {
                return workspaceFolder.uri.fsPath;
            }
            catch (e) { }
        }
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length) {
            return vscode.workspace.workspaceFolders[0].uri.fsPath;
        }
        return '';
    }
    getPlugin() {
        const agent = `${this.agentName}/${vscode.version} vscode-wakatime/${this.extension.version}`;
        const os = this.getOperatingSystem();
        if (os)
            return `(${os}) ${agent}`;
        return agent;
    }
    getOperatingSystem() {
        if (navigator.userAgentData && navigator.userAgentData.platform) {
            const platform = navigator.userAgentData.platform;
            if (platform.toLowerCase().indexOf('mac') != -1)
                return 'Mac';
            if (platform.toLowerCase().indexOf('win') != -1)
                return 'Windows';
            if (platform.toLowerCase().indexOf('linux') != -1)
                return 'Linux';
            if (platform.toLowerCase().indexOf('unix') != -1)
                return 'Unix';
            if (platform.toLowerCase().indexOf('android') != -1)
                return 'Android';
            return platform;
        }
        if (navigator.platform) {
            const platform = navigator.platform;
            if (navigator.userAgent && navigator.userAgent.toLowerCase().indexOf('android') != -1)
                return 'Android';
            if (platform.toLowerCase().indexOf('mac') != -1)
                return 'Mac';
            if (platform.toLowerCase().indexOf('win') != -1)
                return 'Windows';
            if (platform.toLowerCase().indexOf('linux') != -1)
                return 'Linux';
            if (platform.toLowerCase().indexOf('unix') != -1)
                return 'Unix';
            if (platform.toLowerCase().indexOf('android') != -1)
                return 'Android';
            return platform;
        }
        return null;
    }
    getApiUrl() {
        let apiUrl = this.config.get('wakatime.apiUrl') || 'https://api.wakatime.com/api/v1';
        const suffixes = ['/', '.bulk', '/users/current/heartbeats', '/heartbeats', '/heartbeat'];
        for (const suffix of suffixes) {
            if (apiUrl.endsWith(suffix)) {
                apiUrl = apiUrl.slice(0, -suffix.length);
            }
        }
        return apiUrl;
    }
    countSlashesInPath(path) {
        if (!path)
            return 0;
        const windowsNetDrive = path.indexOf('\\\\') === 0;
        path = path.replace(/[\\/]+/, '/');
        if (windowsNetDrive) {
            path = '\\\\' + path.slice(1);
        }
        if (!path.endsWith('/'))
            path = path + '/';
        return (path.match(/\//g) || []).length;
    }
}
exports.WakaTime = WakaTime;


/***/ }),
/* 5 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __rewriteRelativeImportExtension: () => (/* binding */ __rewriteRelativeImportExtension),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownKeys = function(o) {
  ownKeys = Object.getOwnPropertyNames || function (o) {
    var ar = [];
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownKeys(o);
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
      });
  }
  return path;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esDecorate,
  __runInitializers,
  __propKey,
  __setFunctionName,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension,
});


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utils = void 0;
const vscode = __webpack_require__(1);
const constants_1 = __webpack_require__(2);
class Utils {
    static quote(str) {
        if (str.includes(' '))
            return `"${str.replace(/"/g, '\\"')}"`;
        return str;
    }
    static apiKeyInvalid(key) {
        const err = 'Invalid api key... check https://wakatime.com/api-key for your key';
        if (!key)
            return err;
        const re = new RegExp('^(waka_)?[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$', 'i');
        if (!re.test(key))
            return err;
        return '';
    }
    static validateApiUrl(url) {
        if (!url)
            return '';
        if (url.startsWith('http://') || url.startsWith('https://'))
            return url.trim();
        return '';
    }
    static validateProxy(proxy) {
        if (!proxy)
            return '';
        let re;
        if (proxy.indexOf('\\') === -1) {
            re = new RegExp('^((https?|socks5)://)?([^:@]+(:([^:@])+)?@)?[\\w\\.-]+(:\\d+)?$', 'i');
        }
        else {
            re = new RegExp('^.*\\\\.+$', 'i');
        }
        if (!re.test(proxy)) {
            const ipv6 = new RegExp('^((https?|socks5)://)?([^:@]+(:([^:@])+)?@)?(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(:\\d+)?$', 'i');
            if (!ipv6.test(proxy)) {
                return 'Invalid proxy. Valid formats are https://user:pass@host:port or socks5://user:pass@host:port or domain\\user:pass';
            }
        }
        return '';
    }
    static formatDate(date) {
        let months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        let ampm = 'AM';
        let hour = date.getHours();
        if (hour > 11) {
            ampm = 'PM';
            hour = hour - 12;
        }
        if (hour == 0) {
            hour = 12;
        }
        let minute = date.getMinutes();
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hour}:${minute < 10 ? `0${minute}` : minute} ${ampm}`;
    }
    static obfuscateKey(key) {
        let newKey = '';
        if (key) {
            newKey = key;
            if (key.length > 4)
                newKey = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX' + key.substring(key.length - 4);
        }
        return newKey;
    }
    static wrapArg(arg) {
        if (arg.indexOf(' ') > -1)
            return '"' + arg.replace(/"/g, '\\"') + '"';
        return arg;
    }
    static formatArguments(binary, args) {
        let clone = args.slice(0);
        clone.unshift(this.wrapArg(binary));
        let newCmds = [];
        let lastCmd = '';
        for (let i = 0; i < clone.length; i++) {
            if (lastCmd == '--key')
                newCmds.push(this.wrapArg(this.obfuscateKey(clone[i])));
            else
                newCmds.push(this.wrapArg(clone[i]));
            lastCmd = clone[i];
        }
        return newCmds.join(' ');
    }
    static isRemoteUri(uri) {
        if (!uri)
            return false;
        return uri.scheme === 'vscode-remote';
    }
    static apiUrlToDashboardUrl(url) {
        url = url
            .replace('://api.', '://')
            .replace('/api/v1', '')
            .replace(/^api\./, '')
            .replace('/api', '');
        return url;
    }
    static enoughTimePassed(lastHeartbeat, now) {
        return lastHeartbeat + constants_1.TIME_BETWEEN_HEARTBEATS_MS < now;
    }
    static isPullRequest(uri) {
        if (!uri)
            return false;
        return uri.scheme === 'pr';
    }
    static isAIChatSidebar(uri) {
        var _a, _b, _c;
        const activeTab = (_b = (_a = vscode.window.tabGroups) === null || _a === void 0 ? void 0 : _a.activeTabGroup) === null || _b === void 0 ? void 0 : _b.activeTab;
        const viewType = (_c = activeTab === null || activeTab === void 0 ? void 0 : activeTab.input) === null || _c === void 0 ? void 0 : _c.viewType;
        if ((viewType === null || viewType === void 0 ? void 0 : viewType.includes('claude')) && (activeTab === null || activeTab === void 0 ? void 0 : activeTab.label.toLowerCase().includes('claude'))) {
            return true;
        }
        if (!uri)
            return false;
        if (uri.fsPath.endsWith('.log'))
            return false;
        if (uri.scheme === 'vscode-chat-code-block')
            return true;
        if (uri.scheme === 'openai-codex')
            return true;
        return false;
    }
    static isPossibleAICodeInsert(e) {
        var _a;
        if (e.document.fileName.endsWith('.log'))
            return false;
        if (e.contentChanges.length !== 1)
            return false;
        const text = (_a = e.contentChanges) === null || _a === void 0 ? void 0 : _a[0].text.trim();
        if (text.length <= 2)
            return false;
        return (text.match(/[\n\r]/g) || []).length > 2 || text.length > 50;
    }
    static getFocusedFile(document) {
        var _a;
        const doc = document !== null && document !== void 0 ? document : (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
        if (doc) {
            const file = doc.fileName;
            if (Utils.isRemoteUri(doc.uri)) {
                return `${doc.uri.authority}${doc.uri.path}`.replace('ssh-remote+', 'ssh://');
            }
            return file;
        }
    }
    static isPossibleHumanCodeInsert(e) {
        var _a, _b, _c, _d;
        if (e.contentChanges.length !== 1)
            return false;
        if (((_a = e.contentChanges) === null || _a === void 0 ? void 0 : _a[0].text.trim().length) === 1 &&
            ((_b = e.contentChanges) === null || _b === void 0 ? void 0 : _b[0].text) !== '\n' &&
            ((_c = e.contentChanges) === null || _c === void 0 ? void 0 : _c[0].text) !== '\r')
            return true;
        if (((_d = e.contentChanges) === null || _d === void 0 ? void 0 : _d[0].text.length) === 0)
            return true;
        return false;
    }
    static getEditorName() {
        if (this.appNames[vscode.env.appName]) {
            return this.appNames[vscode.env.appName];
        }
        else if (vscode.env.appName.toLowerCase().includes('visual')) {
            return 'vscode';
        }
        else {
            return vscode.env.appName.replace(/\s/g, '').toLowerCase();
        }
    }
    static isAICapableEditor() {
        const editorName = vscode.env.appName.toLowerCase();
        return editorName.includes('kiro') || editorName.includes('windsurf');
    }
    static hasAIExtensions() {
        return constants_1.COMMON_AI_EXTENSIONS.some((assistant) => {
            if (assistant.transcriptLogGlobs.length > 0)
                return false;
            return assistant.extensionIds.some((id) => {
                const extension = vscode.extensions.getExtension(id);
                return extension && extension.isActive;
            });
        });
    }
    static checkAICapabilities() {
        return this.isAICapableEditor() || this.hasAIExtensions();
    }
    static buildUserAgentString(editorName, extensionVersion, aiName = undefined) {
        const ai = aiName ? ` ${aiName}` : '';
        return editorName + '/' + vscode.version + ai + ' vscode-wakatime/' + extensionVersion;
    }
    static withinSeconds(relativeTo, compareTo, withinSeconds) {
        return Math.abs(relativeTo - compareTo) <= withinSeconds;
    }
}
exports.Utils = Utils;
Utils.appNames = {
    'Arduino IDE': 'arduino',
    'Azure Data Studio': 'azdata',
    Cursor: 'cursor',
    Kiro: 'kiro',
    Onivim: 'onivim',
    'Onivim 2': 'onivim',
    'SQL Operations Studio': 'sqlops',
    Trae: 'trae',
    'Visual Studio Code': 'vscode',
    Windsurf: 'windsurf',
};


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __webpack_require__(1);
const constants_1 = __webpack_require__(2);
const logger_1 = __webpack_require__(3);
const wakatime_1 = __webpack_require__(4);
var logger = new logger_1.Logger(constants_1.LogLevel.INFO);
var wakatime;
function activate(ctx) {
    var _a;
    wakatime = new wakatime_1.WakaTime(logger, ctx.globalState);
    (_a = ctx.globalState) === null || _a === void 0 ? void 0 : _a.setKeysForSync(['wakatime.apiKey']);
    ctx.subscriptions.push(vscode.commands.registerCommand(constants_1.COMMAND_API_KEY, function () {
        wakatime.promptForApiKey();
    }));
    ctx.subscriptions.push(vscode.commands.registerCommand(constants_1.COMMAND_API_URL, function () {
        wakatime.promptForApiUrl();
    }));
    ctx.subscriptions.push(vscode.commands.registerCommand(constants_1.COMMAND_DEBUG, function () {
        wakatime.promptForDebug();
    }));
    ctx.subscriptions.push(vscode.commands.registerCommand(constants_1.COMMAND_DISABLE, function () {
        wakatime.promptToDisable();
    }));
    ctx.subscriptions.push(vscode.commands.registerCommand(constants_1.COMMAND_STATUS_BAR_ENABLED, function () {
        wakatime.promptStatusBarIcon();
    }));
    ctx.subscriptions.push(vscode.commands.registerCommand(constants_1.COMMAND_STATUS_BAR_CODING_ACTIVITY, function () {
        wakatime.promptStatusBarCodingActivity();
    }));
    ctx.subscriptions.push(vscode.commands.registerCommand(constants_1.COMMAND_DASHBOARD, function () {
        wakatime.openDashboardWebsite();
    }));
    ctx.subscriptions.push(wakatime);
    wakatime.initialize();
}
function deactivate() {
    wakatime.dispose();
}

})();

var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=extension.js.map