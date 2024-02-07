"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_process_1 = require("node:process");
var node_path_1 = require("node:path");
var bcc2srtCore = function (bccConfig) {
    var timeConverter = function (second) {
        return [
            [
                Math.trunc(second / 60 / 60),
                Math.trunc(second / 60),
                Math.trunc(second % 60)
            ].map(function (num) { return num.toString().padStart(2, '0'); }).join(':'),
            (second % 1).toFixed(3).toString().slice(2, 5)
        ].join(",");
    };
    return bccConfig.body.reduce(function (prev, item, index) {
        var idx = "".concat(index + 1);
        prev[idx] = {
            from: timeConverter(item.from),
            to: timeConverter(item.to),
            content: item.content
        };
        return prev;
    }, {});
};
var FIRST_FILE_IDX = 2;
var inputFileName = node_process_1.argv[FIRST_FILE_IDX];
if (inputFileName) {
    try {
        var srtConfigs = bcc2srtCore(JSON.parse((0, node_fs_1.readFileSync)(inputFileName, { encoding: 'utf8' })));
        var strs = [];
        for (var key in srtConfigs) {
            var _a = srtConfigs[key], from = _a.from, to = _a.to, content = _a.content;
            var time = "".concat(from, " --> ").concat(to);
            strs.push([key, time, content].join('\n'));
        }
        (0, node_fs_1.writeFileSync)((0, node_path_1.resolve)(inputFileName).replace(/\.[\s\S]+$/g, '.srt'), strs.join('\n\n'));
    }
    catch (e) {
        console.error(e);
    }
}
