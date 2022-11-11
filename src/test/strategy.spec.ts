import { expect, suite, test } from 'vitest';
import { findAnsi4Color } from '../strategies/ansi4';
import { findAnsi8Color } from '../strategies/ansi8';
import { findAnsi24Color } from '../strategies/ansi24';

suite('ANSI Strategy Test', () => {
	const color4TableString = `const colorTables = ["\\x1b[30m", "\\x1b[31m"]`;
	const color8TableString = `const colorTables = ["\\x1b[38;5;0m", "\\x1b[38;5;1m"]`;
	const color24TableString = `const colorTables = ["\\x1b[38;2;0;0;0m", "\\x1b[38;2;0;0;1m"]`;

	test('Test ansi 4', () => {
		const result1 = findAnsi4Color(color4TableString);
		expect(result1.length).eq(2);
		expect(result1[0].color).eq('rgb(0, 0, 0)');

		const result2 = findAnsi4Color(color8TableString);
		expect(result2.length).eq(0);

		const result3 = findAnsi4Color(color24TableString);
		expect(result3.length).eq(0);
	});

	test('Test ansi 8', () => {
		const result1 = findAnsi8Color(color4TableString);
		expect(result1.length).eq(0);
		const result2 = findAnsi8Color(color8TableString);
		expect(result2.length).eq(2);
		const result3 = findAnsi8Color(color24TableString);
		expect(result3.length).eq(0);
	});

	test('Test ansi 24', () => {
		const result1 = findAnsi24Color(color4TableString);
		expect(result1.length).eq(0);
		const result2 = findAnsi24Color(color8TableString);
		expect(result2.length).eq(0);
		const result3 = findAnsi24Color(color24TableString);
		expect(result3.length).eq(2);
		expect(result3).toMatchInlineSnapshot(`
			[
			  {
			    "color": "rgb(0, 0, 0)",
			    "end": 38,
			    "start": 22,
			  },
			  {
			    "color": "rgb(0, 0, 1)",
			    "end": 58,
			    "start": 42,
			  },
			]
		`);
	});
});
