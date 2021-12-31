<template>
  <div>
    <div class="sticky bg-white top-0 z-50">
      <div class="max-w-full mx-auto">
        <div class="flex flex-col justify-center items-center border-b-2 border-gray-300 py-2">
          <label class="inline-flex items-center w-7/12">
            <input type="radio" class="text-indigo-600" name="mode" value="0" checked v-model="mode">
            <span class="">精密（校正サーバーにツクールのテキストデータを送ります ※要ネット環境）</span>
          </label>
          <label class="inline-flex items-center w-7/12">
            <input type="radio" class="text-indigo-600" name="mode" value="1" v-model="mode">
            <span class="">簡易（プラグイン上でチェック）</span>
          </label>
        </div>
        <div class="flex justify-center items-center border-b-2 border-gray-300 py-2">
          <div class="flex flex-col justify-evenly items-start py-1">
            <label><input type="checkbox" value="CommonEvents.json" v-model="targets">コモンイベント</label>
            <label><input type="checkbox" value="Weapons.json" v-model="targets">武器</label>
            <label><input type="checkbox" value="Enemies.json" v-model="targets">敵キャラ</label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1 pl-2">
            <label><input type="checkbox" value="MapInfos.json" v-model="targets">マップ</label>
            <label><input type="checkbox" value="Armors.json" v-model="targets">防具</label>
            <label><input type="checkbox" value="Troops.json" v-model="targets">敵グループ</label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1 px-2">
            <label><input type="checkbox" value="Items.json" v-model="targets">アイテム</label>
            <label><input type="checkbox" value="Classes.json" v-model="targets">職業</label>
            <label><input type="checkbox" value="States.json" v-model="targets">ステート</label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1">
            <label><input type="checkbox" value="Actors.json" v-model="targets">アクター</label>
            <label><input type="checkbox" value="Skills.json" v-model="targets">スキル</label>
            <label><input type="checkbox" value="System.json" v-model="targets">システム</label>
          </div>
        </div>
        <div class="flex justify-center items-center border-b-2 border-gray-300 py-2">
          <button @click="execute()" type="button" class="inline-flex items-center px-12 py-2 mx-3 rounded-full text-white bg-indigo-600 hover:bg-indigo-800">
            チェックする
          </button>
          <button @click="stop()" type="button" class="inline-flex items-center px-12 py-2 mx-3 rounded-full text-white bg-stone-600 hover:bg-stone-800">
            停止
          </button>
        </div>
      </div>
    </div>

    <table class="table-fixed w-full max-w-7xl mx-auto mt-6 border-collapse border border-neutral-500">
      <thead>
        <tr class="bg-indigo-100">
          <th class="border border-neutral-500">出現箇所</th>
          <th class="border border-neutral-500">テキスト</th>
          <th class="border border-neutral-500">校正案</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in results">
          <td class="border border-neutral-500">{{result.location}}</td>
          <td class="border border-neutral-500">{{result.text}}</td>
          <td class="border border-neutral-500">{{result.suggestion}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      results: [],
      connection: null,
      targets: [],
      mode: "",
    }
  },
  methods: {
    sendGameText: function (filename) {
      const fs = nw.require('fs');
      const path = nw.require('path');
      let data_dir = path.join(process.cwd(), 'data');
      this.connection.send(JSON.stringify({'filename':filename, 'json_data':JSON.parse(fs.readFileSync(path.join(data_dir, filename)))}));
    },
    execute: function () {
      this.results = []

      if(this.mode == "0"){
        this.connection = new WebSocket("ws://192.168.0.16:8080");

        this.connection.onopen = function(event) {
          this.targets.forEach(json_name => {
            this.sendGameText(json_name);
          });
        }.bind(this)

        this.connection.onmessage = function(event) {
          this.results.push(JSON.parse(event.data));
        }.bind(this)
      }else{

      }
    },
    stop: function () {
      this.connection.close()
    }
  },
  mounted() {
  },
}
</script>