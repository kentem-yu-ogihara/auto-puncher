# auto-puncher👊
毎日の出勤、退勤の際、いちいちジョブカンを開いて打刻するのはめんどくさいですよね。
そんな手間を解消します！

> [!WARNING]
> 本アプリの起動には、Node.jsとnpmが必要です。

# 導入方法

1. 本リポジトリをクローンしてください。
2. `npm i`を実行してください。
3. `npx playwright install`を実行してください

# 使い方
1. `.env`ファイルを作成し、以下を設定してください。
```bash
PW_USERNAME=ジョブカンに登録してあるあなたの名前
PW_PASSWORD=ジョブカンに登録してあるあなたのパスワード
OVERTIME_REASON=残業申請の際の申請コメント
HEADLESS_MODE=onにすると、ブラウザが立ち上がらずに打刻されます
```
```bash
（例）
PW_USERNAME=hoge-fuga@piyo.co.jp
PW_PASSWORD=HogeFuga111
OVERTIME_REASON=業務のため
HEADLESS_MODE=
```

2. 出勤・退勤の際に、exec.batファイルをダブルクリックしてください。
3. アプリが起動するので、出勤か退勤か選択してください。

# 仕様
退勤の際は、今の時刻で、30分単位に丸めて残業申請まで行います。

（例）アプリの起動時間17：45
→17：30で残業申請
