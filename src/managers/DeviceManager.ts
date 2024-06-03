// Default devices
import type { DeviceManagerConfig } from 'grapesjs';
import {
	DesktopWindows,
	Laptop,
	Tablet,
	PhoneAndroid,
	TabletMac
} from '@paulpopa/icons/md/outlined';

const breakpoints = [10, 640, 768, 1024, 1280, 1536];
export const devices = [
	{
		id: 'desktop',
		name: 'Desktop',
		priority: 4,
		icon: DesktopWindows
	},
	{
		id: 'laptop',
		name: 'Laptop',
		width: '1260px',
		widthMedia: '1279px',
		priority: 3,
		icon: Laptop
	},
	{
		id: 'tablet',
		name: 'Tablet',
		width: '1020px',
		widthMedia: '1023px',
		priority: 2,
		icon: TabletMac
	},
	{
		id: 'mobile-landscape',
		name: 'Mobile Landscape',
		width: '760px',
		widthMedia: '767px',
		priority: 1,
		icon: Tablet
	},
	{
		id: 'mobile',
		name: 'Mobile',
		width: '600px',
		widthMedia: '639px',
		priority: 0,
		icon: PhoneAndroid
	}
];

export default {
	// The device `id` to select on start, if not indicated, the first available from `devices` will be used.
	default: 'desktop',
	devices
} as DeviceManagerConfig;
