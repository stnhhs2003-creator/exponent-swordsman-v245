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
