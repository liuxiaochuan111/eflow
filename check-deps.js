#!/usr/bin/env node

/**
 * EFlow 项目依赖检查脚本
 * 检查所需的依赖是否已安装
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 检查 EFlow 项目依赖...\n');

const checks = [
  {
    name: '前端 node_modules',
    path: path.join(__dirname, 'frontend/node_modules'),
    required: true
  },
  {
    name: '后端 node_modules',
    path: path.join(__dirname, 'backend/node_modules'),
    required: true
  },
  {
    name: '前端 package.json',
    path: path.join(__dirname, 'frontend/package.json'),
    required: true
  },
  {
    name: '后端 package.json',
    path: path.join(__dirname, 'backend/package.json'),
    required: true
  }
];

let allPassed = true;

checks.forEach(check => {
  const exists = fs.existsSync(check.path);
  const status = exists ? '✅' : '❌';
  const statusText = exists ? '已安装' : '未安装';

  console.log(`${status} ${check.name}: ${statusText}`);

  if (check.required && !exists) {
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('✅ 所有依赖检查通过！');
  console.log('\n🚀 启动项目：');
  console.log('   后端: cd backend && npm run dev');
  console.log('   前端: cd frontend && npm run dev');
} else {
  console.log('❌ 依赖检查失败，请先安装依赖：');
  console.log('   cd backend && npm install');
  console.log('   cd frontend && npm install');
}

console.log('='.repeat(50) + '\n');
