import { join } from 'path';
import type { Config } from 'tailwindcss';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';
import { rewardStationOmegaTheme1 } from './reward-station-omega-theme-1';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {
			maxWidth: {
				'8xl': '90rem'
			},
			fontFamily: {
				"raleway": ["Raleway", "sans-serif"],
			}
		},
	},
  plugins: [
    skeleton({
      themes: {
        custom: [rewardStationOmegaTheme1]
      }
    })
  ]
} satisfies Config;

export default config;
