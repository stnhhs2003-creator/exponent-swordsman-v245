# 城市大富翁 V3.7｜機會與命運事件規格（未接入遊戲）

此檔為獨立事件設計，不會改動 V3.6 換組、題庫、骰子或計時。正式整合前必須取得原始回合引擎並驗證事件流程。

```json
{
  "version": "3.7-design",
  "status": "prototype-not-integrated",
  "chance": [
    {
      "id": "train",
      "title": "城市高鐵",
      "emoji": "🚄",
      "kind": "question_move",
      "level": "advanced",
      "successSteps": 3,
      "failureSteps": 0
    },
    {
      "id": "treasure",
      "title": "神秘寶箱",
      "emoji": "🎁",
      "kind": "choose_reward",
      "choices": [
        1,
        2,
        3
      ]
    },
    {
      "id": "helicopter",
      "title": "空中捷徑",
      "emoji": "🚁",
      "kind": "question_move",
      "level": "expert",
      "successSteps": 3,
      "failureSteps": 0
    },
    {
      "id": "shield",
      "title": "幸運護盾",
      "emoji": "🛡️",
      "kind": "shield",
      "maxStored": 1
    },
    {
      "id": "double",
      "title": "雙倍挑戰",
      "emoji": "🎯",
      "kind": "optional_question",
      "level": "expert",
      "successSteps": 4,
      "failureSteps": -1
    },
    {
      "id": "catchup",
      "title": "落後追擊",
      "emoji": "🏆",
      "kind": "catchup_question",
      "level": "expert",
      "successSteps": 2,
      "failureSteps": 0
    }
  ],
  "fate": [
    {
      "id": "tornado",
      "title": "城市龍捲風",
      "emoji": "🌪️",
      "kind": "avoid_penalty_question",
      "level": "advanced",
      "successSteps": 0,
      "failureSteps": -2
    },
    {
      "id": "redlight",
      "title": "紅燈管制",
      "emoji": "🚦",
      "kind": "question_hold",
      "level": "basic",
      "successSteps": 0,
      "failureSteps": 0
    },
    {
      "id": "swap",
      "title": "時空交換站",
      "emoji": "🔀",
      "kind": "optional_swap",
      "level": "expert",
      "target": "nearest_ahead",
      "failureSteps": 0
    },
    {
      "id": "boss",
      "title": "魔王封鎖線",
      "emoji": "👹",
      "kind": "question_move",
      "level": "boss",
      "successSteps": 3,
      "failureSteps": 0
    },
    {
      "id": "fatedice",
      "title": "命運骰子",
      "emoji": "🎲",
      "kind": "risk_choice",
      "safeSteps": 1,
      "riskySteps": [
        0,
        1,
        2,
        3
      ]
    },
    {
      "id": "lightning",
      "title": "雷電危機",
      "emoji": "⚡",
      "kind": "shieldable_penalty",
      "steps": -1
    }
  ],
  "rules": {
    "trigger": "landing on chance/fate tile after normal movement completes",
    "draw": "shuffle once per game and cycle with reshuffle; avoid immediate duplicate",
    "atomic": "one event per landing, no chained events; event movement does not retrigger event tiles",
    "turn": "resolve event -> apply movement or shield -> finalize -> next player (existing turn engine)",
    "question": "reuse selected unit and current difficulty bank; don't create parallel countdown timers",
    "guard": "one pending event at most, idempotent resolution token, no event may call the next-player button twice",
    "limits": "maximum bonus advance 4, maximum penalty retreat 2, shield cap 1, no negative board position",
    "verification": [
      "next player button works",
      "next team receives a new question",
      "at least 5 full rounds",
      "event reward and penalty do not deadlock the game",
      "16:9 screen and iPhone Safari",
      "audio resumes only with user gesture"
    ]
  }
}
```

注意：此分支從 V3.6 測試分支建立，不代表此版本已部署，也不代表正式版已更新。
