# atcoder-local-judge

> ### ⚠️ **注意**
> 
> このツールは **非公式** に開発されたものであり、AtCoder運営による公式サポートは存在しません。  
> - 本ツールによる取得処理は **1秒に1回以下のfetch** に制限されており、過度な負荷をかける設計ではありません。  
> - 入出力データを含む全データは **AtCoderの利用規約に基づく著作権の対象**であり、それに準拠して利用されています。  
> - すべての処理は **ローカル環境内で完結**し、データが外部に送信されることはありません。  
> - これは **外部で開発された開発されたオープンソースアプリケーション** です。

## 使用方法
> ### ⚠️
>
> 現在electronとしてのビルドを行っていないためアプリケーションとして利用することはできておらず、
> `npm`、`node`の環境がある方のみ利用することができる状態です。

以下コマンドを実行することで利用できます。
```bash
git clone https://github.com/minoru-kinugasa-105/atcoder-local-executor.git;
cd atcoder-local-executor;

npm install;
npm run page-dev;
```
標準では http://localhost:3000/ のwebページにて利用することができます。

## 仕様
コンテスト入力欄にコンテスト名を入力し、`問題を取得`をクリックすることで、問題一覧とそれらのテストケースが取得されます。  

![image](https://github.com/user-attachments/assets/0a51eb7d-a870-4b80-98b1-08cdc77a2a4b)

---

また、選択している問題のテストケースが表示されます。  
これらそれぞれのテストケースでのジャッジも可能です。  

![image](https://github.com/user-attachments/assets/a064fcd7-cd6a-43c7-8aea-bf07ea28f1f4)

---

ソースコード記述部分は`monaco-editor`を利用しているためこちらでのコード記述も可能です。

![image](https://github.com/user-attachments/assets/fd7a6e79-2c9f-47b1-90a8-6619d029730c)

---

`全てのテストケースを実行`をすると、全てのテストケースをジャッジします。  
このジャッジはローカル（pc内）で行われるため、コンテスト中の混雑したジャッジを待つ必要がありません。  
> このテストケース全てをジャッジするのに必要とする時間は約2秒でした。  

![image](https://github.com/user-attachments/assets/fd89b964-6994-46d7-8135-793481de83c8)

