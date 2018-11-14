import { GrabberJob } from '@magz/common';

export let jobs = new Map<string, GrabberJob>();
export let runned = new Map<string, boolean>();
export const streams = new Map<string, Map<string, any[]>>();