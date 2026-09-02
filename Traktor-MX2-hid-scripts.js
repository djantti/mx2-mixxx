// Native Instruments Traktor MX2 HID controller script for Mixxx 2.6
// ------------------------------------------------------------------
// Based on Mixxx's official Traktor MX2, S2 MK1 and S4 MK3 scripts
// Created by djantti

const LedOff = 0x00;

// Used by single color LEDs
const LedDim = 0x7c;
const LedFull = 0x7e;

// Dim colors are color - 2 (e.g. dim green = 0x1c)
const LedColors = {
    red: 0x06,
    carrot: 0x0a,
    orange: 0x0e,
    honey: 0x12,
    yellow: 0x16,
    lime: 0x1a,
    green: 0x1e,
    aqua: 0x22,
    celeste: 0x26,
    sky: 0x2a,
    blue: 0x2e,
    purple: 0x32,
    fuscia: 0x36,
    magenta: 0x3a,
    azalea: 0x3e,
    salmon: 0x42,
    white: 0x4a,
};

const PadColors = {
    0xcc0000: LedColors.red,
    0xcc5e00: LedColors.carrot,
    0xcc7800: LedColors.orange,
    0xcc9200: LedColors.honey,
    0xcccc00: LedColors.yellow,
    0x81cc00: LedColors.lime,
    0x00cc00: LedColors.green,
    0x00cc49: LedColors.aqua,
    0x00cccc: LedColors.celeste,
    0x0091cc: LedColors.sky,
    0x0000cc: LedColors.blue,
    0xcc00cc: LedColors.purple,
    0xad65ff: LedColors.fuscia,
    0xcc0079: LedColors.magenta,
    0xcc477e: LedColors.azalea,
    0xcc4761: LedColors.salmon,
    0xcccccc: LedColors.white,
};

const DefaultTheme = {
    // Effect focus and effect toggle buttons
    focusColor: LedColors.white,
    effectColor: LedColors.orange,

    // Library function buttons
    libraryColor: LedColors.white,

    // Jogwheel side mode buttons
    transportColor: LedColors.red,
    jogModeColor: LedColors.blue,

    // Cue and play buttons
    cueColor: LedColors.blue,
    playColor: LedColors.green,

    // Keylock button
    keylockColor: LedColors.yellow,

    // Pad mode select buttons
    inactivePadModeColor: LedColors.sky,
    activePadModeColor: LedColors.celeste,

    // Inactive pad buttons
    unconnectedPadColor: LedColors.white,

    // Inactive pad buttons
    inactivePadColor: LedColors.white,

    // Active pad buttons
    activePadColor: LedColors.green,

    // Alternate function pad buttons
    altPadColor: LedColors.orange,

    // Sync button
    syncColor: LedColors.magenta,

    // FX button color
    fxColor: LedColors.white,

    // Headphone and talkback buttons
    pflColor: LedColors.white,
    micColor: LedColors.white
};

const FrostbiteTheme = {
    focusColor: LedColors.white,
    effectColor: LedColors.purple,
    libraryColor: LedColors.white,
    transportColor: LedColors.celeste,
    jogModeColor: LedColors.sky,
    cueColor: LedColors.celeste,
    playColor: LedColors.sky,
    keylockColor: LedColors.sky,
    inactivePadModeColor: LedColors.sky,
    activePadModeColor: LedColors.celeste,
    unconnectedPadColor: LedColors.white,
    inactivePadColor: LedColors.celeste,
    activePadColor: LedColors.sky,
    altPadColor: LedColors.purple,
    syncColor: LedColors.celeste,
    fxColor: LedColors.white,
    pflColor: LedColors.celeste,
    micColor: LedColors.white
};

const MojitoTheme = {
    focusColor: LedColors.lime,
    effectColor: LedColors.honey,
    libraryColor: LedColors.lime,
    transportColor: LedColors.sky,
    jogModeColor: LedColors.lime,
    cueColor: LedColors.lime,
    playColor: LedColors.sky,
    keylockColor: LedColors.lime,
    inactivePadModeColor: LedColors.sky,
    activePadModeColor: LedColors.lime,
    unconnectedPadColor: LedColors.white,
    inactivePadColor: LedColors.lime,
    activePadColor: LedColors.sky,
    altPadColor: LedColors.honey,
    syncColor: LedColors.lime,
    fxColor: LedColors.white,
    pflColor: LedColors.lime,
    micColor: LedColors.sky
};

const SynthwaveTheme = {
    focusColor: LedColors.magenta,
    effectColor: LedColors.orange,
    libraryColor: LedColors.purple,
    transportColor: LedColors.purple,
    jogModeColor: LedColors.magenta,
    cueColor: LedColors.sky,
    playColor: LedColors.magenta,
    keylockColor: LedColors.sky,
    inactivePadModeColor: LedColors.magenta,
    activePadModeColor: LedColors.sky,
    unconnectedPadColor: LedColors.white,
    inactivePadColor: LedColors.sky,
    activePadColor: LedColors.orange,
    altPadColor: LedColors.magenta,
    syncColor: LedColors.sky,
    fxColor: LedColors.white,
    pflColor: LedColors.magenta,
    micColor: LedColors.sky
};

const ColorThemes = {
    Default: DefaultTheme,
    Frostbite: FrostbiteTheme,
    Mojito: MojitoTheme,
    Synthwave: SynthwaveTheme
};

const Settings = {
    // Selected color theme
    colorTheme: engine.getSetting("colorTheme") || "Default",

    // Use on-screen stem and hotcue colors for pad LEDs (default: true)
    matchPadColors: !!engine.getSetting("matchPadColors"),

    // Use bright LEDs for VU meter (default: true)
    brightMeterSegments: !!engine.getSetting("brightMeterSegments"),

    // Enable bottom LED lighting effects (default: true)
    enableBottomLeds: !!engine.getSetting("enableBottomLeds"),

    // Bottom panel LED colors
    bottomLedsStandbyColor: LedColors[engine.getSetting("bottomLedsStandbyColor")] || LedColors.white,
    bottomLedsPlayColor: LedColors[engine.getSetting("bottomLedsPlayColor")] || LedColors.sky,
    bottomLedsLoopColor: LedColors[engine.getSetting("bottomLedsLoopColor")] || LedColors.green,
    bottomLedsEndColor: LedColors[engine.getSetting("bottomLedsEndColor")] || LedColors.red,

    // Quick FX button colors
    qfxColors: [
        LedColors[engine.getSetting("qfxColor1")] || LedColors.red,
        LedColors[engine.getSetting("qfxColor2")] || LedColors.green,
        LedColors[engine.getSetting("qfxColor3")] || LedColors.blue,
        LedColors[engine.getSetting("qfxColor4")] || LedColors.yellow,
        LedColors[engine.getSetting("qfxColor5")] || LedColors.orange
    ],

    // Quick FX button presets
    qfxPresets: [
        engine.getSetting("qfxPreset1") || 1,
        engine.getSetting("qfxPreset2") || 2,
        engine.getSetting("qfxPreset3") || 3,
        engine.getSetting("qfxPreset4") || 4,
        engine.getSetting("qfxPreset5") || 11,
    ],

    // Jogging and nudging sensitivity
    jogWheelSensitivity: Number(engine.getSetting("jogWheelSensivity")) || 0.5,

    // Low-pass filter coefficient for jog wheel input
    jogWheelAlpha: Number(engine.getSetting("jogWheelAlpha")) || 0.5,

    // Dead zone threshold for jog wheel input
    jogWheelEpsilon: Number(engine.getSetting("jogWheelEpsilon")) || 1e-6,

    // Snap rate faders to mid point
    rateFaderSnap: Number(engine.getSetting("rateFaderSnap")) || 0,

    // Use soft takeover for knobs and faders (default: true)
    softTakeover: !!engine.getSetting("softTakeover"),

    // Route audio through master gain knob (default: false)
    enableMasterGain: !!engine.getSetting("masterGain")
};

class Mixer {
    constructor(parent) {
        this.mx2 = parent;
        this.controller = this.mx2.controller;

        this.groups = {
            "crossfader": "[Master]",
            "gain": "[Master]",
            "headMix": "[Master]",
            "headGain": "[Master]",
            "talkover": "[Microphone]",
            "peak_indicator": "[Main]"
        };

        this.outputColorMap = this.mx2.outputColorMap;

        this.talkoverPressedTimer = 0;

        this.qfxPressed = 0;
        this.qfxActive = 0;
        this.qfxIgnore = false;

        this.fxPresetButtons = [
            new FxPresetButton(this, 1),
            new FxPresetButton(this, 2),
            new FxPresetButton(this, 3),
            new FxPresetButton(this, 4),
            new FxPresetButton(this, 5)
        ];
    }

    registerInputs(config) {
        for (let i = 0; i < 5; i++) {
            this.fxPresetButtons[i].registerInputs(config.fxPresetButtons[i]);
        }

        this.registerButton("talkover", config.micButton, this.talkoverHandler);

        this.registerScalar("gain", config.gainKnob, this.gainHandler);
        this.registerScalar("headMix", config.mixKnob, this.scalarHandler);
        this.registerScalar("headGain", config.volKnob, this.scalarHandler);
        this.registerScalar("crossfader", config.crossfader, this.scalarHandler);
    }

    registerOutputs(config) {
        for (let i = 0; i < 5; i++) {
            this.fxPresetButtons[i].registerOutputs(config.fxPresetButtons[i]);
        }

        this.registerLed("talkover", config.micButton);
        this.registerLed("peak_indicator", config.peakIndicator);
    }

    linkOutputs() {
        for (let i = 0; i < 5; i++) {
            this.fxPresetButtons[i].linkOutputs();
        }

        engine.makeConnection(this.groups.talkover, "talkover", this.talkoverCallback.bind(this)).trigger();
        engine.makeConnection(this.groups.peak_indicator, "peak_indicator", this.peakIndicatorCallback.bind(this));
    }

    enableSoftTakeover() {
        engine.softTakeover(this.groups.gain, "gain", true);
        engine.softTakeover(this.groups.headMix, "headMix", true);
        engine.softTakeover(this.groups.headGain, "headGain", true);
        engine.softTakeover(this.groups.crossfader, "crossfader", true);
    }

    enableOutputs() {
        for (let i = 0; i < 5; i++) {
            this.fxPresetButtons[i].enableOutputs();
        }
    }

    disableOutputs() {
        for (let i = 0; i < 5; i++) {
            this.fxPresetButtons[i].disableOutputs();
        }

        this.controller.setOutput(this.groups.talkover, "talkover", LedOff, false);
        this.controller.setOutput(this.groups.peak_indicator, "peak_indicator", LedOff, false);
    }

    registerButton(name, config, callback) {
        if (callback !== undefined) {
            callback = callback.bind(this);
        }

        if (!config) {
            throw new Error(`Config object not found for '${ name }'`);
        }

        config.hidReport.addControl(this.resolveGroup(name), name, config.offset, "B", config.mask, false, callback);
    }

    registerScalar(name, config, callback) {
        if (callback !== undefined) {
            callback = callback.bind(this);
        }

        if (!config) {
            throw new Error(`Config object not found for '${ name }'`);
        }

        config.hidReport.addControl(this.resolveGroup(name), name, config.offset, "H", 0xffff, false, callback);
    }

    registerLed(name, config) {
        if (!config) {
            throw new Error(`Config object not found for '${ name }'`);
        }

        config.hidReport.addOutput(this.resolveGroup(name), name, config.offset, "B");
    }

    resolveGroup(name) {
        const group = this.groups?.[name];

        if (!group) {
            throw new Error(`Group definition not found for '${ name }'`);
        }

        return group;
    }

