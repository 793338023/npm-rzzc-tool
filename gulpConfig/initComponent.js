const fs = require("fs");
const path = require('path');
const readline = require('linebyline');

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
    console.log("开始检查...");
    checkFile(scanRootDir);
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
                    console.log("模板生成完毕...");
                    break;
                default:
                    break;
            }
        })
    }
}

// 导出文件模板
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
function isHasDir(dir, isFiles = false) {
    let ret = false;
    try {
        const stat = fs.statSync(dir);
        if (stat.isDirectory()) {
            ret = true;
        }else if(isFiles && stat.isFile()){
            ret = true;
        }
    } catch (e) {
        ret = false;
    } finally {
        return ret;
    }
}

function checkFile(dir){
    try{
        fs.readdir(dir,(err, files)=>{
            if(err){
                console.log(err);
                return ;
            }
            readAndWrite(dir, files);
        });
    }catch(err){
        console.log(err);
    }
}

function readAndWrite(dir, files){
    const fileName = "index.tsx";
    const index = files.indexOf(fileName);
    const indexFile = path.resolve(dir, fileName);
    if(!~index){
        console.log(indexFile+":不存在");
        return ;
    }
    files.splice(index, 1);
    const checkDirArr = [];
    files.forEach((item)=>{
        const stat = fs.statSync(path.resolve(dir, item));
        if (stat.isDirectory()) {
            checkDirArr.push("./"+item);
        }
    });

    const lineArr = [];
    const delCountLineArr = [];
    rl = readline(indexFile);
    rl.on('line', function(line, lineCount, byteCount) {
        if(~line.indexOf("export")){
            if(line.match(new RegExp(checkDirArr.join("|")))){
                lineArr.push(line+"\n");
            }else{
                delCountLineArr.push({line,lineCount});
            }
        }else{
            if(line.trim() !== ""){
                lineArr.push(line);
            }
        }
      })
      .on('error', function(e) {
        console.error(e);
      }).on('close',()=>{
          if(delCountLineArr.length){
            console.log("删除了:");
            console.log(delCountLineArr);
            fs.writeFileSync(indexFile, lineArr.join("\n"), 'utf-8');
          }
          console.log("检查完毕!!!!!");
      });
}


module.exports = { 
    isExitDirFile: isHasDir,
    checkFile: checkFile,
    createComponent
 };