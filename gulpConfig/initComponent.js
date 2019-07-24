const fs = require("fs");

function createComponent(scanRootDir){
    const dir = process.env.dir;
    if (!dir || dir === 'undefined') {
        console.log("组件目录没有定义");
        return false;
    }
    let componentDir = scanRootDir+"/"+dir;
    if(isHasDir(componentDir)){
        console.log("组件目录已存在");
        return true;
    }
    console.log(componentDir);
    createDir(componentDir);
}

var projectData={
    'name':'',
    'type':'dir',
    'fileData':[
        {
            'name':'style',
            'type':'dir'
        },
        {
            'name':'style/index.scss',
            'type':'file'
        },
        {
            'name':'style/index.tsx',
            'type':'file'
        },
        {
            'name':'index.tsx',
            'type':'file',
            'content':"import React from 'react';\nimport { List, InputItem } from 'antd-mobile';"
        }
    ]
};

// 创建目录
function createDir(dir){
    projectData.name = dir;
    fs.mkdirSync(projectData.name);
    var fileData=projectData.fileData;
    if (fileData&&fileData.forEach){
        fileData.forEach(function (f) {
            f.path=projectData.name+'/'+f.name;
            f.content=f.content||'';
            switch (f.type){
                case  'dir':
                    fs.mkdirSync(f.path);
                    break;
                case 'file':
                    fs.writeFileSync(f.path,f.content,'utf-8');
                    break;
                default :
                    break;
            }
        })
    }
}

// 目录是否存在
function isHasDir(dir) {
    let ret = false;
    try {
        const stat = fs.statSync(dir);
        if(stat.isDirectory()){
            ret = true;
        }
    } catch (e) {
        ret = false;
    }finally{
        return ret;
    }
}

module.exports = {createComponent};