import * as assert from 'assert';
import { findAnsi4Color } from '../strategies/ansi4';
import { suite, test } from 'vitest';
import { findAnsi8Color } from '../strategies/ansi8';
import { findAnsi24Color } from '../strategies/ansi24';

suite('ANSI Strategy Test', () => {
	const color4TableString = `const colorTables = ["\\x1b[30m", "\\x1b[31m"]`;
	const color8TableString = `const colorTables = ["\\x1b[38;5;0m", "\\x1b[38;5;1m"]`;
	const color24TableString = `const colorTables = ["\\x1b[38;2;0;0;0m", "\\x1b[38;2;0;0;1m"]`;

	test('Test ansi 4', () => {
		const result1 = findAnsi4Color(color4TableString);
		assert.equal(result1.length, 2);
		assert.equal(result1[0].color, 'rgb(0, 0, 0)');

		const result2 = findAnsi4Color(color8TableString);
		assert.equal(result2.length, 0);

		const result3 = findAnsi4Color(color24TableString);
		assert.equal(result3.length, 0);
	});

	test('Test ansi 8', () => {
		const result1 = findAnsi8Color(color4TableString);
		assert.equal(result1.length, 0);
		const result2 = findAnsi8Color(color8TableString);
		assert.equal(result2.length, 2);
		const result3 = findAnsi8Color(color24TableString);
		assert.equal(result3.length, 0);
	});

	test('Test ansi 24', () => {
		const result1 = findAnsi24Color(color4TableString);
		assert.equal(result1.length, 0);
		const result2 = findAnsi24Color(color8TableString);
		assert.equal(result2.length, 0);
		const result3 = findAnsi24Color(color24TableString);
		assert.equal(result3.length, 2);
	});
});
