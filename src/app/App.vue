<template>
  <div>
    <div class="sticky bg-white top-0 z-50">
      <div class="max-w-full mx-auto">
        <div class="flex flex-col justify-center items-center border-b-2 border-gray-300 py-2">
          <label class="inline-flex items-center w-7/12" :class="{'cursor-not-allowed': disable}">
            <input type="radio" class="text-indigo-600" name="mode" value="0" checked v-model="mode" :disabled="disable">
            <span class="">精密（校正サーバーにツクールのテキストデータを送ります ※要ネット環境）</span>
          </label>
          <label class="inline-flex items-center w-7/12" :class="{'cursor-not-allowed': disable}">
            <input type="radio" class="text-indigo-600" name="mode" value="1" v-model="mode" :disabled="disable">
            <span class="">簡易（プラグイン上でチェック。サ入れ表現、サ抜き表現、れ足す言葉しか検出できません）</span>
          </label>
        </div>
        <div class="flex justify-center items-center border-b-2 border-gray-300 py-2">
          <div class="flex flex-col justify-evenly items-start py-1 mr-8">
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" v-model="allcheck" :disabled="disable">全てチェックする</label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1">
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="CommonEvents.json" v-model="targets" :disabled="disable">コモンイベント</label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Weapons.json" v-model="targets" :disabled="disable">武器</label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Enemies.json" v-model="targets" :disabled="disable">敵キャラ</label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1 pl-2">
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="MapInfos.json" v-model="targets" :disabled="disable">マップ</label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Armors.json" v-model="targets" :disabled="disable">防具</label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Troops.json" v-model="targets" :disabled="disable">敵グループ</label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1 px-2">
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Items.json" v-model="targets" :disabled="disable">アイテム</label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Classes.json" v-model="targets" :disabled="disable">職業</label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="States.json" v-model="targets" :disabled="disable">ステート</label>
          </div>
          <div class="flex flex-col justify-evenly items-start py-1">
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Actors.json" v-model="targets" :disabled="disable">アクター</label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="Skills.json" v-model="targets" :disabled="disable">スキル</label>
            <label :class="{'cursor-not-allowed': disable}"><input type="checkbox" value="System.json" v-model="targets" :disabled="disable">システム</label>
          </div>
        </div>
        <div class="flex justify-center items-center border-b-2 border-gray-300 py-2">
          <button @click="execute()" :disabled="disable" :class="{'cursor-not-allowed': disable}" type="button" class="inline-flex items-center px-12 py-2 mx-3 rounded-full text-white bg-indigo-600 hover:bg-indigo-800">
            <svg v-show="disable" class="animate-spin -ml-5 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            チェックする
          </button>
          <button @click="stop()" type="button" class="inline-flex items-center px-12 py-2 mx-3 rounded-full text-white bg-stone-600 hover:bg-stone-800">
            停止
          </button>
        </div>
        <div v-if="finish" class="flex justify-center items-center py-2">
          <div class="bg-blue-100 rounded-lg py-2 px-6 text-base text-blue-700" role="alert">
            完了しました
          </div>
        </div>
        <div v-if="error" class="flex justify-center items-center py-2">
          <div class="bg-red-100 rounded-lg py-2 px-6 text-base text-red-700" role="alert">
            {{error}}
          </div>
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
          <td class="border border-neutral-500 whitespace-pre-wrap break-words">{{result.location}}</td>
          <td class="border border-neutral-500 whitespace-pre-wrap break-words">{{result.text}}</td>
          <td class="border border-neutral-500 whitespace-pre-wrap break-words">{{result.suggestion}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import textlintWorker from "./assets/textlint-worker.prebundleapp";
import { Engine, formatResult } from "./lib/engine";

export default {
  name: "App",
  data() {
    return {
      results: [],
      connection: null,
      targets: [],
      allcheck: false,
      mode: "0",
      lint_result: {},
      worker: null,
      engine: null,
      current_data: {},
      run: false,
      disable: false,
      finish: false,
      error: "",
    }
  },
  watch: {
    lint_result: function (newVal, oldVal) {
      if(Object.keys(newVal).length == 0){
        return;
      }
      if(this.run){
        if(newVal.messages && newVal.messages.length != 0){
          this.results.push(formatResult(this.current_data.location, newVal, this.current_data.text));
        }
        this.current_data = this.engine.next();
        if(this.current_data == "EOF"){
          this.stop(true);
        }else{
          this.postGameText(this.current_data.text);
        }
      }
    },
    allcheck: function(newVal, oldVal){
      if(newVal){
        this.targets = [
          "CommonEvents.json","Weapons.json","Enemies.json","MapInfos.json","Armors.json","Troops.json",
          "Items.json","Classes.json","States.json","Actors.json","Skills.json","System.json"
        ];
      }else{
        this.targets = [];
      }
    }
  },
  methods: {
    sendGameText: function (filename) {
      const fs = nw.require('fs');
      const path = nw.require('path');
      let data_dir = path.join(process.cwd(), 'data');
      this.connection.send(JSON.stringify({'filename':filename, 'json_data':JSON.parse(fs.readFileSync(path.join(data_dir, filename)))}));
    },
    postGameText: function(text){
      this.worker.postMessage({
        command: "lint",
        text: text,
        ext: ".md"
      })
    },
    execute: function () {
      if(this.targets.length == 0){
        this.error = "チェックするデータを選んでください"
        this.stop();
        return;
      }
      this.results = [];
      this.lint_result = {};
      this.disable = true;
      this.finish = false;
      this.error = "";
      this.run = true;

      if(this.mode == "0"){
        this.connection = new WebSocket("ws://192.168.0.16:8080");

        this.connection.onerror = function(event) {
          this.error = "サーバーとの接続に失敗しました"
          this.stop();
        }.bind(this)

        this.connection.onopen = function(event) {
          this.targets.forEach(json_name => {
            this.sendGameText(json_name);
          });
        }.bind(this)

        this.connection.onmessage = function(event) {
          this.results.push(JSON.parse(event.data));
        }.bind(this)
      }else{
        const url = URL.createObjectURL(
          new Blob([textlintWorker], { type: "text/javascript" })
        );
        this.worker = new Worker(url);
        this.worker.addEventListener('message', function (event) {
          if (event.data.command === "lint:result") {
            this.lint_result = event.data.result;
          }
        }.bind(this));
        this.engine = new Engine(this.targets.concat());
        this.current_data = this.engine.next();
        this.postGameText(this.current_data.text);
      }
    },
    stop: function (success) {
      this.run = false;
      this.disable = false;
      if(this.mode == "0"){
        this.connection.close()
      }
      if(success){
        this.finish = true;
        this.error = "";
      }
    }
  },
}
</script>