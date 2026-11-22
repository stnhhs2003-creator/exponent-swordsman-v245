---
name: math-game-sprite-stacking
description: Optional 2.5D pixel-art workflow for Math Game Studio & QA Master V2.1; use for rotating vehicles and environmental props.
---
# 數學幻境 V2.1｜2.5D 美術技術
來源：https://github.com/danielwh2/sprite-stacking （MIT）。S 級優先研究；初步審核完成，完整安全驗收及安裝尚未完成。本文件只登錄方法，不包含原始外掛或執行腳本。
## 選項
2.5D 立體像素風；2.5D 高精緻像素風。保留國一、國二、國三及原有美術選項。
## 流程
四張等比例正投影圖（上、側、前、後）→ 切片 → 逐層旋轉堆疊 → 檢視完整旋轉 → 整合既有 Canvas 渲染器。可預烘焙16方向 PNG，靜態物件快取。不要另建渲染管線或強制改動原有遊戲。
## 試點
第13款賽車優先，接續第12款史萊姆噗噗車、第05及10款大富翁、螺旋戰機、海底冒險。格鬥與武俠保留原角色多動作動畫，僅視需要使用立體道具。
## 品管
搭配 math-game-codegraph；先保留原版，獨立測試教室16:9、iPhone Safari、旋轉視覺、記憶體與幀率、操作及數學題庫。未驗證不得宣稱改善。維持13款遊戲，不新增第14、15款。
## 安全
不執行 npx、pip 或原始腳本；若需安裝原始技能，必先完成既定十項安全檢查、固定版本、隔離測試方案，取得使用者同意再安裝。保留來源授權與必要聲明。

## 縱向飛行射擊美術提示詞庫（螺旋戰機／數學空戰）
使用者提供的原始提示詞，保留英文原文。每項生圖前先貼上該專案 style.md 的「整體風格＋色調＋構圖」；若 style.md 不存在，先建立並確認統一風格，不假設已有內容。以下素材為俯視 2D sprite，不必強制使用 sprite stacking。
### player_01
```
Sci-fi fighter jet, top-down view, nose pointing up, sleek blue and white hull,
cyan glowing engines, symmetrical design, transparent background, no text.
```
### enemy_01
```
Sci-fi enemy drone fighter, top-down view, nose pointing down, angular red and
dark gray hull, red glowing core, aggressive silhouette, transparent background, no text.
```
### boss_01
```
Massive sci-fi battleship boss, top-down view, dark purple armored hull,
golden energy core in the center, multiple cannon turrets, imposing symmetrical
design, transparent background, no text.
```
### 整合與驗收規格
- 建議輸出 player_01.png、enemy_01.png、boss_01.png，透明背景、無文字、無浮水印；檢查 alpha 與實際可見範圍，避免假去背。
- 玩家青藍、敵方紅黑、Boss 深紫金色；與背景及答案標誌保持高對比。統一俯視角度、機體中心與光源。
- 可按玩法補齊尾焰、雷射、蓄力砲、護盾、命中閃光、爆炸、Boss 三階段素材；這些為擴充建議，非已生成資產。
- 先匯入既有遊戲獨立測試，確認圖片實際載入、碰撞範圍與圖像吻合、教室16:9可辨識、手機橫放不裁切，再更新正式入口。不得把聊天參考圖片當成已匯入資產。
- 本次只保存提示詞及工作規格，不生成圖片、不安裝外部工具、不更動既有遊戲。
