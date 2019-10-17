"use strict";
const elfCount = 27;
const elfSourceWidth = 11;
const elfSourceHeight = 24;
const highestElfIndex = elfCount-1;
const backgroundStreamMode = false;
const internalWidth = 750;
const internalHeight = 650;
const soundGain = 3 / 4;
const musicNodeGain = 0.2;

const KEY_BINDS_KEY =      "KEY_BINDS_UV27";
const VOLUME_STORAGE_KEY = "VOLUME_UV27";
const SIZE_MODE_KEY =      "SIZE_MODE_KEY_UV27";
const SOUND_MUTED_KEY =    "SOUND_MUTED_UV27";
const MUSIC_MUTED_KEY =    "MUSIC_MUTED_UV27";
const DEFAULT_KEY_BINDS = JSON.stringify({
    Enter: kc.accept,
    Escape: kc.cancel,
    KeyP: kc.picture_mode,
    Space: kc.open,

    KeyW: kc.up,
    KeyD: kc.right,
    KeyS: kc.down,
    KeyA: kc.left,

    ArrowUp: kc.up,
    ArrowDown: kc.down,
    ArrowLeft: kc.left,
    ArrowRight: kc.right,

    KeyN: kc.nav_left,
    KeyM: kc.nav_right,
    F11: kc.fullscreen
});
