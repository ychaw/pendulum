// Global parameters
export const PARAM_SMOOTHING = 0.3; // Smoothing for parameter changes in seconds
export const SAMPLERATE = 48000;
export const DSPZERO = 1e-32; // DSP elements do not like zero. Use this instead.
export const TWENTYK = 20000; // Approx. upper limit of human hearing
export const VALUERES = 1000; // Resolution in steps for values that need mapping from UI into DSP.


// Strings for reuse
export const A = 'a';
export const D = 'd';
export const S = 's';
export const R = 'r';
export const LP = 'lp';
export const HP = 'hp';
export const BP = 'bp';
export const NOTCH = 'notch';
export const TYPE = 'type';
export const FREQ = 'frequency';
export const RES = 'resonance';
