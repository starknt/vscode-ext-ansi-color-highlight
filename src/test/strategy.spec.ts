import * as assert from 'assert';
import { findAnsi8Color } from '../strategies/ansi8';
import { suite, test } from 'vitest';

suite('ANSI8 Strategy Test', () => {
	test('Test 1', () => {
		const colorTableString = `const colorTables = ["\\x1b[30m", "\\x1b[31m"]`;

		const result = findAnsi8Color(colorTableString);
		assert.equal(result.length, 2);
		assert.equal(result[0].color, 'rgb(0, 0, 0)');
	});
});
