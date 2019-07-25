const fs = require("fs");

function createComponent(scanRootDir) {
    const dir = process.env.dir;
    if (!dir || dir === 'undefined') {
        console.log("组件目录没有定义");
        return false;
    }
    let componentDir = scanRootDir + "/" + dir;
    if (isHasDir(componentDir)) {
        console.log("组件目录已存在");
        return true;
    }
    console.log(componentDir);
    createDir(componentDir);
}

var projectData = {
    'name': '',
    'type': 'dir',
    'fileData': [
        {
            'name': "style",
            'type': "dir"
        },
        {
            'name': "style/index.scss",
            'type': "file"
        },
        {
            'name': "style/index.tsx",
            'type': "file",
            'content': "import './index.scss';\n"
        },
        {
            'name': "index.tsx",
            'type': "file"
        }
    ]
};

// 创建目录
function createDir(dir) {
    projectData.name = dir;
    fs.mkdirSync(projectData.name);
    var fileData = projectData.fileData;
    if (fileData && fileData.forEach) {
        fileData.forEach(function (f) {
            f.path = projectData.name + '/' + f.name;
            f.content = f.content || '';
            switch (f.type) {
                case 'dir':
                    fs.mkdirSync(f.path);
                    break;
                case 'file':
                    if (f.name === 'index.tsx') {
                        f.content += spliceContent(dir);
                    }
                    fs.writeFileSync(f.path, f.content, 'utf-8');
                    break;
                default:
                    break;
            }
        })
    }
}

// 
function spliceContent(name) {
    let content = '';
    try {
        let className = transName(name);
        content = 
            "import React from 'react';\n\n"+
            "export interface IProps {\n\n}\n"+
            "export interface IState {\n\n}\n"+
            "class "+className+" extends React.Component<IProps, IState> {\n\n"+
                "\tconstructor(props){\n"+
                "\t\tsuper(props);\n\n"+
                "\t}\n\n"+
                "\trender() {\n\n"+
                    "\t\treturn null;\n"+
                "\t}\n\n"+
            "}\n\n"+
            "export default "+className;
    } catch (e) {
        console.log(e);
    }
    return content;
}

// 根据目录生成组件名称
function transName(name) {
    name = name.split('/');
    name = name[name.length-1];
    let splitName = name.split("-");
    let newName = "";
    splitName.forEach(item => {
        let splitChar = item.split("");
        splitChar[0] = splitChar[0].toLocaleUpperCase();
        newName += splitChar.join('');
    });
    return newName;
}

// 目录是否存在
function isHasDir(dir) {
    let ret = false;
    try {
        const stat = fs.statSync(dir);
        if (stat.isDirectory()) {
            ret = true;
        }
    } catch (e) {
        ret = false;
    } finally {
        return ret;
    }
}

module.exports = { createComponent };