    talkoverHandler(field) {
        if (field.value === 1) {
            this.talkoverPressedTimer = engine.beginTimer(300, () => {
                this.talkoverPressedTimer = 0;
            }, true);

            script.toggleControl("[Microphone]", "talkover");
            return;
        }

        if (this.talkoverPressedTimer !== 0) {
            // Activate permanently on short press release
            engine.stopTimer(this.talkoverPressedTimer);
            this.talkoverPressedTimer = 0;
        } else {
            // Disable talkover on long press release
            engine.setValue("[Microphone]", "talkover", 0);
        }
    }

    gainHandler(field) {
        if (Settings.enableMasterGain) {
            engine.setParameter(field.group, field.name, field.value / 4095);
        }
    }

    scalarHandler(field) {
        engine.setParameter(field.group, field.name, field.value / 4095);
    }

    talkoverCallback(value, group, key) {
        const ledValue = value ? this.outputColorMap.micColor.full : this.outputColorMap.micColor.dim;
        this.controller.setOutput(group, key, ledValue, true);
    }

    peakIndicatorCallback(value, group, key) {
        const ledValue = value ? LedColors.red : LedOff;
        this.controller.setOutput(group, key, ledValue, true);
    }
}

class FxPresetButton {
    constructor(parent, number) {
        this.mixer = parent;
        this.controller = this.mixer.controller;

        this.number = number;
        this.group = "[ChannelX]";
        this.output = `!qfx_${ this.number }`;

        this.qfxActive = false;

        this.outputColorMap = this.mixer.outputColorMap;
    }

    registerInputs(config) {
        config.hidReport.addControl(this.group, this.output, config.offset, "B", config.mask, false,
            this.quickFxButtonHandler.bind(this));
    }

    registerOutputs(config) {
        config.hidReport.addOutput(this.group, this.output, config.offset, "B");
    }

    enableOutputs() {
        this.controller.setOutput(this.group, this.output,
            Settings.qfxColors[this.number - 1] - 2, false);
    }

    linkOutputs() {
        engine.makeConnection("[QuickEffectRack1_[Channel1]]", "loaded_chain_preset",
            this.quickFxButtonCallback.bind(this)).trigger();
        engine.makeConnection("[QuickEffectRack1_[Channel2]]", "loaded_chain_preset",
            this.quickFxButtonCallback.bind(this)).trigger();
    }

    disableOutputs() {
        this.controller.setOutput(this.group, this.output, LedOff, false);
    }

    quickFxButtonHandler(field) {
        if (field.value === 1) {
            this.mixer.qfxPressed = this.number;
            return;
        }

        this.mixer.qfxPressed = 0;

        if (this.mixer.qfxIgnore) {
            this.mixer.qfxIgnore = false;
        } else {
            const preset = Settings.qfxPresets[this.number - 1];

            // Change Quick FX preset for both decks on normal button release
            [1, 2].forEach(channel => {
                engine.setValue(`[QuickEffectRack1_[Channel${ channel }]]`, "loaded_chain_preset", preset);
            });
        }
    }

    quickFxButtonCallback(value, _group, _key) {
        if (Settings.qfxPresets[this.number - 1] === value) {
            // Only set the led once if changing presets for both decks
            if (!this.qfxActive) {
                this.controller.setOutput("[ChannelX]", `!qfx_${ this.number }`,
                    Settings.qfxColors[this.number - 1], true);
            }
            this.qfxActive = true;
        } else {
            if (this.qfxActive) {
                this.controller.setOutput("[ChannelX]", `!qfx_${ this.number }`,
                    Settings.qfxColors[this.number - 1] - 2, true);
            }
            this.qfxActive = false;
        }
    }
}

class Deck {
    constructor(parent, number) {
        this.mx2 = parent;
        this.controller = this.mx2.controller;

        this.number = number;
        this.group = `[Channel${ this.number }]`;

        this.outputColorMap = this.mx2.outputColorMap;

        // VU meter LED segment states
        this.vuMeterState = new Array(8).fill(LedOff);

        this.moveEncoderPressed = false;
        this.loopEncoderPressed = false;
        this.shiftPressed = false;
        this.keylockPressed = false;
        this.keylockIgnore = false;

        this.padPressed = {5: false, 6: false, 7: false, 8: false};

        // 0 = hotcues, 1 = stems, 2 = samples, 3 = loops
        this.activePadMode = 0;

        this.syncEnabledTime = NaN;
        this.syncLongPress = false;

        this.mstLongPressTimer = 0;
        this.mstLongPress = false;

        // 0 = turntable mode, 1 = jog mode
        this.jogMode = 0;

        this.jogTimecode = 0;

        this.lastVelocity = 0;
        this.lastTickValue = 0;
        this.lastTimestamp = 0;
        this.lastWallClock = 0;

        this.jogStopTimerId = null;
        this.jogDecayTimerId = null;

        // Jog wheel post-release velocity polling interval (min. 20 ms)
        this.jogWheelStopPollTime = 20;

        // Velocity reduction interval after jog wheel release (min. 20 ms)
        this.jogWheelDecayPollTime = 20;

        // Raw velocity (tick delta / time delta) to scaratch2 scaling constants
        this.ticksPerRev = 1024;
        this.jogWheelClockHz = 100000000;
        this.targetRpm = 33 + 1 / 3;
        this.velocityToScratch = this.jogWheelClockHz / (this.ticksPerRev * this.targetRpm / 60);
        this.velocityToJog = this.velocityToScratch * Settings.jogWheelSensitivity;

        this.browseEncoder = new Encoder();
        this.moveEncoder = new Encoder();
        this.loopEncoder = new Encoder();

        this.padButtons = [
            new PadButton(this, 1),
            new PadButton(this, 2),
            new PadButton(this, 3),
            new PadButton(this, 4),
            new PadButton(this, 5),
            new PadButton(this, 6),
            new PadButton(this, 7),
            new PadButton(this, 8)
        ];

        this.eq = new Equalizer(this);
    }

    registerInputs(config) {
        this.registerButton("!favorite", config.favButton, this.favButtonHandler);
        this.registerButton("!prepare", config.prepButton, this.prepButtonHandler);
        this.registerButton("!preview", config.previewButton, this.previewButtonHandler);
        this.registerButton("!view", config.viewButton, this.viewButtonHandler);
        this.registerButton("slip_enabled", config.flxButton);
        this.registerButton("reverse", config.revButton, this.revButtonHandler);
        this.registerButton("!tt", config.ttButton, this.jogModeButtonHandler);
        this.registerButton("!jog", config.jogButton, this.jogModeButtonHandler);
        this.registerButton("!shift", config.shiftButton, this.shiftButtonHandler);
        this.registerButton("sync_enabled", config.sncButton, this.sncButtonHandler);
        this.registerButton("sync_leader", config.mstButton, this.mstButtonHandler);
        this.registerButton("keylock", config.keylockButton, this.keylockButtonHandler);
        this.registerButton("!hotcues", config.hotcueButton, this.padModeButtonHandler);
        this.registerButton("!stems", config.stemButton, this.padModeButtonHandler);
        this.registerButton("!samples", config.sampleButton, this.padModeButtonHandler);
        this.registerButton("!loops", config.loopButton, this.padModeButtonHandler);
        this.registerButton("!cue_default", config.cueButton, this.cueButtonHandler);
        this.registerButton("!play", config.playButton, this.playButtonHandler);
        this.registerButton("!quick_effect", config.fxButton, this.fxButtonHandler);
        this.registerButton("pfl", config.pflButton, this.pflButtonHandler);
        this.registerButton("!jog_touch", config.jogTouch, this.jogTouchHandler);
        this.registerButton("!browse_encoder_press", config.browseEncoderPress, this.browseEncoderPressHandler);
        this.registerButton("!browse_encoder", config.browseEncoderTurn, this.browseEncoderTurnHandler);
        this.registerButton("!left_encoder_turn", config.moveEncoderTurn, this.moveEncoderTurnHandler);
        this.registerButton("!left_encoder_press", config.moveEncoderPress, this.moveEncoderPressHandler);
        this.registerButton("!right_encoder_turn", config.loopEncoderTurn, this.loopEncoderTurnHandler);
        this.registerButton("!right_encoder_press", config.loopEncoderPress, this.loopEncoderPressHandler);

        for (let i = 0; i < 8; i++) {
            this.padButtons[i].registerInputs(config.padButtons[i]);
        }

        this.registerScalar("pregain", config.gainKnob, this.scalarHandler);
        this.registerScalar("super1", config.fxKnob, this.fxKnobHandler);
        this.registerScalar("volume", config.volumeFader, this.scalarHandler);
        this.registerScalar("rate", config.rateFader, this.rateFaderHandler);

        this.eq.registerInputs(config.eqKnobs);

        this.registerJog("!jog_timer", config.jogTimer, this.timecodeHandler);
        this.registerJog("!jog_wheel", config.jogWheel, this.jogMoveHandler);
    }

    registerOutputs(config) {
        for (let i = 0; i < 8; i++) {
            this.padButtons[i].registerOutputs(config.padButtons[i]);
        }

        for (let i = 0; i < 8; i++) {
            this.registerLed(`!vu_meter_${ i + 1 }`,
                {hidReport: config.vuMeters[i].hidReport, offset: config.vuMeters[i].offset});
        }

        for (let i = 0; i < 6; i++) {
            this.registerLed(`!bottom_led_${ i + 1 }`,
                {hidReport: config.bottomLeds[i].hidReport, offset: config.bottomLeds[i].offset});
        }

        this.registerLed("!favorite", config.favButton);
        this.registerLed("!prepare", config.prepButton);
        this.registerLed("!preview", config.previewButton);
        this.registerLed("!view", config.viewButton);
        this.registerLed("slip_enabled", config.flxButton);
        this.registerLed("reverse", config.revButton);
        this.registerLed("!tt", config.ttButton);
        this.registerLed("!jog", config.jogButton);
        this.registerLed("sync_enabled", config.sncButton);
        this.registerLed("sync_leader", config.mstButton);
        this.registerLed("keylock", config.keylockButton);
        this.registerLed("!hotcues", config.hotcueButton);
        this.registerLed("!stems", config.stemButton);
        this.registerLed("!samples", config.sampleButton);
        this.registerLed("!loops", config.loopButton);
        this.registerLed("cue_indicator", config.cueButton);
        this.registerLed("play_indicator", config.playButton);
        this.registerLed("!quick_effect", config.fxButton);
        this.registerLed("pfl", config.pflButton);
        this.registerLed("peak_indicator", config.peakIndicator);
    }

    linkOutputs() {
        this.linkLed("[PreviewDeck1]", "play", this.previewButtonCallback);
        this.linkLed("[Skin]", "show_maximized_library", this.viewButtonCallback);
        this.linkLed(this.group, "slip_enabled", this.outputCallback);
        this.linkLed(this.group, "reverse", this.outputCallback);
        this.linkLed(this.group, "sync_enabled", this.outputCallback);
        this.linkLed(this.group, "sync_leader", this.outputCallback);
        this.linkLed(this.group, "keylock", this.outputCallback);
        this.linkLed(this.group, "cue_indicator", this.outputCallback);
        this.linkLed(this.group, "play_indicator", this.outputCallback);
        this.linkLed(`[QuickEffectRack1_${ this.group }]`, "loaded_chain_preset", this.fxButtonCallback);
        this.linkLed(`[QuickEffectRack1_${ this.group }]`, "enabled", this.fxButtonCallback);
        this.linkLed(this.group, "pfl", this.outputCallback);

        // Link bottom panel LED callbacks if light effects are enabled in settings
        if (Settings.enableBottomLeds) {
            this.linkLed("[App]", "indicator_500ms", this.bottomLedsCallback, false);
            this.linkLed(this.group, "end_of_track", this.bottomLedsCallback, false);
            this.linkLed(this.group, "loop_enabled", this.bottomLedsCallback, false);
            this.linkLed(this.group, "play", this.bottomLedsCallback, false);
            this.linkLed(this.group, "track_loaded", this.bottomLedsCallback);
        }

        this.linkLed(this.group, "peak_indicator", this.peakIndicatorCallback, false);
        this.linkLed(this.group, "vu_meter", this.vuMeterCallback, false);
    }

