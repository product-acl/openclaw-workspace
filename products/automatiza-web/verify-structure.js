#!/usr/bin/env node

// Simple verification script for Automatiza.lat landing page structure
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Automatiza.lat landing page structure...\n');

const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.ts',
  'postcss.config.js',
  'tsconfig.json',
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'README.md',
  'DEPLOY.md'
];

const sections = [
  'Hero',
  'The Pain / Anti-Status Quo',
  'How it Works',
  'Scope',
  'Trust / Founder Note',
  'Pricing',
  'FAQ'
];

let allPassed = true;

// Check required files
console.log('📁 File Structure:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${file}`);
  if (!exists) allPassed = false;
});

// Check page.tsx for sections
console.log('\n📄 Page Sections:');
const pageContent = fs.readFileSync(path.join(__dirname, 'app/page.tsx'), 'utf8');
sections.forEach(section => {
  // Check for section comments or section markers
  const hasSection = pageContent.includes(`Section`) && 
                     (pageContent.includes(section) || 
                      pageContent.includes(section.split(' ')[0])); // Check first word
  const status = hasSection ? '✅' : '⚠️';
  console.log(`  ${status} ${section}`);
  if (!hasSection) allPassed = false;
});

// Check for CTAs
console.log('\n🎯 Key Elements:');
const checks = [
  { name: 'Primary CTA ("Book a Fit Call")', check: pageContent.includes('Book a Fit Call') },
  { name: 'Pricing ($1,000)', check: pageContent.includes('$1,000') },
  { name: 'Founder note (Leo)', check: pageContent.includes('Leonardo Diaz') || pageContent.includes('Leo Diaz') },
  { name: 'Dark mode classes', check: pageContent.includes('dark') || pageContent.includes('gray-950') },
  { name: 'Gradient buttons', check: pageContent.includes('gradient-to-r') },
];

checks.forEach(({ name, check }) => {
  const status = check ? '✅' : '⚠️';
  console.log(`  ${status} ${name}`);
  if (!check && name.includes('Primary CTA')) allPassed = false;
});

console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ All checks passed! Landing page is ready for deployment.');
  console.log('\nNext steps:');
  console.log('1. npm install');
  console.log('2. npm run dev (test locally)');
  console.log('3. Deploy to Vercel (recommended)');
  console.log('4. Update Calendly link in CTAs');
} else {
  console.log('⚠️  Some checks failed. Review the structure.');
}
console.log('='.repeat(50));