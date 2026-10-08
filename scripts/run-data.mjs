import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { quoteFx } from '../src/fx.js';
function run(command,args) { const r=spawnSync(command,args,{stdio:'inherit',shell:false}); if(r.status!==0) throw Error(`RUNNER_STEP_FAILED: ${command}`); }
function git(args){ const r=spawnSync('git',args,{encoding:'utf8'}); if(r.status!==0) throw Error('GIT_CHECK_FAILED'); return r.stdout.trim(); }
if(git(['branch','--show-current'])!=='main' || git(['remote','get-url','origin'])!=='https://github.com/ansqhd5774-Choi/lamdready.git') throw Error('WRONG_TARGET');
if(git(['status','--porcelain'])) throw Error('WORKTREE_DIRTY: commit or preserve changes before runner');
run(process.execPath,['scripts/collect-local.mjs']);
const b=JSON.parse(fs.readFileSync('local-data/latest.json','utf8').replace(/^\uFEFF/,''));
quoteFx(b.fx,'EUR',['KRW','USD','JPY','SGD','THB','AUD','CNY']);
fs.writeFileSync('data/fx-latest.json',JSON.stringify(b.fx,null,2));
fs.writeFileSync('data/travel-advice.json',JSON.stringify(b.advice,null,2));
run(process.execPath,['--test']);
run(process.execPath,['scripts/build-assets.mjs']);
run('git',['add','data/fx-latest.json','data/travel-advice.json']);
if(git(['diff','--cached','--name-only'])) { run('git',['commit','-m','chore(data): 로컬 러너의 검증된 공개 데이터 갱신']); }
run('git',['push','origin','main']);
console.log('Published public snapshots via GitHub -> Cloudflare Builds. Verify deployment and /api/status separately.');
