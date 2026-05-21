/**
 * Second pass: catches leftover patterns missed in the first run.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ADMIN_DIR = 'resources/js/Pages/Admin';

const REPLACEMENTS = [
    // Table header row (exact pattern from index pages)
    [/border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-zinc-500 text-sm font-semibold uppercase tracking-wider/g, 'border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider'],
    [/border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider/g, 'border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider'],
    // search icon color
    [/h-4 w-4 text-gray-400/g, 'h-4 w-4 text-zinc-500'],
    // remaining border-gray-200/700
    [/border border-gray-200 dark:border-gray-700/g, 'border border-white/5'],
    [/divide-gray-100 dark:divide-gray-700/g, 'divide-white/[0.04]'],
    // remaining gray-400/500 standalone
    [/"text-gray-400"/g, '"text-zinc-500"'],
    [/"text-gray-500"/g, '"text-zinc-500"'],
    // leftover bg-gray-200 dark:bg-gray-700
    [/bg-gray-200 dark:bg-gray-700/g, 'bg-zinc-800'],
    [/bg-gray-50 dark:bg-gray-800\/50/g, 'bg-[#080808]/40'],
    [/bg-gray-50 dark:bg-gray-800/g, 'bg-[#0c0c0e]'],
    // inline-flex pill container remnants
    [/px-2.5 py-0.5 rounded-full text-xs font-medium/g, 'px-2.5 py-0.5 rounded-full text-[10px] font-semibold border'],
    // border-gray-300 dark:border-gray-600 remaining
    [/border-gray-300 dark:border-gray-600/g, 'border-white/10'],
    [/border-gray-300/g, 'border-white/10'],
    // bg-gray-900 remaining form inputs
    [/bg-white dark:bg-gray-900/g, 'bg-[#080808]'],
    [/bg-gray-900/g, 'bg-[#080808]'],
    // remaining text colors
    [/text-gray-900 dark:text-gray-100/g, 'text-white'],
    [/text-gray-900/g, 'text-white'],
    [/dark:text-gray-400/g, 'text-zinc-500'],
    [/dark:text-gray-300/g, 'text-zinc-300'],
    [/dark:text-gray-200/g, 'text-zinc-200'],
    // Upload icon
    [/text-gray-400" \/>/g, 'text-zinc-600" />'],
    // remaining bg-white
    [/bg-white hover:bg-gray-50 dark:hover:bg-gray-700/g, 'bg-white/5 hover:bg-white/10'],
    [/" bg-white"/g, '" bg-[#080808]"'],
    // link text colors
    [/text-gray-500 hover:text-gray-700/g, 'text-zinc-500 hover:text-[var(--gold)]'],
    [/text-gray-700 dark:text-gray-300/g, 'text-zinc-300'],
    [/text-gray-600/g, 'text-zinc-400'],
    // shadow-sm (subtle)
    [/shadow-sm/g, ''],
];

function processFile(filePath) {
    let content = readFileSync(filePath, 'utf-8');
    let changed = false;
    for (const [from, to] of REPLACEMENTS) {
        const next = content.replace(from, to);
        if (next !== content) { content = next; changed = true; }
    }
    if (changed) {
        writeFileSync(filePath, content, 'utf-8');
        console.log('✅ Pass-2 restyled:', filePath);
    }
}

function walk(dir) {
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (full.endsWith('.jsx')) processFile(full);
    }
}

walk(ADMIN_DIR);
console.log('\nPass 2 done.');
