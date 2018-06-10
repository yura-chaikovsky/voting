"use strict";


module.exports = function preprocess(content, map) {
    content = "export default function (self, Ruth)" + content.trim().slice(12, -3);

    this.callback(null, content, map);
};
