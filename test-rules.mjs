import { getAvailableRules } from './dist/src/core/config.js';

const rules = getAvailableRules();
console.log('利用可能なルール:');
rules.forEach(rule => {
  console.log(`  - ${rule.value}: ${rule.label}`);
});