    enableSoftTakeover() {
        engine.softTakeover(this.group, "pregain", true);
        engine.softTakeover(`[QuickEffectRack1_${ this.group }]`, "super1", true);
        engine.softTakeover(this.group, "rate", true);
        engine.softTakeover(this.group, "volume", true);
        this.eq.enableSoftTakeover();
    }

    enableOutputs() {
        this.controller.setOutput(this.group, "!favorite", this.outputColorMap.libraryColor.dim, false);
        this.controller.setOutput(this.group, "!prepare", this.outputColorMap.libraryColor.dim, false);
        // Turntable mode is on by default
        this.controller.setOutput(this.group, "!tt", this.outputColorMap.jogModeColor.full, false);
        this.controller.setOutput(this.group, "!jog", this.outputColorMap.jogModeColor.dim, false);
        // Hotcue mode is on by default
        this.controller.setOutput(this.group, "!hotcues", this.outputColorMap.activePadModeColor.full, false);
        this.controller.setOutput(this.group, "!stems", this.outputColorMap.inactivePadModeColor.dim, false);
        this.controller.setOutput(this.group, "!samples", this.outputColorMap.inactivePadModeColor.dim, false);
        this.controller.setOutput(this.group, "!loops", this.outputColorMap.inactivePadModeColor.dim, false);
    }

    disableOutputs() {
        for (let i = 1; i <= 8; i++) {
            this.controller.setOutput(this.group, `!pad_button_${ i }`, LedOff, false);
        }

        for (let i = 1; i <= 6; i++) {
            this.controller.setOutput(this.group, `!bottom_led_${ i }`, LedOff, false);
        }

        const outputs = [
            "!favorite",
            "!prepare",
            "!preview",
            "!view",
            "slip_enabled",
            "reverse",
            "!tt",
            "!jog",
            "!hotcues",
            "!stems",
            "!samples",
            "!loops",
            "sync_enabled",
            "sync_leader",
            "keylock",
            "cue_indicator",
            "play_indicator",
            "!quick_effect",
            "pfl"
        ];

        outputs.forEach(key => {
            this.controller.setOutput(this.group, key, LedOff, false);
        });
    }

    registerButton(name, config, callback) {
        if (callback !== undefined) {
            callback = callback.bind(this);
        }

        config.hidReport.addControl(this.group, name, config.offset, "B", config.mask, false, callback);
    }

    registerScalar(name, config, callback) {
        if (callback !== undefined) {
            callback = callback.bind(this);
        }

        config.hidReport.addControl(this.group, name, config.offset, "H", 0xffff, false, callback);
    }

    registerJog(name, config, callback) {
        config.hidReport.addControl(this.group, name, config.offset, "I", 0xffffffff, false, callback.bind(this));
    }

    registerLed(name, config) {
        config.hidReport.addOutput(this.group, name, config.offset, "B");
    }

    linkLed(group, name, callback, trigger = true) {
        const connection = engine.makeConnection(group, name, callback.bind(this));

        if (trigger) {
            connection.trigger();
        }
    }

    favButtonHandler(field) {
        if (field.value === 1) {
            if (this.shiftPressed) {
                engine.setValue("[Library]", "track_color_prev", 1);
            } else {
                engine.setValue("[Library]", "track_color_next", 1);
            }
        }

        this.outputCallback(field.value, field.group, field.name);
    }

    prepButtonHandler(field) {
        if (field.value === 1) {
            if (this.shiftPressed) {
                engine.setValue("[Library]", "AutoDjAddTop", field.value);
            } else {
                engine.setValue("[Library]", "AutoDjAddBottom", field.value);
            }
        }

        this.outputCallback(field.value, field.group, field.name);
    }

    previewButtonHandler(field) {
        if (field.value === 1) {
            engine.setValue("[PreviewDeck1]", "LoadSelectedTrackAndPlay", field.value);
        }
    }

    viewButtonHandler(field) {
        if (field.value === 1) {
            script.toggleControl("[Skin]", "show_maximized_library");
        }
    }

    revButtonHandler(field) {
        if (this.shiftPressed) {
            engine.setValue(field.group, "reverseroll", field.value);
        } else {
            engine.setValue(field.group, "reverse", field.value);
        }

        this.outputCallback(field.value, field.group, field.name);
    }

    jogModeButtonHandler(field) {
        if (field.value === 0) {
            return;
        }

        if (field.name === "!tt") {
            this.setJogMode(0);
        } else if (field.name === "!jog") {
            this.setJogMode(1);
        } else {
            console.warn(`Unknown field: ${ field.name }`);
        }
    }

    shiftButtonHandler(field) {
        if (field.value === 1) {
            this.shiftPressed = 1;
        } else {
            this.shiftPressed = 0;
        }
    }

    sncButtonHandler(field) {
        const now = Date.now();

        if (field.value === 1) {
            this.syncEnabledTime = now;
            engine.setValue(this.group, "sync_enabled", 1);
        } else {
            if (!engine.getValue(this.group, "sync_enabled")) {
                // Keep sync lock disabled if button was released before latching
                engine.setValue(this.group, "sync_enabled", 0);
                return;
            }
            if (now - this.syncEnabledTime > 300) {
                engine.setValue(this.group, "sync_enabled", 1);
                return;
            }
            engine.setValue(this.group, "sync_enabled", 0);
        }
    }

    mstButtonHandler(field) {
        if (field.value === 1) {
            this.mstLongPressTimer = engine.beginTimer(300, () => {
                this.mstLongPress = true;
                this.mstLongPressTimer = 0;
            }, true);

            return;
        }

        if (this.mstLongPressTimer !== 0) {
            engine.stopTimer(this.mstLongPressTimer);
            this.mstLongPressTimer = 0;
        }

        if (this.mstLongPress) {
            const rateRange = engine.getValue(this.group, "rateRange");
            engine.setValue(this.group, "rateRange", rateRange < 0.9 ? 0.9 : 0.08);
        } else {
            script.toggleControl(this.group, "sync_leader");
        }

        this.mstLongPress = false;
    }

    keylockButtonHandler(field) {
        if (field.value === 1) {
            this.keylockPressed = 1;
            return;
        }

        if (this.keylockIgnore) {
            this.keylockIgnore = false;
        } else {
            script.toggleControl(field.group, field.name);
            this.outputCallback(field.value, field.group, field.name);
        }
    }

    padModeButtonHandler(field) {
        if (field.value === 0) {
            return;
        }

        const padModes = ["!hotcues", "!stems", "!samples", "!loops"];
        const padIndex = padModes.indexOf(field.name);

        if (padIndex === -1) {
            console.warn(`Unknown pad mode: ${ field.name }`);
            return;
        }

        for (const item of padModes) {
            this.controller.setOutput(this.group, item, this.outputColorMap.inactivePadModeColor.dim, false);
        }

        this.controller.setOutput(this.group, field.name, this.outputColorMap.activePadModeColor.full, true);
        this.setPadMode(padIndex);
    }

    cueButtonHandler(field) {
        if (this.shiftPressed) {
            engine.setValue(this.group, "cue_gotoandstop", field.value);
        } else {
            engine.setValue(this.group, "cue_default", field.value);
        }
    }

    playButtonHandler(field) {
        if (this.shiftPressed) {
            engine.setValue(this.group, "start_stop", field.value);
        } else if (field.value === 1) {
            // Failsafe to disable scratching if the timer has not yet executed after a backspin
            if (engine.isScratching(this.number)) {
                engine.scratchDisable(this.number, false);
            }

            script.toggleControl(this.group, "play");
        }
    }

    fxButtonHandler(field) {
        if (field.value === 0) {
            return;
        }

        const qfxPressed = this.mx2.mixer.qfxPressed;

        if (qfxPressed > 0) {
            this.mx2.mixer.qfxIgnore = true;
            engine.setValue(`[QuickEffectRack1_${ this.group }]`, "loaded_chain_preset",
                Settings.qfxPresets[qfxPressed - 1]);
        } else {
            script.toggleControl(`[QuickEffectRack1_${ this.group }]`, "enabled");
        }
    }

    pflButtonHandler(field) {
        if (field.value === 0) {
            return;
        }

        if (this.shiftPressed) {
            script.toggleControl(this.group, "quantize");
        } else {
            script.toggleControl(this.group, "pfl");
        }
    }

    jogTouchHandler(field) {
        if (this.jogMode === 0) {
            if (field.value > 0) {
                // Cancel any existing stop timers
                if ((this.jogStopTimerId !== null) && (this.jogStopTimerId !== null)) {
                    engine.stopTimer(this.jogStopTimerId);
                    this.jogStopTimerId = null;
                }
                engine.setValue(this.group, "scratch2_enable", true);
            } else {
                this.jogStopper();
            }
        }
    }

    browseEncoderPressHandler(field) {
        if (this.shiftPressed) {
            engine.setValue("[Library]", "GoToItem", field.value);
        } else {
            engine.setValue(field.group, "LoadSelectedTrack", field.value);
        }
    }

    browseEncoderTurnHandler(field) {
        const delta = this.browseEncoder.delta(field.value);

        if (this.shiftPressed) {
            engine.setValue("[Library]", "focused_widget", 2);
            engine.setValue("[Library]", "MoveVertical", delta);
        } else {
            engine.setValue("[Library]", "focused_widget", 3);
            engine.setValue("[Library]", "MoveVertical", delta);
        }
    }

    moveEncoderTurnHandler(field) {
        const delta = this.moveEncoder.delta(field.value);

        if (this.activePadMode === 1 && Object.values(this.padPressed).some(Boolean)) {
            for (const padNum in this.padPressed) {
                if (this.padPressed[padNum]) {
                    if (delta > 0) {
                        script.triggerControl(`[Channel${ this.number }_Stem${ padNum - 3 }]`, "volume_up");
                    } else {
                        script.triggerControl(`[Channel${ this.number }_Stem${ padNum - 3 }]`, "volume_down");
                    }

                }
            }
        } else {
            if (this.shiftPressed) {
                const beatjumpSize = engine.getValue(field.group, "beatjump_size");

                if (delta > 0) {
                    engine.setValue(field.group, "beatjump_size", beatjumpSize * 2);
                } else {
                    engine.setValue(field.group, "beatjump_size", beatjumpSize / 2);
                }
            } else {
                if (delta < 0) {
                    script.triggerControl(field.group, "beatjump_backward");
                } else {
                    script.triggerControl(field.group, "beatjump_forward");
                }
            }
        }
    }

    moveEncoderPressHandler(field) {
        if (this.shiftPressed) {
            engine.setValue(this.group, "reloop_andstop", field.value);
        } else {
            engine.setValue(this.group, "beatlooproll_activate", field.value);
        }
    }

    loopEncoderTurnHandler(field) {
        const delta = this.loopEncoder.delta(field.value);

        if (this.activePadMode === 1 && Object.values(this.padPressed).some(Boolean)) {
            for (const padNum in this.padPressed) {
                if (this.padPressed[padNum]) {
                    if (!this.shiftPressed) {
                        if (delta > 0) {
                            script.triggerControl("[QuickEffectRack1_[Channel" +
                            `${ field.group[field.group.length - 2] }_Stem${ padNum - 3 }]]`, "super1_up");
                        } else {
                            script.triggerControl("[QuickEffectRack1_[Channel" +
                            `${ field.group[field.group.length - 2] }_Stem${ padNum - 3 }]]`, "super1_down");
                        }
                    } else {
                        if (delta > 0) {
                            engine.setValue(`[QuickEffectRack1_[Channel${ field.group[field.group.length - 2] }` +
                                `_Stem${ padNum - 3 }]]`, "next_chain_preset", 1);
                        } else {
                            engine.setValue(`[QuickEffectRack1_[Channel${ field.group[field.group.length - 2] }` +
                                `_Stem${ padNum - 3 }]]`, "prev_chain_preset", 1);
                        }
                    }

                }
            }
        } else if (this.keylockPressed) {
            this.keylockIgnore = true;

            if (delta > 0) {
                engine.setValue(this.group, "pitch_adjust_up_small", 1);
            } else {
                engine.setValue(this.group, "pitch_adjust_down_small", 1);
            }
        } else {
            if (delta > 0) {
                script.triggerControl(this.group, "loop_double");
            } else {
                script.triggerControl(this.group, "loop_halve");
            }
        }
    }

