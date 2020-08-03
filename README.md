# SeatNotify
中国大陆托福、GRE考位查询、空考位提醒。TOEFL, GRE seat information and seat notifier.

### Git 操作标准 (参考 Git-flow)
1. 克隆仓库到本地

    - git clone https://github.com/iamGeoWat/SeatNotify.git

2. 新建开发分支 git branch end(front-back)/type(feature-doc-fix)/name
    - 文档更新 doc/doc-name 例：git branch doc/readme
    - 新增或优化功能 feature/feature-name 例：git branch feature/gre-engine
    - 修复Bug fix/fix-name 例：git branch fix/mini-program-visual
    
3. 你的分支有修改后，将更新推到远程分支
    - git add . (添加修改到git)
    - git commit -m 'commit-message' (commit你的修改)
    - git push origin your-branch (将修改push到远程)

4. Pull Request 前的操作
    - git checkout master (切回 master 分支)
    - git pull (获取 master 分支的最新修改)
    - git checkout your-branch (切回你的开发分支)
    - git merge (将 master 上的修改融入进你的仓库，有 conflict 就要处理)
    - 去 Github 代码仓库里提 Pull Request
