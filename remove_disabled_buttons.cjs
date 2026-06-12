const fs = require('fs');
const path = require('path');

const adminPagesDir = path.join(__dirname, 'resources', 'js', 'Pages', 'Admin');

// Recursively find all Index.jsx
function findIndexFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findIndexFiles(fullPath));
        } else if (file === 'Index.jsx' || file === 'Create.jsx' || file === 'Edit.jsx') {
            results.push(fullPath);
        }
    });
    return results;
}

const files = findIndexFiles(adminPagesDir);

files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Pattern for Create button:
    // {hasPermission(...) ? ( ... ) : ( <button disabled... </button> )}
    // Note: Due to JSX, writing a pure regex for nested tags is hard. We can just replace the specific string chunks we know exist, or just use regex with specific boundaries.
    
    // Instead of full AST parsing, let's just do targeted string replacements for the known pattern.
    const createPattern = /\{([^{]*hasPermission\('[^']+'\)[^?]*)\?\s*\(\s*(<Link[\s\S]*?<\/Link>)\s*\)\s*:\s*\(\s*<button[\s\S]*?disabled[\s\S]*?<\/button>\s*\)\}/g;
    
    content = content.replace(createPattern, '{ ($1) && (\n$2\n)}');

    // Pattern for Edit button
    const editPattern = /\{([^{]*hasPermission\('edit_[^']+'\)[^?]*)\?\s*\(\s*(<Link[\s\S]*?<\/Link>)\s*\)\s*:\s*\(\s*<button[\s\S]*?disabled[\s\S]*?<\/button>\s*\)\}/g;
    content = content.replace(editPattern, '{ ($1) && (\n$2\n)}');

    // Pattern for Delete button
    const deletePattern = /\{([^{]*hasPermission\('delete_[^']+'\)[^?]*)\?\s*\(\s*(<button[\s\S]*?onClick=\{[\s\S]*?<\/button>)\s*\)\s*:\s*\(\s*<button[\s\S]*?disabled[\s\S]*?<\/button>\s*\)\}/g;
    content = content.replace(deletePattern, '{ ($1) && (\n$2\n)}');

    // Generic hasPermission matching ? ( ... ) : ( <button disabled ... </button> )
    // A bit more robust for any tag that has disabled inside it.
    const genericPattern = /\{([^{]*hasPermission\([^)]+\)[^?]*)\?\s*\(\s*(<[^>]+>[\s\S]*?<\/[^>]+>)\s*\)\s*:\s*\(\s*<button[^>]*disabled[^>]*>[\s\S]*?<\/button>\s*\)\}/g;
    content = content.replace(genericPattern, '{ ($1) && (\n$2\n)}');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
});