    loopEncoderPressHandler(field) {
        if (field.value === 0) {
            return;
        }

        if (this.activePadMode === 1 && Object.values(this.padPressed).some(Boolean)) {
            for (const padNum in this.padPressed) {
                if (this.padPressed[padNum]) {
                    script.toggleControl("[QuickEffectRack1_[Channel" +
                        `${ field.group[field.group.length - 2] }_Stem${ padNum - 4 }]]`, "enabled");
                }
            }
        } else {
            if (this.shiftPressed) {
                engine.setValue(this.group, "reloop_toggle", field.value);
            } else {
                engine.setValue(this.group, "beatloop_activate", field.value);
            }
        }
    }

    scalarHandler(field) {
        engine.setParameter(this.group, field.name, field.value / 4095);
    }

    fxKnobHandler(field) {
        engine.setParameter(`[QuickEffectRack1_${ this.group }]`, field.name, field.value / 4095);
    }

    rateFaderHandler(field) {
        let value = field.value;
        const lowerSnapRange = 2047 - Settings.rateFaderSnap;
        const upperSnapRange = 2047 + Settings.rateFaderSnap;

        if (value <= lowerSnapRange) {
            value = script.absoluteLin(value, -1, 0, 0, lowerSnapRange);
        } else if (value > upperSnapRange) {
            value = script.absoluteLin(value, 0, 1, upperSnapRange, 4095);
        } else {
            value = 0;
        }

        engine.setValue(field.group, "rate", value);
    }

    timecodeHandler(field) {
        this.jogTimecode = field.value;
    }

    jogMoveHandler(field) {
        // Disable wheel if no track is loaded
        if (!engine.getValue(field.group, "track_loaded")) {
            return;
        }

        const velocity = this.wheelVelocity(field.value);

        if (this.jogMode === 0) {
            if (this.shiftPressed && !engine.getValue(this.group, "play")) {
                engine.setValue(this.group, "beatjump", velocity * 10 ** 6);
            } else {
                if (engine.getValue(this.group, "scratch2_enable")) {
                    engine.setValue(this.group, "scratch2", velocity * this.velocityToScratch);

                    if ((this.jogDecayTimerId !== null) && (this.jogDecayTimerId !== null)) {
                        // Cancel any existing decay timers
                        engine.stopTimer(this.jogDecayTimerId);
                        this.jogDecayTimerId = null;
                    }

                    // Start timer to manually decay the velocity
                    this.jogDecayTimerId = engine.beginTimer(this.jogWheelDecayPollTime, () => {
                        this.jogDecayer();
                    }, true);

                } else {
                    engine.setValue(this.group, "jog", velocity * this.velocityToJog);
                }
            }
        } else {
            engine.setValue(this.group, "jog", velocity * this.velocityToJog);
        }
    }

    previewButtonCallback(value, _group, _key) {
        this.controller.setOutput(this.group, "!preview",
            this.mapLedValue(value, this.outputColorMap.libraryColor), true);
    }

    viewButtonCallback(value, _group, _key) {
        this.controller.setOutput(this.group, "!view",
            this.mapLedValue(value, this.outputColorMap.libraryColor), true);
    }

    outputCallback(value, group, key) {
        const outputs = {
            "!favorite": this.outputColorMap.libraryColor,
            "!prepare": this.outputColorMap.libraryColor,
            "slip_enabled": this.outputColorMap.transportColor,
            "reverse": this.outputColorMap.transportColor,
            "sync_enabled": this.outputColorMap.syncColor,
            "sync_leader": this.outputColorMap.syncColor,
            "keylock": this.outputColorMap.keylockColor,
            "cue_indicator": this.outputColorMap.cueColor,
            "play_indicator": this.outputColorMap.playColor,
            "pfl": this.outputColorMap.pflColor
        };

        const color = outputs[key];

        if (color === undefined) {
            console.warn(`No output color found for '${key}'.`);
        } else {
            this.controller.setOutput(group, key, this.mapLedValue(value, color), true);
        }
    }

    fxButtonCallback(_value, _group, _key) {
        const loadedPreset = engine.getValue(`[QuickEffectRack1_${ this.group }]`, "loaded_chain_preset");
        const qfxIndex = Settings.qfxPresets.indexOf(loadedPreset);
        const color = qfxIndex === -1 ? this.outputColorMap.fxColor.full : Settings.qfxColors[qfxIndex];

        if (engine.getValue(`[QuickEffectRack1_${ this.group }]`, "enabled")) {
            this.controller.setOutput(this.group, "!quick_effect", color, true);
        } else {
            this.controller.setOutput(this.group, "!quick_effect", color - 2, true);
        }
    }

    bottomLedsCallback(value, _group, key) {
        // Skip blinking LED updates if track is not ending
        if (key === "indicator_500ms" && !engine.getValue(this.group, "end_of_track")) {
            return;
        }

        const color = this.getBottomLedsColor(value, key);

        for (let i = 1; i <= 6; i++) {
            this.controller.setOutput(this.group, `!bottom_led_${i}`, color, false);
        }

        this.controller.OutputPackets.outputReport0x80.send();
    }

    peakIndicatorCallback(value, group, key) {
        const ledValue = value ? LedFull : LedOff;
        this.controller.setOutput(group, key, ledValue, true);
    }

    vuMeterCallback(value, _group, _key) {
        // Figure out the number of illuminated segments
        const scaledValue = value * 8.0;
        const fullIllumCount = Math.floor(scaledValue);
        const ledBrightness = Settings.brightMeterSegments ? LedFull : LedDim;

        let sendUpdate = false;

        for (let i = 0; i < 8; i++) {
            const ledUpdate = i < fullIllumCount ? ledBrightness : LedOff;

            if (ledUpdate !== this.vuMeterState[i]) {
                this.controller.setOutput(this.group, `!vu_meter_${i + 1}`, ledUpdate, false);
                // Store the new segment state
                this.vuMeterState[i] = ledUpdate;
                sendUpdate = true;
            }
        }

        // Only send the report if LED states have changed
        if (sendUpdate) {
            this.controller.OutputPackets.outputReport0x80.send();
        }
    }

    setPadMode(padMode) {
        this.activePadMode = padMode;

        for (const pad in this.padButtons) {
            this.padButtons[pad].padModeChanged();
        }
    }

    mapLedValue(value, color) {
        if (value) {
            return color.full;
        } else {
            return color.dim;
        }
    }

    getBottomLedsColor(value, key) {
        if (key === "indicator_500ms") {
            // Use callback value as blinking LED brightness
            return Settings.bottomLedsEndColor + (value ? 0 : -2);
        }

        if (engine.getValue(this.group, "loop_enabled")) {
            // Switch loop color brightness based on playback state
            return Settings.bottomLedsLoopColor + (engine.getValue(this.group, "play") ? 0 : -2);
        }

        if (engine.getValue(this.group, "track_loaded")) {
            return Settings.bottomLedsPlayColor + (engine.getValue(this.group, "play") ? 0 : -2);
        }

        // Return standby color by default
        return Settings.bottomLedsStandbyColor - 2;
    }

    setJogMode(jogMode) {
        if (jogMode === 0) {
            this.controller.setOutput(this.group, "!tt", this.outputColorMap.jogModeColor.full, false);
            this.controller.setOutput(this.group, "!jog", this.outputColorMap.jogModeColor.dim, true);
        } else if (jogMode === 1) {
            engine.scratchDisable(this.number, true);

            if (engine.getValue(this.group, "scratch2_enable")) {
                // Disable if mode was changed while scratching
                engine.setValue(this.group, "scratch2_enable", false);
            }

            this.controller.setOutput(this.group, "!jog", this.outputColorMap.jogModeColor.full, false);
            this.controller.setOutput(this.group, "!tt", this.outputColorMap.jogModeColor.dim, true);
        } else {
            console.warn(`Unknown mode: ${ jogMode }`);
            return;
        }

        this.jogMode = jogMode;
    }

    jogStopper() {
        if (Math.abs(engine.getValue(this.group, "scratch2")) <= Settings.jogWheelEpsilon * this.velocityToScratch) {
            // Exit scratching mode if the wheel is stopped
            engine.setValue(this.group, "scratch2", 0);
            engine.setValue(this.group, "scratch2_enable", false);
            this.lastVelocity = 0;
            this.jogStopTimerId = null;
        } else {
            // Otherwise, check again after a while
            this.jogStopTimerId = engine.beginTimer(this.jogWheelStopPollTime, () => this.jogStopper(), true);
        }
    }

    wheelVelocity(value) {
        // Get current 32-bit timecode value
        const timeValue = this.jogTimecode;

        // Current 32-bit tick value (wheel position) masked to low 10 bits
        const tickValue = value & 0x3ff;

        const prevTick = this.lastTickValue;
        const prevTime = this.lastTimestamp;
        const prevWallClock = this.lastWallClock;

        this.lastTickValue = tickValue;
        this.lastTimestamp = timeValue;
        this.lastWallClock = Date.now();

        // If the jog wheel has been idle for too long, the timecode may have
        // looped around multiple times. We have nothing to go by, so reset the
        // last stored velocity and return 0.
        if (this.lastWallClock - prevWallClock > 40000 && this.lastVelocity !== 0) {
            this.lastVelocity = 0;
            return 0;
        }

        // Calculate time delta and handle timecode rollover
        const timeDelta = (timeValue - prevTime) >>> 0;

        if (timeDelta === 0) {
            // Return last stored velocity if timecode didn't advance
            return this.lastVelocity;
        }

        // Calculate tick delta and handle wheel rollover
        let tickDelta = tickValue - prevTick;

        if (tickDelta > this.ticksPerRev / 2) {
            tickDelta -= this.ticksPerRev;
        } else if (tickDelta < -this.ticksPerRev / 2) {
            tickDelta += this.ticksPerRev;
        }

        const rawVelocity = tickDelta / timeDelta;
        const prevVelocity = this.lastVelocity;

        let nextVelocity;

        if ((Math.abs(prevVelocity) < Settings.jogWheelEpsilon) || (rawVelocity * prevVelocity < 0)) {
            // Use the raw velocity if jog wheel is currently stopped or changing directions
            nextVelocity = rawVelocity;
        } else {
            // Otherwise smooth the raw velocity with a low-pass filter
            nextVelocity = Settings.jogWheelAlpha * rawVelocity + (1 - Settings.jogWheelAlpha) * prevVelocity;
        }

        this.lastVelocity = nextVelocity;
        return nextVelocity;
    }

    jogDecayer() {
        if (Math.abs(engine.getValue(this.group, "scratch2")) <= Settings.jogWheelEpsilon * this.velocityToScratch) {
            // If wheel is slow enough, immediately set scratch2 to 0
            this.lastVelocity = 0;
            engine.setValue(this.group, "scratch2", 0);
            this.jogDecayTimerId = null;
        } else {
            // Otherwise decay the velocity and call again after a while
            const decayedVelocity = this.lastVelocity * (1 - Settings.jogWheelAlpha);
            this.lastVelocity = decayedVelocity;
            engine.setValue(this.group, "scratch2", decayedVelocity * this.velocityToScratch);
            this.jogDecayTimerId = engine.beginTimer(this.jogWheelDecayPollTime, () => this.jogDecayer(), true);
        }
    }
}

