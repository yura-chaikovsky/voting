"use strict";


module.exports = function preprocess(content, map) {
    content = content
        .replace(/::(\w+)/g, "self.$1")
        .replace(/>(\w+)\s*\(/g, "Ruth.$1(")
        .replace(/<([A-Z]\w*)/g, "<Ruth.$1");

    this.callback(null, content, map);
};
