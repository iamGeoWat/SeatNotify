# SeatNotify
中国大陆托福、GRE考位查询、空考位提醒。TOEFL, GRE seat information and seat notifier.

### 主R的任务罢了
|  Task | Branch | 谁做 | 完成情况 |
|    ----    |  ----  | -- | --- |
|  修复小程序底部tabbar  | 待定 | tcy666 |  |
| 爬虫掉登录态时的错误处理、上报sentry | 无 |  |  |
| 后端、爬虫 Code Review  | 无 | Dormitabnia |  |
| 迁移至腾讯云  | 无 | iamGeoWat |  |

### Git 操作标准 (参考 Git-flow)
开发前的操作
1. 克隆仓库到本地

    - git clone https://github.com/iamGeoWat/SeatNotify.git

2. 新建开发分支 git branch end(front-back)/type(feature-doc-fix)/name
    - 文档更新 doc/doc-name 例：git branch front/doc/readme
    - 新增或优化功能 feature/feature-name 例：git branch back/feature/gre-engine
    - 修复Bug fix/fix-name 例：git branch front/fix/mini-program-visual
    
3. 切到你刚建的开发分支 git checkout your-branch

修改后的操作
    
1. 你的分支有修改后，将更新 push 到 Github
    - git add . (添加修改到暂存区)
    - git commit -m 'commit-message' (commit你的修改，commmit message写上修改了什么)
    - git push origin your-branch (将修改push到远程)

2. 此分支要做的事情开发完毕，提 Pull Request
    - git checkout master (切回 master 分支)
    - git pull (获取 master 分支的最新修改)
    - git checkout your-branch (切回你的开发分支)
    - git merge (将 master 上的修改融入进你的仓库，有 conflict 就要处理)
    
    要是 master 在你开发的时间里没有修改，上面四步就免了。
    - 去 Github 代码仓库里提 Pull Request