class PadButton {
    constructor(parent, number) {
        this.deck = parent;
        this.controller = this.deck.controller;

        this.number = number;
        this.output = `!pad_button_${ this.number }`;

        this.outputColorMap = this.deck.mx2.outputColorMap;
        this.padColorMap = new ColorMapper(PadColors);

        const padRelations = {
            "[Channel1]": {1: 1, 2: 2, 3: 3, 4: 4, 5: 9, 6: 10, 7: 11, 8: 12},
            "[Channel2]": {1: 5, 2: 6, 3: 7, 4: 8, 5: 13, 6: 14, 7: 15, 8: 16}
        };

        this.samplerGroup = `[Sampler${ padRelations[this.deck.group][this.number] }]`;

        this.padConnections = [];
    }

    registerInputs(config) {
        config.hidReport.addControl(this.deck.group, this.output, config.offset, "B", config.mask, false,
            this.padButtonHandler.bind(this));
    }

    registerOutputs(config) {
        config.hidReport.addOutput(this.deck.group, this.output, config.offset, "B");
    }

    padButtonHandler(field) {
        const padMode = this.deck.activePadMode;

        switch (padMode) {
        case 0:
            this.hotcuePad(field.value);
            break;
        case 1:
            this.stemPad(field.value);
            break;
        case 2:
            this.samplePad(field.value);
            break;
        case 3:
            this.loopPad(field.value);
            break;
        default:
            console.warn(`Unknown mode: ${ padMode }`);
            break;
        }
    }

    hotcuePad(value) {
        if (this.deck.shiftPressed) {
            engine.setValue(this.deck.group, `hotcue_${ this.number }_clear`, value);
        } else {
            engine.setValue(this.deck.group, `hotcue_${ this.number }_activate`, value);
        }
    }

    stemPad(value) {
        if (engine.getValue(this.deck.group, "stem_count") === 0) {
            return;
        }

        if (this.number <= Math.min(4, engine.getValue(this.deck.group, "stem_count"))) {
            if (value === 0) {
                return;
            }

            script.toggleControl(`[Channel${ this.deck.number }_Stem${ this.number }]`, "mute");
        } else if (this.number >= 5) {
            // Lower four pads are used as stem control modifiers
            this.deck.padPressed[this.number - 1] = (value === 1);
        }
    }

    samplePad(value) {
        if (value === 0) {
            return;
        }

        if (this.deck.shiftPressed) {
            if (engine.getValue(this.samplerGroup, "play") === 1) {
                engine.setValue(this.samplerGroup, "play", 0);
            } else {
                script.triggerControl(this.samplerGroup, "eject");
            }
        } else {
            if (engine.getValue(this.samplerGroup, "track_loaded") === 0) {
                script.triggerControl(this.samplerGroup, "LoadSelectedTrack");
            } else {
                script.triggerControl(this.samplerGroup, "cue_gotoandplay");
            }
        }
    }

    loopPad(value) {
        // Disable pads if no track is loaded
        if (!engine.getValue(this.deck.group, "track_loaded")) {
            return;
        }

        if (value === 1) {
            if (this.deck.shiftPressed) {
                this.controller.setOutput(this.deck.group, this.output, this.outputColorMap.altPadColor.full, true);
                engine.setValue(this.deck.group, `beatloop_${ 2 ** ((this.number - 5)) }_activate`, 1);
            } else {
                this.controller.setOutput(this.deck.group, this.output, this.outputColorMap.activePadColor.full, true);
                engine.setValue(this.deck.group, `beatlooproll_${ 2 ** (this.number - 5) }_activate`, 1);
            }
        } else {
            this.controller.setOutput(this.deck.group, this.output, this.outputColorMap.inactivePadColor.full, true);
            engine.setValue(this.deck.group, "loop_enabled", 0);
        }
    }

    hotcuePadCallback() {
        const status = engine.getValue(this.deck.group, `hotcue_${ this.number }_status`);
        const color = engine.getValue(this.deck.group, `hotcue_${ this.number }_color`);

        if (status === 1) {
            if (Settings.matchPadColors) {
                this.controller.setOutput(this.deck.group, this.output,
                    this.padColorMap.getValueForNearestColor(color), true);
            } else {
                this.controller.setOutput(this.deck.group, this.output,
                    this.outputColorMap.inactivePadColor.full, true);
            }
        } else if (status === 2) {
            this.controller.setOutput(this.deck.group, this.output,
                this.outputColorMap.activePadColor.full, true);
        } else {
            this.controller.setOutput(this.deck.group, this.output,
                this.outputColorMap.unconnectedPadColor.dim, true);
        }
    }

    stemPadCallback() {
        const stemColor = engine.getValue(`[Channel${ this.deck.number }_Stem${ this.number }]`, "color");
        const padColor = this.padColorMap.getValueForNearestColor(stemColor);

        if (stemColor === -1) {
            // No color data available, so assume the file doesn't contain stems
            this.controller.setOutput(this.deck.group, this.output, LedOff, false);
            this.controller.setOutput(this.deck.group, `!pad_button_${ this.number + 4 }`, LedOff, true);
            return;
        }

        this.controller.setOutput(this.deck.group, `!pad_button_${ this.number + 4 }`,
            this.outputColorMap.unconnectedPadColor.dim, false);

        if (engine.getValue(`[Channel${ this.deck.number }_Stem${ this.number }]`, "mute") === 1) {
            if (Settings.matchPadColors) {
                this.controller.setOutput(this.deck.group, this.output, padColor - 2, false);
            } else {
                this.controller.setOutput(this.deck.group, this.output,
                    this.outputColorMap.inactivePadColor.dim, false);
            }
        } else {
            if (Settings.matchPadColors) {
                this.controller.setOutput(this.deck.group, this.output, padColor, false);
            } else {
                this.controller.setOutput(this.deck.group, this.output,
                    this.outputColorMap.inactivePadColor.full, false);
            }
        }

        this.controller.OutputPackets.outputReport0x80.send();
    }

    samplePadCallback() {
        if (engine.getValue(this.samplerGroup, "track_loaded")) {
            if (engine.getValue(this.samplerGroup, "play") === 1) {
                if (engine.getValue(this.samplerGroup, "repeat") === 1) {
                    this.controller.setOutput(this.deck.group, this.output, this.outputColorMap.altPadColor.full, true);
                } else {
                    this.controller.setOutput(this.deck.group, this.output,
                        this.outputColorMap.activePadColor.full, true);
                }
            } else {
                this.controller.setOutput(this.deck.group, this.output,
                    this.outputColorMap.inactivePadColor.full, true);
            }
        } else {
            this.controller.setOutput(this.deck.group, this.output, this.outputColorMap.unconnectedPadColor.dim, true);
        }
    }

    loopCallback(value, _group, _key) {
        if (value === 0) {
            this.controller.setOutput(this.deck.group, this.output, this.outputColorMap.inactivePadColor.full, true);
        } else if (engine.getValue(this.deck.group, "loop_enabled") === 1) {
            this.controller.setOutput(this.deck.group, this.output, this.outputColorMap.activePadColor.full, true);
        }
    }

    padModeChanged() {
        const padMode = this.deck.activePadMode;

        this.padConnections.forEach(function(connection) {
            connection.disconnect();
        });

        this.padConnections = [];

        switch (padMode) {
        case 0:
            this.padConnections.push(engine.makeConnection(
                this.deck.group, `hotcue_${ this.number }_status`, this.hotcuePadCallback.bind(this)));
            this.padConnections.push(engine.makeConnection(
                this.deck.group, `hotcue_${ this.number }_color`, this.hotcuePadCallback.bind(this)));
            break;
        case 1:
            if (this.number <= 4) {
                // Using `track_loaded` for callback doesn't work here, since stem info is not yet available
                this.padConnections.push(engine.makeConnection(
                    `[Channel${ this.deck.number }_Stem${ this.number }]`, "mute", this.stemPadCallback.bind(this)));
                this.padConnections.push(engine.makeConnection(
                    `[Channel${ this.deck.number }_Stem${ this.number }]`, "color", this.stemPadCallback.bind(this)));
            }

            break;
        case 2:
            this.padConnections.push(engine.makeConnection(
                this.samplerGroup, "track_loaded", this.samplePadCallback.bind(this)));
            this.padConnections.push(engine.makeConnection(
                this.samplerGroup, "play", this.samplePadCallback.bind(this)));
            this.padConnections.push(engine.makeConnection(
                this.samplerGroup, "repeat", this.samplePadCallback.bind(this)));
            break;
        case 3:
            this.controller.setOutput(this.deck.group, this.output, this.outputColorMap.inactivePadColor.full, false);

            // Send output report on the last LED update
            if (this.number === 8) {
                this.controller.OutputPackets.outputReport0x80.send();
            }

            break;
        default:
            console.warn(`Unknown mode: ${ padMode }`);
            break;
        }

        this.padConnections.forEach(function(connection) {
            connection.trigger();
        });
    }
}

class Equalizer {
    constructor(parent) {
        this.deck = parent;
        this.controller = this.deck.controller;

        this.group = `[EqualizerRack1_${ this.deck.group }_Effect1]`;

        this.eqParams = [
            new EqualizerParameter(this, 3),
            new EqualizerParameter(this, 2),
            new EqualizerParameter(this, 1),
        ];
    }

    registerInputs(config) {
        for (let i = 0; i < 3; i++) {
            this.eqParams[i].registerInputs(config[i]);
        }
    }

    enableSoftTakeover() {
        for (let i = 0; i < 3; i++) {
            this.eqParams[i].enableSoftTakeover();
        }
    }
}

class EqualizerParameter {
    constructor(parent, number) {
        this.equalizer = parent;
        this.number = number;
        this.group = this.equalizer.group;
    }

    registerInputs(config) {
        this.registerScalar(`parameter${ this.number }`, config, this.eqKnobHandler);
    }

    enableSoftTakeover() {
        engine.softTakeover(this.group, `parameter${ this.number }`, true);
    }

    registerScalar(name, config, callback) {
        if (callback !== undefined) {
            callback = callback.bind(this);
        }

        config.hidReport.addControl(this.group, name, config.offset, "H", 0xffff, false, callback);
    }

    eqKnobHandler(field) {
        engine.setParameter(this.group, `parameter${ this.number }`, field.value / 4095);
    }
}

class EffectUnit {
    constructor(parent, number) {
        this.mx2 = parent;
        this.controller = parent.controller;

        this.number = number;
        this.deck = this.mx2.decks[this.number - 1];
        this.group = `[EffectRack1_EffectUnit${ this.number }]`;

        this.outputColorMap = this.mx2.outputColorMap;

        this.effectFocusTimer = 0;
        this.effectIndices = [0, 1, 2];
        this.focusedEffect = null;
        this.focusSelectMode = false;
        this.focusBlinkTimer = 0;

        this.fxParams = [
            new EffectParameter(this, 1),
            new EffectParameter(this, 2),
            new EffectParameter(this, 3),
        ];
    }

    registerInputs(config) {
        this.registerButton("!effect_focus", config.focusButton, this.focusButtonHandler);
        this.registerButton("group_[Channel1]_enable", config.fxAssignButton1);
        this.registerButton("group_[Channel2]_enable", config.fxAssignButton2);
        this.registerScalar("!mix", config.mixKnob, this.mixKnobHandler);

        for (let i = 0; i < 3; i++) {
            this.fxParams[i].registerInputs(config.fxParams[i]);
        }
    }

    registerOutputs(config) {
        this.registerLed("!effect_focus", config.focusButton);
        this.registerLed("group_[Channel1]_enable", config.fxAssignButton1);
        this.registerLed("group_[Channel2]_enable", config.fxAssignButton2);

        for (let i = 0; i < 3; i++) {
            this.fxParams[i].registerOutputs(config.fxParams[i]);
        }
    }

    linkOutputs() {
        engine.makeConnection(this.group, "show_parameters", this.showParametersCallback.bind(this)).trigger();
        engine.makeConnection(this.group, "focused_effect", this.focusedEffectCallback.bind(this)).trigger();
        engine.makeConnection("[App]", "indicator_250ms", this.focusLedCallback.bind(this));
        engine.makeConnection(this.group, "group_[Channel1]_enable", this.effectGroupCallback.bind(this)).trigger();
        engine.makeConnection(this.group, "group_[Channel2]_enable", this.effectGroupCallback.bind(this)).trigger();
    }

    enableSoftTakeover() {
        engine.softTakeover(this.group, "mix", true);

        for (let i = 0; i < 3; i++) {
            this.fxParams[i].enableSoftTakeover();
        }
    }

    disableOutputs() {
        this.controller.setOutput(this.group, "!effect_focus", LedOff, false);

        [1, 2].forEach(channel => {
            this.controller.setOutput(this.group, `group_[Channel${ channel }]_enable`, LedOff, false);
        });

        this.fxParams.forEach(function(effectParam) {
            effectParam.disableOutputs();
        });
    }

    registerButton(name, config, callback) {
        if (callback !== undefined) {
            callback = callback.bind(this);
        }

        config.hidReport.addControl(this.group, name, config.offset, "B", config.mask, false, callback);
    }

    registerScalar(name, config, callback) {
        if (callback !== undefined) {
            callback = callback.bind(this);
        }

        config.hidReport.addControl(this.group, name, config.offset, "H", 0xffff, false, callback);
    }

    registerLed(name, config) {
        config.hidReport.addOutput(this.group, name, config.offset, "B");
    }

    focusButtonHandler(field) {
        if (field.value === 1) {
            this.effectFocusTimer = engine.beginTimer(300, () => {
                this.effectFocusTimer = 0;
                this.focusLongPress();
            }, true);

            return;
        }

        if (this.focusSelectMode) {
            this.focusLongRelease();
        } else {
            if (this.effectFocusTimer !== 0) {
                engine.stopTimer(this.effectFocusTimer);
                this.effectFocusTimer = 0;
            }

            this.focusShortRelease();
        }
    }

    mixKnobHandler(field) {
        engine.setParameter(this.group, "mix", field.value / 4095);
    }

    focusShortRelease() {
        const focusedEffect = engine.getValue(this.group, "focused_effect");

        if (focusedEffect) {
            // Store the currently focused effect
            this.focusedEffect = focusedEffect;

            // Hide the currently focused effect and parameter panel
            engine.setValue(this.group, "focused_effect", 0);
            engine.setValue(this.group, "show_focus", 0);
            engine.setValue(this.group, "show_parameters", 0);
        } else if (this.focusedEffect !== null) {
            // Restore a hidden focused effect
            engine.setValue(this.group, "focused_effect", this.focusedEffect);
            engine.setValue(this.group, "show_focus", 1);
            engine.setValue(this.group, "show_parameters", 1);
        } else {
            script.toggleControl(this.group, "show_parameters");
        }
    }

    focusLongPress() {
        this.focusSelectMode = true;
        this.startFocusedMode();
    }

    focusLongRelease() {
        this.focusSelectMode = false;
        this.startNormalMode();
    }

    setFocusedEffect(effectIdx) {
        // Set / clear focused effect
        if (this.focusedEffect === effectIdx) {
            this.focusedEffect = null;
        } else {
            this.focusedEffect = effectIdx;
        }

        if (this.focusedEffect === null) {
            engine.setValue(this.group, "focused_effect", 0);
            engine.setValue(this.group, "show_focus", 0);
        } else {
            engine.setValue(this.group, "focused_effect", effectIdx);
            engine.setValue(this.group, "show_focus", 1);
        }
    }

    startFocusedMode() {
        // Always show parameters in focused mode
        engine.setValue(this.group, "show_parameters", 1);

        for (const index of this.effectIndices) {
            this.fxParams[index].connectFocusedLed();
        }
    }

    startNormalMode() {
        const effectGroup = this.effectGroupForNumber(engine.getValue(this.group, "focused_effect"));
        const noEffectFocused = this.focusedEffect === null;

        for (const index of this.effectIndices) {
            const unfocusGroup = this.effectGroupForNumber(index);
            this.fxParams[index].connectNormalLed(effectGroup, unfocusGroup, noEffectFocused);
        }
    }

    effectGroupForNumber(number) {
        return `[EffectRack1_EffectUnit${ this.unitNumber }_Effect${ number + 1 }]`;
    }

    showParametersCallback(value, group, _key) {
        if (value === 0) {
            if (engine.getValue(group, "show_focus") > 0) {
                engine.setValue(group, "show_focus", 0);
                engine.setValue(group, "focused_effect", 0);
            }
        } else {
            if (this.focusedEffect !== null) {
                engine.setValue(group, "show_focus", 1);
                engine.setValue(group, "focused_effect", this.focusedEffect);
            }
        }
    }

    focusedEffectCallback(value, group, _key) {
        if (value > 0) {
            if (!engine.getValue(this.group, "show_focus")) {
                // Show focus when a focused effect is restored
                engine.setValue(this.group, "show_focus", 1);
            }
        } else {
            this.controller.setOutput(this.group, "!effect_focus", this.outputColorMap.focusColor.dim, true);
            engine.setValue(this.group, "show_focus", 0);
        }

        // Restart normal mode if focused effect was changed from the parameter panel
        if (!this.focusSelectMode) {
            this.startNormalMode();
        }

        if (value === 0) {
            for (let i = 1; i <= 3; i++) {
                // Previously focused effect is not available here, so iterate over all parameter knobs
                for (let j = 1; j <= 3; j++) {
                    engine.softTakeoverIgnoreNextValue(`${ group.slice(0, -1) }_Effect${ i }]`, `parameter${ j }`);
                }
            }
        } else {
            for (let i = 1; i <= 3; i++) {
                engine.softTakeoverIgnoreNextValue(`${ group.slice(0, -1) }_Effect${ i }]`, "meta");
            }
        }
    }

    focusLedCallback(value, _group, _key) {
        if (engine.getValue(this.group, "focused_effect") > 0) {
            if (value === 1) {
                this.controller.setOutput(this.group, "!effect_focus", this.outputColorMap.focusColor.full, true);
            } else {
                this.controller.setOutput(this.group, "!effect_focus", this.outputColorMap.focusColor.dim, true);
            }
        }
    }

    effectGroupCallback(value, group, key) {
        const ledValue = value ? this.outputColorMap.effectColor.full : this.outputColorMap.effectColor.dim;
        this.controller.setOutput(group, key, ledValue, true);
    }

    shiftPressed() {
        return this.mx2.decks[this.number - 1].shiftPressed;
    }
}

class EffectParameter {
    constructor(parent, number) {
        this.effectUnit = parent;
        this.controller = this.effectUnit.controller;

        this.number = number;
        this.groupPrefix = this.effectUnit.group.slice(0, -1);
        this.group = this.effectUnit.group;
        this.output = `!effect_button_${ this.number }`;

        this.outputColorMap = this.effectUnit.mx2.outputColorMap;

        this.longPressTimer = 0;
        this.isLongPressed = false;
        this.ledConnection = null;
    }

    registerInputs(config) {
        this.registerButton(`!effect_button_${ this.number }`, config.paramButton, this.effectButtonHandler);
        this.registerScalar(`!effect_knob_${ this.number }`, config.paramKnob, this.effectKnobHandler);
    }

    registerOutputs(config) {
        config.hidReport.addOutput(this.group, `!effect_button_${ this.number }`, config.offset, "B");
    }

    enableSoftTakeover() {
        const group = `${ this.groupPrefix }_Effect${ this.number }]`;
        engine.softTakeover(group, "meta", true);

        for (let i = 1; i <= 3; i++) {
            engine.softTakeover(group, `parameter${ i }`, true);
        }
    }

    disableOutputs() {
        for (let i = 1; i <= 3; i++) {
            this.controller.setOutput(this.group, `!effect_button_${ i }`, LedOff, false);
        }
    }

    registerButton(name, config, callback) {
        if (callback !== undefined) {
            callback = callback.bind(this);
        }

        config.hidReport.addControl(this.group, name, config.offset, "B", config.mask, false, callback);
    }

    registerScalar(name, config, callback) {
        if (callback !== undefined) {
            callback = callback.bind(this);
        }

        config.hidReport.addControl(this.group, name, config.offset, "H", 0xffff, false, callback);
    }

    effectButtonHandler(field) {
        if (field.value === 1) {
            if (this.effectUnit.shiftPressed()) {
                script.triggerControl(`${this.groupPrefix}_Effect${this.number}`, "next_effect");
                return;
            }

            if (this.effectUnit.focusSelectMode) {
                this.effectUnit.setFocusedEffect(this.number);
                return;
            }

            this.isLongPressed = false;
            this.toggleButton();

            this.longPressTimer = engine.beginTimer(300, () => {
                this.isLongPressed = true;
                this.longPressTimer = 0;
            }, true);

            return;
        }

        if (this.longPressTimer !== 0) {
            engine.stopTimer(this.longPressTimer);
            this.longPressTimer = 0;
        }

        if (this.isLongPressed) {
            this.isLongPressed = false;
            this.toggleButton();
        }
    }

    effectKnobHandler(field) {
        const knob = this.getKnobGroupAndKey();
        engine.setParameter(knob.group, knob.key, field.value / 4095);
    }

    connectFocusedLed() {
        this.connectLed(this.group, "focused_effect", this.ledCallbackFocused);
    }

    connectNormalLed() {
        const button = this.getButtonGroupAndKey();
        this.connectLed(button.group, button.key, this.ledCallbackNormal);
    }

    connectLed(group, key, callback) {
        if (this.ledConnection !== null) {
            this.ledConnection.disconnect();
        }

        this.ledConnection = engine.makeConnection(group, key, callback.bind(this));
        this.ledConnection.trigger();
    }

    toggleButton() {
        const button = this.getButtonGroupAndKey();

        // Limit param button toggle to available effect buttons
        if (engine.getValue(this.group, "focused_effect") !== 0) {
            if (button.key.slice(-1) <= engine.getValue(button.group, "num_button_parameters")) {
                script.toggleControl(button.group, button.key);
            }
        } else {
            script.toggleControl(button.group, button.key);
        }
    }

    getButtonGroupAndKey() {
        const focusedEffect = engine.getValue(this.group, "focused_effect");

        if (focusedEffect === 0) {
            return {
                group: `${ this.groupPrefix }_Effect${ this.number }]`,
                key: "enabled",
            };
        } else {
            return {
                group: `${ this.groupPrefix }_Effect${ focusedEffect }]`,
                key: `button_parameter${ this.number }`,
            };
        }
    }

    getKnobGroupAndKey() {
        const focusedEffect = engine.getValue(this.group, "focused_effect");

        if (focusedEffect === 0) {
            return {
                group: `${ this.groupPrefix }_Effect${ this.number}]`,
                key: "meta",
            };
        } else {
            return {
                group: `${ this.groupPrefix }_Effect${ focusedEffect }]`,
                key: `parameter${ this.number }`,
            };
        }
    }

    ledCallbackNormal(value) {
        this.ledCallback(value === 1);
    }

    ledCallbackFocused(value) {
        this.ledCallback(value === this.number);
    }

    ledCallback(value) {
        this.controller.setOutput(this.group, this.output,
            value ? this.outputColorMap.effectColor.full : this.outputColorMap.effectColor.dim, true);
    }
}

class Encoder {
    constructor() {
        this.previousValue = -1;
    }

    // 1 = right turn, -1 = left turn, 0 = something weird happens / first delta
    delta(value) {
        if (this.previousValue === -1) {
            this.previousValue = value;
            return 0;
        }

        let dir = 0;

        if ((value + 1) % 16 === this.previousValue) {
            dir = -1;
        } else if ((this.previousValue + 1) % 16 === value) {
            dir = 1;
        }

        this.previousValue = value;
        return dir;
    }
}

class MX2 {
    constructor() {
        this.controller = new HIDController();

        this.outputColorMap = this.getOutputColorMap(Settings.colorTheme);

        if (engine.getValue("[App]", "num_samplers") < 8) {
            engine.setValue("[App]", "num_samplers", 8);
        }

        this.mixer = new Mixer(this);

        this.decks = [
            new Deck(this, 1),
            new Deck(this, 2),
        ];

        this.effectUnits = [
            new EffectUnit(this, 1),
            new EffectUnit(this, 2),
        ];
    }

    registerInputPackets() {
        // 0x01: Buttons and encoders (binary inputs)
        // Packet is 64 + 15 = 79 bytes long; last 15 bytes are data, first is report ID 0x01
        const inputReport0x01 = new HIDPacket("inputReport0x01", 0x01, this.buttonInputReportCallback.bind(this));

        // 0x02: Knobs and faders (scalar inputs)
        // Packet is 64 + 53 = 117 bytes long; last 53 bytes are data, first is report ID 0x02
        // Most items are controls that go from 0 - 4095, but there are also some 4 bit encoders
        const inputReport0x02 = new HIDPacket("inputReport0x02", 0x02, this.scalarInputReportCallback.bind(this));

        // 0x03: Jog timer and jog wheel
        // Packet is 64 + 20 = 84 bytes long; last 20 bytes are data, first is report ID 0x03
        // Unlike the two other report types, the MX2 sends this continuously to provide a clock
        const inputReport0x03 = new HIDPacket("inputReport0x03", 0x03, this.scalarInputReportCallback.bind(this));

        // Input property names follow physical device labels where possible
        this.decks[0].registerInputs({
            favButton: {hidReport: inputReport0x01, offset: 0x01, mask: 0x10},
            prepButton: {hidReport: inputReport0x01, offset: 0x01, mask: 0x20},
            previewButton: {hidReport: inputReport0x01, offset: 0x01, mask: 0x40},
            viewButton: {hidReport: inputReport0x01, offset: 0x01, mask: 0x80},
            flxButton: {hidReport: inputReport0x01, offset: 0x02, mask: 0x01},
            revButton: {hidReport: inputReport0x01, offset: 0x02, mask: 0x02},
            ttButton: {hidReport: inputReport0x01, offset: 0x02, mask: 0x04},
            jogButton: {hidReport: inputReport0x01, offset: 0x02, mask: 0x08},
            shiftButton: {hidReport: inputReport0x01, offset: 0x02, mask: 0x10},
            sncButton: {hidReport: inputReport0x01, offset: 0x02, mask: 0x20},
            mstButton: {hidReport: inputReport0x01, offset: 0x02, mask: 0x40},
            keylockButton: {hidReport: inputReport0x01, offset: 0x02, mask: 0x80},
            hotcueButton: {hidReport: inputReport0x01, offset: 0x03, mask: 0x01},
            stemButton: {hidReport: inputReport0x01, offset: 0x03, mask: 0x02},
            sampleButton: {hidReport: inputReport0x01, offset: 0x03, mask: 0x04},
            loopButton: {hidReport: inputReport0x01, offset: 0x03, mask: 0x08},
            padButtons: [
                {hidReport: inputReport0x01, offset: 0x03, mask: 0x10},
                {hidReport: inputReport0x01, offset: 0x03, mask: 0x20},
                {hidReport: inputReport0x01, offset: 0x03, mask: 0x40},
                {hidReport: inputReport0x01, offset: 0x03, mask: 0x80},
                {hidReport: inputReport0x01, offset: 0x04, mask: 0x01},
                {hidReport: inputReport0x01, offset: 0x04, mask: 0x02},
                {hidReport: inputReport0x01, offset: 0x04, mask: 0x04},
                {hidReport: inputReport0x01, offset: 0x04, mask: 0x08}
            ],
            cueButton: {hidReport: inputReport0x01, offset: 0x04, mask: 0x10},
            playButton: {hidReport: inputReport0x01, offset: 0x04, mask: 0x20},
            fxButton: {hidReport: inputReport0x01, offset: 0x08, mask: 0x40},
            pflButton: {hidReport: inputReport0x01, offset: 0x08, mask: 0x80},
            browseEncoderPress: {hidReport: inputReport0x01, offset: 0x0a, mask: 0x04},
            moveEncoderPress: {hidReport: inputReport0x01, offset: 0x0a, mask: 0x08},
            loopEncoderPress: {hidReport: inputReport0x01, offset: 0x0a, mask: 0x10},
            jogTouch: {hidReport: inputReport0x01, offset: 0x0b, mask: 0x01},
            browseEncoderTurn: {hidReport: inputReport0x01, offset: 0x0c, mask: 0x0f},
            moveEncoderTurn: {hidReport: inputReport0x01, offset: 0x0c, mask: 0xf0},
            loopEncoderTurn: {hidReport: inputReport0x01, offset: 0x0d, mask: 0x0f},
            gainKnob: {hidReport: inputReport0x02, offset: 0x11},
            eqKnobs: [
                {hidReport: inputReport0x02, offset: 0x13},
                {hidReport: inputReport0x02, offset: 0x15},
                {hidReport: inputReport0x02, offset: 0x17}
            ],
            fxKnob: {hidReport: inputReport0x02, offset: 0x19},
            volumeFader: {hidReport: inputReport0x02, offset: 0x2b},
            rateFader: {hidReport: inputReport0x02, offset: 0x31},
            jogTimer: {hidReport: inputReport0x03, offset: 0x04},
            jogWheel: {hidReport: inputReport0x03, offset: 0x08}
        });

        this.decks[1].registerInputs({
            favButton: {hidReport: inputReport0x01, offset: 0x05, mask: 0x04},
            prepButton: {hidReport: inputReport0x01, offset: 0x05, mask: 0x08},
            previewButton: {hidReport: inputReport0x01, offset: 0x05, mask: 0x10},
            viewButton: {hidReport: inputReport0x01, offset: 0x05, mask: 0x20},
            flxButton: {hidReport: inputReport0x01, offset: 0x05, mask: 0x40},
            revButton: {hidReport: inputReport0x01, offset: 0x05, mask: 0x80},
            ttButton: {hidReport: inputReport0x01, offset: 0x06, mask: 0x01},
            jogButton: {hidReport: inputReport0x01, offset: 0x06, mask: 0x02},
            shiftButton: {hidReport: inputReport0x01, offset: 0x06, mask: 0x04},
            sncButton: {hidReport: inputReport0x01, offset: 0x06, mask: 0x08},
            mstButton: {hidReport: inputReport0x01, offset: 0x06, mask: 0x10},
            keylockButton: {hidReport: inputReport0x01, offset: 0x06, mask: 0x20},
            hotcueButton: {hidReport: inputReport0x01, offset: 0x06, mask: 0x40},
            stemButton: {hidReport: inputReport0x01, offset: 0x06, mask: 0x80},
            sampleButton: {hidReport: inputReport0x01, offset: 0x07, mask: 0x01},
            loopButton: {hidReport: inputReport0x01, offset: 0x07, mask: 0x02},
            padButtons: [
                {hidReport: inputReport0x01, offset: 0x07, mask: 0x04},
                {hidReport: inputReport0x01, offset: 0x07, mask: 0x08},
                {hidReport: inputReport0x01, offset: 0x07, mask: 0x10},
                {hidReport: inputReport0x01, offset: 0x07, mask: 0x20},
                {hidReport: inputReport0x01, offset: 0x07, mask: 0x40},
                {hidReport: inputReport0x01, offset: 0x07, mask: 0x80},
                {hidReport: inputReport0x01, offset: 0x08, mask: 0x01},
                {hidReport: inputReport0x01, offset: 0x08, mask: 0x02}
            ],
            cueButton: {hidReport: inputReport0x01, offset: 0x08, mask: 0x04},
            playButton: {hidReport: inputReport0x01, offset: 0x08, mask: 0x08},
            fxButton: {hidReport: inputReport0x01, offset: 0x09, mask: 0x04},
            pflButton: {hidReport: inputReport0x01, offset: 0x09, mask: 0x08},
            browseEncoderPress: {hidReport: inputReport0x01, offset: 0x0a, mask: 0x20},
            moveEncoderPress: {hidReport: inputReport0x01, offset: 0x0a, mask: 0x40},
            loopEncoderPress: {hidReport: inputReport0x01, offset: 0x0a, mask: 0x80},
            jogTouch: {hidReport: inputReport0x01, offset: 0x0b, mask: 0x02},
            browseEncoderTurn: {hidReport: inputReport0x01, offset: 0x0d, mask: 0xf0},
            moveEncoderTurn: {hidReport: inputReport0x01, offset: 0x0e, mask: 0x0f},
            loopEncoderTurn: {hidReport: inputReport0x01, offset: 0x0e, mask: 0xf0},
            gainKnob: {hidReport: inputReport0x02, offset: 0x1b},
            eqKnobs: [
                {hidReport: inputReport0x02, offset: 0x1d},
                {hidReport: inputReport0x02, offset: 0x1f},
                {hidReport: inputReport0x02, offset: 0x21}
            ],
            fxKnob: {hidReport: inputReport0x02, offset: 0x23},
            volumeFader: {hidReport: inputReport0x02, offset: 0x2d},
            rateFader: {hidReport: inputReport0x02, offset: 0x33},
            jogTimer: {hidReport: inputReport0x03, offset: 0x0c},
            jogWheel: {hidReport: inputReport0x03, offset: 0x10}
        });

        this.effectUnits[0].registerInputs({
            focusButton: {hidReport: inputReport0x01, offset: 0x01, mask: 0x01},
            mixKnob: {hidReport: inputReport0x02, offset: 0x01},
            fxParams: [
                {
                    paramButton: {hidReport: inputReport0x01, offset: 0x01, mask: 0x02},
                    paramKnob: {hidReport: inputReport0x02, offset: 0x03}
                },
                {
                    paramButton: {hidReport: inputReport0x01, offset: 0x01, mask: 0x04},
                    paramKnob: {hidReport: inputReport0x02, offset: 0x05}
                },
                {
                    paramButton: {hidReport: inputReport0x01, offset: 0x01, mask: 0x08},
                    paramKnob: {hidReport: inputReport0x02, offset: 0x07}
                },
            ],
            fxAssignButton1: {hidReport: inputReport0x01, offset: 0x08, mask: 0x10},
            fxAssignButton2: {hidReport: inputReport0x01, offset: 0x08, mask: 0x20},
        });

        this.effectUnits[1].registerInputs({
            focusButton: {hidReport: inputReport0x01, offset: 0x04, mask: 0x40},
            mixKnob: {hidReport: inputReport0x02, offset: 0x09},
            fxParams: [
                {
                    paramButton: {hidReport: inputReport0x01, offset: 0x04, mask: 0x80},
                    paramKnob: {hidReport: inputReport0x02, offset: 0x0b}
                },
                {
                    paramButton: {hidReport: inputReport0x01, offset: 0x05, mask: 0x01},
                    paramKnob: {hidReport: inputReport0x02, offset: 0x0d}
                },
                {
                    paramButton: {hidReport: inputReport0x01, offset: 0x05, mask: 0x02},
                    paramKnob: {hidReport: inputReport0x02, offset: 0x0f}
                },
            ],
            fxAssignButton1: {hidReport: inputReport0x01, offset: 0x09, mask: 0x01},
            fxAssignButton2: {hidReport: inputReport0x01, offset: 0x09, mask: 0x02}
        });

        this.mixer.registerInputs({
            fxPresetButtons: [
                {hidReport: inputReport0x01, offset: 0x09, mask: 0x10},
                {hidReport: inputReport0x01, offset: 0x09, mask: 0x20},
                {hidReport: inputReport0x01, offset: 0x09, mask: 0x40},
                {hidReport: inputReport0x01, offset: 0x09, mask: 0x80},
                {hidReport: inputReport0x01, offset: 0x0a, mask: 0x01}
            ],
            micButton: {hidReport: inputReport0x01, offset: 0x0a, mask: 0x02},
            gainKnob: {hidReport: inputReport0x02,  offset: 0x25},
            mixKnob: {hidReport: inputReport0x02, offset: 0x27},
            volKnob: {hidReport: inputReport0x02, offset: 0x29},
            crossfader: {hidReport: inputReport0x02, offset: 0x2f}
        });

        // Register packet
        this.controller.registerInputPacket(inputReport0x01);
        this.controller.registerInputPacket(inputReport0x02);
        this.controller.registerInputPacket(inputReport0x03);
    }

    registerOutputPackets() {
        const outputReport0x80 = new HIDPacket("outputReport0x80", 0x80);

        this.decks[0].registerOutputs({
            favButton: {hidReport: outputReport0x80, offset: 0x05},
            prepButton: {hidReport: outputReport0x80, offset: 0x06},
            previewButton: {hidReport: outputReport0x80, offset: 0x07},
            viewButton: {hidReport: outputReport0x80, offset: 0x08},
            flxButton: {hidReport: outputReport0x80, offset: 0x09},
            revButton: {hidReport: outputReport0x80, offset: 0x0a},
            ttButton: {hidReport: outputReport0x80, offset: 0x0b},
            jogButton: {hidReport: outputReport0x80, offset: 0x0c},
            // Left deck shift should be here (0x0d), but the MX2 firmwave doesn't allow changes
            sncButton: {hidReport: outputReport0x80, offset: 0x0e},
            mstButton: {hidReport: outputReport0x80, offset: 0x0f},
            keylockButton: {hidReport: outputReport0x80, offset: 0x10},
            hotcueButton: {hidReport: outputReport0x80, offset: 0x11},
            stemButton: {hidReport: outputReport0x80, offset: 0x12},
            sampleButton: {hidReport: outputReport0x80, offset: 0x13},
            loopButton: {hidReport: outputReport0x80, offset: 0x14},
            padButtons: [
                {hidReport: outputReport0x80, offset: 0x15},
                {hidReport: outputReport0x80, offset: 0x16},
                {hidReport: outputReport0x80, offset: 0x17},
                {hidReport: outputReport0x80, offset: 0x18},
                {hidReport: outputReport0x80, offset: 0x19},
                {hidReport: outputReport0x80, offset: 0x1a},
                {hidReport: outputReport0x80, offset: 0x1b},
                {hidReport: outputReport0x80, offset: 0x1c}
            ],
            cueButton: {hidReport: outputReport0x80, offset: 0x1d},
            playButton: {hidReport: outputReport0x80, offset: 0x1e},
            fxButton: {hidReport: outputReport0x80, offset: 0x3f},
            pflButton: {hidReport: outputReport0x80, offset: 0x40},
            bottomLeds: [
                {hidReport: outputReport0x80, offset: 0x4b},
                {hidReport: outputReport0x80, offset: 0x4c},
                {hidReport: outputReport0x80, offset: 0x4d},
                {hidReport: outputReport0x80, offset: 0x4e},
                {hidReport: outputReport0x80, offset: 0x4f},
                {hidReport: outputReport0x80, offset: 0x50}
            ],
            vuMeters: [
                {hidReport: outputReport0x80, offset: 0x58},
                {hidReport: outputReport0x80, offset: 0x59},
                {hidReport: outputReport0x80, offset: 0x5a},
                {hidReport: outputReport0x80, offset: 0x5b},
                {hidReport: outputReport0x80, offset: 0x5c},
                {hidReport: outputReport0x80, offset: 0x5d},
                {hidReport: outputReport0x80, offset: 0x5e},
                {hidReport: outputReport0x80, offset: 0x5f}
            ],
            peakIndicator: {hidReport: outputReport0x80, offset: 0x60}
        });

        this.decks[1].registerOutputs({
            favButton: {hidReport: outputReport0x80, offset: 0x23},
            prepButton: {hidReport: outputReport0x80, offset: 0x24},
            previewButton: {hidReport: outputReport0x80, offset: 0x25},
            viewButton: {hidReport: outputReport0x80, offset: 0x26},
            flxButton: {hidReport: outputReport0x80, offset: 0x27},
            revButton: {hidReport: outputReport0x80, offset: 0x28},
            ttButton: {hidReport: outputReport0x80, offset: 0x29},
            jogButton: {hidReport: outputReport0x80, offset: 0x2a},
            // Right deck shift should be here (0x2b), but the MX2 firmwave doesn't allow changes
            sncButton: {hidReport: outputReport0x80, offset: 0x2c},
            mstButton: {hidReport: outputReport0x80, offset: 0x2d},
            keylockButton: {hidReport: outputReport0x80, offset: 0x2e},
            hotcueButton: {hidReport: outputReport0x80, offset: 0x2f},
            stemButton: {hidReport: outputReport0x80, offset: 0x30},
            sampleButton: {hidReport: outputReport0x80, offset: 0x31},
            loopButton: {hidReport: outputReport0x80, offset: 0x32},
            padButtons: [
                {hidReport: outputReport0x80, offset: 0x33},
                {hidReport: outputReport0x80, offset: 0x34},
                {hidReport: outputReport0x80, offset: 0x35},
                {hidReport: outputReport0x80, offset: 0x36},
                {hidReport: outputReport0x80, offset: 0x37},
                {hidReport: outputReport0x80, offset: 0x38},
                {hidReport: outputReport0x80, offset: 0x39},
                {hidReport: outputReport0x80, offset: 0x3a}
            ],
            cueButton: {hidReport: outputReport0x80, offset: 0x3b},
            playButton: {hidReport: outputReport0x80, offset: 0x3c},
            fxButton: {hidReport: outputReport0x80, offset: 0x43},
            pflButton: {hidReport: outputReport0x80, offset: 0x44},
            bottomLeds: [
                {hidReport: outputReport0x80, offset: 0x51},
                {hidReport: outputReport0x80, offset: 0x52},
                {hidReport: outputReport0x80, offset: 0x53},
                {hidReport: outputReport0x80, offset: 0x54},
                {hidReport: outputReport0x80, offset: 0x55},
                {hidReport: outputReport0x80, offset: 0x56}
            ],
            vuMeters: [
                {hidReport: outputReport0x80, offset: 0x61},
                {hidReport: outputReport0x80, offset: 0x62},
                {hidReport: outputReport0x80, offset: 0x63},
                {hidReport: outputReport0x80, offset: 0x64},
                {hidReport: outputReport0x80, offset: 0x65},
                {hidReport: outputReport0x80, offset: 0x66},
                {hidReport: outputReport0x80, offset: 0x67},
                {hidReport: outputReport0x80, offset: 0x68}
            ],
            peakIndicator: {hidReport: outputReport0x80, offset: 0x69}
        });

        this.effectUnits[0].registerOutputs({
            focusButton: {hidReport: outputReport0x80, offset: 0x01},
            fxParams: [
                {hidReport: outputReport0x80, offset: 0x02},
                {hidReport: outputReport0x80, offset: 0x03},
                {hidReport: outputReport0x80, offset: 0x04}
            ],
            fxAssignButton1: {hidReport: outputReport0x80, offset: 0x3d},
            fxAssignButton2: {hidReport: outputReport0x80, offset: 0x41}
        });

        this.effectUnits[1].registerOutputs({
            focusButton: {hidReport: outputReport0x80, offset: 0x1f},
            fxParams: [
                {hidReport: outputReport0x80, offset: 0x20},
                {hidReport: outputReport0x80, offset: 0x21},
                {hidReport: outputReport0x80, offset: 0x22}
            ],
            fxAssignButton1: {hidReport: outputReport0x80, offset: 0x3e},
            fxAssignButton2: {hidReport: outputReport0x80, offset: 0x42}
        });

        this.mixer.registerOutputs({
            fxPresetButtons: [
                {hidReport: outputReport0x80, offset: 0x45},
                {hidReport: outputReport0x80, offset: 0x46},
                {hidReport: outputReport0x80, offset: 0x47},
                {hidReport: outputReport0x80, offset: 0x48},
                {hidReport: outputReport0x80, offset: 0x49}
            ],
            micButton: {hidReport: outputReport0x80, offset: 0x4a},
            peakIndicator: {hidReport: outputReport0x80, offset: 0x57}
        });

        this.controller.registerOutputPacket(outputReport0x80);

        this.decks.forEach(function(deck) {
            deck.enableOutputs();
            deck.linkOutputs();
            deck.setPadMode(0);
        });

        this.effectUnits.forEach(function(effectUnit) {
            effectUnit.linkOutputs();
        });

        this.mixer.enableOutputs();
        this.mixer.linkOutputs();

        this.controller.OutputPackets.outputReport0x80.send();
    }

    incomingData(data, length) {
        this.controller.parsePacket(data, length);
    }

    readCurrentPosition() {
        const report0x01 = new Uint8Array(controller.getInputReport(0x01));
        this.controller.parsePacket([0x01, ...Array.from(report0x01)]);

        const report0x02 = new Uint8Array(controller.getInputReport(0x02));
        // The first packet is ignored by HIDController
        this.controller.parsePacket([0x02, ...Array.from(report0x02.map(x => x ^ 0xff))]);
        this.controller.parsePacket([0x02, ...Array.from(report0x02)]);
    }

    buttonInputReportCallback(packet, data) {
        for (const name in data) {
            const field = data[name];
            this.controller.processButton(field);
        }
    }

    scalarInputReportCallback(packet, data) {
        for (const name in data) {
            const field = data[name];
            this.controller.processControl(field);
        }
    }

    enableSoftTakeover() {
        this.mixer.enableSoftTakeover();

        [0, 1].forEach(num => {
            this.decks[num].enableSoftTakeover();
            this.effectUnits[num].enableSoftTakeover();
        });
    }

    createCustomTheme() {
        const customTheme = {};

        // Populate the custom theme and use default theme values as fallback
        for (const [key, defaultValue] of Object.entries(DefaultTheme)) {
            customTheme[key] = LedColors[engine.getSetting(key)] || defaultValue;
        }

        return customTheme;
    }

    createColorMap(theme) {
        const colorMap = {};

        for (const [name, color] of Object.entries(theme)) {
            colorMap[name] = {
                full: color,
                dim: Math.max(0x00, color - 2)
            };
        }

        return colorMap;
    }

    getOutputColorMap(theme) {
        return this.createColorMap(
            theme === "Custom" ? this.createCustomTheme() : ColorThemes[theme] || DefaultTheme
        );
    }

    init(_id) {
        this.id = _id;
        this.registerInputPackets();
        this.readCurrentPosition();

        if (Settings.softTakeover) {
            this.enableSoftTakeover();
        }

        this.registerOutputPackets();

        console.log(`${ this.id } initialized`);
    }

    shutdown() {
        this.decks.forEach(function(deck) {
            deck.disableOutputs();
        });

        this.effectUnits.forEach(function(effectUnit) {
            effectUnit.disableOutputs();
        });

        this.mixer.disableOutputs();
        this.controller.OutputPackets.outputReport0x80.send();

        console.log(`${ this.id } shut down`);
    }
}

// eslint-disable-next-line
var TraktorMX2 = new MX2();
